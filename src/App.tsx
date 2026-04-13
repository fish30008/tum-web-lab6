import { useEffect, useMemo, useState } from 'react'
import './App.css'
import type { Workout } from './data/seedWorkout'
import AddWorkoutForm from './components/AddWorkoutForm'
import type { NewWorkoutInput } from './components/AddWorkoutForm'
import WorkoutCard from './components/WorkoutCard'
import {
  defaultWorkoutFilters,
  filterWorkouts,
  getAvailableMuscleGroups,
} from './utils/workoutFilters'
import type { WorkoutFilters } from './utils/workoutFilters'
import {
  loadFiltersFromStorage,
  loadWorkoutsFromStorage,
  saveFiltersToStorage,
  saveWorkoutsToStorage,
} from './utils/workoutStorage'

function App() {
  const [workouts, setWorkouts] = useState<Workout[]>(loadWorkoutsFromStorage)
  const [filters, setFilters] = useState<WorkoutFilters>(loadFiltersFromStorage)

  useEffect(() => {
    saveWorkoutsToStorage(workouts)
  }, [workouts])

  useEffect(() => {
    saveFiltersToStorage(filters)
  }, [filters])

  const availableMuscleGroups = useMemo(() => getAvailableMuscleGroups(workouts), [workouts])

  const filteredWorkouts = useMemo(() => filterWorkouts(workouts, filters), [filters, workouts])

  const toggleLike = (id: string) => {
    setWorkouts((prevWorkouts) =>
      prevWorkouts.map((workout) =>
        workout.id === id ? { ...workout, liked: !workout.liked } : workout,
      ),
    )
  }

  const deleteWorkout = (id: string) => {
    setWorkouts((prevWorkouts) => prevWorkouts.filter((workout) => workout.id !== id))
  }

  const addWorkout = (newWorkout: NewWorkoutInput) => {
    const workoutToAdd: Workout = {
      id: crypto.randomUUID(),
      liked: false,
      ...newWorkout,
    }

    setWorkouts((prevWorkouts) => [workoutToAdd, ...prevWorkouts])
  }

  const clearFilters = () => {
    setFilters(defaultWorkoutFilters)
  }

  return (
    <div className="app-container">
      <h1>Workout App</h1>

      <AddWorkoutForm onAddWorkout={addWorkout} />

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