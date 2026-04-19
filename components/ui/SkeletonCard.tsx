'use client'

interface SkeletonCardProps {
  height?: number
  className?: string
  lines?: number
}

export function SkeletonLine({ width = '100%', height = 16 }: { width?: string | number; height?: number }) {
  return (
    <div
      className="skeleton"
      style={{
        width,
        height,
        borderRadius: 6,
        marginBottom: 8,
      }}
    />
  )
}

export default function SkeletonCard({ height = 200, className = '', lines = 3 }: SkeletonCardProps) {
  return (
    <div
      className={`skeleton-card ${className}`}
      style={{ minHeight: height }}
    >
      {/* Title skeleton */}
      <SkeletonLine width="40%" height={14} />
      <div style={{ marginBottom: 16 }} />
      {/* Big number skeleton */}
      <SkeletonLine width="60%" height={36} />
      <div style={{ marginBottom: 12 }} />
      {/* Lines */}
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine key={i} width={`${70 - i * 15}%`} height={12} />
      ))}
    </div>
  )
}

export function SkeletonChart({ height = 300 }: { height?: number }) {
  return (
    <div className="skeleton-card" style={{ minHeight: height + 60 }}>
      <SkeletonLine width="35%" height={14} />
      <div style={{ marginBottom: 20 }} />
      <div
        className="skeleton"
        style={{ width: '100%', height, borderRadius: 8 }}
      />
    </div>
  )
}

export function SkeletonStatCard() {
  return (
    <div className="skeleton-card" style={{ minHeight: 140 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 10 }} />
        <div className="skeleton" style={{ width: 50, height: 20, borderRadius: 10 }} />
      </div>
      <SkeletonLine width="50%" height={12} />
      <SkeletonLine width="70%" height={32} />
      <SkeletonLine width="40%" height={12} />
    </div>
  )
}
