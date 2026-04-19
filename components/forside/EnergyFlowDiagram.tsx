'use client'

import { useEffect, useState } from 'react'

interface FlowData {
  solarKw: number
  batteryKw: number
  batteryPct: number
  houseKw: number
  gridKw: number
  gridDirection: 'import' | 'export'
  batteryDirection: 'charging' | 'discharging' | 'idle'
}

const mockFlowData: FlowData = {
  solarKw: 3.2,
  batteryKw: 1.1,
  batteryPct: 87,
  houseKw: 2.4,
  gridKw: 0.3,
  gridDirection: 'export',
  batteryDirection: 'charging',
}

function generateVariation(base: number, pct = 0.05): number {
  return Math.round((base * (1 + (Math.random() - 0.5) * pct)) * 10) / 10
}

interface NodeProps {
  x: number
  y: number
  emoji: string
  label: string
  value: string
  color: string
  glowColor: string
  active?: boolean
}

function FlowNode({ x, y, emoji, label, value, color, glowColor, active = true }: NodeProps) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Glow circle */}
      {active && (
        <circle
          r={38}
          fill={glowColor}
          opacity={0.15}
          style={{ animation: 'glowPulse 2s ease-in-out infinite' }}
        />
      )}
      {/* Main circle */}
      <circle r={32} fill="white" stroke={color} strokeWidth={2.5} />
      {/* Emoji */}
      <text textAnchor="middle" dominantBaseline="middle" fontSize={20} y={-2}>
        {emoji}
      </text>
      {/* Label */}
      <text
        textAnchor="middle"
        y={46}
        fontSize={11}
        fontWeight={600}
        fill="#6b7280"
        fontFamily="Outfit, sans-serif"
      >
        {label}
      </text>
      {/* Value */}
      <text
        textAnchor="middle"
        y={60}
        fontSize={12}
        fontWeight={700}
        fill={color}
        fontFamily="Outfit, sans-serif"
      >
        {value}
      </text>
    </g>
  )
}

interface FlowArrowProps {
  x1: number
  y1: number
  x2: number
  y2: number
  color: string
  active: boolean
  reverse?: boolean
  thickness?: number
}

function FlowArrow({ x1, y1, x2, y2, color, active, reverse = false, thickness = 2 }: FlowArrowProps) {
  if (!active) return null

  return (
    <g>
      {/* Background line */}
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color}
        strokeWidth={thickness}
        strokeOpacity={0.2}
      />
      {/* Animated dashed line */}
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color}
        strokeWidth={thickness}
        strokeDasharray="8 6"
        strokeLinecap="round"
        style={{
          animation: `flowDash ${reverse ? '0.8s linear infinite reverse' : '0.8s linear infinite'}`,
        }}
      />
      {/* Arrow head */}
      <circle cx={reverse ? x1 : x2} cy={reverse ? y1 : y2} r={4} fill={color} />
    </g>
  )
}

export default function EnergyFlowDiagram() {
  const [flow, setFlow] = useState<FlowData>(mockFlowData)

  // Simulate live data updates every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setFlow(prev => ({
        ...prev,
        solarKw: generateVariation(prev.solarKw),
        batteryKw: generateVariation(prev.batteryKw),
        houseKw: generateVariation(prev.houseKw),
        gridKw: generateVariation(prev.gridKw),
      }))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Node positions
  const solar = { x: 80, y: 120 }
  const battery = { x: 240, y: 120 }
  const house = { x: 400, y: 120 }
  const grid = { x: 560, y: 120 }

  const solarActive = flow.solarKw > 0
  const batteryCharging = flow.batteryDirection === 'charging'
  const batteryDischarging = flow.batteryDirection === 'discharging'
  const gridExporting = flow.gridDirection === 'export'

  return (
    <div>
      <svg
        viewBox="0 0 640 200"
        style={{ width: '100%', maxHeight: 200, overflow: 'visible' }}
      >
        {/* Solar → Battery */}
        <FlowArrow
          x1={solar.x + 34} y1={solar.y}
          x2={battery.x - 34} y2={battery.y}
          color="#ca8a04"
          active={solarActive && batteryCharging}
          thickness={Math.max(1.5, flow.solarKw * 0.6)}
        />

        {/* Solar → House (direct self-consumption) */}
        {solarActive && !batteryCharging && (
          <FlowArrow
            x1={solar.x + 34} y1={solar.y}
            x2={house.x - 34} y2={house.y}
            color="#ca8a04"
            active={true}
            thickness={Math.max(1.5, flow.solarKw * 0.5)}
          />
        )}

        {/* Battery → House */}
        <FlowArrow
          x1={battery.x + 34} y1={battery.y}
          x2={house.x - 34} y2={house.y}
          color="#16a34a"
          active={batteryDischarging || batteryCharging}
          reverse={batteryCharging}
          thickness={Math.max(1.5, flow.batteryKw * 0.7)}
        />

        {/* House → Grid (export) or Grid → House (import) */}
        <FlowArrow
          x1={house.x + 34} y1={house.y}
          x2={grid.x - 34} y2={grid.y}
          color={gridExporting ? '#ca8a04' : '#2563eb'}
          active={flow.gridKw > 0}
          reverse={!gridExporting}
          thickness={Math.max(1.5, flow.gridKw * 0.8)}
        />

        {/* Nodes */}
        <FlowNode
          x={solar.x} y={solar.y}
          emoji="☀️"
          label="Solpaneler"
          value={`${flow.solarKw} kW`}
          color="#ca8a04"
          glowColor="#fef9c3"
          active={solarActive}
        />
        <FlowNode
          x={battery.x} y={battery.y}
          emoji="🔋"
          label="Batteri"
          value={`${flow.batteryPct}%`}
          color={batteryCharging ? '#16a34a' : batteryDischarging ? '#f59e0b' : '#6b7280'}
          glowColor={batteryCharging ? '#dcfce7' : '#fef9c3'}
          active={true}
        />
        <FlowNode
          x={house.x} y={house.y}
          emoji="🏠"
          label="Hus"
          value={`${flow.houseKw} kW`}
          color="#7c3aed"
          glowColor="#ede9fe"
          active={true}
        />
        <FlowNode
          x={grid.x} y={grid.y}
          emoji="⚡"
          label="Elnet"
          value={`${flow.gridKw} kW`}
          color={gridExporting ? '#ca8a04' : '#2563eb'}
          glowColor={gridExporting ? '#fef9c3' : '#dbeafe'}
          active={flow.gridKw > 0}
        />
      </svg>

      {/* Mini stat pills */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          marginTop: 16,
          flexWrap: 'wrap',
        }}
      >
        {[
          { label: 'Sol produktion', value: `${flow.solarKw} kW`, color: '#ca8a04', bg: '#fef9c3' },
          { label: 'Batteri', value: `${flow.batteryPct}%`, color: '#16a34a', bg: '#dcfce7' },
          { label: 'Forbrug', value: `${flow.houseKw} kW`, color: '#7c3aed', bg: '#ede9fe' },
          {
            label: flow.gridDirection === 'export' ? 'Til net' : 'Fra net',
            value: `${flow.gridKw} kW`,
            color: flow.gridDirection === 'export' ? '#ca8a04' : '#2563eb',
            bg: flow.gridDirection === 'export' ? '#fef9c3' : '#dbeafe',
          },
        ].map(pill => (
          <div
            key={pill.label}
            style={{
              background: pill.bg,
              borderRadius: 20,
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span style={{ fontSize: 11, color: pill.color, fontWeight: 500 }}>{pill.label}</span>
            <span style={{ fontSize: 13, color: pill.color, fontWeight: 700 }}>{pill.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
