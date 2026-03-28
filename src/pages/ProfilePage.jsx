import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Save, ChevronRight, UserCircle, AlertCircle, Mail, Lock, Edit3, LogOut, Dna, Weight, Ruler, Calendar } from 'lucide-react'
import useHealthStore from '../store/useHealthStore'

// Defined OUTSIDE component to prevent remount on every render
const Field = ({ label, children }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{label}</label>
    {children}
  </div>
)

const StatCard = ({ icon: Icon, label, value, unit }) => (
  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
    <div className="w-10 h-10 rounded-xl bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center text-accent-purple shrink-0">
      <Icon size={18} />
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</p>
      <p className="text-xl font-black font-['Outfit'] text-white">{value}<span className="text-sm text-slate-400 ml-1 font-medium">{unit}</span></p>
    </div>
  </div>
)

const ProfilePage = () => {
  const navigate = useNavigate()
  const { user, signup, logout, allHistory, isLoading, error, setError } = useHealthStore()
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    age: '', height: '', weight: ''
  })

  const set = (field) => (e) => setFormData({ ...formData, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    const newUser = await signup(formData)
    if (newUser) navigate('/health-input')
  }

  // ─── PROFILE VIEW (logged in) ─────────────────────────────────────────────
  if (user) {
    return (
      <div className="p-10 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-12">
          <h1 className="text-4xl font-bold font-['Outfit'] mb-2 uppercase tracking-tighter">Digital Twin Profile</h1>
          <p className="text-slate-400 font-medium">Your biological markers and account details.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card p-10 space-y-8 max-w-2xl border-none bg-white/5 relative overflow-hidden"
        >
          {/* Avatar + Name */}
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-accent-purple to-accent-blue flex items-center justify-center shadow-lg shadow-accent-purple/30 shrink-0">
              <span className="text-3xl font-black text-white font-['Outfit']">
                {user.name?.[0]?.toUpperCase() || '?'}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-black font-['Outfit'] text-white">{user.name}</h2>
              {user.email && (
                <p className="text-sm text-slate-400 font-medium flex items-center gap-2 mt-1">
                  <Mail size={14} />
                  {user.email}
                </p>
              )}
              <div className="flex items-center gap-3 mt-3">
                <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 inline-flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">Twin Active</span>
                </div>
                <div className="px-3 py-1 rounded-full bg-accent-purple/10 border border-accent-purple/20 inline-flex items-center gap-2">
                  <Calendar size={12} className="text-accent-purple" />
                  <span className="text-[10px] font-black text-accent-purple uppercase tracking-widest">
                    Day {allHistory?.length + 1 || 1} of Longevity
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Biological Stats */}
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Biological Markers</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard icon={Calendar} label="Age" value={user.age} unit="yrs" />
              <StatCard icon={Ruler} label="Height" value={user.height} unit="cm" />
              <StatCard icon={Weight} label="Weight" value={user.weight} unit="kg" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/10">
            <button
              onClick={() => navigate('/health-input')}
              className="btn-primary flex-1 flex items-center justify-center gap-3 py-4 font-black uppercase tracking-widest"
            >
              <Dna size={20} />
              Add Todays Health Input
            </button>
            <button
              onClick={() => { logout(); navigate('/login') }}
              className="btn-secondary flex items-center justify-center gap-3 py-4 font-black uppercase tracking-widest text-red-400 border-red-500/20 hover:bg-red-400/5"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>

          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-purple/5 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none" />
        </motion.div>
      </div>
    )
  }

  // ─── SIGNUP FORM (not logged in) ─────────────────────────────────────────
  return (
    <div className="p-10 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-12">
        <h1 className="text-4xl font-bold font-['Outfit'] mb-2 uppercase tracking-tighter">Create Your Digital Twin</h1>
        <p className="text-slate-400 font-medium">
          Register to start your AI-powered longevity journey.{' '}
          <Link to="/login" className="text-accent-purple font-black hover:underline">
            Already have an account? Sign in →
          </Link>
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        onSubmit={handleSubmit}
        className="glass-card p-10 space-y-8 max-w-2xl border-none bg-white/5 relative overflow-hidden"
      >
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3">
            <AlertCircle size={18} />
            {error}
          </motion.div>
        )}

        <div className="flex items-center justify-center mb-4">
          <div className="p-5 rounded-3xl bg-accent-purple/5 border border-accent-purple/10 shadow-[0_0_30px_rgba(139,92,246,0.1)]">
            <UserCircle size={48} className="text-accent-purple" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div className="md:col-span-2">
            <Field label="Full Name">
              <input
                required disabled={isLoading}
                className="input-field disabled:opacity-50 font-black"
                placeholder="e.g. Karthik S"
                value={formData.name}
                onChange={set('name')}
              />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field label="Email Address">
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email" required disabled={isLoading}
                  className="input-field pl-11 disabled:opacity-50"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={set('email')}
                />
              </div>
            </Field>
          </div>

          <Field label="Password">
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password" required disabled={isLoading}
                className="input-field pl-11 disabled:opacity-50"
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={set('password')}
              />
            </div>
          </Field>

          <Field label="Confirm Password">
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password" required disabled={isLoading}
                className="input-field pl-11 disabled:opacity-50"
                placeholder="Repeat password"
                value={formData.confirmPassword}
                onChange={set('confirmPassword')}
              />
            </div>
          </Field>

          <Field label="Age">
            <input
              required type="number" disabled={isLoading}
              className="input-field disabled:opacity-50 text-xl font-['Outfit']"
              placeholder="32"
              value={formData.age}
              onChange={set('age')}
            />
          </Field>

          <Field label="Height (cm)">
            <input
              required type="number" disabled={isLoading}
              className="input-field disabled:opacity-50 text-xl font-['Outfit']"
              placeholder="175"
              value={formData.height}
              onChange={set('height')}
            />
          </Field>

          <div className="md:col-span-2">
            <Field label="Weight (kg)">
              <input
                required type="number" disabled={isLoading}
                className="input-field disabled:opacity-50 text-xl font-['Outfit']"
                placeholder="70"
                value={formData.weight}
                onChange={set('weight')}
              />
            </Field>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          type="submit" disabled={isLoading}
          className="btn-primary w-full flex items-center justify-center gap-3 py-5 text-xl font-black uppercase tracking-widest disabled:opacity-50 relative z-10"
        >
          {isLoading ? (
            <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Save size={24} />
              Create Account & Calibrate
              <ChevronRight size={24} />
            </>
          )}
        </motion.button>

        <div className="pt-4 border-t border-white/5 relative z-10">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => {
              const { enterDemoMode } = useHealthStore.getState()
              enterDemoMode('user_1')
              navigate('/dashboard')
            }}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-accent-purple/10 border border-accent-purple/20 text-accent-purple text-sm font-black uppercase tracking-widest hover:bg-accent-purple/20 transition-all"
          >
            <Dna size={20} />
            Enter Demo Lab (Bypass Auth)
          </motion.button>
          <p className="text-[10px] text-center text-slate-500 mt-3 font-medium uppercase tracking-tighter">
            Bypass email rate limits & explore with sample data
          </p>
        </div>

        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-purple/5 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none" />
      </motion.form>
    </div>
  )
}

export default ProfilePage
