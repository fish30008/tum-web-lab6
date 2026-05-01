import type { Workout } from './data/seedWorkout'
import type { NewWorkoutInput } from './components/AddWorkoutForm'

const BASE_URL = 'http://localhost:8000'
const TOKEN_KEY = 'workout-app:token'
const ROLE_KEY = 'workout-app:role'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const getRole = () => localStorage.getItem(ROLE_KEY)
export const clearAuth = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(ROLE_KEY)
}

export const login = async (role: 'admin' | 'visitor', password?: string) => {
  try {
    const res = await fetch(`${BASE_URL}/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, password }),
    })
    if (!res.ok) throw new Error('Login failed. Check your password.')
    const { access_token, role: fetchedRole } = await res.json()
    localStorage.setItem(TOKEN_KEY, access_token)
    localStorage.setItem(ROLE_KEY, fetchedRole)
    return { access_token, role: fetchedRole }
  } catch (e: any) {
    if (e.name === 'TypeError') throw new Error('OFFLINE')
    throw e
  }
}

const getHeaders = () => {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export const getWorkouts = async (skip = 0, limit = 100): Promise<Workout[]> => {
  try {
    const res = await fetch(`${BASE_URL}/workouts?skip=${skip}&limit=${limit}`, {
      headers: getHeaders(),
    })
    if (!res.ok) throw new Error('Failed to fetch workouts')
    return res.json()
  } catch (e: any) {
    if (e.name === 'TypeError') throw new Error('OFFLINE')
    throw e
  }
}

export const createWorkout = async (data: NewWorkoutInput): Promise<Workout> => {
  try {
    const res = await fetch(`${BASE_URL}/workouts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to create workout (Admin required)')
    return res.json()
  } catch (e: any) {
    if (e.name === 'TypeError') throw new Error('OFFLINE')
    throw e
  }
}

export const updateWorkout = async (id: string, data: Partial<Workout>): Promise<Workout> => {
  try {
    const res = await fetch(`${BASE_URL}/workouts/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update workout (Admin required)')
    return res.json()
  } catch (e: any) {
    if (e.name === 'TypeError') throw new Error('OFFLINE')
    throw e
  }
}

export const deleteWorkout = async (id: string): Promise<void> => {
  try {
    const res = await fetch(`${BASE_URL}/workouts/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    })
    if (!res.ok) throw new Error('Failed to delete workout (Admin required)')
  } catch (e: any) {
    if (e.name === 'TypeError') throw new Error('OFFLINE')
    throw e
  }
}