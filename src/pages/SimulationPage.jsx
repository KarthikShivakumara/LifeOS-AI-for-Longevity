import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Activity, Clock, RotateCcw, TrendingUp, Info, AlertTriangle } from 'lucide-react'
import useHealthStore from '../store/useHealthStore'
import SimulationSlider from '../components/SimulationSlider'

const SimulationPage = () => {
    const { healthData, user, simulateChange, isLoading, setLoading } = useHealthStore()
    const [sliders, setSliders] = useState({
        sleep: 7,
        steps: 5000,
        screenTime: 4,
        stress: 'Medium'
    })
    
    const [simResult, setSimResult] = useState({
        before: healthData?.health_score || 70,
        after: healthData?.health_score || 70,
        gain: 0,
        longevity_gain_years: 0,
        risk_reduction_percent: 0
    })

    const handleSimulation = async () => {
        setLoading(true)
        try {
            const result = await simulateChange(sliders)
            setSimResult(result)
        } finally {
            setLoading(false)
        }
    }

    // Auto-sim on slider change
    useEffect(() => {
        const timeout = setTimeout(() => {
            handleSimulation()
        }, 500)
        return () => clearTimeout(timeout)
    }, [sliders])

    if (!healthData) {
        return (
            <div className="p-20 text-center space-y-6">
                <AlertTriangle className="mx-auto text-orange-400" size={48} />
                <h2 className="text-2xl font-black font-['Outfit'] uppercase">Simulation Engine Offline</h2>
                <p className="text-slate-500">Please complete an initial AI analysis to activate the Digital Twin model.</p>
            </div>
        )
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-10 pb-20">
            <header className="flex justify-between items-end">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="flex items-center gap-3 mb-2">
                        <Zap size={24} className="text-accent-purple shadow-[0_0_15px_rgba(139,92,246,0.5)]" />
                        <h1 className="text-4xl font-bold font-['Outfit'] tracking-tighter uppercase">Digital Twin Modeling</h1>
                    </div>
                    <p className="text-slate-400 font-medium">Predict your biological future by adjusting daily lifestyle parameters.</p>
                </motion.div>
                
                <button 
                    onClick={() => setSliders({ sleep: 7, steps: 5000, screenTime: 4, stress: 'Medium' })}
                    className="btn-secondary flex items-center gap-2 text-xs font-black uppercase tracking-widest border-red-500/20 text-red-400 hover:bg-red-400/5 mb-2"
                >
                    <RotateCcw size={14} />
                    Reset Model
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* 1. Controllers (5 columns) */}
                <div className="lg:col-span-5 space-y-6">
                    <SimulationSlider 
                        label="Daily Sleep" 
                        icon={Clock} 
                        unit="Hours"
                        min={3} max={12} step={0.5} 
                        value={sliders.sleep}
                        onChange={(v) => setSliders({...sliders, sleep: parseFloat(v)})} 
                    />
                    <SimulationSlider 
                        label="Daily Steps" 
                        icon={Activity} 
                        unit="Steps"
                        min={0} max={20000} step={500} 
                        value={sliders.steps}
                        onChange={(v) => setSliders({...sliders, steps: parseInt(v)})} 
                    />
                    <SimulationSlider 
                        label="Screen Time" 
                        icon={Zap} 
                        unit="Hours"
                        min={0} max={18} step={0.5} 
                        value={sliders.screenTime}
                        onChange={(v) => setSliders({...sliders, screenTime: parseFloat(v)})} 
                    />

                    <div className="p-8 rounded-3xl bg-accent-purple/10 border border-accent-purple/20 relative overflow-hidden group">
                        <div className="flex gap-4 text-accent-purple mb-4">
                            <Info size={24} />
                            <span className="text-lg font-black font-['Outfit'] uppercase tracking-tight">Personalized for {user?.name || 'You'}</span>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed font-medium relative z-10">
                            Projecting against your <span className="text-white font-black">actual baseline score of {healthData?.health_score || '—'}</span>. Adjustments are calibrated to your age and biological profile.
                        </p>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-purple/10 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:bg-accent-purple/20 transition-all duration-700" />
                    </div>
                </div>

                {/* 2. Simulation Results (7 columns) */}
                <div className="lg:col-span-7">
                    <div className="glass-card p-12 h-full relative overflow-hidden bg-gradient-to-br from-white/5 to-transparent border-none">
                        <div className="absolute top-0 right-0 p-8">
                             <div className={`text-[10px] font-black tracking-[0.3em] px-4 py-1.5 rounded-full border ${isLoading ? 'border-accent-purple text-accent-purple animate-pulse' : 'border-green-500/30 text-green-500'}`}>
                                {isLoading ? 'PROCESSING MODEL...' : 'STABLE PROJECTION'}
                             </div>
                        </div>

                        <div className="space-y-16">
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">Projected Outcome Synthesis</h2>
                            
                            <div className="space-y-12">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest font-['Outfit']">Projected Score Growth</span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-7xl font-black font-['Outfit'] tracking-tighter text-white">
                                                {Math.round(simResult.after)}
                                            </span>
                                            <span className={`text-sm font-black ${simResult.gain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {simResult.gain >= 0 ? `+${simResult.gain}` : simResult.gain} Points
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${simResult.after}%` }}
                                            transition={{ duration: 1 }}
                                            className="h-full bg-accent-purple shadow-[0_0_20px_rgba(139,92,246,0.6)]" 
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-white/5">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-accent-cyan/10 border border-accent-cyan/10 flex items-center justify-center text-accent-cyan group hover:scale-110 transition-transform">
                                                <TrendingUp size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Est. Longevity Gain</p>
                                                <p className={`text-2xl font-black font-['Outfit'] ${simResult.longevity_gain_years >= 0 ? 'text-accent-cyan' : 'text-red-400'}`}>
                                                    {simResult.longevity_gain_years >= 0 ? '+' : ''}{simResult.longevity_gain_years} Years
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-green-500/10 border border-green-500/10 flex items-center justify-center text-green-400 group hover:scale-110 transition-transform">
                                                <Activity size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Risk Reduction</p>
                                                <p className={`text-2xl font-black font-['Outfit'] ${simResult.risk_reduction_percent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                    {simResult.risk_reduction_percent >= 0 ? '-' : '+'}{Math.abs(simResult.risk_reduction_percent)}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-10">
                                <motion.button 
                                    whileHover={{ scale: 1.02 }} 
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full p-6 rounded-3xl bg-gradient-to-r from-accent-purple to-accent-blue font-black uppercase text-xl tracking-[0.2em] shadow-[0_15px_40px_rgba(139,92,246,0.3)] group overflow-hidden relative"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-4">
                                        Apply Habit Protocol
                                        <Zap size={24} className="fill-current" />
                                    </span>
                                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SimulationPage
