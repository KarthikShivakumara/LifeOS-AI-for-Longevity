import { create } from 'zustand'
import axios from 'axios'

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000'

const useHealthStore = create((set, get) => ({
  user: null,
  healthData: null,
  allHistory: [],
  isLoading: false,
  error: null,

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (err) => set({ error: err }),

  // 0. GUEST/DEMO MODE — bypass Supabase Auth
  enterDemoMode: async (demoId = 'user_1') => {
    set({ isLoading: true, error: null })
    try {
      // Create a fake guest profile based on CSV context
      const guestUser = {
        id: demoId,
        email: `demo@lifeos.internal`,
        name: demoId === 'user_1' ? 'Karthik (Demo)' : demoId === 'user_3' ? 'Bio-Optimizer (Demo)' : 'Guest User',
        age: 30,
        height: 175,
        weight: 75,
        isGuest: true
      }
      set({ user: guestUser })
      localStorage.setItem('lifeos_user_id', guestUser.id)
      localStorage.setItem('lifeos_user_name', guestUser.name)
      localStorage.setItem('lifeos_is_guest', 'true')
      
      // Load their dataset context immediately
      await get().fetchHistory(guestUser.id)
      return guestUser
    } finally {
      set({ isLoading: false })
    }
  },

  // 1. SIGNUP — create Supabase auth user + profile
  signup: async (formData) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email: formData.email,
        password: formData.password,
        full_name: formData.name,
        age: parseInt(formData.age),
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight)
      })
      if (response.data.error) {
        set({ error: response.data.error })
        return null
      }
      const raw = response.data
      const sessionUser = {
        id: raw.id,
        email: raw.email,
        name: raw.full_name,
        age: raw.age,
        height: raw.height,
        weight: raw.weight
      }
      set({ user: sessionUser })
      localStorage.setItem('lifeos_user_id', sessionUser.id)
      localStorage.setItem('lifeos_user_name', sessionUser.name)
      localStorage.setItem('lifeos_user_age', String(sessionUser.age))
      localStorage.setItem('lifeos_user_email', sessionUser.email)
      return sessionUser
    } catch (err) {
      set({ error: 'Signup failed. Check backend.' })
      return null
    } finally {
      set({ isLoading: false })
    }
  },

  // 2. LOGIN — authenticate with Supabase Auth
  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password })
      if (response.data.error) {
        set({ error: response.data.error })
        return null
      }
      const raw = response.data
      const sessionUser = {
        id: raw.id,
        email: raw.email,
        name: raw.full_name,
        age: raw.age,
        height: raw.height,
        weight: raw.weight
      }
      set({ user: sessionUser })
      localStorage.setItem('lifeos_user_id', sessionUser.id)
      localStorage.setItem('lifeos_user_name', sessionUser.name)
      localStorage.setItem('lifeos_user_age', String(sessionUser.age))
      localStorage.setItem('lifeos_user_email', sessionUser.email)
      return sessionUser
    } catch (err) {
      set({ error: 'Login failed. Check your credentials.' })
      return null
    } finally {
      set({ isLoading: false })
    }
  },

  // 3. LOGOUT
  logout: () => {
    set({ user: null, healthData: null, allHistory: [] })
    localStorage.removeItem('lifeos_user_id')
    localStorage.removeItem('lifeos_user_name')
    localStorage.removeItem('lifeos_user_age')
    localStorage.removeItem('lifeos_user_email')
  },

  // LEGACY — kept for backward compat
  createProfile: async (profileData) => {
    return get().signup(profileData)
  },

  analyzeHealth: async (userId, metrics) => {
    set({ isLoading: true, error: null })
    try {
      // FastAPI expects a flat body with user_id at root
      const response = await axios.post(`${API_URL}/agent-structured`, {
        sleep: parseFloat(metrics.sleep),
        steps: parseInt(metrics.steps),
        screen_time: parseFloat(metrics.screenTime),
        stress: metrics.stress,
        feeling: metrics.feeling || '',
        user_id: userId
      })

      // Backend returns: { health_score, biological_age, risk, future, feedback, label }
      const data = response.data
      const healthData = {
        health_score: data.health_score,
        biological_age: data.biological_age,
        label: data.label || (data.health_score >= 80 ? 'Optimal' : data.health_score >= 60 ? 'Moderate' : 'Poor'),
        risk: data.risk,
        future: data.future,
        feedback: data.feedback
      }

      set({ healthData })
      return healthData
    } catch (err) {
      console.error('AI Analysis Error:', err)
      set({ error: 'AI Analysis failed. Check backend.' })
      return null
    } finally {
      set({ isLoading: false })
    }
  },

  // 3. Fetch history — supports CSV fallback for demo users
  fetchHistory: async (userId) => {
    if (!userId || userId.startsWith('local_')) return
    try {
      // If it's a demo user, we point them to the analysis endpoint to see patterns
      const url = userId.startsWith('user_') 
        ? `${API_URL}/analysis/dataset/${userId}/7`
        : `${API_URL}/user-history/${userId}`
      
      const response = await axios.get(url)
      
      // If result has 'averages', it's from the new analysis endpoint
      const data = response.data
      const history = Array.isArray(data) ? data : (data.averages ? [data.averages] : [])
      set({ allHistory: history })
    } catch (err) {
      console.warn('Could not fetch history.')
    }
  },

  // 4. Restore latest session data on page load
  fetchLatestAnalysis: async (userId) => {
    if (!userId || userId.startsWith('local_')) return
    try {
      // If demo user, use the analysis/dataset endpoint to get the 'latest' look
      const url = userId.startsWith('user_')
        ? `${API_URL}/analysis/dataset/${userId}/7`
        : `${API_URL}/user-history/${userId}`
      
      const response = await axios.get(url)
      const data = response.data

      // Normalize data for the dashboard
      if (userId.startsWith('user_')) {
        const last = data.averages
        const report = data.report
        const healthData = {
          health_score: report.grade === 'A' ? 92 : report.grade === 'B' ? 78 : 55,
          biological_age: 30, // Mock for demo
          label: report.grade === 'A' ? 'Optimal' : 'Moderate',
          risk: report.risk_flags || [],
          future: report.summary,
          feedback: {
            positives: report.habits?.filter(h => h.impact === 'High').map(h => h.habit) || [],
            improvements: report.habits?.filter(h => h.impact !== 'High').map(h => h.habit) || []
          }
        }
        set({ healthData, allHistory: [last] })
        return healthData
      } else {
        const records = data
        if (records && records.length > 0) {
          const last = records[records.length - 1]
          const healthData = {
            health_score: last.score,
            biological_age: last.biological_age,
            label: last.score >= 80 ? 'Optimal' : last.score >= 60 ? 'Moderate' : 'Poor',
            risk: last.risk,
            future: last.future,
            feedback: {
              positives: last.positives || [],
              improvements: last.improvements || []
            }
          }
          set({ healthData, allHistory: records })
          return healthData
        }
      }
    } catch (err) {
      console.warn('Could not restore session:', err)
    }
  },

  // 5. Restore user profile from localStorage on page load
  fetchProfile: async (userId) => {
    if (!userId || userId.startsWith('local_')) return
    try {
      // Pull metadata from localStorage (handle demo user context)
      const name = localStorage.getItem('lifeos_user_name')
      const age = localStorage.getItem('lifeos_user_age') || 30
      const isGuest = localStorage.getItem('lifeos_is_guest') === 'true'
      
      if (name) {
        set({ user: { id: userId, name, age: parseInt(age), isGuest } })
      } else if (userId.startsWith('user_')) {
        // Fallback for direct URL demo entry
        set({ user: { id: userId, name: 'Karthik (Demo)', age: 30, isGuest: true } })
      }
    } catch (err) {
      console.warn('Could not restore profile.')
    }
  },
}))

export default useHealthStore
