import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Zap } from 'lucide-react'

const ScoreCard = ({ score, label }) => {
  const isGood = score >= 75
  const isPoor = score < 50
  
  const statusColor = isGood ? 'text-green-400' : isPoor ? 'text-red-400' : 'text-accent-purple'
  const bgColor = isGood ? 'bg-green-400/10' : isPoor ? 'bg-red-400/10' : 'bg-accent-purple/10'

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-card p-10 flex flex-col justify-center items-center h-full relative overflow-hidden bg-white/5 border-none group"
    >
      <div className="absolute top-6 left-6 flex items-center gap-2 text-slate-500 font-black text-[10px] uppercase tracking-[0.3em]">
        <Activity size={14} className="text-accent-purple" />
        Longevity Score
      </div>

      <div className="relative">
        <svg className="w-56 h-56 transform -rotate-90">
          <circle
            cx="112"
            cy="112"
            r="100"
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-white/5"
          />
          <motion.circle
            cx="112"
            cy="112"
            r="100"
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray="628"
            initial={{ strokeDashoffset: 628 }}
            animate={{ strokeDashoffset: 628 - (628 * score) / 100 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={statusColor}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
          <span className="text-7xl font-black font-['Outfit'] tracking-tighter">{score}</span>
          <span className={`text-sm font-black uppercase tracking-widest ${statusColor}`}>
            {label}
          </span>
        </div>
      </div>

      <div className="mt-8 flex gap-4 w-full">
         <div className="flex-1 p-3 rounded-2xl bg-white/5 border border-white/5 text-center">
            <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Target</span>
            <span className="text-lg font-black font-['Outfit']">95+</span>
         </div>
         <div className="flex-1 p-3 rounded-2xl bg-white/5 border border-white/5 text-center">
            <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</span>
            <span className={`text-lg font-black font-['Outfit'] ${statusColor}`}>{isGood ? 'Optimal' : 'Needs Work'}</span>
         </div>
      </div>

      {/* Decorative gradient */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-accent-purple/5 to-transparent -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
    </motion.div>
  )
}

export default ScoreCard
