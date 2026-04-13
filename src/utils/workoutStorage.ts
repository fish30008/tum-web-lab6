import { seedWorkouts } from '../data/seedWorkout'
import type { Workout } from '../data/seedWorkout'
import type { WorkoutFilters } from './workoutFilters'
import { defaultWorkoutFilters } from './workoutFilters'

const WORKOUTS_STORAGE_KEY = 'workout-app:workouts'
const FILTERS_STORAGE_KEY = 'workout-app:filters'

export function loadWorkoutsFromStorage(): Workout[] {
  if (typeof window === 'undefined') {
    return seedWorkouts
  }

  const rawValue = window.localStorage.getItem(WORKOUTS_STORAGE_KEY)
  if (!rawValue) {
    return seedWorkouts
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Workout[]
    return Array.isArray(parsedValue) ? parsedValue : seedWorkouts
  } catch {
    return seedWorkouts
  }
}

export function saveWorkoutsToStorage(workouts: Workout[]): void {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(WORKOUTS_STORAGE_KEY, JSON.stringify(workouts))
}

export function loadFiltersFromStorage(): WorkoutFilters {
  if (typeof window === 'undefined') {
    return defaultWorkoutFilters
  }

  const rawValue = window.localStorage.getItem(FILTERS_STORAGE_KEY)
  if (!rawValue) {
    return defaultWorkoutFilters
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Partial<WorkoutFilters>
    return {
      ...defaultWorkoutFilters,
      ...parsedValue,
    }
  } catch {
    return defaultWorkoutFilters
  }
}

export function saveFiltersToStorage(filters: WorkoutFilters): void {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters))
}
