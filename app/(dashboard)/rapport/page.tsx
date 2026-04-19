'use client'

import { useState } from 'react'
import { FileText, Download, CheckSquare, Square } from 'lucide-react'

export default function RapportPage() {
  const [fromDate, setFromDate] = useState('2024-01-01')
  const [toDate, setToDate] = useState('2024-12-31')
  const [format, setFormat] = useState<'månedlig' | 'årlig' | 'periode'>('månedlig')
  const [periodeFrom, setPeriodeFrom] = useState('2024-01-01')
  const [periodeTo, setPeriodeTo] = useState('2024-06-30')
  const [includes, setIncludes] = useState({
    el: true, vand: true, varme: true, solceller: true, konklusion: true,
  })
  const [generated, setGenerated] = useState(false)
  const [generating, setGenerating] = useState(false)

  const toggleInclude = (key: keyof typeof includes) => {
    setIncludes(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleGenerate = async () => {
    setGenerating(true)
    await new Promise(r => setTimeout(r, 1200))
    setGenerating(false)
    setGenerated(true)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: 44,
    padding: '0 14px',
    border: '1px solid rgba(0,212,255,0.2)',
    borderRadius: 10,
    background: '#1a1a2e',
    fontFamily: "'Outfit', sans-serif",
    fontSize: 14,
    color: '#ffffff',
    outline: 'none',
  }

  const sections = [
    { key: 'el', label: 'El', emoji: '⚡', color: '#00ff88', kwh: '3.686 kWh', dkk: 'DKK 9.588' },
    { key: 'vand', label: 'Vand', emoji: '💧', color: '#3b82f6', m3: '205.5 m³', dkk: 'DKK 2.670' },
    { key: 'varme', label: 'Varme', emoji: '🔥', color: '#f59e0b', kwh: '10.940 kWh', dkk: 'DKK 13.128' },
    { key: 'solceller', label: 'Solceller', emoji: '☀️', color: '#fbbf24', kwh: '2.855 kWh', co2: '1.428 kg CO₂' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 760, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 12px rgba(0,212,255,0.2)',
        }}>
          <FileText size={20} color="#00d4ff" />
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#ffffff' }}>Generer rapport</h1>
      </div>

      {/* FORM CARD */}
      <div className="ems-card" style={{ borderColor: 'rgba(0,212,255,0.2)' }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#ffffff', marginBottom: 20 }}>Rapportindstillinger</h2>

        {/* Date range */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#94a3b8', marginBottom: 6 }}>Fra dato</label>
            <input
              type="date"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#94a3b8', marginBottom: 6 }}>Til dato</label>
            <input
              type="date"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Format */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#94a3b8', marginBottom: 10 }}>Vælg format</label>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {(['månedlig', 'årlig', 'periode'] as const).map(f => (
              <label
                key={f}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                  padding: '10px 16px', borderRadius: 10,
                  background: format === f ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${format === f ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.06)'}`,
                  transition: 'all 0.2s',
                }}
              >
                <input
                  type="radio"
                  name="format"
                  value={f}
                  checked={format === f}
                  onChange={() => setFormat(f)}
                  style={{ accentColor: '#00d4ff' }}
                />
                <span style={{ fontSize: 14, color: format === f ? '#00d4ff' : '#94a3b8', fontWeight: 500, textTransform: 'capitalize' }}>
                  {f}
                </span>
              </label>
            ))}
          </div>

          {/* Periode date pickers — only shown when Periode is selected */}
          {format === 'periode' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#94a3b8', marginBottom: 6 }}>Fra dato</label>
                <input
                  type="date"
                  value={periodeFrom}
                  onChange={e => setPeriodeFrom(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#94a3b8', marginBottom: 6 }}>Til dato</label>
                <input
                  type="date"
                  value={periodeTo}
                  onChange={e => setPeriodeTo(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>
          )}
        </div>

        {/* Include checkboxes */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#94a3b8', marginBottom: 10 }}>Inkluder i rapporten</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { key: 'el', label: 'El', emoji: '⚡', color: '#00ff88' },
              { key: 'vand', label: 'Vand', emoji: '💧', color: '#3b82f6' },
              { key: 'varme', label: 'Varme', emoji: '🔥', color: '#f59e0b' },
              { key: 'solceller', label: 'Solceller', emoji: '☀️', color: '#fbbf24' },
              { key: 'konklusion', label: 'Konklusion & anbefalinger', emoji: '📋', color: '#a855f7' },
            ].map(item => {
              const checked = includes[item.key as keyof typeof includes]
              return (
                <label
                  key={item.key}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                    padding: '10px 14px', borderRadius: 10,
                    background: checked ? `${item.color}08` : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${checked ? `${item.color}25` : 'rgba(255,255,255,0.05)'}`,
                    transition: 'all 0.2s',
                  }}
                  onClick={() => toggleInclude(item.key as keyof typeof includes)}
                >
                  {checked
                    ? <CheckSquare size={16} color={item.color} />
                    : <Square size={16} color="#475569" />
                  }
                  <span style={{ fontSize: 16 }}>{item.emoji}</span>
                  <span style={{ fontSize: 14, color: checked ? '#ffffff' : '#94a3b8', fontWeight: checked ? 500 : 400 }}>
                    {item.label}
                  </span>
                </label>
              )
            })}
          </div>
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="btn-primary"
          style={{ width: '100%', opacity: generating ? 0.7 : 1 }}
        >
          {generating ? '⏳ Genererer rapport...' : '📄 Generer PDF rapport'}
        </button>
      </div>

      {/* PDF PREVIEW */}
      {generated && (
        <div className="ems-card animate-fade-in" style={{ borderColor: 'rgba(0,212,255,0.2)', padding: 0, overflow: 'hidden' }}>
          {/* Banner */}
          <div style={{
            height: 160, position: 'relative', overflow: 'hidden',
            background: 'linear-gradient(135deg, #0a0a0f, #1a1a2e)',
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'url(/Forside.jpg)',
              backgroundSize: 'cover', backgroundPosition: 'center',
              opacity: 0.3,
            }} />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,212,255,0.1))',
            }} />
            <div style={{ position: 'relative', zIndex: 1, padding: '32px 32px' }}>
              <div style={{ fontSize: 11, color: 'rgba(0,212,255,0.7)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                Ekici EMS
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>Energirapport</h2>
              <div style={{ fontSize: 13, color: '#94a3b8' }}>
                {fromDate} → {toDate} • {format.charAt(0).toUpperCase() + format.slice(1)} rapport
              </div>
            </div>
          </div>

          {/* Sections */}
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {sections.filter(s => includes[s.key as keyof typeof includes]).map(section => (
              <div
                key={section.key}
                style={{
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: `1px solid ${section.color}20`,
                }}
              >
                {/* Section header */}
                <div style={{
                  padding: '10px 16px',
                  background: `${section.color}12`,
                  borderBottom: `1px solid ${section.color}20`,
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{ fontSize: 16 }}>{section.emoji}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: section.color }}>{section.label}</span>
                </div>
                {/* Section content */}
                <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.02)', display: 'flex', gap: 24 }}>
                  {section.kwh && (
                    <div>
                      <div style={{ fontSize: 11, color: '#475569' }}>Forbrug</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>{section.kwh}</div>
                    </div>
                  )}
                  {section.m3 && (
                    <div>
                      <div style={{ fontSize: 11, color: '#475569' }}>Forbrug</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>{section.m3}</div>
                    </div>
                  )}
                  {section.dkk && (
                    <div>
                      <div style={{ fontSize: 11, color: '#475569' }}>Omkostning</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>{section.dkk}</div>
                    </div>
                  )}
                  {section.co2 && (
                    <div>
                      <div style={{ fontSize: 11, color: '#475569' }}>CO₂ sparet</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#00ff88' }}>{section.co2}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Konklusion */}
            {includes.konklusion && (
              <div style={{ borderRadius: 12, border: '1px solid rgba(168,85,247,0.2)', overflow: 'hidden' }}>
                <div style={{ padding: '10px 16px', background: 'rgba(168,85,247,0.1)', borderBottom: '1px solid rgba(168,85,247,0.2)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16 }}>📋</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#a855f7' }}>Konklusion & anbefalinger</span>
                </div>
                <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)' }}>
                  <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>
                    Baseret på data for perioden {fromDate} til {toDate} viser analysen, at elforbrug er steget med 12% sammenlignet med forrige periode, primært drevet af øget varmepumpeforbrug i vintermånederne. Solcelleanlægget har produceret 2.855 kWh og dækket 84% af sommerforbruget. Det anbefales at optimere vaskemaskine og opvaskemaskine til nattetimer (01:00–06:00) for at udnytte lave elpriser. Vandforbruget er stabilt og inden for normale grænser.
                  </p>
                </div>
              </div>
            )}

            {/* Download button */}
            <button
              onClick={() => console.log('Download PDF — placeholder')}
              className="btn-outline"
              style={{ width: '100%', height: 44 }}
            >
              <Download size={16} />
              Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
