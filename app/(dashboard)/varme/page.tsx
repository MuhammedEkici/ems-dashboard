'use client'

import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { Flame, Upload } from 'lucide-react'
import AnimatedCounter from '@/components/ui/AnimatedCounter'

const mockVarmeData = [
  { month: 'Jan', kwh: 1840, dkk: 2208, graddage: 312 },
  { month: 'Feb', kwh: 1620, dkk: 1944, graddage: 278 },
  { month: 'Mar', kwh: 1240, dkk: 1488, graddage: 198 },
  { month: 'Apr', kwh: 780, dkk: 936, graddage: 112 },
  { month: 'Maj', kwh: 420, dkk: 504, graddage: 48 },
  { month: 'Jun', kwh: 180, dkk: 216, graddage: 12 },
  { month: 'Jul', kwh: 120, dkk: 144, graddage: 6 },
  { month: 'Aug', kwh: 160, dkk: 192, graddage: 10 },
  { month: 'Sep', kwh: 540, dkk: 648, graddage: 78 },
  { month: 'Okt', kwh: 980, dkk: 1176, graddage: 162 },
  { month: 'Nov', kwh: 1380, dkk: 1656, graddage: 248 },
  { month: 'Dec', kwh: 1680, dkk: 2016, graddage: 298 },
]

const weekForecast = [
  { day: 'Man', date: '21/4', icon: '⛅', tempMax: 11, tempMin: 5,  heatDemand: 'Høj',       recommendation: 'Normal',       efficiency: 72 },
  { day: 'Tir', date: '22/4', icon: '🌧️', tempMax: 8,  tempMin: 3,  heatDemand: 'Meget høj', recommendation: 'Tænd tidligt', efficiency: 65 },
  { day: 'Ons', date: '23/4', icon: '🌧️', tempMax: 7,  tempMin: 2,  heatDemand: 'Meget høj', recommendation: 'Skru ned 1°C', efficiency: 61 },
  { day: 'Tor', date: '24/4', icon: '☀️', tempMax: 14, tempMin: 6,  heatDemand: 'Middel',     recommendation: 'Spar 15%',    efficiency: 84 },
  { day: 'Fre', date: '25/4', icon: '⛅', tempMax: 13, tempMin: 5,  heatDemand: 'Middel',     recommendation: 'Normal',       efficiency: 81 },
  { day: 'Lør', date: '26/4', icon: '☀️', tempMax: 17, tempMin: 8,  heatDemand: 'Lav',        recommendation: 'Skru ned 2°C', efficiency: 91 },
  { day: 'Søn', date: '27/4', icon: '☀️', tempMax: 18, tempMin: 9,  heatDemand: 'Lav',        recommendation: 'Skru ned 2°C', efficiency: 93 },
]

function heatDemandColor(demand: string) {
  if (demand === 'Lav')        return '#00ff88'
  if (demand === 'Middel')     return '#f59e0b'
  if (demand === 'Høj')        return '#f97316'
  return '#ef4444'
}

const tooltipStyle = {
  background: '#1a1a2e',
  border: '1px solid rgba(245,158,11,0.3)',
  borderRadius: 12,
  color: '#fff',
  fontSize: 12,
}

export default function VarmePage() {
  const [period, setPeriod] = useState('2024')
  const [mounted, setMounted] = useState(false)
  const [showImport, setShowImport] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const totalKwh = mockVarmeData.reduce((s, d) => s + d.kwh, 0)
  const totalDkk = mockVarmeData.reduce((s, d) => s + d.dkk, 0)
  const totalGraddage = mockVarmeData.reduce((s, d) => s + d.graddage, 0)
  const avgEfficiency = (totalKwh / totalGraddage).toFixed(1)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 12px rgba(245,158,11,0.2)',
          }}>
            <Flame size={20} color="#f59e0b" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: '#ffffff' }}>Varme</h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setShowImport(!showImport)}
            className="btn-outline"
            style={{ height: 36, fontSize: 13, borderColor: 'rgba(245,158,11,0.4)', color: '#f59e0b' }}
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
          { label: 'Samlet forbrug', value: totalKwh, unit: 'kWh', color: '#f59e0b', icon: '🔥', decimals: 0 },
          { label: 'Samlet omkostning', value: totalDkk, unit: 'DKK', color: '#00d4ff', icon: '💰', decimals: 0 },
          { label: 'Graddage i alt', value: totalGraddage, unit: 'GD', color: '#a855f7', icon: '🌡️', decimals: 0 },
          { label: 'Effektivitet', value: parseFloat(avgEfficiency), unit: 'kWh/GD', color: '#00ff88', icon: '⚡', decimals: 1 },
        ].map((stat, i) => (
          <div key={i} className="ems-card animate-stagger-fade-up" style={{ animationDelay: `${i * 80}ms`, borderColor: 'rgba(245,158,11,0.2)' }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{stat.icon}</div>
            <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
              {stat.label}
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: stat.color, lineHeight: 1.1 }}>
              {mounted ? (
                <AnimatedCounter value={stat.value} decimals={stat.decimals} duration={900} />
              ) : stat.value}
              <span style={{ fontSize: 13, fontWeight: 400, color: '#475569', marginLeft: 4 }}>{stat.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* IMPORT PANEL */}
      {showImport && (
        <div className="ems-card animate-fade-in" style={{ borderColor: 'rgba(245,158,11,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Upload size={16} color="#f59e0b" />
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#ffffff' }}>Importer varmedata</h3>
            <span style={{ fontSize: 12, color: '#475569', marginLeft: 'auto' }}>Kun admin</span>
          </div>
          <div className="upload-area" style={{ borderColor: 'rgba(245,158,11,0.3)' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📂</div>
            <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 4 }}>
              Træk og slip din CSV-fil her eller klik for at vælge
            </div>
            <div style={{ fontSize: 12, color: '#475569' }}>
              Format: Kommasepareret — Dato, kWh, Graddage
            </div>
          </div>
        </div>
      )}

      {/* TWO CHARTS SIDE BY SIDE */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Raw consumption bar chart */}
        <div className="ems-card">
          <div style={{ marginBottom: 16 }}>
            <span className="category-label" style={{ color: '#f59e0b' }}>Varme</span>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: '#ffffff' }}>Råforbrug</h2>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mockVarmeData} barSize={16}>
              <defs>
                <linearGradient id="varmeBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v: number) => [`${v} kWh`, 'Forbrug']}
                labelFormatter={(l) => `📅 ${l}`}
              />
              <Bar dataKey="kwh" fill="url(#varmeBarGrad)" radius={[3, 3, 0, 0]} isAnimationActive animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 7-day weather forecast + heat pump recommendation */}
        <div className="ems-card" style={{ borderColor: 'rgba(245,158,11,0.2)' }}>
          <div style={{ marginBottom: 14 }}>
            <span className="category-label" style={{ color: '#f59e0b' }}>Varme</span>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: '#ffffff' }}>Vejrudsigt & Varmepumpe-anbefaling</h2>
          </div>

          {/* 7-day grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 14 }}>
            {weekForecast.map((day, i) => {
              const col = heatDemandColor(day.heatDemand)
              return (
                <div key={i} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                  padding: '8px 4px',
                  background: `${col}0d`,
                  border: `1px solid ${col}30`,
                  borderRadius: 8,
                }}>
                  <div style={{ fontSize: 10, color: '#475569', fontWeight: 600 }}>{day.day}</div>
                  <div style={{ fontSize: 10, color: '#475569' }}>{day.date}</div>
                  <div style={{ fontSize: 18 }}>{day.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#ffffff' }}>{day.tempMax}°</div>
                  <div style={{ fontSize: 10, color: '#475569' }}>{day.tempMin}°</div>
                  <div style={{
                    fontSize: 9, fontWeight: 600, color: col,
                    background: `${col}18`, borderRadius: 4, padding: '1px 4px',
                    textAlign: 'center', lineHeight: 1.4,
                  }}>
                    {day.heatDemand}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Efficiency bar chart */}
          <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
            Varmepumpe effektivitet %
          </div>
          <ResponsiveContainer width="100%" height={80}>
            <BarChart data={weekForecast} barSize={14}>
              <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#475569' }} axisLine={false} tickLine={false} />
              <YAxis hide domain={[0, 100]} />
              <Tooltip
                contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 8, fontSize: 11, color: '#fff' }}
                formatter={(v: number) => [`${v}%`, 'Effektivitet']}
              />
              <Bar dataKey="efficiency" radius={[3, 3, 0, 0]} isAnimationActive animationDuration={800}
                fill="#f59e0b"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* HEAT PUMP SECTION */}
      <div className="ems-card" style={{ borderColor: 'rgba(245,158,11,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <span style={{ fontSize: 20 }}>🌡️</span>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#ffffff' }}>Varmepumpe — Jordvarmepumpe 50m</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {/* COP gauge */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Estimeret COP</div>
            <div style={{ position: 'relative', width: 120, height: 120, margin: '0 auto' }}>
              <svg viewBox="0 0 120 120" style={{ width: '100%', height: '100%' }}>
                <path d="M 20 90 A 50 50 0 1 1 100 90" stroke="rgba(245,158,11,0.15)" strokeWidth={10} fill="none" strokeLinecap="round" />
                <path d="M 20 90 A 50 50 0 1 1 100 90" stroke="#f59e0b" strokeWidth={10} fill="none" strokeLinecap="round"
                  strokeDasharray="220" strokeDashoffset={220 * (1 - 0.76)}
                  style={{ filter: 'drop-shadow(0 0 6px rgba(245,158,11,0.6))', transition: 'stroke-dashoffset 1s ease-out' }}
                />
                <text x="60" y="68" textAnchor="middle" fontSize={24} fontWeight={700} fill="#f59e0b">3.8</text>
                <text x="60" y="82" textAnchor="middle" fontSize={10} fill="#475569">COP</text>
              </svg>
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Effektiv varmepumpe</div>
          </div>

          {/* Stats */}
          <div>
            <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Årsstatistik</div>
            {[
              { label: 'Årligt forbrug', value: '5.500 kWh', color: '#f59e0b' },
              { label: 'Varme produceret', value: '20.900 kWh', color: '#00ff88' },
              { label: 'Besparelse vs. gas', value: 'DKK 8.400', color: '#00d4ff' },
              { label: 'CO₂ sparet', value: '2.1 ton', color: '#a855f7' },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <span style={{ fontSize: 13, color: '#94a3b8' }}>{row.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: row.color }}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* Efficiency bars */}
          <div>
            <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Effektivitet</div>
            {[
              { label: 'Vinter (Jan–Mar)', pct: 72, color: '#3b82f6' },
              { label: 'Forår (Apr–Jun)', pct: 88, color: '#00ff88' },
              { label: 'Sommer (Jul–Sep)', pct: 95, color: '#fbbf24' },
              { label: 'Efterår (Okt–Dec)', pct: 78, color: '#f59e0b' },
            ].map((row, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>{row.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: row.color }}>{row.pct}%</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${row.pct}%`, background: row.color,
                    borderRadius: 3, boxShadow: `0 0 6px ${row.color}`,
                    transition: 'width 1s ease-out',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
