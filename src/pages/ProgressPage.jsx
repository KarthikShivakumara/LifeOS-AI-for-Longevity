import React, { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Calendar, Activity, Award, Brain, AlertTriangle, Zap, ChevronRight, RefreshCw, Star } from 'lucide-react'
import axios from 'axios'
import useHealthStore from '../store/useHealthStore'

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000'

// ─── SUB COMPONENTS ────────────────────────────────────────────────────────

const GradeRing = ({ grade }) => {
  const colors = { 'A+': '#10b981', 'A': '#22d3ee', 'B': '#8b5cf6', 'C': '#f59e0b', 'D': '#ef4444' }
  const color = colors[grade] || '#8b5cf6'
  return (
    <div className="flex flex-col items-center justify-center w-28 h-28 rounded-full border-4 shrink-0"
      style={{ borderColor: color, boxShadow: `0 0 30px ${color}40` }}>
      <span className="text-4xl font-black font-['Outfit']" style={{ color }}>{grade || '?'}</span>
      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Grade</span>
    </div>
  )
}

const TrendBadge = ({ trend }) => {
  const config = {
    Improving: { color: 'text-green-400 border-green-500/20 bg-green-500/10', icon: '↑' },
    Stable: { color: 'text-accent-cyan border-accent-cyan/20 bg-accent-cyan/10', icon: '→' },
    Declining: { color: 'text-red-400 border-red-500/20 bg-red-500/10', icon: '↓' }
  }
  const c = config[trend] || config.Stable
  return (
    <span className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${c.color}`}>
      {c.icon} {trend}
    </span>
  )
}

const ImpactBadge = ({ impact }) => {
  const colors = { High: 'text-red-400 bg-red-500/10 border-red-500/20', Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20', Low: 'text-green-400 bg-green-500/10 border-green-500/20' }
  return (
    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full border ${colors[impact] || colors.Medium}`}>
      {impact}
    </span>
  )
}

const MetricStat = ({ label, value }) => (
  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-xl font-black font-['Outfit'] text-white">{value}</p>
  </div>
)

const AnalysisPanel = ({ data, period }) => {
  if (!data) return null
  if (data.error) return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
      <AlertTriangle className="text-amber-400" size={40} />
      <p className="text-slate-400 font-medium max-w-sm">{data.error}</p>
      <p className="text-slate-500 text-sm">Submit more daily Health Reports to unlock {period} analysis.</p>
    </div>
  )

  const avg = data.averages || {}
  const stress = avg.stress_breakdown || {}

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center gap-6 p-8 rounded-3xl bg-white/5 border border-white/10">
        <GradeRing grade={data.overall_grade} />
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-black font-['Outfit'] uppercase tracking-tight">{period} Report</h3>
            <TrendBadge trend={data.trend} />
          </div>
          <p className="text-slate-300 font-medium leading-relaxed text-sm">{data.trend_summary}</p>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Based on <span className="text-white">{data.record_count || 0} daily reports</span>
          </p>
        </div>
      </div>

      {/* Averages Grid */}
      <div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Average Metrics</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricStat label="Avg Score" value={`${avg.avg_score || 0}/100`} />
          <MetricStat label="Avg Sleep" value={`${avg.avg_sleep || 0}h`} />
          <MetricStat label="Avg Steps" value={(avg.avg_steps || 0).toLocaleString()} />
          <MetricStat label="Avg Screen" value={`${avg.avg_screen || 0}h`} />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <MetricStat label="Low Stress Days" value={`${stress.Low || 0} days`} />
          <MetricStat label="Medium Stress Days" value={`${stress.Medium || 0} days`} />
          <MetricStat label="High Stress Days" value={`${stress.High || 0} days`} />
        </div>
      </div>

      {/* Two columns: Wins + Flags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Wins */}
        <div className="p-6 rounded-3xl bg-green-500/5 border border-green-500/15 space-y-4">
          <div className="flex items-center gap-2 text-green-400">
            <Star size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Key Wins</span>
          </div>
          <div className="space-y-3">
            {(data.key_wins || []).map((win, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 shrink-0" />
                <p className="text-sm text-slate-300 font-medium leading-relaxed">{win}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Flags */}
        <div className="p-6 rounded-3xl bg-red-500/5 border border-red-500/15 space-y-4">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Risk Flags</span>
          </div>
          <div className="space-y-3">
            {(data.risk_flags || []).map((flag, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
                <p className="text-sm text-slate-300 font-medium leading-relaxed">{flag}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lifestyle Recommendations */}
      <div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">AI Lifestyle Protocols</p>
        <div className="space-y-4">
          {(data.lifestyle_recommendations || []).map((rec, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-5 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-accent-purple/30 transition-all group"
            >
              <div className="w-10 h-10 rounded-2xl bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center text-accent-purple shrink-0 group-hover:scale-110 transition-transform">
                <Zap size={16} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="text-sm font-black uppercase tracking-wide text-white">{rec.title}</h4>
                  <ImpactBadge impact={rec.impact} />
                </div>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">{rec.action}</p>
              </div>
              <ChevronRight size={16} className="text-slate-600 shrink-0 mt-1" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Biological Insight banner */}
      {data.biological_insight && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-accent-purple/10 to-accent-blue/10 border border-accent-purple/20">
          <div className="flex items-start gap-4">
            <Brain size={20} className="text-accent-purple shrink-0 mt-0.5" />
            <div>
              <p className="text-[9px] font-black text-accent-purple uppercase tracking-widest mb-1">Longevity Insight</p>
              <p className="text-sm text-slate-300 font-medium leading-relaxed italic">"{data.biological_insight}"</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────

const ProgressPage = () => {
  const { user, allHistory, fetchHistory } = useHealthStore()
  const [activeTab, setActiveTab] = useState('chart')
  const [weeklyData, setWeeklyData] = useState(null)
  const [monthlyData, setMonthlyData] = useState(null)
  const [loadingWeekly, setLoadingWeekly] = useState(false)
  const [loadingMonthly, setLoadingMonthly] = useState(false)

  useEffect(() => {
    if (user?.id) fetchHistory(user.id)
  }, [user])

  const fetchWeekly = useCallback(async () => {
    if (!user?.id || user.id.startsWith('local_')) return
    setLoadingWeekly(true)
    try {
      const res = await axios.get(`${API_URL}/analysis/weekly/${user.id}`)
      setWeeklyData(res.data)
    } catch (e) {
      setWeeklyData({ error: 'Could not load weekly analysis.' })
    } finally {
      setLoadingWeekly(false)
    }
  }, [user])

  const fetchMonthly = useCallback(async () => {
    if (!user?.id || user.id.startsWith('local_')) return
    setLoadingMonthly(true)
    try {
      const res = await axios.get(`${API_URL}/analysis/monthly/${user.id}`)
      setMonthlyData(res.data)
    } catch (e) {
      setMonthlyData({ error: 'Could not load monthly analysis.' })
    } finally {
      setLoadingMonthly(false)
    }
  }, [user])

  // Auto-load analysis when tab is activated
  useEffect(() => {
    if (activeTab === 'weekly' && !weeklyData) fetchWeekly()
    if (activeTab === 'monthly' && !monthlyData) fetchMonthly()
  }, [activeTab])

  const chartData = allHistory.map(entry => ({
    date: new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: entry.score,
    bioAge: entry.biological_age
  }))
  const displayData = chartData.length > 0 ? chartData : [{ date: 'No data', score: 0, bioAge: 0 }]

  const tabs = [
    { id: 'chart', label: 'Score History', icon: TrendingUp },
    { id: 'weekly', label: 'Weekly AI Report', icon: Calendar },
    { id: 'monthly', label: 'Monthly AI Report', icon: Activity }
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 pb-20">
      <header className="flex justify-between items-end">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-bold font-['Outfit'] uppercase tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-r from-accent-purple via-accent-cyan to-accent-blue">
            Life Evolution Track
          </h1>
          <p className="text-slate-400 font-medium">AI-powered weekly & monthly analysis of your daily health reports.</p>
        </motion.div>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-accent-purple text-white shadow-lg shadow-accent-purple/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Chart Tab */}
        {activeTab === 'chart' && (
          <motion.div
            key="chart"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="glass-card p-10 border-none bg-white/5 space-y-8 relative overflow-hidden"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold font-['Outfit'] uppercase tracking-tight">Score Evolution</h3>
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest mt-1">{allHistory.length} sessions logged</p>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent-purple" />
                  <span>Longevity Score</span>
                </div>
              </div>
            </div>

            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={displayData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff08" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false}
                    tick={{ fill: '#475569', fontSize: 10, fontWeight: 900 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false}
                    tick={{ fill: '#475569', fontSize: 10, fontWeight: 900 }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ffffff15', borderRadius: '16px' }}
                    itemStyle={{ color: '#fff', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase' }}
                    labelStyle={{ color: '#64748b', fontSize: '10px', marginBottom: '6px', fontWeight: '900' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={3}
                    fillOpacity={1} fill="url(#colorScore)" dot={{ fill: '#8b5cf6', r: 4, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent-purple/5 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none" />
          </motion.div>
        )}

        {/* Weekly Tab */}
        {activeTab === 'weekly' && (
          <motion.div key="weekly" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex justify-between items-center mb-6">
              <p className="text-slate-400 text-sm font-medium">Groq AI analysis of your last 7 days of daily reports.</p>
              <button
                onClick={fetchWeekly}
                disabled={loadingWeekly}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white hover:border-accent-purple/40 transition-all disabled:opacity-50"
              >
                <RefreshCw size={13} className={loadingWeekly ? 'animate-spin' : ''} />
                {loadingWeekly ? 'Analyzing...' : 'Refresh'}
              </button>
            </div>
            {loadingWeekly ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-6">
                <div className="w-16 h-16 border-4 border-accent-purple/30 border-t-accent-purple rounded-full animate-spin" />
                <div className="text-center">
                  <p className="font-black uppercase tracking-widest text-accent-purple">AI Council Processing</p>
                  <p className="text-sm text-slate-500 mt-1">Analyzing your 7-day health patterns...</p>
                </div>
              </div>
            ) : (
              <AnalysisPanel data={weeklyData} period="Weekly" />
            )}
          </motion.div>
        )}

        {/* Monthly Tab */}
        {activeTab === 'monthly' && (
          <motion.div key="monthly" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex justify-between items-center mb-6">
              <p className="text-slate-400 text-sm font-medium">Groq AI analysis of your last 30 days of daily reports.</p>
              <button
                onClick={fetchMonthly}
                disabled={loadingMonthly}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white hover:border-accent-purple/40 transition-all disabled:opacity-50"
              >
                <RefreshCw size={13} className={loadingMonthly ? 'animate-spin' : ''} />
                {loadingMonthly ? 'Analyzing...' : 'Refresh'}
              </button>
            </div>
            {loadingMonthly ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-6">
                <div className="w-16 h-16 border-4 border-accent-purple/30 border-t-accent-purple rounded-full animate-spin" />
                <div className="text-center">
                  <p className="font-black uppercase tracking-widest text-accent-purple">AI Council Processing</p>
                  <p className="text-sm text-slate-500 mt-1">Analyzing your 30-day health patterns...</p>
                </div>
              </div>
            ) : (
              <AnalysisPanel data={monthlyData} period="Monthly" />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProgressPage
