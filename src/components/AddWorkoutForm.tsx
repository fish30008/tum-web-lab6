import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { difficulties, muscleGroups } from '../data/seedWorkout'
import type { Workout } from '../data/seedWorkout'
import './AddWorkoutForm.css'

export type NewWorkoutInput = Omit<Workout, 'id' | 'liked'>

type NewWorkoutFormState = {
  name: string
  muscleGroup: Workout['muscleGroup']
  difficulty: Workout['difficulty']
  duration: number
  sets: number
  reps: number
  gifUrl: string
  description: string
}

type AddWorkoutFormProps = {
  onAddWorkout: (workout: NewWorkoutInput) => void
}

const initialFormState: NewWorkoutFormState = {
  name: '',
  muscleGroup: muscleGroups[0],
  difficulty: difficulties[0],
  duration: 10,
  sets: 3,
  reps: 10,
  gifUrl: '',
  description: '',
}

export default function AddWorkoutForm({ onAddWorkout }: AddWorkoutFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [newWorkout, setNewWorkout] = useState<NewWorkoutFormState>(initialFormState)
  const [formError, setFormError] = useState('')

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target

    if (name === 'duration' || name === 'sets' || name === 'reps') {
      setNewWorkout((prevWorkout) => ({
        ...prevWorkout,
        [name]: Number(value),
      }))
      return
    }

    setNewWorkout((prevWorkout) => ({
      ...prevWorkout,
      [name]: value,
    }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!newWorkout.name.trim() || !newWorkout.gifUrl.trim()) {
      setFormError('Workout name and GIF URL are required.')
      return
    }

    if (newWorkout.duration <= 0 || newWorkout.sets <= 0 || newWorkout.reps <= 0) {
      setFormError('Duration, sets and reps must be greater than 0.')
      return
    }

    const workoutToCreate: NewWorkoutInput = {
      name: newWorkout.name.trim(),
      muscleGroup: newWorkout.muscleGroup,
      difficulty: newWorkout.difficulty,
      duration: newWorkout.duration,
      sets: newWorkout.sets,
      reps: newWorkout.reps,
      gifUrl: newWorkout.gifUrl.trim(),
      description: newWorkout.description.trim() || undefined,
    }

    onAddWorkout(workoutToCreate)
    setNewWorkout(initialFormState)
    setFormError('')
    setIsOpen(false)
  }

  return (
    <>
      <button type="button" className="open-add-btn" onClick={() => setIsOpen(true)}>
        Add Workout
      </button>

      {isOpen && (
        <div className="add-workout-modal" role="dialog" aria-modal="true" aria-label="Add workout">
          <form className="add-workout-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label htmlFor="name">Workout Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={newWorkout.name}
                onChange={handleInputChange}
                placeholder="e.g. Burpees"
                required
              />
            </div>

            <div className="form-row">
              <label htmlFor="gifUrl">GIF URL</label>
              <input
                id="gifUrl"
                name="gifUrl"
                type="url"
                value={newWorkout.gifUrl}
                onChange={handleInputChange}
                placeholder="https://..."
                required
              />
            </div>

            <div className="form-grid">
              <div className="form-row">
                <label htmlFor="muscleGroup">Muscle Group</label>
                <select
                  id="muscleGroup"
                  name="muscleGroup"
                  value={newWorkout.muscleGroup}
                  onChange={handleInputChange}
                >
                  {muscleGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <label htmlFor="difficulty">Difficulty</label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={newWorkout.difficulty}
                  onChange={handleInputChange}
                >
                  {difficulties.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <label htmlFor="duration">Duration (min)</label>
                <input
                  id="duration"
                  name="duration"
                  type="number"
                  min={1}
                  value={newWorkout.duration}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <label htmlFor="sets">Sets</label>
                <input
                  id="sets"
                  name="sets"
                  type="number"
                  min={1}
                  value={newWorkout.sets}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <label htmlFor="reps">Reps</label>
                <input
                  id="reps"
                  name="reps"
                  type="number"
                  min={1}
                  value={newWorkout.reps}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <label htmlFor="description">Description (optional)</label>
              <textarea
                id="description"
                name="description"
                value={newWorkout.description}
                onChange={handleInputChange}
                rows={3}
                placeholder="Short description..."
              />
            </div>

            {formError && <p className="form-error">{formError}</p>}

            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setIsOpen(false)
                  setFormError('')
                }}
              >
                Cancel
              </button>
              <button type="submit" className="add-btn">
                Save Workout
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
