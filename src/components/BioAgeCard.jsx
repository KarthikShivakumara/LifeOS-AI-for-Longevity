import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, User } from 'lucide-react'

const BioAgeCard = ({ bioAge, actualAge }) => {
  const difference = actualAge - bioAge
  const isOptimal = difference > 0

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-8 border-none bg-gradient-to-br from-white/5 to-transparent relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Biological Age</h3>
        <div className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${isOptimal ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
          {isOptimal ? 'CALIBRATION OPTIMAL' : 'CALIBRATION LOW'}
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="space-y-1">
          <span className="text-6xl font-black font-['Outfit'] text-accent-cyan tracking-tighter">{bioAge}</span>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Digital Twin Age</p>
        </div>

        <div className="h-12 w-px bg-white/10" />

        <div className="space-y-4 flex-1">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2 text-slate-400 font-bold">
              <User size={14} />
              <span>Actual Age</span>
            </div>
            <span className="font-black font-['Outfit']">{actualAge}</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2 text-slate-400 font-bold">
              <Calendar size={14} />
              <span>Longevity Gain</span>
            </div>
            <span className={`font-black font-['Outfit'] ${isOptimal ? 'text-green-400' : 'text-slate-400'}`}>
              {isOptimal ? `-${difference.toFixed(1)} Years` : 'None'}
            </span>
          </div>
        </div>
      </div>

      {/* Decorative pulse */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent-cyan/10 blur-[60px] rounded-full -mr-16 -mt-16" />
    </motion.div>
  )
}

export default BioAgeCard
