import type { Workout } from '../data/seedWorkout'
import './WorkoutCard.css'

type Props = {
  workout: Workout
  onToggleLike: (id: string) => void
  onDelete: (id: string) => void
}

export default function WorkoutCard({ workout, onToggleLike, onDelete }: Props) {
  const difficultyColor = {
    Beginner: '#4caf50',
    Intermediate: '#ff9800',
    Advanced: '#f44336'
  }

  return (
    <div className="workout-card">
      <div className="card-header">
        <h3>{workout.name}</h3>
        <button
          className={`like-btn ${workout.liked ? 'liked' : ''}`}
          onClick={() => onToggleLike(workout.id)}
          aria-label={workout.liked ? 'Unlike' : 'Like'}
        >
          {workout.liked ? '❤️' : '🤍'}
        </button>
      </div>
      
      <div className="gif-container">
        <img
          src={workout.gifUrl}
          alt={workout.name}
          loading="lazy"
        />
      </div>

      <div className="card-body">
        {workout.description && (
          <p className="description">{workout.description}</p>
        )}
        
        <div className="workout-details">
          <div className="detail-item">
            <span className="label">Muscle:</span>
            <span className="value">{workout.muscleGroup}</span>
          </div>
          
          <div className="detail-item">
            <span className="label">Difficulty:</span>
            <span 
              className="value difficulty-badge"
              style={{ backgroundColor: difficultyColor[workout.difficulty] }}
            >
              {workout.difficulty}
            </span>
          </div>
          
          <div className="detail-item">
            <span className="label">Duration:</span>
            <span className="value">{workout.duration} min</span>
          </div>
          
          <div className="detail-item">
            <span className="label">Sets:</span>
            <span className="value">{workout.sets}</span>
          </div>
          
          <div className="detail-item">
            <span className="label">Reps:</span>
            <span className="value">{workout.reps}</span>
          </div>
        </div>
      </div>

      <div className="card-footer">
        <button
          className="delete-btn"
          onClick={() => onDelete(workout.id)}
          aria-label="Delete workout"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  )
}