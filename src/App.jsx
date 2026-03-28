import React, { useEffect } from 'react'
import { Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Activity, LayoutDashboard, LineChart, FlaskConical, LogOut, LogIn } from 'lucide-react'
import useHealthStore from './store/useHealthStore'

// Lazy load pages
const LandingPage = React.lazy(() => import('./pages/LandingPage'))
const LoginPage = React.lazy(() => import('./pages/LoginPage'))
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'))
const HealthInputPage = React.lazy(() => import('./pages/HealthInputPage'))
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'))
const ProgressPage = React.lazy(() => import('./pages/ProgressPage'))

const SidebarItem = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-6 py-4 transition-all duration-300 border-r-2 ${
        isActive
          ? 'bg-accent-purple/10 border-accent-purple text-accent-purple'
          : 'border-transparent text-slate-400 hover:bg-white/5 hover:text-white'
      }`
    }
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </NavLink>
)

const App = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const isLanding = location.pathname === '/'
  const isAuthPage = location.pathname === '/login'
  const { fetchProfile, fetchLatestAnalysis, user, logout } = useHealthStore()

  useEffect(() => {
    const userId = localStorage.getItem('lifeos_user_id')
    if (userId && !userId.startsWith('local_')) {
      fetchProfile(userId)
      fetchLatestAnalysis(userId)
    }
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const showSidebar = !isLanding && !isAuthPage

  return (
    <div className="min-h-screen flex bg-dark">
      {showSidebar && (
        <aside className="w-64 border-r border-white/10 flex flex-col pt-8 glass-card rounded-none z-50">
          <div className="px-6 mb-10 flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-purple to-accent-blue flex items-center justify-center shadow-lg shadow-accent-purple/20">
              <FlaskConical className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold font-['Outfit'] tracking-tight gradient-text">LifeOS</span>
          </div>

          {/* User Badge */}
          {user && (
            <div className="px-6 mb-6">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Active Twin</p>
                <p className="text-sm font-black text-white truncate">{user.name}</p>
                {user.email && <p className="text-[10px] text-slate-500 truncate">{user.email}</p>}
              </div>
            </div>
          )}

          <nav className="flex-1">
            <SidebarItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
            <SidebarItem to="/profile" icon={User} label="Profile" />
            <SidebarItem to="/health-input" icon={Activity} label="Health Analysis" />
            <SidebarItem to="/progress" icon={LineChart} label="Trends" />
          </nav>

          {/* Bottom Auth Actions */}
          <div className="p-4 border-t border-white/10">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/5 transition-all text-sm font-black uppercase tracking-widest"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            ) : (
              <NavLink
                to="/login"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-accent-purple hover:bg-accent-purple/5 transition-all text-sm font-black uppercase tracking-widest"
              >
                <LogIn size={16} />
                Sign In
              </NavLink>
            )}
          </div>
        </aside>
      )}

      <main className={`flex-1 flex flex-col ${showSidebar ? 'pl-4' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex-1"
          >
            <React.Suspense fallback={
              <div className="flex-1 flex items-center justify-center h-screen bg-dark">
                <div className="w-12 h-12 border-4 border-accent-purple/30 border-t-accent-purple rounded-full animate-spin"></div>
              </div>
            }>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/health-input" element={<HealthInputPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/progress" element={<ProgressPage />} />
              </Routes>
            </React.Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

export default App
