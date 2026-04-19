'use client'

import { useState, useEffect } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { Sun } from 'lucide-react'
import AnimatedCounter from '@/components/ui/AnimatedCounter'

const mockSolData = [
  { month: 'Jan', produktion: 82, forbrug: 412, selvforsyning: 20 },
  { month: 'Feb', produktion: 124, forbrug: 387, selvforsyning: 32 },
  { month: 'Mar', produktion: 198, forbrug: 356, selvforsyning: 56 },
  { month: 'Apr', produktion: 267, forbrug: 298, selvforsyning: 90 },
  { month: 'Maj', produktion: 342, forbrug: 267, selvforsyning: 100 },
  { month: 'Jun', produktion: 389, forbrug: 231, selvforsyning: 100 },
  { month: 'Jul', produktion: 412, forbrug: 218, selvforsyning: 100 },
  { month: 'Aug', produktion: 378, forbrug: 245, selvforsyning: 100 },
  { month: 'Sep', produktion: 287, forbrug: 289, selvforsyning: 99 },
  { month: 'Okt', produktion: 178, forbrug: 342, selvforsyning: 52 },
  { month: 'Nov', produktion: 98, forbrug: 398, selvforsyning: 25 },
  { month: 'Dec', produktion: 67, forbrug: 445, selvforsyning: 15 },
]

// Compact CSS Solar Panel Grid (3×2 = 6 panels)
function CompactSolarPanels() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(2, 1fr)',
        gap: 4,
        padding: 8,
        background: '#0d1b2a',
        borderRadius: 10,
        border: '1px solid rgba(255,255,255,0.15)',
      }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{
            background: 'linear-gradient(135deg, #0d1a2e 0%, #0a1520 50%, #0d1a2e 100%)',
            border: '1px solid rgba(59,130,246,0.15)',
            borderRadius: 2,
            position: 'relative',
            overflow: 'hidden',
            height: 45,
            width: 60,
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(135deg, transparent 30%, rgba(0,212,255,0.08) 50%, transparent 70%)',
              animation: `solarShimmer ${2 + (i % 3) * 0.5}s ease-in-out infinite`,
              animationDelay: `${(i % 5) * 0.3}s`,
            }} />
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(59,130,246,0.1)' }} />
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'rgba(59,130,246,0.1)' }} />
          </div>
        ))}
      </div>
      <div style={{ fontSize: 10, color: '#475569', textAlign: 'center' }}>Solpaneler • 6.5 kWp • 20 paneler</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#00ff88', textAlign: 'center', textShadow: '0 0 8px #00ff88' }}>3.2 kW</div>
    </div>
  )
}

// Circular progress ring
function CircularProgress({ pct, color, size = 80 }: { pct: number; color: string; size?: number }) {
  const r = (size - 12) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - pct / 100)

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={8} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={8}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: 'stroke-dashoffset 1s ease-out' }}
      />
    </svg>
  )
}

const tooltipStyle = {
  background: '#1a1a2e',
  border: '1px solid rgba(251,191,36,0.3)',
  borderRadius: 12,
  color: '#fff',
  fontSize: 12,
}

export default function SolcellerPage() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<'dag' | 'måned' | 'år' | 'levetid'>('måned')

  useEffect(() => { setMounted(true) }, [])

  const batteryPct = 87

  const energyBreakdown = [
    { label: 'Fra sol', value: 287, total: 342, color: '#fbbf24' },
    { label: 'Fra net', value: 55, total: 342, color: '#3b82f6' },
    { label: 'Til net', value: 124, total: 287, color: '#a855f7' },
    { label: 'Til batteri', value: 76, total: 287, color: '#00ff88' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 12px rgba(251,191,36,0.2)',
          }}>
            <Sun size={20} color="#fbbf24" />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 600, color: '#ffffff' }}>Ekici Solceller</h1>
            <div style={{ fontSize: 13, color: '#475569' }}>ID: Ringsted • 6.5 kWp</div>
          </div>
        </div>
        <span className="data-source-mock">Simuleret data</span>
      </div>

      {/* HERO — Compact 3-column: Panels | Battery | Pylon */}
      <div className="ems-card" style={{ borderColor: 'rgba(251,191,36,0.2)', maxHeight: 220, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0, height: '100%', position: 'relative' }}>

          {/* LEFT (35%) — Solar panels */}
          <div style={{ width: '35%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <CompactSolarPanels />
          </div>

          {/* Animated flow lines (SVG overlay) — CSS keyframe squares */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }} viewBox="0 0 600 180" preserveAspectRatio="none">
            <defs>
              <style>{`
                @keyframes sef-pb { 0%{transform:translateX(0);opacity:0} 5%{opacity:1} 80%{opacity:1} 100%{transform:translateX(80px);opacity:0} }
                @keyframes sef-pp { 0%{transform:translateX(0);opacity:0} 5%{opacity:1} 80%{opacity:1} 100%{transform:translateX(200px);opacity:0} }
                @keyframes sef-bp { 0%{transform:translateX(0);opacity:0} 5%{opacity:1} 80%{opacity:1} 100%{transform:translateX(110px);opacity:0} }
              `}</style>
            </defs>
            {/* Panels→Battery: green line at mid-height */}
            <line x1="212" y1="90" x2="298" y2="90" stroke="#00ff88" strokeWidth="2" strokeOpacity="0.6" />
            {[0, 0.7, 1.4].map((d, i) => (
              <rect key={i} x="210" y="88" width="4" height="4" fill="#00ff88"
                style={{ filter: 'drop-shadow(0 0 3px #00ff88)', animation: 'sef-pb 2s linear infinite', animationDelay: `${d}s` }} />
            ))}
            {/* Panels→Pylon: amber line above */}
            <line x1="212" y1="60" x2="418" y2="60" stroke="#f59e0b" strokeWidth="2" strokeOpacity="0.6" />
            {[0, 0.7, 1.4].map((d, i) => (
              <rect key={i} x="210" y="58" width="4" height="4" fill="#f59e0b"
                style={{ filter: 'drop-shadow(0 0 3px #f59e0b)', animation: 'sef-pp 2s linear infinite', animationDelay: `${d}s` }} />
            ))}
            {/* Battery→Pylon: cyan line below */}
            <line x1="302" y1="120" x2="418" y2="120" stroke="#00d4ff" strokeWidth="2" strokeOpacity="0.6" />
            {[0, 0.7, 1.4].map((d, i) => (
              <rect key={i} x="300" y="118" width="4" height="4" fill="#00d4ff"
                style={{ filter: 'drop-shadow(0 0 3px #00d4ff)', animation: 'sef-bp 2s linear infinite', animationDelay: `${d}s` }} />
            ))}
          </svg>

          {/* CENTER (30%) — Battery ring */}
          <div style={{ width: '30%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, position: 'relative', zIndex: 2 }}>
            <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Batteri</div>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <CircularProgress pct={batteryPct} color="#00ff88" size={90} />
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: '#00ff88' }}>{batteryPct}%</span>
                <span style={{ fontSize: 10 }}>🔋</span>
              </div>
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>Oplader +1.1 kW</div>
          </div>

          {/* RIGHT (35%) — Grid pylon */}
          <div style={{ width: '35%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, position: 'relative', zIndex: 2 }}>
            <svg width="60" height="80" viewBox="0 0 60 80" fill="none">
              <line x1="30" y1="0"  x2="10" y2="30" stroke="#00d4ff" strokeWidth="2"/>
              <line x1="30" y1="0"  x2="50" y2="30" stroke="#00d4ff" strokeWidth="2"/>
              <line x1="10" y1="30" x2="50" y2="30" stroke="#00d4ff" strokeWidth="1.5"/>
              <line x1="20" y1="30" x2="15" y2="60" stroke="#00d4ff" strokeWidth="2"/>
              <line x1="40" y1="30" x2="45" y2="60" stroke="#00d4ff" strokeWidth="2"/>
              <line x1="15" y1="60" x2="45" y2="60" stroke="#00d4ff" strokeWidth="1.5"/>
              <line x1="15" y1="60" x2="20" y2="80" stroke="#00d4ff" strokeWidth="2"/>
              <line x1="45" y1="60" x2="40" y2="80" stroke="#00d4ff" strokeWidth="2"/>
              <line x1="5"  y1="35" x2="55" y2="35" stroke="#00d4ff" strokeWidth="1" opacity="0.5"/>
              <line x1="8"  y1="55" x2="52" y2="55" stroke="#00d4ff" strokeWidth="1" opacity="0.5"/>
            </svg>
            <div style={{ fontSize: 10, color: '#475569' }}>Elnet</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#00d4ff', textShadow: '0 0 6px #00d4ff' }}>Eksporterer 1.1 kW</div>
          </div>
        </div>
      </div>

      {/* STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          {
            label: 'Produktion i dag', value: 28.5, unit: 'kWh', color: '#fbbf24',
            sub: '• Sol: 2.74 kW\n• Net: 2.74 kW\n• Batteri: 0.34 kW', icon: '☀️',
          },
          {
            label: 'Produktion', value: 287, unit: 'kWh', color: '#00ff88',
            barPct: 72, barLabel: 'Lav → Høj', icon: '📈',
          },
          {
            label: 'Forbrug', value: 342, unit: 'kWh', color: '#ef4444',
            barPct: 56, barLabel: 'Normal', icon: '⚡',
          },
          {
            label: 'CO₂ Besparelse', value: 42, unit: 'kg CO₂', color: '#a855f7',
            sub: 'Drevet af sol: 84%', icon: '🌿', isCircle: true,
          },
        ].map((card, i) => (
          <div key={i} className="ems-card animate-stagger-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{card.icon}</div>
            <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
              {card.label}
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: card.color, lineHeight: 1.1, marginBottom: 8 }}>
              {mounted ? <AnimatedCounter value={card.value} decimals={card.unit === 'kWh' && card.value < 100 ? 1 : 0} duration={900} /> : card.value}
              <span style={{ fontSize: 13, fontWeight: 400, color: '#475569', marginLeft: 4 }}>{card.unit}</span>
            </div>
            {card.barPct !== undefined && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#475569', marginBottom: 4 }}>
                  <span>Lav</span><span>Høj</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
                  <div style={{ height: '100%', width: `${card.barPct}%`, background: card.color, borderRadius: 3, boxShadow: `0 0 6px ${card.color}`, transition: 'width 1s ease-out' }} />
                  <div style={{ position: 'absolute', left: `${card.barPct}%`, top: -2, width: 2, height: 10, background: '#ffffff', borderRadius: 1 }} />
                </div>
                <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>{card.barLabel}</div>
              </div>
            )}
            {card.sub && (
              <div style={{ fontSize: 11, color: '#94a3b8', whiteSpace: 'pre-line', lineHeight: 1.6 }}>{card.sub}</div>
            )}
          </div>
        ))}
      </div>

      {/* TAB SELECTOR */}
      <div style={{ display: 'flex', gap: 4, background: '#111118', borderRadius: 12, padding: 4, border: '1px solid rgba(0,212,255,0.1)', width: 'fit-content' }}>
        {(['dag', 'måned', 'år', 'levetid'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '6px 20px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              background: activeTab === tab ? 'rgba(251,191,36,0.15)' : 'transparent',
              color: activeTab === tab ? '#fbbf24' : '#475569',
              boxShadow: activeTab === tab ? '0 0 12px rgba(251,191,36,0.2)' : 'none',
              transition: 'all 0.2s',
              textTransform: 'capitalize',
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* CHART + BREAKDOWN */}
      <div style={{ display: 'grid', gridTemplateColumns: '60% 40%', gap: 16 }}>
        {/* Area chart */}
        <div className="ems-card">
          <div style={{ marginBottom: 16 }}>
            <span className="category-label" style={{ color: '#fbbf24' }}>Solceller</span>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: '#ffffff' }}>
              {activeTab === 'dag' ? 'Daglig produktion' : activeTab === 'måned' ? 'Månedlig produktion' : activeTab === 'år' ? 'Årlig produktion' : 'Livstidsproduktion'}
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={mockSolData}>
              <defs>
                <linearGradient id="solGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="forbrugGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v: number, name: string) => [`${v} kWh`, name === 'produktion' ? 'Produktion' : 'Forbrug']}
                labelFormatter={(l) => `📅 ${l}`}
              />
              <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
              <Area type="monotone" dataKey="produktion" stroke="#fbbf24" strokeWidth={2} fill="url(#solGrad)" name="produktion" isAnimationActive animationDuration={800} />
              <Area type="monotone" dataKey="forbrug" stroke="#ef4444" strokeWidth={2} fill="url(#forbrugGrad)" name="forbrug" isAnimationActive animationDuration={800} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Energy breakdown */}
        <div className="ems-card">
          <div style={{ marginBottom: 16 }}>
            <span className="category-label" style={{ color: '#fbbf24' }}>Solceller</span>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: '#ffffff' }}>Energifordeling</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {energyBreakdown.map((item, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: '#94a3b8' }}>{item.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{item.value} kWh</span>
                </div>
                <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${(item.value / item.total) * 100}%`,
                    background: item.color,
                    borderRadius: 4,
                    boxShadow: `0 0 8px ${item.color}`,
                    transition: 'width 1s ease-out',
                  }} />
                </div>
                <div style={{ fontSize: 11, color: '#475569', marginTop: 3 }}>
                  {Math.round((item.value / item.total) * 100)}% af {item.total} kWh
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <div className="ems-card" style={{ borderColor: 'rgba(251,191,36,0.25)' }}>
          <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Nuværende effekt</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#fbbf24' }}>3.2 <span style={{ fontSize: 16, color: '#475569' }}>kW</span></div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Peak i dag: 5.8 kW kl. 13:00</div>
        </div>
        <div className="ems-card" style={{ borderColor: 'rgba(168,85,247,0.25)' }}>
          <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>CO₂ besparelse</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#a855f7' }}>
            {mounted ? <AnimatedCounter value={42} decimals={0} duration={900} /> : 42}
            <span style={{ fontSize: 16, color: '#475569', marginLeft: 4 }}>kg</span>
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Denne måned • 504 kg i år</div>
        </div>
        <div className="ems-card" style={{ borderColor: 'rgba(0,255,136,0.25)' }}>
          <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Livstidsproduktion</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#00ff88' }}>
            {mounted ? <AnimatedCounter value={18420} decimals={0} duration={1200} /> : 18420}
            <span style={{ fontSize: 16, color: '#475569', marginLeft: 4 }}>kWh</span>
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Siden installation: Jan 2022</div>
        </div>
      </div>
    </div>
  )
}
