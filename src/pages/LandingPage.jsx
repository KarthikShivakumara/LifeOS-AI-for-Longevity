import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Activity, ShieldCheck, Zap } from 'lucide-react'

const FeatureCard = ({ icon: Icon, title, desc, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay }}
    className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
  >
    <div className="w-12 h-12 rounded-xl bg-accent-purple/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
      <Icon className="text-accent-purple" size={24} />
    </div>
    <h3 className="text-xl font-bold mb-2 font-['Outfit']">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{desc}</p>
  </motion.div>
)

const LandingPage = () => {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen pt-20 px-6 overflow-hidden flex flex-col items-center">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent-purple/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent-blue/10 rounded-full blur-[120px] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl text-center space-y-6 mb-20"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-accent-purple text-sm font-semibold mb-4 backdrop-blur-md"
        >
          <Zap size={16} fill="currentColor" />
          <span>The Next Generation of Personal Health</span>
        </motion.div>

        <h1 className="text-7xl font-bold font-['Outfit'] leading-tight tracking-tight">
          Know Your <span className="gradient-text tracking-tighter">Real Health Age</span>
        </h1>

        <p className="text-2xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
          AI-powered lifestyle intelligence that creates your digital health twin to predict longevity and optimize your future.
        </p>

        <div className="flex items-center justify-center gap-6 pt-8">
          <button
            onClick={() => navigate('/profile')}
            className="btn-primary flex items-center gap-2 text-lg hover:shadow-2xl hover:shadow-accent-purple/30 group"
          >
            Start the journey of Longevity
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => {
              useHealthStore.getState().enableDemoMode()
              navigate('/dashboard')
            }}
            className="btn-secondary text-lg hover:bg-white/10"
          >
            Try Demo
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl py-12">
        <FeatureCard
          icon={Activity}
          title="Digital Health Twin"
          desc="AI simulates your biological markers to create a real-time replica of your metabolic health."
          delay={0.4}
        />
        <FeatureCard
          icon={ShieldCheck}
          title="Predictive Risk AI"
          desc="Advanced risk assessment algorithms predict burnout and fatigue before they happen."
          delay={0.6}
        />
        <FeatureCard
          icon={Zap}
          title="Real-Time Simulations"
          desc="Instantly see how small lifestyle changes impact your biological age and long-term health."
          delay={0.8}
        />
      </div>

      <footer className="mt-auto py-10 text-slate-500 text-sm font-medium">
        &copy; 2026 LifeOS AI Platform • Built for Longevity
      </footer>
    </div>
  )
}

export default LandingPage
