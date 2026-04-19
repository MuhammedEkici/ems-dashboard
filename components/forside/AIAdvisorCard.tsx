'use client'

import { useEffect, useState, useRef } from 'react'
import { Sparkles, Send, X } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function AIAdvisorCard() {
  const [advice, setAdvice] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [noKey, setNoKey] = useState(false)
  const [source, setSource] = useState<'live' | 'mock'>('mock')
  const [showChat, setShowChat] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [displayedText, setDisplayedText] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Typewriter effect
  useEffect(() => {
    if (!advice) return
    setDisplayedText('')
    let i = 0
    const interval = setInterval(() => {
      if (i < advice.length) {
        setDisplayedText(advice.slice(0, i + 1))
        i++
      } else {
        clearInterval(interval)
      }
    }, 18)
    return () => clearInterval(interval)
  }, [advice])

  // Fetch AI advice on mount
  useEffect(() => {
    fetch('/api/ai-advisor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        spotPrices: [],
        weather: null,
        consumption: '1.245 kWh',
        solarProduction: '12.5 kWh',
      }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.error === 'NO_API_KEY') {
          setNoKey(true)
          setLoading(false)
          return
        }
        setAdvice(data.advice || '')
        setSource(data.source || 'mock')
        setLoading(false)
      })
      .catch(() => {
        setAdvice('I dag er elprisen lav mellem 01:00–06:00. Overvej at starte vaskemaskinen eller oplade elbilen om natten. Vejret er delvist skyet — begrænset solproduktion forventes.')
        setSource('mock')
        setLoading(false)
      })
  }, [])

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleChatSend = async () => {
    if (!chatInput.trim() || chatLoading) return
    const userMsg = chatInput.trim()
    setChatInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setChatLoading(true)

    try {
      const res = await fetch(`/api/ai-advisor?message=${encodeURIComponent(userMsg)}`)
      const data = await res.json()
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.reply || 'Beklager, ingen svar.'
      }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Beklager, der opstod en fejl. Prøv igen.'
      }])
    } finally {
      setChatLoading(false)
    }
  }

  return (
    <>
      <div
        className="ems-card"
        style={{
          height: '100%',
          background: 'linear-gradient(135deg, #ffffff 0%, #faf5ff 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle background shimmer when loading */}
        {loading && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.05) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
              borderRadius: 16,
            }}
          />
        )}

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={16} color="#7c3aed" />
            <span style={{ fontSize: 11, fontWeight: 500, color: '#7c3aed', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              AI Energirådgiver
            </span>
          </div>
          <span className={source === 'live' ? 'data-source-live' : 'data-source-mock'}>
            {source === 'live' ? 'Claude AI' : 'Simuleret'}
          </span>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', padding: '16px 0' }}>
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
        ) : noKey ? (
          <div
            style={{
              padding: '12px 14px',
              background: '#faf5ff',
              borderRadius: 10,
              border: '1px solid rgba(124,58,237,0.15)',
              fontSize: 13,
              color: '#6b7280',
              lineHeight: 1.6,
            }}
          >
            Tilføj din <code style={{ color: '#7c3aed', fontSize: 12 }}>ANTHROPIC_API_KEY</code> i{' '}
            <code style={{ color: '#7c3aed', fontSize: 12 }}>.env.local</code> for at aktivere AI-rådgiveren.
          </div>
        ) : (
          <div
            style={{
              fontSize: 14,
              color: '#374151',
              lineHeight: 1.7,
              minHeight: 80,
            }}
          >
            {displayedText}
            {displayedText.length < advice.length && (
              <span style={{ opacity: 0.5 }}>|</span>
            )}
          </div>
        )}

        {/* Chat button */}
        {!noKey && !loading && (
          <button
            onClick={() => setShowChat(true)}
            className="btn-outline"
            style={{ marginTop: 16, width: '100%' }}
          >
            <Sparkles size={14} />
            Spørg AI
          </button>
        )}
      </div>

      {/* Chat Modal */}
      {showChat && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            padding: 24,
          }}
          onClick={e => { if (e.target === e.currentTarget) setShowChat(false) }}
        >
          <div
            className="animate-slide-down"
            style={{
              width: 400,
              maxHeight: '70vh',
              background: 'white',
              borderRadius: 16,
              boxShadow: '0 16px 48px rgba(124,58,237,0.2)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Chat header */}
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #f3f4f6',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sparkles size={16} color="white" />
                <span style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>AI Energirådgiver</span>
              </div>
              <button
                onClick={() => setShowChat(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {messages.length === 0 && (
                <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: 13, padding: '20px 0' }}>
                  Stil mig et spørgsmål om din energi 💡
                </div>
              )}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '80%',
                      padding: '10px 14px',
                      borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      background: msg.role === 'user' ? '#7c3aed' : '#f9fafb',
                      color: msg.role === 'user' ? 'white' : '#374151',
                      fontSize: 13,
                      lineHeight: 1.6,
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div style={{ display: 'flex', gap: 6, padding: '8px 0' }}>
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div
              style={{
                padding: '12px 16px',
                borderTop: '1px solid #f3f4f6',
                display: 'flex',
                gap: 8,
              }}
            >
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleChatSend()}
                placeholder="Stil et spørgsmål..."
                className="ems-input"
                style={{ flex: 1, height: 40 }}
              />
              <button
                onClick={handleChatSend}
                disabled={chatLoading || !chatInput.trim()}
                style={{
                  width: 40,
                  height: 40,
                  background: '#7c3aed',
                  border: 'none',
                  borderRadius: 10,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: chatLoading || !chatInput.trim() ? 0.5 : 1,
                }}
              >
                <Send size={16} color="white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
