'use client'

import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Legend
} from 'recharts'

// ── Mock data ──────────────────────────────────────────────────────────────
const rooms = [
  { id: 0, name: 'Stue',        temp: 21.5, co2: 842,  color: '#00d4ff' },
  { id: 1, name: 'Soveværelse', temp: 21.0, co2: 420,  color: '#a855f7' },
  { id: 2, name: 'Kontor',      temp: 20.0, co2: 910,  color: '#f59e0b' },
  { id: 3, name: 'Badeværelse', temp: 22.0, co2: 380,  color: '#00ff88' },
]

const tempHistory = [
  { day: 'Man', stue: 21.2, sovevarelse: 20.8, kontor: 19.5, badevarelse: 21.8 },
  { day: 'Tir', stue: 21.4, sovevarelse: 21.0, kontor: 19.8, badevarelse: 22.0 },
  { day: 'Ons', stue: 21.6, sovevarelse: 21.2, kontor: 20.2, badevarelse: 22.1 },
  { day: 'Tor', stue: 21.3, sovevarelse: 20.9, kontor: 20.0, badevarelse: 21.9 },
  { day: 'Fre', stue: 21.5, sovevarelse: 21.1, kontor: 20.1, badevarelse: 22.2 },
  { day: 'Lør', stue: 21.7, sovevarelse: 21.3, kontor: 20.4, badevarelse: 22.3 },
  { day: 'Søn', stue: 21.5, sovevarelse: 21.0, kontor: 20.0, badevarelse: 22.0 },
]

const co2History = [
  { day: 'Man', stue: 820, sovevarelse: 410, kontor: 890, badevarelse: 360 },
  { day: 'Tir', stue: 835, sovevarelse: 425, kontor: 905, badevarelse: 375 },
  { day: 'Ons', stue: 850, sovevarelse: 415, kontor: 920, badevarelse: 385 },
  { day: 'Tor', stue: 830, sovevarelse: 405, kontor: 895, badevarelse: 370 },
  { day: 'Fre', stue: 842, sovevarelse: 420, kontor: 910, badevarelse: 380 },
  { day: 'Lør', stue: 815, sovevarelse: 400, kontor: 875, badevarelse: 355 },
  { day: 'Søn', stue: 842, sovevarelse: 420, kontor: 910, badevarelse: 380 },
]

const ventData = [
  { day: 'Man', kwh: 0.4 }, { day: 'Tir', kwh: 0.6 }, { day: 'Ons', kwh: 0.7 },
  { day: 'Tor', kwh: 0.3 }, { day: 'Fre', kwh: 0.5 }, { day: 'Lør', kwh: 0.2 }, { day: 'Søn', kwh: 0.3 },
]

// ── Helpers ────────────────────────────────────────────────────────────────
function getAirColor(co2: number) {
  if (co2 < 600)  return { color: '#00ff88', label: 'Frisk' }
  if (co2 < 1000) return { color: '#f59e0b', label: 'God' }
  if (co2 < 1500) return { color: '#f97316', label: 'Middel' }
  return              { color: '#ef4444', label: 'Dårlig' }
}

// ── SVG Icons ──────────────────────────────────────────────────────────────
const CloudIcon = ({ color }: { color: string }) => (
  <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
    <path d="M13 5.5C13 5.5 13 5 12.5 4.5C12 4 11 3.5 10 3.5C9.5 2 8 1 6.5 1C4.5 1 3 2.5 3 4.5C2 4.5 1 5.5 1 6.5C1 7.8 2.2 9 3.5 9H13C14.1 9 15 8.1 15 7C15 6 14.1 5.1 13 5.5Z" fill={color} fillOpacity="0.9"/>
  </svg>
)

const WindowIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    {isOpen ? (
      <>
        <rect x="1" y="4" width="10" height="7" rx="1" stroke="#00ff88" strokeWidth="1.2" fill="none"/>
        <line x1="6" y1="4" x2="6" y2="11" stroke="#00ff88" strokeWidth="1"/>
        <line x1="1" y1="7.5" x2="11" y2="7.5" stroke="#00ff88" strokeWidth="0.8" opacity="0.5"/>
        <path d="M3 4 Q6 1 9 4" stroke="#00ff88" strokeWidth="1" fill="none" strokeDasharray="2 1"/>
      </>
    ) : (
      <>
        <rect x="1" y="1" width="10" height="10" rx="1" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" fill="none"/>
        <line x1="6" y1="1" x2="6" y2="11" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
        <line x1="1" y1="6" x2="11" y2="6" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
      </>
    )}
  </svg>
)

const FanIcon = ({ spinning }: { spinning: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 12 12" fill="none"
    style={{ animation: spinning ? 'spin 3s linear infinite' : 'none' }}>
    <circle cx="6" cy="6" r="1.5" fill="#00d4ff"/>
    <path d="M6 4.5C6 3 7 1.5 8.5 1.5C8.5 3 7.5 4.5 6 4.5Z" fill="#00d4ff" opacity="0.7"/>
    <path d="M7.3 6.7C8.5 7.4 9.2 8.8 8.5 10C7.3 9.3 6.6 7.9 7.3 6.7Z" fill="#00d4ff" opacity="0.7"/>
    <path d="M4.7 6.7C3.5 7.4 2.8 8.8 3.5 10C4.7 9.3 5.4 7.9 4.7 6.7Z" fill="#00d4ff" opacity="0.7"/>
    <path d="M6 4.5C6 3 5 1.5 3.5 1.5C3.5 3 4.5 4.5 6 4.5Z" fill="#00d4ff" opacity="0.5"/>
    <path d="M7.3 6.7C8.5 6 9.8 5 9.5 3.5C8.3 4.2 7.5 5.5 7.3 6.7Z" fill="#00d4ff" opacity="0.5"/>
    <path d="M4.7 6.7C3.5 6 2.2 5 2.5 3.5C3.7 4.2 4.5 5.5 4.7 6.7Z" fill="#00d4ff" opacity="0.5"/>
  </svg>
)

const tooltipStyle = {
  background: '#1a1a2e',
  border: '1px solid rgba(0,212,255,0.2)',
  borderRadius: 10,
  color: '#fff',
  fontSize: 12,
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function IndeklimaPage() {
  const [roomStates, setRoomStates] = useState([
    { id: 0, name: 'Stue',        ventilation: true,  windowOpen: false, ppmTarget: 800  },
    { id: 1, name: 'Soveværelse', ventilation: false, windowOpen: true,  ppmTarget: 600  },
    { id: 2, name: 'Kontor',      ventilation: true,  windowOpen: false, ppmTarget: 1000 },
    { id: 3, name: 'Badeværelse', ventilation: false, windowOpen: false, ppmTarget: 700  },
  ])

  const updateRoom = (id: number, key: string, value: boolean | number) => {
    setRoomStates(prev => prev.map(r => r.id === id ? { ...r, [key]: value } : r))
  }

  const anyVentilation = roomStates.some(r => r.ventilation)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: 'rgba(0,255,136,0.12)', border: '1px solid rgba(0,255,136,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 12px rgba(0,255,136,0.2)',
          fontSize: 20,
        }}>🌿</div>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#ffffff' }}>Indeklima</h1>
      </div>

      {/* TOP STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          { label: 'Gennemsnitstemperatur', value: '21.4°C', color: '#f59e0b', icon: '🌡️', sub: 'Alle rum' },
          { label: 'CO₂ niveau', value: '842 ppm', color: '#00ff88', icon: '💨', sub: 'God luftkvalitet' },
          { label: 'Luftfugtighed', value: '48%', color: '#3b82f6', icon: '💧', sub: 'Optimal' },
          { label: 'Ventilation', value: 'Aktiv', color: '#00ff88', icon: null, sub: '2 rum aktive', pulse: true },
        ].map((card, i) => (
          <div key={i} className="ems-card" style={{ animationDelay: `${i * 80}ms` }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>
              {card.pulse ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 8px #00ff88', animation: 'livePulse 1.5s ease-in-out infinite' }} />
                </div>
              ) : card.icon}
            </div>
            <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
              {card.label}
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: card.color, lineHeight: 1.1 }}>{card.value}</div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* FLOOR PLAN */}
      <div className="ems-card" style={{ borderColor: 'rgba(0,212,255,0.2)', padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(0,212,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: '#ffffff' }}>Interaktiv plantegning</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {anyVentilation && <FanIcon spinning={true} />}
            <span style={{ fontSize: 12, color: '#475569' }}>Klik for at styre rum</span>
          </div>
        </div>

        {/* 2×2 grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          height: 380,
          background: '#0d1117',
          position: 'relative',
        }}>
          {/* Thermostat overlay top-right */}
          <div style={{
            position: 'absolute', top: 12, right: 12, zIndex: 10,
            background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: 8, padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" stroke="#f59e0b" strokeWidth="1.2" fill="none"/>
              <circle cx="7" cy="7" r="2.5" fill="#f59e0b" opacity="0.8"/>
              <line x1="7" y1="1" x2="7" y2="3" stroke="#f59e0b" strokeWidth="1"/>
              <line x1="7" y1="11" x2="7" y2="13" stroke="#f59e0b" strokeWidth="1"/>
              <line x1="1" y1="7" x2="3" y2="7" stroke="#f59e0b" strokeWidth="1"/>
              <line x1="11" y1="7" x2="13" y2="7" stroke="#f59e0b" strokeWidth="1"/>
            </svg>
            <span style={{ fontSize: 11, color: '#f59e0b', fontWeight: 600 }}>22°C</span>
          </div>

          {/* Grid divider lines */}
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1, background: 'rgba(0,212,255,0.15)', zIndex: 5 }} />
          <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 1, background: 'rgba(0,212,255,0.15)', zIndex: 5 }} />

          {/* Rooms: order = Soveværelse(top-left), Kontor(top-right), Stue(bottom-left), Badeværelse(bottom-right) */}
          {[1, 2, 0, 3].map((roomIdx) => {
            const room = rooms[roomIdx]
            const state = roomStates[roomIdx]
            const airInfo = getAirColor(room.co2)

            return (
              <div key={room.id} style={{
                padding: 14,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                borderColor: 'rgba(0,212,255,0.08)',
                position: 'relative',
              }}>
                {/* Room name */}
                <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {room.name}
                </div>

                {/* Temp + CO2 row */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <div style={{
                    background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
                    borderRadius: 8, padding: '4px 8px', display: 'inline-flex', alignItems: 'center', gap: 4,
                  }}>
                    <span style={{ fontSize: 12 }}>🌡️</span>
                    <span style={{ color: '#f59e0b', fontWeight: 600, fontSize: 13 }}>{room.temp}°C</span>
                  </div>

                  <div style={{
                    background: `${airInfo.color}18`, border: `1px solid ${airInfo.color}44`,
                    borderRadius: 8, padding: '4px 8px', display: 'inline-flex', alignItems: 'center', gap: 4,
                  }}>
                    <CloudIcon color={airInfo.color} />
                    <span style={{ color: airInfo.color, fontWeight: 600, fontSize: 13 }}>{room.co2} ppm</span>
                    <span style={{ color: airInfo.color, fontSize: 10, opacity: 0.8 }}>{airInfo.label}</span>
                  </div>
                </div>

                {/* Window toggle */}
                <button
                  onClick={() => updateRoom(room.id, 'windowOpen', !state.windowOpen)}
                  style={{
                    background: 'none',
                    border: `1px solid ${state.windowOpen ? '#00ff88' : 'rgba(255,255,255,0.15)'}`,
                    borderRadius: 4, padding: '2px 6px', cursor: 'pointer',
                    display: 'inline-flex', alignItems: 'center', gap: 3,
                    color: state.windowOpen ? '#00ff88' : 'rgba(255,255,255,0.35)',
                    fontSize: 10, width: 'fit-content',
                  }}
                >
                  <WindowIcon isOpen={state.windowOpen} />
                  {state.windowOpen ? 'Åben' : 'Lukket'}
                </button>

                {/* Bottom controls */}
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => updateRoom(room.id, 'ventilation', !state.ventilation)}
                    style={{
                      background: state.ventilation ? 'rgba(0,255,136,0.12)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${state.ventilation ? '#00ff88' : 'rgba(255,255,255,0.12)'}`,
                      borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontSize: 11,
                      color: state.ventilation ? '#00ff88' : 'rgba(255,255,255,0.35)',
                      display: 'flex', alignItems: 'center', gap: 4,
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <circle cx="6" cy="6" r="1.5" fill="currentColor"/>
                      <path d="M6 4.5C6 3 7 1.5 8.5 1.5C8.5 3 7.5 4.5 6 4.5Z" fill="currentColor" opacity="0.7"/>
                      <path d="M7.3 6.7C8.5 7.4 9.2 8.8 8.5 10C7.3 9.3 6.6 7.9 7.3 6.7Z" fill="currentColor" opacity="0.7"/>
                      <path d="M4.7 6.7C3.5 7.4 2.8 8.8 3.5 10C4.7 9.3 5.4 7.9 4.7 6.7Z" fill="currentColor" opacity="0.7"/>
                      <path d="M6 4.5C6 3 5 1.5 3.5 1.5C3.5 3 4.5 4.5 6 4.5Z" fill="currentColor" opacity="0.5"/>
                      <path d="M7.3 6.7C8.5 6 9.8 5 9.5 3.5C8.3 4.2 7.5 5.5 7.3 6.7Z" fill="currentColor" opacity="0.5"/>
                      <path d="M4.7 6.7C3.5 6 2.2 5 2.5 3.5C3.7 4.2 4.5 5.5 4.7 6.7Z" fill="currentColor" opacity="0.5"/>
                    </svg>
                    {state.ventilation ? 'Ventilation: Til' : 'Ventilation: Fra'}
                  </button>
                </div>

                {/* PPM slider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>Mål:</span>
                  <input
                    type="range" min="400" max="1500" step="50"
                    value={state.ppmTarget}
                    onChange={e => updateRoom(room.id, 'ppmTarget', Number(e.target.value))}
                    style={{ flex: 1, accentColor: '#00d4ff', height: 3 }}
                  />
                  <span style={{ fontSize: 10, color: '#00d4ff', whiteSpace: 'nowrap', minWidth: 52 }}>
                    {state.ppmTarget} ppm
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 3 BOTTOM CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {/* Card 1 — Air quality bars */}
        <div className="ems-card">
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#ffffff', marginBottom: 16 }}>Luftkvalitet overblik</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {rooms.map(room => {
              const airInfo = getAirColor(room.co2)
              const state = roomStates[room.id]
              const pct = Math.min((room.co2 / 1500) * 100, 100)
              const targetPct = Math.min((state.ppmTarget / 1500) * 100, 100)
              return (
                <div key={room.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>{room.name}</span>
                    <span style={{ fontSize: 12, color: airInfo.color, fontWeight: 600 }}>
                      {room.co2} / {state.ppmTarget} ppm
                    </span>
                  </div>
                  <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'visible', position: 'relative' }}>
                    <div style={{
                      height: '100%', width: `${pct}%`, background: airInfo.color,
                      borderRadius: 4, boxShadow: `0 0 6px ${airInfo.color}`,
                      transition: 'width 0.8s ease-out',
                    }} />
                    {/* Target line */}
                    <div style={{
                      position: 'absolute', top: -2, left: `${targetPct}%`,
                      width: 2, height: 12, background: '#ffffff', borderRadius: 1, opacity: 0.6,
                    }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Card 2 — Ventilation energy */}
        <div className="ems-card">
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#ffffff', marginBottom: 16 }}>Ventilation energiforbrug</h3>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={ventData}>
              <defs>
                <linearGradient id="ventGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v} kWh`, 'Forbrug']} />
              <Area type="monotone" dataKey="kwh" stroke="#00d4ff" strokeWidth={2} fill="url(#ventGrad)" isAnimationActive animationDuration={800} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Card 3 — Recommendations */}
        <div className="ems-card">
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#ffffff', marginBottom: 16 }}>💡 Anbefalinger</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { text: '🪟 Åbn vindue i Soveværelse — CO₂ under 500 ppm', color: '#00ff88' },
              { text: '❄️ Reducer ventilation i Stue mellem 23:00–06:00', color: '#00d4ff' },
              { text: '✅ Badeværelse luftkvalitet optimal', color: '#00ff88' },
              { text: '⚠️ Kontor: CO₂ stiger — øg ventilation', color: '#f97316' },
            ].map((item, i) => (
              <div key={i} style={{
                borderLeft: `3px solid ${item.color}`,
                paddingLeft: 10,
                fontSize: 12,
                color: '#94a3b8',
                lineHeight: 1.5,
              }}>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM CHARTS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Temperature history */}
        <div className="ems-card">
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#ffffff', marginBottom: 16 }}>Temperatur over tid</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={tempHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
              <YAxis domain={[18, 24]} tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}°C`]} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
              <Line type="monotone" dataKey="stue" stroke="#00d4ff" strokeWidth={2} dot={false} name="Stue" />
              <Line type="monotone" dataKey="sovevarelse" stroke="#a855f7" strokeWidth={2} dot={false} name="Soveværelse" />
              <Line type="monotone" dataKey="kontor" stroke="#f59e0b" strokeWidth={2} dot={false} name="Kontor" />
              <Line type="monotone" dataKey="badevarelse" stroke="#00ff88" strokeWidth={2} dot={false} name="Badeværelse" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* CO2 history */}
        <div className="ems-card">
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#ffffff', marginBottom: 16 }}>CO₂ niveau over tid</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={co2History}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v} ppm`]} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
              <Line type="monotone" dataKey="stue" stroke="#00d4ff" strokeWidth={2} dot={false} name="Stue" />
              <Line type="monotone" dataKey="sovevarelse" stroke="#a855f7" strokeWidth={2} dot={false} name="Soveværelse" />
              <Line type="monotone" dataKey="kontor" stroke="#f59e0b" strokeWidth={2} dot={false} name="Kontor" />
              <Line type="monotone" dataKey="badevarelse" stroke="#00ff88" strokeWidth={2} dot={false} name="Badeværelse" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
