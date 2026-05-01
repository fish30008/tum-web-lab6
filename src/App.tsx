import { useEffect, useMemo, useState } from 'react'
import './App.css'
import type { Workout } from './data/seedWorkout'
import AddWorkoutForm from './components/AddWorkoutForm'
import type { NewWorkoutInput } from './components/AddWorkoutForm'
import ThemeToggle from './components/ThemeToggle'
import WorkoutCard from './components/WorkoutCard'
import {
  defaultWorkoutFilters,
  filterWorkouts,
  getAvailableMuscleGroups,
} from './utils/workoutFilters'
import type { WorkoutFilters } from './utils/workoutFilters'
import {
  loadFiltersFromStorage,
  saveFiltersToStorage,
  saveWorkoutsToStorage,
  loadWorkoutsFromStorage
} from './utils/workoutStorage'
import {
  applyThemeToDocument,
  loadThemeFromStorage,
  saveThemeToStorage,
} from './utils/themeStorage'
import type { AppTheme } from './utils/themeStorage'
import * as api from './api'

function App() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [filters, setFilters] = useState<WorkoutFilters>(loadFiltersFromStorage)
  const [theme, setTheme] = useState<AppTheme>(loadThemeFromStorage)
  const [role, setRole] = useState<'admin' | 'visitor' | null>(null)
  const [authError, setAuthError] = useState('')
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    // Initial fetch, but wait for login first
    if (role) {
      api.getWorkouts()
        .then((data) => {
          setWorkouts(data)
          setIsOffline(false)
          saveWorkoutsToStorage(data) // Cache for offline mode
        })
        .catch((err) => {
          if (err.message === 'OFFLINE') {
            setIsOffline(true)
            setWorkouts(loadWorkoutsFromStorage())
          } else {
            console.error(err)
            setAuthError('Session expired or access denied. Please login again.')
            setRole(null)
            api.clearAuth()
          }
        })
    }
  }, [role])

  useEffect(() => {
    if (isOffline && workouts.length > 0) {
      saveWorkoutsToStorage(workouts)
    }
  }, [workouts, isOffline])

  useEffect(() => {
    saveFiltersToStorage(filters)
  }, [filters])

  useEffect(() => {
    applyThemeToDocument(theme)
    saveThemeToStorage(theme)
  }, [theme])

  const availableMuscleGroups = useMemo(() => getAvailableMuscleGroups(workouts), [workouts])

  const filteredWorkouts = useMemo(() => filterWorkouts(workouts, filters), [filters, workouts])

  const toggleLike = async (id: string) => {
    if (role !== 'admin') {
      alert('Only Admins can like workouts!')
      return
    }
    const currentWorkout = workouts.find(w => w.id === id)
    if (!currentWorkout) return

    if (isOffline) {
      setWorkouts((prevWorkouts) =>
        prevWorkouts.map((workout) =>
          workout.id === id ? { ...workout, liked: !workout.liked } : workout,
        ),
      )
      return
    }

    try {
      const updated = await api.updateWorkout(id, { liked: !currentWorkout.liked })
      setWorkouts((prevWorkouts) =>
        prevWorkouts.map((workout) => (workout.id === id ? updated : workout)),
      )
    } catch (e: any) {
      if (e.message === 'OFFLINE') {
        setIsOffline(true)
        alert('You are offline. Changes saved locally.')
      } else {
        alert(e.message)
      }
    }
  }

  const deleteWorkout = async (id: string) => {
    if (role !== 'admin') {
      alert('Only Admins can delete workouts!')
      return
    }
    
    if (isOffline) {
      setWorkouts((prevWorkouts) => prevWorkouts.filter((workout) => workout.id !== id))
      return
    }

    try {
      await api.deleteWorkout(id)
      setWorkouts((prevWorkouts) => prevWorkouts.filter((workout) => workout.id !== id))
    } catch (e: any) {
      if (e.message === 'OFFLINE') {
        setIsOffline(true)
        setWorkouts((prevWorkouts) => prevWorkouts.filter((workout) => workout.id !== id))
        alert('You are offline. Changes saved locally.')
      } else {
        alert(e.message)
      }
    }
  }

  const addWorkout = async (newWorkout: NewWorkoutInput) => {
    if (role !== 'admin') {
      alert('Only Admins can add workouts!')
      return
    }

    if (isOffline) {
      const workoutToAdd: Workout = {
        id: crypto.randomUUID(),
        liked: false,
        ...newWorkout,
      }
      setWorkouts((prevWorkouts) => [workoutToAdd, ...prevWorkouts])
      return
    }

    try {
      const added = await api.createWorkout(newWorkout)
      setWorkouts((prevWorkouts) => [added, ...prevWorkouts])
    } catch (e: any) {
      if (e.message === 'OFFLINE') {
        setIsOffline(true)
        alert('You are offline. Changes saved locally.')
      } else {
        alert(e.message)
      }
    }
  }

  const clearFilters = () => {
    setFilters(defaultWorkoutFilters)
  }

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'))
  }

  const handleLogin = async (roleType: 'admin' | 'visitor') => {
    try {
      setAuthError('')
      let targetPassword = undefined
      if (roleType === 'admin') {
        targetPassword = prompt('Enter admin password')
        if (targetPassword === null) return // User cancelled
      }
      
      const res = await api.login(roleType, targetPassword)
      setRole(res.role as 'admin' | 'visitor')
      setIsOffline(false)
    } catch (e: any) {
      if (e.message === 'OFFLINE') {
        // Allow offline login using stored role if backend down
        setRole(roleType)
        setIsOffline(true)
        setWorkouts(loadWorkoutsFromStorage())
      } else {
        setAuthError(e.message || 'Login failed.')
      }
    }
  }

  if (!role) {
    return (
      <div className="app-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <h1>Welcome to Workout App</h1>
        <p>Please select your role to continue:</p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button onClick={() => handleLogin('visitor')} className="add-btn">Login as Visitor</button>
          <button onClick={() => handleLogin('admin')} className="add-btn" style={{ background: 'var(--accent-color)' }}>Login as Admin</button>
        </div>
        {authError && <p className="form-error" style={{ marginTop: '1rem' }}>{authError}</p>}
      </div>
    )
  }

  return (
    <div className="app-container">
      <div className="app-toolbar">
        <h1>
          Workout App ({role.toUpperCase()}) 
          {isOffline && <span style={{ color: 'red', marginLeft: '10px' }}>[OFFLINE MODE]</span>}
        </h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
          <button 
            className="clear-filters-btn" 
            onClick={() => { setRole(null); setWorkouts([]); api.clearAuth(); setIsOffline(false); }}
          >
            Logout
          </button>
        </div>
      </div>

      {role === 'admin' && <AddWorkoutForm onAddWorkout={addWorkout} />}

      <section className="filters-panel" aria-label="Workout filters">
        <input
          type="search"
          placeholder="Search by name or muscle group"
          value={filters.search}
          onChange={(event) =>
            setFilters((prevFilters) => ({
              ...prevFilters,
              search: event.target.value,
            }))
          }
        />

        <select
          aria-label="Filter by muscle group"
          value={filters.muscleGroup}
          onChange={(event) =>
            setFilters((prevFilters) => ({
              ...prevFilters,
              muscleGroup: event.target.value,
            }))
          }
        >
          {availableMuscleGroups.map((muscleGroup) => (
            <option key={muscleGroup} value={muscleGroup}>
              {muscleGroup}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter by difficulty"
          value={filters.difficulty}
          onChange={(event) =>
            setFilters((prevFilters) => ({
              ...prevFilters,
              difficulty: event.target.value as WorkoutFilters['difficulty'],
            }))
          }
        >
          <option value="All">All difficulties</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <label className="favorites-filter">
          <input
            type="checkbox"
            checked={filters.favoritesOnly}
            onChange={(event) =>
              setFilters((prevFilters) => ({
                ...prevFilters,
                favoritesOnly: event.target.checked,
              }))
            }
          />
          Favorites only
        </label>

        <button type="button" className="clear-filters-btn" onClick={clearFilters}>
          Reset filters
        </button>
      </section>

      <div className="workout-grid">
        {filteredWorkouts.length === 0 ? (
          <div className="empty-state">
            <p>No workouts match your filters.</p>
            <p className="empty-hint">Try resetting filters or add a new workout.</p>
          </div>
        ) : (
          filteredWorkouts.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onToggleLike={toggleLike}
              onDelete={deleteWorkout}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default App