'use client'

import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, ReferenceLine
} from 'recharts'
import { Zap, TrendingDown } from 'lucide-react'
import AnimatedCounter from '@/components/ui/AnimatedCounter'

const mockElData = [
  { month: 'Jan', kwh: 412, dkk: 1072 }, { month: 'Feb', kwh: 387, dkk: 1006 },
  { month: 'Mar', kwh: 356, dkk: 925 }, { month: 'Apr', kwh: 298, dkk: 775 },
  { month: 'Maj', kwh: 267, dkk: 694 }, { month: 'Jun', kwh: 231, dkk: 601 },
  { month: 'Jul', kwh: 218, dkk: 567 }, { month: 'Aug', kwh: 245, dkk: 637 },
  { month: 'Sep', kwh: 289, dkk: 751 }, { month: 'Okt', kwh: 342, dkk: 891 },
  { month: 'Nov', kwh: 398, dkk: 1035 }, { month: 'Dec', kwh: 445, dkk: 1157 },
]

const mockSpotPrices = [
  0.42, 0.38, 0.35, 0.32, 0.31, 0.33, 0.45, 0.72, 1.15, 1.42, 1.38, 1.25,
  1.10, 0.98, 0.95, 1.05, 1.35, 1.68, 1.82, 1.75, 1.45, 1.12, 0.85, 0.62
].map((p, i) => ({
  hour: `${String(i).padStart(2, '0')}:00`,
  price: p,
}))

// Hourly usage heatmap data (7 days x 24 hours)
const days = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn']
const heatmapData = days.map(day => ({
  day,
  hours: Array.from({ length: 24 }, (_, h) => {
    const base = h >= 6 && h <= 22 ? 0.4 + Math.random() * 0.8 : 0.1 + Math.random() * 0.3
    return Math.round(base * 100) / 100
  }),
}))

const currentHour = new Date().getHours()

function getBarColor(price: number) {
  if (price < 0.6) return '#00ff88'
  if (price < 1.2) return '#f59e0b'
  return '#ef4444'
}

function getHeatColor(val: number) {
  const t = Math.min(val / 1.2, 1)
  if (t < 0.33) return `rgba(0,212,255,${0.1 + t * 0.6})`
  if (t < 0.66) return `rgba(245,158,11,${0.2 + t * 0.5})`
  return `rgba(239,68,68,${0.3 + t * 0.5})`
}

const tooltipStyle = {
  background: '#1a1a2e',
  border: '1px solid rgba(0,212,255,0.3)',
  borderRadius: 12,
  color: '#fff',
  fontSize: 12,
}

export default function ElPage() {
  const [period, setPeriod] = useState('2024')
  const [mounted, setMounted] = useState(false)
  const [hoverCell, setHoverCell] = useState<{ day: number; hour: number } | null>(null)

  useEffect(() => { setMounted(true) }, [])

  const totalKwh = mockElData.reduce((s, d) => s + d.kwh, 0)
  const totalDkk = mockElData.reduce((s, d) => s + d.dkk, 0)
  const peakHour = mockSpotPrices.reduce((max, d) => d.price > max.price ? d : max, mockSpotPrices[0])
  const cheapHour = mockSpotPrices.reduce((min, d) => d.price < min.price ? d : min, mockSpotPrices[0])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'rgba(0,255,136,0.12)', border: '1px solid rgba(0,255,136,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 12px rgba(0,255,136,0.2)',
          }}>
            <Zap size={20} color="#00ff88" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: '#ffffff' }}>El</h1>
        </div>
        <select
          value={period}
          onChange={e => setPeriod(e.target.value)}
          className="ems-select"
          style={{ width: 'auto', height: 36, fontSize: 13 }}
        >
          {['2026', '2025', '2024', '2023', '2022', '12 måneder tilbage', '30 dage tilbage'].map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* HERO STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          { label: 'Samlet forbrug', value: totalKwh, unit: 'kWh', color: '#00ff88', icon: '⚡' },
          { label: 'Samlet omkostning', value: totalDkk, unit: 'DKK', color: '#00d4ff', icon: '💰' },
          { label: 'Gns. per dag', value: 41.5, unit: 'kWh/dag', color: '#a855f7', icon: '📊' },
          { label: 'Vs. forrige år', value: -3.2, unit: '%', color: '#00ff88', icon: '📉', isPercent: true },
        ].map((stat, i) => (
          <div key={i} className="ems-card animate-stagger-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{stat.icon}</div>
            <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
              {stat.label}
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: stat.color, lineHeight: 1.1 }}>
              {mounted ? (
                <AnimatedCounter value={Math.abs(stat.value)} decimals={stat.unit === '%' ? 1 : 0} duration={900} />
              ) : Math.abs(stat.value)}
              <span style={{ fontSize: 13, fontWeight: 400, color: '#475569', marginLeft: 4 }}>{stat.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* MONTHLY BAR CHART */}
      <div className="ems-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <span className="category-label category-label-el">El</span>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#ffffff' }}>Månedligt forbrug</h2>
          </div>
          <span className="data-source-mock">Simuleret</span>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={mockElData} barSize={20}>
            <defs>
              <linearGradient id="elBarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00ff88" stopOpacity={1} />
                <stop offset="100%" stopColor="#00ff88" stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(v: number) => [`${v} kWh`, 'Forbrug']}
              labelFormatter={(l) => `📅 ${l}`}
            />
            <Bar dataKey="kwh" fill="url(#elBarGrad)" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={800} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* SPOT PRICES */}
      <div className="ems-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <span className="category-label category-label-el">El</span>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#ffffff' }}>Elspot priser — næste 24 timer</h2>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {[
              { color: '#00ff88', label: 'Billig' },
              { color: '#f59e0b', label: 'Normal' },
              { color: '#ef4444', label: 'Dyr' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: item.color, boxShadow: `0 0 6px ${item.color}` }} />
                <span style={{ fontSize: 12, color: '#94a3b8' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={mockSpotPrices} barSize={16}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} interval={2} />
            <YAxis tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(v: number) => [`${v.toFixed(2)} DKK/kWh`, 'Spotpris']}
              labelFormatter={(l) => `🕐 ${l}`}
            />
            <ReferenceLine x={`${String(currentHour).padStart(2, '0')}:00`} stroke="#a855f7" strokeDasharray="4 2" strokeWidth={1.5} />
            <Bar dataKey="price" radius={[3, 3, 0, 0]} isAnimationActive animationDuration={600}>
              {mockSpotPrices.map((entry, i) => (
                <Cell key={i} fill={getBarColor(entry.price)} opacity={i === currentHour ? 1 : 0.75} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* HOURLY HEATMAP */}
      <div className="ems-card">
        <div style={{ marginBottom: 16 }}>
          <span className="category-label category-label-el">El</span>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#ffffff' }}>Timeforbrug — seneste 7 dage</h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: 600 }}>
            {/* Hour labels */}
            <div style={{ display: 'flex', marginLeft: 36, marginBottom: 4 }}>
              {Array.from({ length: 24 }, (_, h) => (
                <div key={h} style={{ flex: 1, textAlign: 'center', fontSize: 9, color: '#475569' }}>
                  {h % 4 === 0 ? `${String(h).padStart(2, '0')}` : ''}
                </div>
              ))}
            </div>
            {/* Rows */}
            {heatmapData.map((row, di) => (
              <div key={row.day} style={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
                <div style={{ width: 32, fontSize: 11, color: '#475569', flexShrink: 0 }}>{row.day}</div>
                {row.hours.map((val, hi) => (
                  <div
                    key={hi}
                    className="heatmap-cell"
                    onMouseEnter={() => setHoverCell({ day: di, hour: hi })}
                    onMouseLeave={() => setHoverCell(null)}
                    title={`${row.day} ${String(hi).padStart(2, '0')}:00 — ${val} kWh`}
                    style={{
                      flex: 1,
                      height: 20,
                      background: getHeatColor(val),
                      borderRadius: 3,
                      marginRight: 2,
                      border: hoverCell?.day === di && hoverCell?.hour === hi
                        ? '1px solid rgba(0,212,255,0.8)'
                        : '1px solid transparent',
                      transition: 'all 0.15s',
                    }}
                  />
                ))}
              </div>
            ))}
            {/* Scale */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, marginLeft: 36 }}>
              <span style={{ fontSize: 11, color: '#475569' }}>Lavt</span>
              <div style={{ flex: 1, height: 8, borderRadius: 4, background: 'linear-gradient(90deg, rgba(0,212,255,0.2), rgba(245,158,11,0.5), rgba(239,68,68,0.8))' }} />
              <span style={{ fontSize: 11, color: '#475569' }}>Højt</span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <div className="ems-card" style={{ borderColor: 'rgba(239,68,68,0.25)' }}>
          <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Dyreste time</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#ef4444' }}>{peakHour.hour}</div>
          <div style={{ fontSize: 14, color: '#94a3b8' }}>{peakHour.price.toFixed(2)} DKK/kWh</div>
          <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>Undgå forbrug i denne time</div>
        </div>
        <div className="ems-card" style={{ borderColor: 'rgba(0,255,136,0.25)' }}>
          <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Billigste time</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#00ff88' }}>{cheapHour.hour}</div>
          <div style={{ fontSize: 14, color: '#94a3b8' }}>{cheapHour.price.toFixed(2)} DKK/kWh</div>
          <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>Optimal tid til vaskemaskine</div>
        </div>
        <div className="ems-card">
          <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Vs. forrige år</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingDown size={24} color="#00ff88" />
            <div style={{ fontSize: 28, fontWeight: 700, color: '#00ff88' }}>3.2%</div>
          </div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>Lavere forbrug end 2023</div>
          <div style={{ fontSize: 12, color: '#475569' }}>Svarende til 398 kWh sparet</div>
        </div>
      </div>
    </div>
  )
}
