import React from 'react'
import { motion } from 'framer-motion'
import { Info } from 'lucide-react'

const SimulationSlider = ({ icon: Icon, label, value, min, max, step, onChange, unit }) => {
  return (
    <div className="space-y-4 p-8 glass-card bg-white/5 border-none group relative overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-accent-purple/10 flex items-center justify-center text-accent-purple group-hover:scale-110 transition-transform duration-500 border border-accent-purple/10 shadow-[0_4px_12px_rgba(139,92,246,0.2)]">
                <Icon size={20} />
            </div>
            <div>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 block mb-1">Parameter Calibration</span>
                <span className="text-lg font-black font-['Outfit'] text-white">{label}</span>
            </div>
        </div>
        <div className="flex flex-col items-end">
            <div className="text-2xl font-black font-['Outfit'] text-accent-purple bg-accent-purple/5 px-4 py-1.5 rounded-2xl border border-accent-purple/10">
                {value}<span className="text-xs ml-1 text-slate-400 font-bold uppercase">{unit}</span>
            </div>
        </div>
      </div>

      <div className="relative pt-4">
        <div className="absolute top-0 right-0 -mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 text-[8px] font-black text-slate-500 tracking-[0.2em] uppercase">
            <Info size={10} />
            Real-time AI Adjustment
        </div>
        <input 
            type="range" 
            min={min} 
            max={max} 
            step={step}
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-2 bg-white/5 rounded-full appearance-none accent-accent-purple cursor-pointer shadow-inner"
        />
        <div className="flex justify-between mt-3 text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
            <span>MIN ({min})</span>
            <span>MAX ({max})</span>
        </div>
      </div>

      {/* Subtle decorative background gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent-purple/5 blur-[50px] -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
    </div>
  )
}

export default SimulationSlider
