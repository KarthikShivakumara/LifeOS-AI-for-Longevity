import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogIn, Mail, Lock, AlertCircle, FlaskConical } from 'lucide-react'
import useHealthStore from '../store/useHealthStore'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login, fetchLatestAnalysis, isLoading, error, setError } = useHealthStore()
  const [form, setForm] = useState({ email: '', password: '' })

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)
    const user = await login(form.email, form.password)
    if (user) {
      await fetchLatestAnalysis(user.id)
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-accent-purple to-accent-blue flex items-center justify-center shadow-lg shadow-accent-purple/30">
            <FlaskConical className="text-white" size={28} />
          </div>
          <span className="text-3xl font-bold font-['Outfit'] tracking-tight gradient-text">LifeOS</span>
        </div>

        <div className="glass-card p-10 space-y-8 bg-white/5 border-white/10 relative overflow-hidden">
          <div>
            <h1 className="text-3xl font-black font-['Outfit'] uppercase tracking-tighter mb-1">Welcome Back</h1>
            <p className="text-slate-400 text-sm font-medium">Sign in to access your Digital Twin.</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3"
            >
              <AlertCircle size={18} />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  disabled={isLoading}
                  className="input-field pl-11 disabled:opacity-50"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  disabled={isLoading}
                  className="input-field pl-11 disabled:opacity-50"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-base font-black uppercase tracking-widest disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={20} />
                  Sign In
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-slate-500">
            New to LifeOS?{' '}
            <Link to="/profile" className="text-accent-purple font-black hover:underline">
              Create your Digital Twin →
            </Link>
          </p>

          <div className="absolute top-0 right-0 w-48 h-48 bg-accent-purple/5 blur-[80px] rounded-full -mr-24 -mt-24 pointer-events-none" />
        </div>
      </motion.div>
    </div>
  )
}

export default LoginPage
