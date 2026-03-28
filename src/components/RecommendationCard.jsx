import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, AlertCircle, ArrowRight, Zap, Target } from 'lucide-react'

const RecommendationCard = ({ positives, improvements }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-card p-10 flex flex-col h-full bg-white/5 border-none relative overflow-hidden"
    >
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
            <Zap size={20} className="text-accent-purple" />
            <h3 className="text-xl font-bold font-['Outfit'] tracking-tight">AI Insights</h3>
        </div>
        <div className="px-4 py-2 rounded-xl bg-accent-purple/10 border border-accent-purple/20 text-accent-purple text-[10px] font-black tracking-widest uppercase">
            Protocol: Longevity Alpha
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 flex-1">
        <div className="space-y-6">
            <h4 className="text-xs font-black uppercase text-green-400 tracking-[0.3em] flex items-center gap-2">
                <CheckCircle2 size={14} />
                Optimal Markers
            </h4>
            <div className="space-y-4">
                {(positives && positives.length > 0 ? positives : ['Stable Vital Baseline']).map((item, i) => (
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="flex items-center gap-4 p-4 rounded-2xl bg-green-500/5 border border-green-500/10 group hover:bg-green-500/10 transition-colors"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 group-hover:scale-150 transition-transform shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                        <span className="text-sm font-bold text-slate-300">{item}</span>
                    </motion.div>
                ))}
            </div>
        </div>

        <div className="space-y-6">
            <h4 className="text-xs font-black uppercase text-orange-400 tracking-[0.3em] flex items-center gap-2">
                <AlertCircle size={14} />
                Critical Improvement
            </h4>
            <div className="space-y-4">
                {(improvements && improvements.length > 0 ? improvements : ['Enhance Activity Consistency']).map((item, i) => (
                    <motion.div 
                        initial={{ opacity: 0, x: 10 }} 
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="flex items-center gap-4 p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10 group hover:bg-orange-500/10 transition-colors"
                    >
                        <Target size={14} className="text-orange-400" />
                        <span className="text-sm font-bold text-slate-300">{item}</span>
                    </motion.div>
                ))}
            </div>
        </div>
      </div>

      <button className="mt-12 group w-full p-6 rounded-3xl bg-gradient-to-r from-accent-purple/20 to-accent-blue/20 border border-white/10 flex items-center justify-between hover:bg-white/5 transition-all transition-colors duration-500">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-accent-purple border border-white/5">
                <Zap size={20} className="fill-current" />
            </div>
            <div className="text-left">
                <p className="text-xs font-black uppercase text-slate-500 tracking-widest">Next Action</p>
                <p className="text-sm font-black text-white px-0.5">Generate Digital Twin Routine</p>
            </div>
        </div>
        <ArrowRight className="text-slate-500 group-hover:text-white group-hover:translate-x-2 transition-all transition-colors duration-500" />
      </button>

      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent-purple/5 blur-[100px] rounded-full" />
    </motion.div>
  )
}

export default RecommendationCard
