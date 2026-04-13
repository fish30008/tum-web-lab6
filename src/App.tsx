import { useState } from 'react'
import { seedWorkouts } from './data/seedWorkout'
import type { Workout } from './data/seedWorkout'
import WorkoutCard from './components/WorkoutCard'

function App() {
  const [workouts, setWorkouts] = useState<Workout[]>(seedWorkouts)

  return (
    <div style={{ padding: '20px' }}>
      <h1>Workout App</h1>

      <div style={{ display: 'grid', gap: '16px' }}>
        {workouts.map((w) => (
          <WorkoutCard key={w.id} workout={w} />
        ))}
      </div>
    </div>
  )
}

export default App