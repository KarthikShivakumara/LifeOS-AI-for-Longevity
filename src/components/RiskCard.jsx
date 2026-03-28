import React from 'react'
import { motion } from 'framer-motion'
import { ShieldAlert, TrendingUp, TrendingDown, Clock } from 'lucide-react'

const RiskCard = ({ riskPercentage, trend, fiveYear, tenYear }) => {
  const isHighRisk = riskPercentage > 60
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-10 flex flex-col h-full bg-white/5 border-none relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-3">
            <div className={`p-4 rounded-2xl bg-gradient-to-br ${isHighRisk ? 'from-red-500/20 to-red-400/10 text-red-400 border border-red-500/20' : 'from-accent-blue/20 to-accent-cyan/10 text-accent-cyan border border-accent-blue/20'}`}>
                <ShieldAlert size={24} />
            </div>
            <div>
                <h3 className="text-xl font-bold font-['Outfit']">Risk Forecast</h3>
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">{trend}</p>
            </div>
        </div>
        
        <div className="flex flex-col items-end">
            <span className={`text-4xl font-black font-['Outfit'] ${isHighRisk ? 'text-red-400' : 'text-accent-blue'}`}>{riskPercentage}%</span>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Total Health Risk</span>
        </div>
      </div>

      <div className="space-y-6 flex-1">
        <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <TrendingUp size={18} className="text-slate-500" />
                <span className="text-sm font-bold text-slate-400">5-Year Burnout Probability</span>
            </div>
            <span className={`font-black uppercase text-[10px] tracking-widest px-3 py-1 rounded-full ${fiveYear === 'Low' ? 'bg-green-500/10 text-green-400' : 'bg-orange-500/10 text-orange-400'}`}>
                {fiveYear}
            </span>
        </div>

        <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Clock size={18} className="text-slate-500" />
                <span className="text-sm font-bold text-slate-400">10-Year Longevity Impact</span>
            </div>
            <span className={`font-black uppercase text-[10px] tracking-widest px-3 py-1 rounded-full ${tenYear === 'Low' ? 'bg-green-500/10 text-green-400' : tenYear === 'Moderate' ? 'bg-orange-500/10 text-orange-400' : 'bg-red-500/10 text-red-400'}`}>
                {tenYear}
            </span>
        </div>
      </div>

      <div className="mt-8">
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${riskPercentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-full ${isHighRisk ? 'bg-red-400' : 'bg-accent-blue'} shadow-[0_0_15px_rgba(59,130,246,0.3)]`} 
            />
        </div>
      </div>

      {/* Subtle scanline effect */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-white/5 animate-pulse" style={{ animationDuration: '2s' }} />
    </motion.div>
  )
}

export default RiskCard
