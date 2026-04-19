'use client'

interface DataSourceBadgeProps {
  source: 'live' | 'mock' | 'simuleret'
  label?: string
}

export default function DataSourceBadge({ source, label }: DataSourceBadgeProps) {
  if (source === 'live') {
    return (
      <span className="data-source-live">
        {label || 'Live data'}
      </span>
    )
  }

  return (
    <span className="data-source-mock">
      {label || 'Simuleret'}
    </span>
  )
}
