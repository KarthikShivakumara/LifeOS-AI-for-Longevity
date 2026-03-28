import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Activity, Brain, Moon, Footprints, Monitor, Send, HelpCircle, Laptop, ShieldCheck } from 'lucide-react'
import useHealthStore from '../store/useHealthStore'

const InputGroup = ({ icon: Icon, label, children }) => (
  <div className="space-y-3 p-6 glass-card border-none bg-white/5 hover:bg-white/10 transition-all">
    <div className="flex items-center gap-3 text-accent-cyan">
      <Icon size={20} />
      <label className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</label>
    </div>
    {children}
  </div>
)

const HealthInputPage = () => {
  const navigate = useNavigate()
  const { user, analyzeHealth, setLoading, enableDemoMode, isLoading } = useHealthStore()
  const [formData, setFormData] = useState({
    sleep: 7,
    steps: 5000,
    screenTime: 4,
    stress: 'Medium',
    feeling: ''
  })

  const handleAnalyze = async (e) => {
    e.preventDefault()
    if (!user) {
        alert('Please sign in first.')
        return navigate('/login')
    }

    setLoading(true)
    try {
        // Parse here, not on every keystroke, so decimals work while typing
        const metrics = {
            sleep: formData.sleep,
            steps: formData.steps,
            screenTime: formData.screenTime,
            stress: formData.stress,
            feeling: formData.feeling
        }
        await analyzeHealth(user.id, metrics)
        navigate('/dashboard')
    } catch (err) {
        console.error('Failed to save analysis:', err)
    } finally {
        setLoading(false)
    }
  }

  const loadDemo = () => {
    setFormData({
        sleep: 4,
        steps: 2000,
        screenTime: 8,
        stress: 'High',
        feeling: 'Feeling constant fatigue and mentally drained from high workload.'
    })
  }

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-bold font-['Outfit'] mb-2 uppercase tracking-tighter">Biological Data Injection</h1>
          <p className="text-slate-400 font-medium">Feed your lifestyle metrics into the AI longevity engine.</p>
        </motion.div>
        
        <button 
          onClick={loadDemo}
          className="btn-secondary text-accent-cyan border-accent-cyan/20 hover:bg-accent-cyan/10 text-xs font-black uppercase tracking-widest"
        >
          Load High-Stress Sample
        </button>
      </div>

      <form onSubmit={handleAnalyze} className="space-y-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputGroup icon={Moon} label="Daily Sleep (Hours)">
            <input 
              disabled={isLoading}
              type="number" 
              step="0.5"
              min="0" max="24"
              className="input-field disabled:opacity-50 text-xl font-['Outfit']" 
              value={formData.sleep} 
              onChange={e => setFormData({...formData, sleep: e.target.value})}
            />
          </InputGroup>

          <InputGroup icon={Footprints} label="Daily Movement (Steps)">
            <input 
              disabled={isLoading}
              type="number"
              step="500"
              min="0" max="50000"
              className="input-field disabled:opacity-50 text-xl font-['Outfit']" 
              value={formData.steps} 
              onChange={e => setFormData({...formData, steps: e.target.value})}
            />
          </InputGroup>

          <InputGroup icon={Monitor} label="Visual Fatigue (Screen Time)">
            <input 
              disabled={isLoading}
              type="number"
              step="0.5"
              min="0" max="24"
              className="input-field disabled:opacity-50 text-xl font-['Outfit']" 
              value={formData.screenTime} 
              onChange={e => setFormData({...formData, screenTime: e.target.value})}
            />
          </InputGroup>

          <InputGroup icon={Brain} label="Stress Resilience">
            <select 
              disabled={isLoading}
              className="input-field appearance-none disabled:opacity-50 font-bold" 
              value={formData.stress} 
              onChange={e => setFormData({...formData, stress: e.target.value})}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </InputGroup>

          <div className="md:col-span-2">
            <InputGroup icon={Activity} label="Subjective Vitality (Physical/Mental Feeling)">
                <textarea 
                    disabled={isLoading}
                    rows={4}
                    className="input-field disabled:opacity-50 font-medium resize-none pt-4"
                    placeholder="Describe your current state (e.g. feeling energetic after morning sun, or mentally tired...)"
                    value={formData.feeling}
                    onChange={e => setFormData({...formData, feeling: e.target.value})}
                />
            </InputGroup>
          </div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit" 
          disabled={isLoading}
          className="btn-primary w-full py-6 text-xl flex items-center justify-center gap-4 disabled:opacity-50 font-black uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(139,92,246,0.3)]"
        >
          {isLoading ? (
             <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <ShieldCheck size={28} />
              Run AI Life-Simulation
              <Send size={24} />
            </>
          )}
        </motion.button>
      </form>
    </div>
  )
}

export default HealthInputPage
