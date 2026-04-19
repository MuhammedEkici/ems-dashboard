'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Lock, Eye, EyeOff, Zap } from 'lucide-react'
import { createBrowserClient } from '@supabase/auth-helpers-nextjs'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError('Forkert e-mail eller kodeord. Prøv igen.')
      } else {
        const redirectTo = searchParams.get('redirectTo') || '/'
        router.push(redirectTo)
        router.refresh()
      }
    } catch {
      setError('Login fejlede. Prøv igen.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        fontFamily: "'Outfit', sans-serif",
        background: '#0a0a0f',
      }}
    >
      {/* LEFT — Hero image */}
      <div
        className="hide-mobile"
        style={{
          width: '55%',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0f',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(/Forside.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.5,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom right, rgba(0,0,0,0.6), rgba(0,212,255,0.1))',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '40%',
            background: 'linear-gradient(to top, #0a0a0f, transparent)',
          }}
        />
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            padding: '0 48px',
          }}
        >
          <div style={{ fontSize: 64, marginBottom: 16 }}>⚡</div>
          <h1
            style={{
              fontSize: 52,
              fontWeight: 700,
              color: 'white',
              marginBottom: 16,
              lineHeight: 1.1,
              textShadow: '0 0 40px rgba(0,212,255,0.3)',
            }}
          >
            Ekici <span style={{ color: '#00d4ff', textShadow: '0 0 20px rgba(0,212,255,0.8)' }}>EMS</span>
          </h1>
          <p
            style={{
              fontSize: 18,
              fontWeight: 300,
              color: 'rgba(255,255,255,0.75)',
              maxWidth: 380,
              lineHeight: 1.6,
            }}
          >
            Intelligent energistyring til dit hjem
          </p>
          <div
            style={{
              display: 'flex',
              gap: 12,
              justifyContent: 'center',
              marginTop: 40,
              flexWrap: 'wrap',
            }}
          >
            {['⚡ El', '💧 Vand', '🌡️ Varme', '🌿 Indeklima', '☀️ Solceller', '🔋 Batteri'].map(item => (
              <span
                key={item}
                style={{
                  background: 'rgba(0,212,255,0.1)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(0,212,255,0.2)',
                  borderRadius: 20,
                  padding: '6px 16px',
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.9)',
                  fontWeight: 500,
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            left: 24,
            fontSize: 12,
            color: 'rgba(255,255,255,0.3)',
            zIndex: 2,
          }}
        >
          © 2026 Ekici EMS · prosolenergi.dk
        </div>
      </div>

      {/* RIGHT — Login form */}
      <div
        style={{
          width: '45%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0f',
          padding: 24,
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 300,
            height: 300,
            background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            width: '100%',
            maxWidth: 380,
            background: '#111118',
            borderRadius: 20,
            padding: 40,
            border: '1px solid rgba(0,212,255,0.15)',
            boxShadow: '0 0 40px rgba(0,212,255,0.08), 0 20px 60px rgba(0,0,0,0.5)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div
              style={{
                width: 56,
                height: 56,
                background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 0 20px rgba(0,212,255,0.4)',
              }}
            >
              <Zap size={28} color="#000" fill="#000" />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 600, color: '#ffffff', marginBottom: 6 }}>
              Velkommen tilbage
            </h2>
            <p style={{ fontSize: 13, color: '#475569' }}>Log ind på dit energidashboard</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label htmlFor="email" style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#94a3b8', marginBottom: 6 }}>
                E-mail
              </label>
              <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="din@email.dk" className="ems-input" required />
            </div>
            <div>
              <label htmlFor="password" style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#94a3b8', marginBottom: 6 }}>
                Kodeord
              </label>
              <div style={{ position: 'relative' }}>
                <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="ems-input" style={{ paddingRight: 44 }} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex', alignItems: 'center' }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, fontSize: 13, color: '#ef4444' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: 4, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Logger ind...' : 'Log Ind'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <a href="#" style={{ fontSize: 13, color: '#a855f7', textDecoration: 'none', fontWeight: 500 }}
              onMouseEnter={e => { e.currentTarget.style.textShadow = '0 0 8px rgba(168,85,247,0.6)' }}
              onMouseLeave={e => { e.currentTarget.style.textShadow = 'none' }}>
              Glemt password?
            </a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(0,212,255,0.08)' }}>
            <Lock size={12} color="#475569" />
            <span style={{ fontSize: 12, color: '#475569' }}>Sikker forbindelse</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ background: '#0a0a0f', height: '100vh' }} />}>
      <LoginForm />
    </Suspense>
  )
}