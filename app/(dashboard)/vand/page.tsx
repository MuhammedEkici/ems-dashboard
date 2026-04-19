'use client'

import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { Droplets, TrendingDown, TrendingUp, CheckCircle, Upload } from 'lucide-react'
import AnimatedCounter from '@/components/ui/AnimatedCounter'

const mockVandData = [
  { month: 'Jan', m3: 14.2, dkk: 184 }, { month: 'Feb', m3: 13.8, dkk: 179 },
  { month: 'Mar', m3: 15.1, dkk: 196 }, { month: 'Apr', m3: 16.4, dkk: 213 },
  { month: 'Maj', m3: 18.2, dkk: 237 }, { month: 'Jun', m3: 19.8, dkk: 257 },
  { month: 'Jul', m3: 21.3, dkk: 277 }, { month: 'Aug', m3: 20.1, dkk: 261 },
  { month: 'Sep', m3: 17.6, dkk: 229 }, { month: 'Okt', m3: 15.9, dkk: 207 },
  { month: 'Nov', m3: 14.7, dkk: 191 }, { month: 'Dec', m3: 18.4, dkk: 239 },
]

const dailyData = [
  { date: '12. apr', m3: 0.62, dkk: 8.1, trend: 'up' },
  { date: '13. apr', m3: 0.58, dkk: 7.5, trend: 'down' },
  { date: '14. apr', m3: 0.71, dkk: 9.2, trend: 'up' },
  { date: '15. apr', m3: 0.55, dkk: 7.2, trend: 'down' },
  { date: '16. apr', m3: 0.63, dkk: 8.2, trend: 'up' },
  { date: '17. apr', m3: 0.59, dkk: 7.7, trend: 'down' },
  { date: '18. apr', m3: 0.61, dkk: 7.9, trend: 'up' },
]

const tooltipStyle = {
  background: '#1a1a2e',
  border: '1px solid rgba(59,130,246,0.3)',
  borderRadius: 12,
  color: '#fff',
  fontSize: 12,
}

export default function VandPage() {
  const [period, setPeriod] = useState('2024')
  const [mounted, setMounted] = useState(false)
  const [showImport, setShowImport] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const totalM3 = mockVandData.reduce((s, d) => s + d.m3, 0)
  const totalDkk = mockVandData.reduce((s, d) => s + d.dkk, 0)
  const avgPerDay = (totalM3 / 365).toFixed(2)
  const highestMonth = mockVandData.reduce((max, d) => d.m3 > max.m3 ? d : max, mockVandData[0])
  const lowestMonth = mockVandData.reduce((min, d) => d.m3 < min.m3 ? d : min, mockVandData[0])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 12px rgba(59,130,246,0.2)',
          }}>
            <Droplets size={20} color="#3b82f6" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: '#ffffff' }}>Vand</h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setShowImport(!showImport)}
            className="btn-outline"
            style={{ height: 36, fontSize: 13, borderColor: 'rgba(59,130,246,0.4)', color: '#3b82f6' }}
          >
            <Upload size={14} />
            Importer data
          </button>
          <select
            value={period}
            onChange={e => setPeriod(e.target.value)}
            className="ems-select"
            style={{ width: 'auto', height: 36, fontSize: 13 }}
          >
            {['2026', '2025', '2024', '2023', '2022'].map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* HERO STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          { label: 'Samlet forbrug', value: totalM3, unit: 'm³', color: '#3b82f6', icon: '💧', decimals: 1 },
          { label: 'Samlet omkostning', value: totalDkk, unit: 'DKK', color: '#00d4ff', icon: '💰', decimals: 0 },
          { label: 'Gns. per dag', value: parseFloat(avgPerDay), unit: 'm³/dag', color: '#a855f7', icon: '📊', decimals: 2 },
          { label: 'Vs. forrige år', value: -3.1, unit: '%', color: '#00ff88', icon: '📉', decimals: 1 },
        ].map((stat, i) => (
          <div key={i} className="ems-card animate-stagger-fade-up" style={{ animationDelay: `${i * 80}ms`, borderColor: 'rgba(59,130,246,0.2)' }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{stat.icon}</div>
            <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
              {stat.label}
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: stat.color, lineHeight: 1.1 }}>
              {mounted ? (
                <AnimatedCounter value={Math.abs(stat.value)} decimals={stat.decimals} duration={900} />
              ) : Math.abs(stat.value)}
              <span style={{ fontSize: 13, fontWeight: 400, color: '#475569', marginLeft: 4 }}>{stat.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* IMPORT PANEL */}
      {showImport && (
        <div className="ems-card animate-fade-in" style={{ borderColor: 'rgba(59,130,246,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Upload size={16} color="#3b82f6" />
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#ffffff' }}>Importer vanddata</h3>
            <span style={{ fontSize: 12, color: '#475569', marginLeft: 'auto' }}>Kun admin</span>
          </div>
          <div
            className="upload-area"
            style={{ borderColor: 'rgba(59,130,246,0.3)' }}
            onClick={() => {}}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>📂</div>
            <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 4 }}>
              Træk og slip din Excel-fil her eller klik for at vælge
            </div>
            <div style={{ fontSize: 12, color: '#475569' }}>
              Format: Kolonne A = Måneder, Kolonne B+ = År (2022–2026)
            </div>
          </div>
        </div>
      )}

      {/* MONTHLY BAR CHART */}
      <div className="ems-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <span className="category-label" style={{ color: '#3b82f6' }}>Vand</span>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#ffffff' }}>Vandforbrug & historik</h2>
          </div>
          <span className="data-source-mock">Simuleret</span>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={mockVandData} barSize={20}>
            <defs>
              <linearGradient id="vandBarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(v: number) => [`${v} m³`, 'Forbrug']}
              labelFormatter={(l) => `📅 ${l}`}
            />
            <Bar dataKey="m3" fill="url(#vandBarGrad)" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={800} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* LEAK DETECTION + STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Leak detection */}
        <div className="ems-card" style={{ borderColor: 'rgba(0,255,136,0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <CheckCircle size={16} color="#00ff88" />
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#ffffff' }}>Lækagedetektering</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px', background: 'rgba(0,255,136,0.06)', borderRadius: 12, border: '1px solid rgba(0,255,136,0.15)', marginBottom: 16 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 10px #00ff88', animation: 'livePulse 1.5s ease-in-out infinite', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#00ff88' }}>Ingen lækage detekteret</div>
              <div style={{ fontSize: 12, color: '#475569' }}>Senest tjekket: i dag kl. 06:00</div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8 }}>Daglig spike-grænse: +20%</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#475569' }}>
            <span>Gårsdagens forbrug: 0.59 m³</span>
            <span style={{ color: '#00ff88' }}>Normal ✓</span>
          </div>
        </div>

        {/* Vandstatistik */}
        <div className="ems-card" style={{ borderColor: 'rgba(59,130,246,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Droplets size={16} color="#3b82f6" />
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#ffffff' }}>Vandstatistik</h3>
          </div>
          {[
            { label: 'Gns. per dag', value: `${avgPerDay} m³`, color: '#3b82f6' },
            { label: 'Højeste måned', value: `${highestMonth.month}: ${highestMonth.m3} m³`, color: '#ef4444' },
            { label: 'Laveste måned', value: `${lowestMonth.month}: ${lowestMonth.m3} m³`, color: '#00ff88' },
            { label: 'År-til-år trend', value: '-3.1% vs 2023', color: '#00ff88' },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <span style={{ fontSize: 13, color: '#94a3b8' }}>{row.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: row.color }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* DAILY TABLE */}
      <div className="ems-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#ffffff' }}>Dagligt forbrug — seneste 7 dage</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Dato', 'm³', 'DKK', 'Trend'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, color: '#475569', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dailyData.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', background: i % 2 === 0 ? 'transparent' : 'rgba(59,130,246,0.02)' }}>
                  <td style={{ padding: '10px 12px', fontSize: 13, color: '#94a3b8' }}>{row.date}</td>
                  <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#ffffff' }}>{row.m3}</td>
                  <td style={{ padding: '10px 12px', fontSize: 13, color: '#94a3b8' }}>{row.dkk}</td>
                  <td style={{ padding: '10px 12px' }}>
                    {row.trend === 'up' ? (
                      <TrendingUp size={14} color="#ef4444" />
                    ) : (
                      <TrendingDown size={14} color="#00ff88" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
