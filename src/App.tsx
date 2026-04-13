import { useState } from 'react'
import './App.css'
import { seedWorkouts } from './data/seedWorkout'
import type { Workout } from './data/seedWorkout'
import AddWorkoutForm from './components/AddWorkoutForm'
import type { NewWorkoutInput } from './components/AddWorkoutForm'
import WorkoutCard from './components/WorkoutCard'

function App() {
  const [workouts, setWorkouts] = useState<Workout[]>(seedWorkouts)

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

  return (
    <div className="app-container">
      <h1>Workout App</h1>

      <AddWorkoutForm onAddWorkout={addWorkout} />

      <div className="workout-grid">
        {workouts.map((workout) => (
          <WorkoutCard
            key={workout.id}
            workout={workout}
            onToggleLike={toggleLike}
            onDelete={deleteWorkout}
          />
        ))}
      </div>
    </div>
  )
}

export default App