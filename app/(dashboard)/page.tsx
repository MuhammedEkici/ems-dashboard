'use client'

import { useState, useEffect } from 'react'
import {
  AreaChart, Area, Tooltip, ResponsiveContainer, XAxis, YAxis
} from 'recharts'
import { TrendingUp, TrendingDown, AlertTriangle, Cloud } from 'lucide-react'
import AnimatedCounter from '@/components/ui/AnimatedCounter'

// ── Chart data ─────────────────────────────────────────────────────────────
const chartData = {
  omkostning: {
    el:    [{month:'Jan',value:1072},{month:'Feb',value:987},{month:'Mar',value:923},{month:'Apr',value:834},{month:'Maj',value:756},{month:'Jun',value:698},{month:'Jul',value:712},{month:'Aug',value:743},{month:'Sep',value:801},{month:'Okt',value:934},{month:'Nov',value:1043},{month:'Dec',value:1156}],
    vand:  [{month:'Jan',value:312},{month:'Feb',value:298},{month:'Mar',value:287},{month:'Apr',value:276},{month:'Maj',value:289},{month:'Jun',value:301},{month:'Jul',value:334},{month:'Aug',value:312},{month:'Sep',value:278},{month:'Okt',value:265},{month:'Nov',value:271},{month:'Dec',value:289}],
    varme: [{month:'Jan',value:1890},{month:'Feb',value:1654},{month:'Mar',value:1243},{month:'Apr',value:876},{month:'Maj',value:432},{month:'Jun',value:198},{month:'Jul',value:143},{month:'Aug',value:167},{month:'Sep',value:398},{month:'Okt',value:876},{month:'Nov',value:1345},{month:'Dec',value:1789}],
    sol:   [{month:'Jan',value:-45},{month:'Feb',value:-89},{month:'Mar',value:-178},{month:'Apr',value:-234},{month:'Maj',value:-312},{month:'Jun',value:-356},{month:'Jul',value:-398},{month:'Aug',value:-334},{month:'Sep',value:-223},{month:'Okt',value:-134},{month:'Nov',value:-67},{month:'Dec',value:-34}],
  },
  energi: {
    el:    [{month:'Jan',value:412},{month:'Feb',value:387},{month:'Mar',value:356},{month:'Apr',value:312},{month:'Maj',value:287},{month:'Jun',value:265},{month:'Jul',value:271},{month:'Aug',value:283},{month:'Sep',value:301},{month:'Okt',value:356},{month:'Nov',value:398},{month:'Dec',value:443}],
    vand:  [{month:'Jan',value:24},{month:'Feb',value:22},{month:'Mar',value:21},{month:'Apr',value:20},{month:'Maj',value:21},{month:'Jun',value:22},{month:'Jul',value:25},{month:'Aug',value:23},{month:'Sep',value:20},{month:'Okt',value:19},{month:'Nov',value:20},{month:'Dec',value:21}],
    varme: [{month:'Jan',value:1240},{month:'Feb',value:1105},{month:'Mar',value:876},{month:'Apr',value:543},{month:'Maj',value:287},{month:'Jun',value:134},{month:'Jul',value:98},{month:'Aug',value:112},{month:'Sep',value:267},{month:'Okt',value:589},{month:'Nov',value:934},{month:'Dec',value:1198}],
    sol:   [{month:'Jan',value:45},{month:'Feb',value:89},{month:'Mar',value:178},{month:'Apr',value:267},{month:'Maj',value:356},{month:'Jun',value:412},{month:'Jul',value:445},{month:'Aug',value:389},{month:'Sep',value:267},{month:'Okt',value:156},{month:'Nov',value:78},{month:'Dec',value:34}],
  },
  co2: {
    el:    [{month:'Jan',value:89},{month:'Feb',value:83},{month:'Mar',value:76},{month:'Apr',value:67},{month:'Maj',value:62},{month:'Jun',value:57},{month:'Jul',value:58},{month:'Aug',value:61},{month:'Sep',value:65},{month:'Okt',value:77},{month:'Nov',value:86},{month:'Dec',value:95}],
    vand:  [{month:'Jan',value:12},{month:'Feb',value:11},{month:'Mar',value:10},{month:'Apr',value:10},{month:'Maj',value:10},{month:'Jun',value:11},{month:'Jul',value:12},{month:'Aug',value:11},{month:'Sep',value:10},{month:'Okt',value:9},{month:'Nov',value:10},{month:'Dec',value:10}],
    varme: [{month:'Jan',value:198},{month:'Feb',value:176},{month:'Mar',value:140},{month:'Apr',value:87},{month:'Maj',value:46},{month:'Jun',value:21},{month:'Jul',value:16},{month:'Aug',value:18},{month:'Sep',value:43},{month:'Okt',value:94},{month:'Nov',value:149},{month:'Dec',value:192}],
    sol:   [{month:'Jan',value:-18},{month:'Feb',value:-24},{month:'Mar',value:-38},{month:'Apr',value:-56},{month:'Maj',value:-74},{month:'Jun',value:-87},{month:'Jul',value:-95},{month:'Aug',value:-83},{month:'Sep',value:-57},{month:'Okt',value:-33},{month:'Nov',value:-17},{month:'Dec',value:-8}],
  },
}

const unitLabels = {
  omkostning: { el: 'DKK', vand: 'DKK', varme: 'DKK', sol: 'DKK' },
  energi:     { el: 'kWh', vand: 'm³',  varme: 'kWh', sol: 'kWh' },
  co2:        { el: 'kg CO₂e', vand: 'kg CO₂e', varme: 'kg CO₂e', sol: 'kg CO₂e' },
}

// ── AI tips ────────────────────────────────────────────────────────────────
const aiTips = [
  { time: 'I dag, 08:00', icon: '💡', text: 'Spotprisen er lav mellem kl. 01-06 i nat. Overvej at starte opvaskemaskinen sent.', color: '#00d4ff' },
  { time: 'I dag, 07:30', icon: '☀️', text: 'Solcelleproduktion estimeret til 4.2 kWh i dag baseret på DMI vejrdata.', color: '#f59e0b' },
  { time: 'I går',        icon: '📰', text: 'Elprisen forventes at stige 12% næste uge. Din selvforsyning beskytter dig.', color: '#a855f7' },
  { time: 'I går',        icon: '🔋', text: 'Batteri ladet til 87%. Optimalt niveau for natforbrug.', color: '#00ff88' },
  { time: '2 dage siden', icon: '🌡️', text: 'Graddage denne uge: 8.2. Varmepumpe kører 14% mere end normalt.', color: '#f97316' },
]

// ── Grid energy flow (2×2) ─────────────────────────────────────────────────
function GridEnergyFlow() {
  const [flow, setFlow] = useState({
    solarKw: 3.2, batteryKw: 1.1, batteryPct: 87,
    houseKw: 2.4, gridKw: 0.3,
    timestamp: new Date().toLocaleTimeString('da-DK'),
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setFlow(prev => ({
        ...prev,
        solarKw: Math.round((prev.solarKw * (1 + (Math.random() - 0.5) * 0.1)) * 10) / 10,
        houseKw: Math.round((prev.houseKw * (1 + (Math.random() - 0.5) * 0.08)) * 10) / 10,
        gridKw: Math.round((Math.random() * 0.8) * 10) / 10,
        timestamp: new Date().toLocaleTimeString('da-DK'),
      }))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const nodeStyle = (color: string): React.CSSProperties => ({
    width: 80, height: 80, borderRadius: '50%',
    background: `radial-gradient(circle, ${color}20 0%, ${color}08 100%)`,
    border: `2px solid ${color}`,
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    boxShadow: `0 0 16px ${color}66, 0 0 32px ${color}33`,
    fontSize: 22, cursor: 'default',
    transition: 'box-shadow 0.5s ease',
    position: 'relative', zIndex: 2,
  })

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Keyframe injected inline */}
      <style>{`
        @keyframes flowParticle {
          0%   { opacity: 0; transform: translate(0, 0); }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { opacity: 0; transform: var(--flow-end); }
        }
        @keyframes flowParticleH {
          0%   { opacity: 0; left: var(--p-start); }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { opacity: 0; left: var(--p-end); }
        }
      `}</style>

      {/* Background grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle, rgba(0,212,255,0.04) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        borderRadius: 12,
      }} />

      {/* 2×2 grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: 0,
        height: 300,
        position: 'relative',
      }}>
        {/* TOP-LEFT: Solpaneler */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, position: 'relative' }}>
          <div style={nodeStyle('#fbbf24')}>
            <span>☀️</span>
            <span style={{ fontSize: 9, color: '#fbbf24', fontWeight: 700, marginTop: 1 }}>{flow.solarKw} kW</span>
          </div>
          <span style={{ fontSize: 10, color: '#94a3b8' }}>Solpaneler</span>
        </div>

        {/* TOP-RIGHT: Elnet */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, position: 'relative' }}>
          <div style={nodeStyle('#00d4ff')}>
            <span>⚡</span>
            <span style={{ fontSize: 9, color: '#00d4ff', fontWeight: 700, marginTop: 1 }}>{flow.gridKw} kW</span>
          </div>
          <span style={{ fontSize: 10, color: '#94a3b8' }}>Elnet</span>
        </div>

        {/* BOTTOM-LEFT: Batteri */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, position: 'relative' }}>
          <div style={nodeStyle('#00ff88')}>
            <span>🔋</span>
            <span style={{ fontSize: 9, color: '#00ff88', fontWeight: 700, marginTop: 1 }}>{flow.batteryPct}%</span>
          </div>
          <span style={{ fontSize: 10, color: '#94a3b8' }}>Batteri</span>
        </div>

        {/* BOTTOM-RIGHT: Hus */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, position: 'relative' }}>
          <div style={nodeStyle('#a855f7')}>
            <span>🏠</span>
            <span style={{ fontSize: 9, color: '#a855f7', fontWeight: 700, marginTop: 1 }}>{flow.houseKw} kW</span>
          </div>
          <span style={{ fontSize: 10, color: '#94a3b8' }}>Hus</span>
        </div>

        {/* SVG overlay for flow lines — CSS keyframe squares, no animateMotion */}
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' }}
          viewBox="0 0 400 300"
          preserveAspectRatio="none"
        >
          <defs>
            <style>{`
              @keyframes gef-h1 { 0%{transform:translateX(0);opacity:0} 5%{opacity:1} 80%{opacity:1} 100%{transform:translateX(120px);opacity:0} }
              @keyframes gef-vl { 0%{transform:translateY(0);opacity:0} 5%{opacity:1} 80%{opacity:1} 100%{transform:translateY(70px);opacity:0} }
              @keyframes gef-d  { 0%{transform:translate(0,0);opacity:0} 5%{opacity:1} 80%{opacity:1} 100%{transform:translate(130px,90px);opacity:0} }
              @keyframes gef-h2 { 0%{transform:translateX(0);opacity:0} 5%{opacity:1} 80%{opacity:1} 100%{transform:translateX(110px);opacity:0} }
              @keyframes gef-vr { 0%{transform:translateY(0);opacity:0} 5%{opacity:1} 80%{opacity:1} 100%{transform:translateY(70px);opacity:0} }
            `}</style>
          </defs>

          {/* Sol→Elnet: horizontal top, cyan */}
          <line x1="142" y1="75" x2="258" y2="75" stroke="#00d4ff" strokeWidth="2" strokeOpacity="0.6" />
          {[0, 0.7, 1.4].map((d, i) => (
            <rect key={i} x="140" y="73" width="4" height="4" fill="#00d4ff"
              style={{ filter: 'drop-shadow(0 0 3px #00d4ff)', animation: `gef-h1 2s linear infinite`, animationDelay: `${d}s` }} />
          ))}

          {/* Sol→Batteri: vertical left, green */}
          <line x1="100" y1="117" x2="100" y2="183" stroke="#00ff88" strokeWidth="2" strokeOpacity="0.6" />
          {[0, 0.7, 1.4].map((d, i) => (
            <rect key={i} x="98" y="115" width="4" height="4" fill="#00ff88"
              style={{ filter: 'drop-shadow(0 0 3px #00ff88)', animation: `gef-vl 2s linear infinite`, animationDelay: `${d}s` }} />
          ))}

          {/* Sol→Hus: diagonal, amber */}
          <line x1="132" y1="107" x2="268" y2="193" stroke="#f59e0b" strokeWidth="2" strokeOpacity="0.6" />
          {[0, 0.7, 1.4].map((d, i) => (
            <rect key={i} x="130" y="105" width="4" height="4" fill="#f59e0b"
              style={{ filter: 'drop-shadow(0 0 3px #f59e0b)', animation: `gef-d 2s linear infinite`, animationDelay: `${d}s` }} />
          ))}

          {/* Batteri→Hus: horizontal bottom, green */}
          <line x1="142" y1="225" x2="258" y2="225" stroke="#00ff88" strokeWidth="2" strokeOpacity="0.6" />
          {[0, 0.7, 1.4].map((d, i) => (
            <rect key={i} x="140" y="223" width="4" height="4" fill="#00ff88"
              style={{ filter: 'drop-shadow(0 0 3px #00ff88)', animation: `gef-h2 2s linear infinite`, animationDelay: `${d}s` }} />
          ))}

          {/* Elnet→Hus: vertical right, cyan */}
          <line x1="300" y1="117" x2="300" y2="183" stroke="#00d4ff" strokeWidth="2" strokeOpacity="0.6" />
          {[0, 0.7, 1.4].map((d, i) => (
            <rect key={i} x="298" y="115" width="4" height="4" fill="#00d4ff"
              style={{ filter: 'drop-shadow(0 0 3px #00d4ff)', animation: `gef-vr 2s linear infinite`, animationDelay: `${d}s` }} />
          ))}
        </svg>
      </div>

      {/* Timestamp */}
      <div style={{ fontSize: 10, color: '#475569', marginTop: 8 }}>
        Opdateret: {flow.timestamp}
      </div>
    </div>
  )
}

// ── Per-card sparkline charts (independent dropdowns) ─────────────────────
type UnitKey = 'energi' | 'omkostning' | 'co2'
type EnergyKey = 'el' | 'vand' | 'varme' | 'sol'

const sparkConfigs: { key: EnergyKey; label: string; color: string }[] = [
  { key: 'el',    label: 'El',        color: '#00ff88' },
  { key: 'vand',  label: 'Vand',      color: '#3b82f6' },
  { key: 'varme', label: 'Varme',     color: '#f59e0b' },
  { key: 'sol',   label: 'Solceller', color: '#fbbf24' },
]

const dropdownStyle: React.CSSProperties = {
  background: '#1a1a2e',
  border: '1px solid rgba(0,212,255,0.3)',
  borderRadius: 8,
  color: '#ffffff',
  fontSize: 12,
  padding: '3px 6px',
  cursor: 'pointer',
  outline: 'none',
  fontFamily: "'Outfit', sans-serif",
}

function SparklineCard({ cfg, unit, onUnitChange }: {
  cfg: { key: EnergyKey; label: string; color: string }
  unit: UnitKey
  onUnitChange: (u: UnitKey) => void
}) {
  const data = chartData[unit][cfg.key]
  const unitLabel = unitLabels[unit][cfg.key]
  const lastVal = data[data.length - 1].value
  const displayVal = Math.abs(lastVal)
  const prefix = lastVal < 0 ? '-' : ''

  return (
    <div className="ems-card" style={{ padding: 12, borderColor: `${cfg.color}20` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>{cfg.label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: cfg.color }}>
            {prefix}{displayVal} {unitLabel}
          </span>
          <select
            value={unit}
            onChange={e => onUnitChange(e.target.value as UnitKey)}
            style={dropdownStyle}
          >
            <option value="energi">Energi</option>
            <option value="omkostning">Omkostning</option>
            <option value="co2">CO₂e</option>
          </select>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={52}>
        <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`sg-${cfg.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={cfg.color} stopOpacity={0.4} />
              <stop offset="95%" stopColor={cfg.color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" hide />
          <YAxis hide />
          <Area type="monotone" dataKey="value" stroke={cfg.color} strokeWidth={2}
            fill={`url(#sg-${cfg.key})`} isAnimationActive animationDuration={600} />
          <Tooltip
            contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(0,212,255,0.3)', borderRadius: 8, fontSize: 11, color: '#fff' }}
            formatter={(v: number) => [`${v} ${unitLabel}`, cfg.label]}
            labelFormatter={(l) => `📅 ${l}`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

function IndependentSparklines() {
  const [elUnit,    setElUnit]    = useState<UnitKey>('energi')
  const [vandUnit,  setVandUnit]  = useState<UnitKey>('energi')
  const [varmeUnit, setVarmeUnit] = useState<UnitKey>('energi')
  const [solUnit,   setSolUnit]   = useState<UnitKey>('energi')

  const units: [UnitKey, (u: UnitKey) => void][] = [
    [elUnit, setElUnit],
    [vandUnit, setVandUnit],
    [varmeUnit, setVarmeUnit],
    [solUnit, setSolUnit],
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {sparkConfigs.map((cfg, i) => (
        <SparklineCard
          key={cfg.key}
          cfg={cfg}
          unit={units[i][0]}
          onUnitChange={units[i][1]}
        />
      ))}
    </div>
  )
}

// ── Hero cards ─────────────────────────────────────────────────────────────
const heroCards = [
  {
    type: 'el', emoji: '⚡', label: 'EL', title: 'Elforbrug denne måned',
    value: 342, unit: 'kWh', sub: 'DKK 891 denne måned', change: 12, positive: false,
    color: '#00ff88', border: 'rgba(0,255,136,0.25)', glow: 'rgba(0,255,136,0.08)',
  },
  {
    type: 'vand', emoji: '💧', label: 'VAND', title: 'Vandforbrug denne måned',
    value: 18.4, unit: 'm³', sub: 'DKK 234 denne måned', change: -3, positive: true,
    color: '#3b82f6', border: 'rgba(59,130,246,0.25)', glow: 'rgba(59,130,246,0.08)',
  },
  {
    type: 'varme', emoji: '🔥', label: 'VARME', title: 'Varmeforbrug denne måned',
    value: 1240, unit: 'kWh', sub: 'DKK 1.456 denne måned', change: 8, positive: false,
    color: '#f59e0b', border: 'rgba(245,158,11,0.25)', glow: 'rgba(245,158,11,0.08)',
  },
  {
    type: 'sol', emoji: '☀️', label: 'SOLCELLER', title: 'Solproduktion denne måned',
    value: 287, unit: 'kWh', sub: 'Selvforsyning: 84%', change: 5, positive: true,
    color: '#fbbf24', border: 'rgba(251,191,36,0.25)', glow: 'rgba(251,191,36,0.08)',
  },
]

// ── Page ───────────────────────────────────────────────────────────────────
export default function ForsidePage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Page title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#ffffff' }}>Energioverblik</h1>
        <span className="data-source-mock">Simuleret data</span>
      </div>

      {/* HERO STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {heroCards.map((card, i) => (
          <div
            key={card.type}
            className="ems-card animate-stagger-fade-up"
            style={{ animationDelay: `${i * 80}ms`, borderColor: card.border, boxShadow: `0 0 20px ${card.glow}` }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `${card.color}15`, border: `1px solid ${card.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
              }}>
                {card.emoji}
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 3,
                padding: '3px 8px', borderRadius: 20,
                background: card.positive ? 'rgba(0,255,136,0.1)' : 'rgba(239,68,68,0.1)',
                border: `1px solid ${card.positive ? 'rgba(0,255,136,0.2)' : 'rgba(239,68,68,0.2)'}`,
                fontSize: 12, fontWeight: 600,
                color: card.positive ? '#00ff88' : '#ef4444',
              }}>
                {card.change > 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {Math.abs(card.change)}%
              </div>
            </div>
            <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
              {card.label}
            </div>
            <div style={{ fontSize: 30, fontWeight: 700, color: '#ffffff', lineHeight: 1.1, marginBottom: 4 }}>
              {mounted ? (
                <AnimatedCounter value={card.value} decimals={card.unit === 'm³' ? 1 : 0} duration={900} />
              ) : card.value}
              <span style={{ fontSize: 14, fontWeight: 400, color: '#475569', marginLeft: 4 }}>{card.unit}</span>
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* MIDDLE — Diamond flow + Tabbed sparklines */}
      <div style={{ display: 'grid', gridTemplateColumns: '60% 40%', gap: 16 }}>
        {/* LEFT — Diamond energy flow */}
        <div className="ems-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 8px #00ff88', animation: 'livePulse 1.5s ease-in-out infinite' }} />
            <h2 style={{ fontSize: 15, fontWeight: 600, color: '#ffffff' }}>Live energiflow</h2>
          </div>
          <GridEnergyFlow />
        </div>

        {/* RIGHT — Independent sparklines */}
        <IndependentSparklines />
      </div>

      {/* BOTTOM ROW — Alarmer + Vejr + AI Energirådgiver */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {/* Alarmer */}
        <div className="ems-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <AlertTriangle size={16} color="#f59e0b" />
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#ffffff' }}>Seneste alarmer</h3>
          </div>
          {[
            { text: 'Højt elforbrug detekteret', time: '2 min siden', color: '#ef4444' },
            { text: 'Vandforbrugsanomali', time: '1 time siden', color: '#f59e0b' },
            { text: 'Batteriniveau lavt (23%)', time: '3 timer siden', color: '#f59e0b' },
          ].map((alert, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: alert.color, boxShadow: `0 0 6px ${alert.color}`, marginTop: 4, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 13, color: '#ffffff', fontWeight: 500 }}>{alert.text}</div>
                <div style={{ fontSize: 11, color: '#475569' }}>{alert.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Vejr */}
        <div className="ems-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Cloud size={16} color="#94a3b8" />
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#ffffff' }}>Vejr — Ringsted</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 48 }}>⛅</div>
            <div>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#00d4ff' }}>12°C</div>
              <div style={{ fontSize: 13, color: '#94a3b8' }}>Delvist skyet</div>
            </div>
          </div>
          <div style={{ padding: '10px 12px', background: 'rgba(0,212,255,0.05)', borderRadius: 10, border: '1px solid rgba(0,212,255,0.1)', marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: '#475569', marginBottom: 4 }}>I morgen</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>🌧️</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#ffffff' }}>9°C</span>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>Regn</span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#475569' }}>Graddage</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#f59e0b' }}>8.2</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#475569' }}>Denne måned</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#f59e0b' }}>142</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#475569' }}>Vs. normal</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#00ff88' }}>-12%</div>
            </div>
          </div>
        </div>

        {/* AI Energirådgiver */}
        <div className="ems-card" style={{ borderColor: 'rgba(168,85,247,0.3)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#ffffff' }}>🤖 AI Energirådgiver</div>
            <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>Daglige tips & forecasts</div>
          </div>
          <div style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            maxHeight: 220,
            paddingRight: 4,
          }}>
            {aiTips.map((tip, i) => (
              <div key={i} style={{
                borderLeft: `3px solid ${tip.color}`,
                paddingLeft: 10,
                paddingTop: 2,
                paddingBottom: 2,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <span style={{ fontSize: 14 }}>{tip.icon}</span>
                  <span style={{ fontSize: 10, color: '#475569' }}>{tip.time}</span>
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>{tip.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
