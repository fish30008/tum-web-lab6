import type { Workout } from '../data/seedWorkout'

export type WorkoutFilters = {
  search: string
  muscleGroup: string
  difficulty: 'All' | Workout['difficulty']
  favoritesOnly: boolean
}

export const defaultWorkoutFilters: WorkoutFilters = {
  search: '',
  muscleGroup: 'All',
  difficulty: 'All',
  favoritesOnly: false,
}

export function getAvailableMuscleGroups(workouts: Workout[]): string[] {
  return ['All', ...new Set(workouts.map((workout) => workout.muscleGroup))]
}

export function filterWorkouts(workouts: Workout[], filters: WorkoutFilters): Workout[] {
  const searchTerm = filters.search.trim().toLowerCase()

  return workouts.filter((workout) => {
    const matchesSearch =
      searchTerm.length === 0 ||
      workout.name.toLowerCase().includes(searchTerm) ||
      workout.muscleGroup.toLowerCase().includes(searchTerm) ||
      workout.description?.toLowerCase().includes(searchTerm)

    const matchesMuscleGroup =
      filters.muscleGroup === 'All' || workout.muscleGroup === filters.muscleGroup

    const matchesDifficulty =
      filters.difficulty === 'All' || workout.difficulty === filters.difficulty

    const matchesFavorites = !filters.favoritesOnly || workout.liked

    return matchesSearch && matchesMuscleGroup && matchesDifficulty && matchesFavorites
  })
}
