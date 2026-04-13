export type Workout = {
  id: string
  name: string
  muscleGroup: string
  difficulty: string
  duration: number
  gifUrl: string
  liked: boolean
}

export const seedWorkouts: Workout[] = [
  {
    id: '1',
    name: 'Push Ups',
    muscleGroup: 'Chest',
    difficulty: 'Easy',
    duration: 10,
    gifUrl: 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExcmNqNzRzOXF6NjI3eDZudXpnanFmZXV2Y29sZDlxZTkzNHVldzF5YSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/zIOdLMZDcBDc2gk6vV/giphy.gif',
    liked: false,
  },
  {
    id: '2',
    name: 'Squats',
    muscleGroup: 'Legs',
    difficulty: 'Medium',
    duration: 15,
    gifUrl: 'https://media.giphy.com/media/3o7TKtnuHOHHUjR38Y/giphy.gif',
    liked: false,
  },
]