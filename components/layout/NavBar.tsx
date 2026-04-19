'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Bell, LogOut, Settings, Menu, X, ChevronDown, Zap } from 'lucide-react'

interface NavBarProps {
  userRole?: 'admin' | 'guest'
  userName?: string
}

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

function getWeatherInfo(code: number) {
  return weatherCodeMap[code] || { label: 'Ukendt', emoji: '🌡️' }
}

const notifications = [
  { id: 1, text: 'Højt elforbrug detekteret', time: '2 min siden', read: false },
  { id: 2, text: 'Vandforbrugsanomali', time: '1 time siden', read: false },
  { id: 3, text: 'Batteriniveau lavt', time: '3 timer siden', read: true },
]

export default function NavBar({ userRole = 'admin', userName = 'Admin Bruger' }: NavBarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [weather, setWeather] = useState<{ temp: number; code: number } | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [bellWobble, setBellWobble] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter(n => !n.read).length

  const navLinks = [
    { href: '/forside', label: 'Forside' },
    { href: '/el', label: 'El' },
    { href: '/vand', label: 'Vand' },
    { href: '/varme', label: 'Varme' },
    { href: '/indeklima', label: 'Indeklima' },
    { href: '/solceller', label: 'Solceller' },
    { href: '/rapport', label: 'Rapport' },
    ...(userRole === 'admin' ? [{ href: '/brugere', label: 'Brugere' }] : []),
  ]

  const initials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  useEffect(() => {
    const cacheKey = 'ems_weather_cache'
    const cacheExpiry = 30 * 60 * 1000

    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      const { data, timestamp } = JSON.parse(cached)
      if (Date.now() - timestamp < cacheExpiry) {
        setWeather(data)
        return
      }
    }

    fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=55.4438&longitude=11.7903&current=temperature_2m,weathercode&timezone=Europe%2FCopenhagen&forecast_days=2'
    )
      .then(r => r.json())
      .then(data => {
        const weatherData = {
          temp: Math.round(data.current.temperature_2m),
          code: data.current.weathercode,
        }
        setWeather(weatherData)
        localStorage.setItem(cacheKey, JSON.stringify({ data: weatherData, timestamp: Date.now() }))
      })
      .catch(() => {
        setWeather({ temp: 12, code: 2 })
      })
  }, [])

  useEffect(() => {
    if (unreadCount > 0) {
      setTimeout(() => setBellWobble(true), 1000)
      setTimeout(() => setBellWobble(false), 1700)
    }
  }, [unreadCount])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogout = () => {
    setShowUserMenu(false)
    router.push('/login')
  }

  const weatherInfo = weather ? getWeatherInfo(weather.code) : null

  const dropdownStyle: React.CSSProperties = {
    background: '#111118',
    border: '1px solid rgba(0,212,255,0.15)',
    borderRadius: 12,
    boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 20px rgba(0,212,255,0.08)',
    overflow: 'hidden',
    zIndex: 100,
  }

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 60,
          background: 'rgba(10,10,15,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,212,255,0.1)',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 24,
          paddingRight: 24,
        }}
      >
        {/* LEFT — Logo + Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div
            style={{
              width: 36,
              height: 36,
              background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px rgba(0,212,255,0.4)',
            }}
          >
            <Zap size={18} color="#000" fill="#000" />
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', lineHeight: 1 }}>
            Ekici<span style={{ color: '#00d4ff', textShadow: '0 0 8px rgba(0,212,255,0.6)' }}>EMS</span>
          </span>
        </div>

        {/* CENTER — Nav links */}
        <div
          className="hide-mobile"
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 28,
          }}
        >
          {navLinks.map(link => {
            const isActive = pathname === link.href || (pathname?.startsWith(link.href + '/') ?? false)
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: isActive ? '#00d4ff' : '#94a3b8',
                  textDecoration: 'none',
                  paddingBottom: 2,
                  borderBottom: isActive ? '2px solid #00d4ff' : '2px solid transparent',
                  transition: 'color 0.2s ease, border-color 0.2s ease',
                  whiteSpace: 'nowrap',
                  textShadow: isActive ? '0 0 8px rgba(0,212,255,0.5)' : 'none',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    (e.target as HTMLElement).style.color = '#00d4ff'
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    (e.target as HTMLElement).style.color = '#94a3b8'
                  }
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* RIGHT — Weather + Bell + User */}
        <div
          className="hide-mobile"
          style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          {/* Weather widget */}
          {weatherInfo && weather && (
            <span style={{ fontSize: 13, color: '#94a3b8', whiteSpace: 'nowrap' }}>
              {weatherInfo.emoji} <span style={{ color: '#00d4ff' }}>{weather.temp}°C</span>
            </span>
          )}

          <div style={{ width: 1, height: 20, background: 'rgba(0,212,255,0.15)' }} />

          {/* Bell */}
          <div ref={notifRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <Bell
                size={20}
                color={showNotifications ? '#00d4ff' : '#94a3b8'}
                style={{
                  animation: bellWobble ? 'wobble 0.6s ease-in-out' : 'none',
                  transition: 'color 0.2s',
                }}
              />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 16,
                    height: 16,
                    background: '#ef4444',
                    borderRadius: '50%',
                    fontSize: 10,
                    fontWeight: 700,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 8px rgba(239,68,68,0.6)',
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div
                className="animate-slide-down"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 8px)',
                  width: 300,
                  ...dropdownStyle,
                }}
              >
                <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0,212,255,0.1)' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#ffffff' }}>Notifikationer</span>
                </div>
                {notifications.map(n => (
                  <div
                    key={n.id}
                    style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      background: n.read ? 'transparent' : 'rgba(0,212,255,0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {!n.read && (
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00d4ff', boxShadow: '0 0 6px #00d4ff', flexShrink: 0 }} />
                      )}
                      <span style={{ fontSize: 13, color: n.read ? '#94a3b8' : '#ffffff', fontWeight: n.read ? 400 : 500 }}>
                        {n.text}
                      </span>
                    </div>
                    <span style={{ fontSize: 11, color: '#475569', marginLeft: n.read ? 0 : 14 }}>{n.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ width: 1, height: 20, background: 'rgba(0,212,255,0.15)' }} />

          {/* User avatar + dropdown */}
          <div ref={userMenuRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: 0,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 700,
                  color: 'white',
                  flexShrink: 0,
                  boxShadow: '0 0 10px rgba(168,85,247,0.4)',
                }}
              >
                {initials}
              </div>
              <ChevronDown size={14} color="#94a3b8" />
            </button>

            {showUserMenu && (
              <div
                className="animate-slide-down"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 8px)',
                  width: 200,
                  ...dropdownStyle,
                }}
              >
                <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0,212,255,0.1)' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#ffffff' }}>{userName}</div>
                  <div style={{ fontSize: 11, color: '#475569' }}>
                    {userRole === 'admin' ? 'Administrator' : 'Gæst'}
                  </div>
                </div>
                <button
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    fontSize: 13,
                    color: '#94a3b8',
                    textAlign: 'left',
                    transition: 'background 0.15s, color 0.15s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(0,212,255,0.06)'
                    e.currentTarget.style.color = '#00d4ff'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'none'
                    e.currentTarget.style.color = '#94a3b8'
                  }}
                >
                  <Settings size={15} />
                  Brugerindstillinger
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    background: 'none',
                    border: 'none',
                    borderTop: '1px solid rgba(255,255,255,0.04)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    fontSize: 13,
                    color: '#ef4444',
                    textAlign: 'left',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                >
                  <LogOut size={15} />
                  Log ud
                </button>
              </div>
            )}
          </div>
        </div>

        {/* MOBILE — Hamburger */}
        <button
          className="show-mobile"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          style={{
            marginLeft: 'auto',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 4,
            display: 'none',
          }}
        >
          {showMobileMenu ? <X size={24} color="#ffffff" /> : <Menu size={24} color="#ffffff" />}
        </button>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      {showMobileMenu && (
        <>
          <div
            onClick={() => setShowMobileMenu(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.7)',
              zIndex: 48,
              animation: 'fadeIn 0.2s ease-out',
            }}
          />
          <div
            className="animate-slide-in-left"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              bottom: 0,
              width: 280,
              background: '#0d0d16',
              zIndex: 49,
              paddingTop: 80,
              paddingLeft: 24,
              paddingRight: 24,
              borderRight: '1px solid rgba(0,212,255,0.1)',
              boxShadow: '4px 0 32px rgba(0,0,0,0.8)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {navLinks.map(link => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setShowMobileMenu(false)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 10,
                      fontSize: 15,
                      fontWeight: 500,
                      color: isActive ? '#00d4ff' : '#94a3b8',
                      background: isActive ? 'rgba(0,212,255,0.08)' : 'transparent',
                      borderLeft: isActive ? '3px solid #00d4ff' : '3px solid transparent',
                      textDecoration: 'none',
                      display: 'block',
                      transition: 'all 0.15s',
                    }}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>

            <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(0,212,255,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    fontWeight: 700,
                    color: 'white',
                    boxShadow: '0 0 10px rgba(168,85,247,0.4)',
                  }}
                >
                  {initials}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#ffffff' }}>{userName}</div>
                  <div style={{ fontSize: 12, color: '#475569' }}>
                    {userRole === 'admin' ? 'Administrator' : 'Gæst'}
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: 10,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontSize: 14,
                  color: '#ef4444',
                  fontWeight: 500,
                }}
              >
                <LogOut size={16} />
                Log ud
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
