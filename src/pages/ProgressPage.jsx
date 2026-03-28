import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { TrendingUp, Calendar, Target, Award, ArrowUpRight, Activity } from 'lucide-react'
import useHealthStore from '../store/useHealthStore'

const StatCard = ({ label, value, trend, icon: Icon, color }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    className="glass-card p-8 border-none bg-white/5 group relative overflow-hidden"
  >
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 rounded-2xl bg-${color}/10 text-${color} border border-${color}/10 group-hover:scale-110 transition-transform duration-500 shadow-[0_4px_12px_rgba(0,0,0,0.1)]`}>
        <Icon size={24} />
      </div>
      <div className="flex items-center gap-1.5 text-green-400 text-[10px] font-black bg-green-400/10 px-3 py-1.5 rounded-full border border-green-500/10 uppercase tracking-widest">
        <ArrowUpRight size={14} />
        {trend}
      </div>
    </div>
    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] block mb-2">{label}</span>
    <p className="text-4xl font-black font-['Outfit'] tracking-tighter text-white">{value}</p>
    
    <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}/5 blur-[50px] -mr-16 -mt-16 group-hover:bg-${color}/10 transition-colors duration-1000`} />
  </motion.div>
)

const ProgressPage = () => {
    const { user, allHistory, fetchHistory, isLoading } = useHealthStore()

    useEffect(() => {
        if (user?.id) fetchHistory(user.id)
    }, [user])

    const chartData = allHistory.map(entry => ({
        date: new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        score: entry.score,
        age: entry.biological_age
    }))

    const displayData = chartData.length > 0 ? chartData : [
        { date: 'Initial', score: 0, age: 0 }
    ]

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12 pb-20">
            <header className="flex justify-between items-end">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-4xl font-bold font-['Outfit'] uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-accent-purple via-accent-cyan to-accent-blue">Life Evolution Track</h1>
                    <p className="text-slate-400 font-medium tracking-tight">Monitoring your biological trajectory across multidimensional health markers.</p>
                </motion.div>
                
                <div className="flex gap-4">
                    <button className="btn-secondary text-[10px] font-black uppercase tracking-[0.2em] border-none bg-white/5 hover:bg-white/10 px-6 font-['Outfit']">Last 30 Days Calibration</button>
                    <button className="btn-primary text-[10px] font-black uppercase tracking-[0.2em] px-6 font-['Outfit']">Export Bio-Data Synthesis</button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard label="Longevity Velocity" value="+12.4%" trend="Optimizing" icon={TrendingUp} color="accent-purple" />
                <StatCard label="Age Delta Summary" value="-3.2 Years" trend="Strong" icon={Calendar} color="accent-cyan" />
                <StatCard label="Mitotic Efficiency" value="88%" trend="Elite" icon={Activity} color="accent-blue" />
                <StatCard label="Protocol Accuracy" value="94/100" trend="Precise" icon={Award} color="green-400" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Trend Card */}
                <div className="lg:col-span-2 glass-card p-10 border-none bg-white/5 space-y-10 relative overflow-hidden">
                    <div className="flex justify-between items-center relative z-10">
                        <div className="space-y-1">
                            <h3 className="text-2xl font-bold font-['Outfit'] uppercase tracking-tight">Score Evolution Protocol</h3>
                            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Real-time biological scoring trend</p>
                        </div>
                        <div className="flex items-center gap-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-accent-purple shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
                                <span>Longevity Score</span>
                            </div>
                            <div className="flex items-center gap-1.5 opacity-50">
                                <span>Calibrated Range [0-100]</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[450px] w-full mt-6 relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={displayData}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff03" />
                                <XAxis 
                                    dataKey="date" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#475569', fontSize: 10, fontWeight: 900, fontFamily: 'Outfit'}}
                                    dy={15}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#475569', fontSize: 10, fontWeight: 900, fontFamily: 'Outfit'}}
                                />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ffffff10', borderRadius: '16px', backdropFilter: 'blur(20px)' }}
                                    itemStyle={{ color: '#fff', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase' }}
                                    labelStyle={{ color: '#64748b', fontSize: '10px', marginBottom: '8px', fontWeight: '900' }}
                                />
                                <Area type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={5} fillOpacity={1} fill="url(#colorScore)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Subtle decorative background pulse */}
                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent-purple/5 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2" />
                </div>

                {/* Growth Analysis Card */}
                <div className="glass-card p-10 border-none bg-white/5 flex flex-col relative overflow-hidden">
                    <h3 className="text-2xl font-bold font-['Outfit'] uppercase tracking-tight mb-10">Bio-Milestones</h3>
                    <div className="space-y-10 relative flex-1 before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-px before:bg-white/5">
                        {[
                            { title: 'Calibration Stable', date: '3 sessions logged', icon: Target, color: 'text-accent-purple', bg: 'bg-accent-purple/10' },
                            { title: 'Inflammation Baseline', date: 'Normal range', icon: Activity, color: 'text-accent-cyan', bg: 'bg-accent-cyan/10' },
                            { title: ' Longevity Goal Alpha', date: '88% Completion', icon: Award, color: 'text-accent-blue', bg: 'bg-accent-blue/10' },
                            { title: 'Next Sync Scheduled', date: 'In 24 hours', icon: Calendar, color: 'text-slate-500', bg: 'bg-white/5' }
                        ].map((m, i) => (
                            <div key={i} className="flex gap-8 relative z-10 transition-transform hover:translate-x-1 duration-300 cursor-default">
                                <div className={`w-10 h-10 rounded-2xl ${m.bg} flex items-center justify-center shrink-0 border border-white/5 z-10 shadow-lg`}>
                                    <m.icon className={m.color} size={18} />
                                </div>
                                <div className="pt-0.5">
                                    <h4 className="text-sm font-black text-white/90 uppercase tracking-widest">{m.title}</h4>
                                    <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-tighter">{m.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-8 rounded-3xl bg-gradient-to-tr from-accent-purple/20 to-accent-blue/20 border border-white/10 text-center relative z-10 group overflow-hidden">
                        <p className="text-sm font-black italic tracking-tight mb-4 group-hover:scale-105 transition-transform duration-500 leading-relaxed text-white">"Your biological trajectory suggests you are outperforming <span className="text-accent-cyan">92%</span> of your age-matched twin group."</p>
                        <button className="text-[10px] font-black uppercase text-accent-purple tracking-[0.3em] underline decoration-accent-purple/30 underline-offset-8 transition-all hover:decoration-accent-purple">Share Bio-Evolution</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProgressPage
