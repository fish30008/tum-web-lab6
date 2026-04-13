import type { Workout } from '../data/seedWorkout'

type Props = {
  workout: Workout
}

export default function WorkoutCard({ workout }: Props) {
  return (
    <div
      style={{
        border: '1px solid #ccc',
        borderRadius: '12px',
        padding: '12px',
        maxWidth: '300px',
      }}
    >
      <img
        src={workout.gifUrl}
        alt={workout.name}
        style={{ width: '100%', borderRadius: '8px' }}
      />

      <h3>{workout.name}</h3>
      <p>Muscle: {workout.muscleGroup}</p>
      <p>Difficulty: {workout.difficulty}</p>
      <p>Duration: {workout.duration} min</p>
    </div>
  )
}