import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Calendar, Zap, LayoutDashboard, ChevronRight, Loader2, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react'
import axios from 'axios'
import useHealthStore from '../store/useHealthStore'

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000'

const AnalysisCard = ({ report, averages }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="space-y-8"
  >
    {/* Averages Section */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Avg Sleep</p>
        <p className="text-3xl font-black text-white">{averages.sleep}<span className="text-sm text-slate-400 ml-1">h</span></p>
      </div>
      <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Avg Steps</p>
        <p className="text-3xl font-black text-white">{averages.steps.toLocaleString()}</p>
      </div>
      <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Avg Screen</p>
        <p className="text-3xl font-black text-white">{averages.screen}<span className="text-sm text-slate-400 ml-1">h</span></p>
      </div>
    </div>

    {/* AI Report Section */}
    <div className="glass-card p-10 bg-accent-purple/5 border-accent-purple/20 relative overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-3xl font-black font-['Outfit'] uppercase tracking-tighter mb-1">{report.title}</h3>
          <p className="text-slate-400 font-medium">{report.summary}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Health Grade</p>
          <p className={`text-4xl font-black ${report.grade === 'A' ? 'text-green-400' : 'text-blue-400'}`}>{report.grade}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Habit Recommendations */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-accent-purple">
            <Zap size={20} />
            <h4 className="text-sm font-black uppercase tracking-widest">Habit Inculcation Protocols</h4>
          </div>
          <div className="space-y-4">
            {report.habits?.map((h, i) => (
              <div key={i} className="p-5 rounded-3xl bg-white/5 border border-white/10 group hover:border-accent-purple/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black text-accent-purple uppercase tracking-widest">{h.habit}</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    h.impact === 'High' ? 'bg-orange-500/10 text-orange-400' : 'bg-blue-500/10 text-blue-400'
                  }`}>
                    {h.impact} Impact
                  </span>
                </div>
                <p className="text-sm text-slate-300 font-medium">{h.action}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Flags & Insights */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-red-400">
            <AlertCircle size={20} />
            <h4 className="text-sm font-black uppercase tracking-widest">Critical Risk Flags</h4>
          </div>
          <div className="space-y-3">
            {report.risk_flags?.map((f, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-slate-400 font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent-purple/10 blur-[120px] rounded-full -mr-32 -mt-32 pointer-events-none" />
    </div>
  </motion.div>
)

const AnalysisPage = () => {
  const [loading, setLoading] = useState(false)
  const [currentTab, setCurrentTab] = useState('weekly')
  const [selectedUser, setSelectedUser] = useState('user_1')
  const [data, setData] = useState(null)

  const fetchAnalysis = async (user, days) => {
    setLoading(true)
    try {
      const resp = await axios.get(`${API_URL}/analysis/dataset/${user}/${days}`)
      setData(resp.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalysis(selectedUser, currentTab === 'weekly' ? 7 : 30)
  }, [currentTab, selectedUser])

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 text-accent-purple mb-4">
            <TrendingUp size={24} />
            <span className="text-xs font-black uppercase tracking-widest">Longitudinal AI Insights</span>
          </div>
          <h1 className="text-5xl font-black font-['Outfit'] uppercase tracking-tighter mb-2">Health Analysis</h1>
          <p className="text-slate-400 font-medium max-w-xl">
            Processing dataset clusters to synthesize actionable longevity protocols based on multi-user biological signals.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/5 p-2 rounded-3xl border border-white/10">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl border border-white/10 mr-2">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Profile</p>
            <select 
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="bg-transparent border-none text-sm font-black text-white focus:ring-0 outline-none uppercase"
            >
              <option value="user_1" className="bg-dark text-white">Twin: user_1</option>
              <option value="user_2" className="bg-dark text-white">Twin: user_2</option>
              <option value="user_3" className="bg-dark text-white">Twin: user_3</option>
            </select>
          </div>
          
          <div className="flex bg-slate-900 rounded-2xl p-1">
            <button
              onClick={() => setCurrentTab('weekly')}
              className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                currentTab === 'weekly' ? 'bg-accent-purple text-white shadow-lg shadow-accent-purple/20' : 'text-slate-500 hover:text-white'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setCurrentTab('monthly')}
              className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                currentTab === 'monthly' ? 'bg-accent-purple text-white shadow-lg shadow-accent-purple/20' : 'text-slate-500 hover:text-white'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="h-[400px] flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-accent-purple" size={48} />
          <p className="text-sm font-black text-slate-500 uppercase tracking-[0.3em] animate-pulse">Processing Multi-User Clusters...</p>
        </div>
      ) : data ? (
        <AnalysisCard report={data.report} averages={data.averages} />
      ) : (
        <div className="h-[400px] flex items-center justify-center">
            <p className="text-slate-500">Failed to load dataset analysis.</p>
        </div>
      )}
    </div>
  )
}

export default AnalysisPage
