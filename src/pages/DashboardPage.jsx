import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Activity, Zap, Clock, AlertTriangle, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useHealthStore from '../store/useHealthStore'

// Import new specialized cards
import ScoreCard from '../components/ScoreCard'
import BioAgeCard from '../components/BioAgeCard'
import RiskCard from '../components/RiskCard'
import RecommendationCard from '../components/RecommendationCard'

const DashboardPage = () => {
    const navigate = useNavigate()
    const { user, healthData, fetchHistory, isLoading } = useHealthStore()

    useEffect(() => {
        if (user?.id) {
            fetchHistory(user.id)
        }
    }, [user])

    if (!healthData) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-8">
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-24 h-24 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400 border border-orange-500/20"
                >
                    <AlertTriangle size={48} />
                </motion.div>
                <div className="space-y-4 max-w-md">
                    <h2 className="text-3xl font-black font-['Outfit'] uppercase tracking-tighter">AI Calibration Missing</h2>
                    <p className="text-slate-400 font-medium">Your Digital Twin is inactive. We need your lifestyle data to generate a longevity forecast.</p>
                </div>
                <button 
                    onClick={() => navigate('/health-input')}
                    className="btn-primary px-10 py-5 flex items-center gap-3 font-black uppercase tracking-widest text-lg"
                >
                    Initialize AI Twin
                    <ArrowRight size={20} />
                </button>
            </div>
        )
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-10 pb-20">
            <header className="flex justify-between items-end">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="flex items-center gap-3 mb-2">
                        <Activity size={24} className="text-accent-purple" />
                        <h1 className="text-4xl font-bold font-['Outfit'] tracking-tighter uppercase">Health Intelligence Hub</h1>
                    </div>
                    <p className="text-slate-400 font-medium tracking-tight">AI Diagnostic Synthesis for <span className="text-white font-black">{user?.name || 'Authorized User'}</span></p>
                </motion.div>
                
                <div className="flex gap-4">
                    <div className="glass-card px-6 py-3 border-none flex items-center gap-3 bg-white/5">
                        <Clock size={16} className="text-slate-500" />
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Next Audit: <span className="text-white">In 22h</span></span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* 1. Main Score Card (4 columns) */}
                <div className="lg:col-span-4 h-full">
                    <ScoreCard score={healthData.health_score} label={healthData.label} />
                </div>

                {/* 2. BioAge & Risk Forecast (8 columns) */}
                <div className="lg:col-span-8 flex flex-col gap-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <BioAgeCard bioAge={healthData.biological_age} actualAge={user?.age || 32} />
                        <RiskCard 
                            riskPercentage={healthData.future?.risk_percentage || 20} 
                            trend={healthData.future?.trend || 'Stable'} 
                            fiveYear={healthData.future?.['5_year'] || 'Low'} 
                            tenYear={healthData.future?.['10_year'] || 'Low'} 
                        />
                    </div>
                    
                    {/* 3. AI Insights (Full width of this section) */}
                    <div className="flex-1">
                        <RecommendationCard 
                            positives={healthData.feedback?.positives} 
                            improvements={healthData.feedback?.improvements} 
                        />
                    </div>
                </div>
            </div>


        </div>
    )
}

export default DashboardPage
