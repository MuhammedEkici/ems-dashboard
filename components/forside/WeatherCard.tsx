'use client'

import { useEffect, useState } from 'react'
import { Wind } from 'lucide-react'

const weatherCodeMap: Record<number, { label: string; emoji: string }> = {
  0: { label: 'Solskin', emoji: '☀️' },
  1: { label: 'Mest solrigt', emoji: '🌤️' },
  2: { label: 'Delvist skyet', emoji: '⛅' },
  3: { label: 'Overskyet', emoji: '☁️' },
  45: { label: 'Tåge', emoji: '🌫️' },
  48: { label: 'Tåge', emoji: '🌫️' },
  51: { label: 'Støvregn', emoji: '🌦️' },
  53: { label: 'Støvregn', emoji: '🌦️' },
  55: { label: 'Støvregn', emoji: '🌦️' },
  61: { label: 'Regn', emoji: '🌧️' },
  63: { label: 'Regn', emoji: '🌧️' },
  65: { label: 'Regn', emoji: '🌧️' },
  71: { label: 'Sne', emoji: '❄️' },
  73: { label: 'Sne', emoji: '❄️' },
  75: { label: 'Sne', emoji: '❄️' },
  80: { label: 'Byger', emoji: '🌦️' },
  81: { label: 'Byger', emoji: '🌦️' },
  82: { label: 'Byger', emoji: '🌦️' },
  95: { label: 'Torden', emoji: '⛈️' },
}

function getWeather(code: number) {
  return weatherCodeMap[code] || { label: 'Ukendt', emoji: '🌡️' }
}

interface WeatherData {
  current: {
    temp: number
    code: number
    windspeed: number
  }
  tomorrow: {
    maxTemp: number
    minTemp: number
    code: number
    precipPct: number
  }
}

const mockWeather: WeatherData = {
  current: { temp: 12, code: 2, windspeed: 14 },
  tomorrow: { maxTemp: 15, minTemp: 8, code: 61, precipPct: 70 },
}

export default function WeatherCard() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showTomorrow, setShowTomorrow] = useState(false)

  useEffect(() => {
    const cacheKey = 'ems_weather_full_cache'
    const cacheExpiry = 30 * 60 * 1000

    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      const { data, timestamp } = JSON.parse(cached)
      if (Date.now() - timestamp < cacheExpiry) {
        setWeather(data)
        setLoading(false)
        setTimeout(() => setShowTomorrow(true), 300)
        return
      }
    }

    fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=55.4438&longitude=11.7903&current=temperature_2m,weathercode,windspeed_10m,is_day&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max&timezone=Europe%2FCopenhagen&forecast_days=2'
    )
      .then(r => r.json())
      .then(data => {
        const weatherData: WeatherData = {
          current: {
            temp: Math.round(data.current.temperature_2m),
            code: data.current.weathercode,
            windspeed: Math.round(data.current.windspeed_10m),
          },
          tomorrow: {
            maxTemp: Math.round(data.daily.temperature_2m_max[1]),
            minTemp: Math.round(data.daily.temperature_2m_min[1]),
            code: data.daily.weathercode[1],
            precipPct: data.daily.precipitation_probability_max[1] || 0,
          },
        }
        setWeather(weatherData)
        localStorage.setItem(cacheKey, JSON.stringify({ data: weatherData, timestamp: Date.now() }))
        setLoading(false)
        setTimeout(() => setShowTomorrow(true), 300)
      })
      .catch(() => {
        setWeather(mockWeather)
        setLoading(false)
        setTimeout(() => setShowTomorrow(true), 300)
      })
  }, [])

  if (loading) {
    return (
      <div className="ems-card" style={{ height: '100%' }}>
        <div className="skeleton" style={{ width: '60%', height: 14, marginBottom: 16 }} />
        <div className="skeleton" style={{ width: 60, height: 60, borderRadius: '50%', margin: '0 auto 12px' }} />
        <div className="skeleton" style={{ width: '40%', height: 32, margin: '0 auto 8px' }} />
        <div className="skeleton" style={{ width: '60%', height: 14, margin: '0 auto' }} />
      </div>
    )
  }

  if (!weather) return null

  const todayInfo = getWeather(weather.current.code)
  const tomorrowInfo = getWeather(weather.tomorrow.code)

  return (
    <div className="ems-card" style={{ height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span className="category-label" style={{ color: '#2563eb', fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Vejr — Ringsted
        </span>
        <span className="data-source-mock">Open-Meteo</span>
      </div>

      {/* Today */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div
          className="animate-float"
          style={{ fontSize: 52, lineHeight: 1, marginBottom: 8 }}
        >
          {todayInfo.emoji}
        </div>
        <div style={{ fontSize: 36, fontWeight: 700, color: '#1a1a2e', lineHeight: 1 }}>
          {weather.current.temp}°C
        </div>
        <div style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
          {todayInfo.label}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 6 }}>
          <Wind size={12} color="#9ca3af" />
          <span style={{ fontSize: 12, color: '#9ca3af' }}>{weather.current.windspeed} km/t</span>
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid #f3f4f6', marginBottom: 14 }} />

      {/* Tomorrow */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          opacity: showTomorrow ? 1 : 0,
          transform: showTomorrow ? 'translateX(0)' : 'translateX(20px)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        }}
      >
        <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>I morgen</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>{tomorrowInfo.emoji}</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>
              {weather.tomorrow.maxTemp}° / {weather.tomorrow.minTemp}°
            </div>
            <div style={{ fontSize: 11, color: '#9ca3af' }}>
              {tomorrowInfo.label} · 💧 {weather.tomorrow.precipPct}%
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
