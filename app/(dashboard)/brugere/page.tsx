'use client'

import { useState } from 'react'
import { Users, Eye, EyeOff, Pencil, Trash2, Mail, Search } from 'lucide-react'

const mockUsers = [
  { id: 1, name: 'Admin Bruger', email: 'admin@prosolenergi.dk', phone: '+45 12 34 56 78', role: 'admin', created: '01. jan 2024', active: true },
  { id: 2, name: 'Lars Nielsen', email: 'lars@example.dk', phone: '+45 23 45 67 89', role: 'guest', created: '15. mar 2024', active: true },
  { id: 3, name: 'Mette Hansen', email: 'mette@example.dk', phone: '+45 34 56 78 90', role: 'guest', created: '22. jun 2024', active: false },
  { id: 4, name: 'Peter Sørensen', email: 'peter@example.dk', phone: '+45 45 67 89 01', role: 'guest', created: '08. sep 2024', active: true },
]

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function BrugerePage() {
  const [users, setUsers] = useState(mockUsers)
  const [search, setSearch] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', password: '', role: 'guest',
  })
  const [formSuccess, setFormSuccess] = useState(false)

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (form.name && form.email) {
      setUsers(prev => [...prev, {
        id: prev.length + 1,
        name: form.name,
        email: form.email,
        phone: form.phone,
        role: form.role as 'admin' | 'guest',
        created: new Date().toLocaleDateString('da-DK', { day: '2-digit', month: 'short', year: 'numeric' }),
        active: true,
      }])
      setForm({ name: '', email: '', phone: '', address: '', password: '', role: 'guest' })
      setFormSuccess(true)
      setTimeout(() => setFormSuccess(false), 3000)
    }
  }

  const handleDelete = (id: number) => {
    setUsers(prev => prev.filter(u => u.id !== id))
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
    transition: 'border-color 0.2s',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 12px rgba(168,85,247,0.2)',
        }}>
          <Users size={20} color="#a855f7" />
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#ffffff' }}>Brugere</h1>
      </div>

      {/* TWO COLUMN LAYOUT */}
      <div style={{ display: 'grid', gridTemplateColumns: '35% 65%', gap: 20, alignItems: 'start' }}>
        {/* LEFT — Add user form */}
        <div className="ems-card" style={{ borderColor: 'rgba(168,85,247,0.2)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: '#ffffff', marginBottom: 20 }}>Tilføj ny bruger</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { key: 'name', label: 'Fulde navn', type: 'text', placeholder: 'Fornavn Efternavn' },
              { key: 'email', label: 'E-mail', type: 'email', placeholder: 'bruger@email.dk' },
              { key: 'phone', label: 'Telefon', type: 'tel', placeholder: '+45 12 34 56 78' },
              { key: 'address', label: 'Adresse', type: 'text', placeholder: 'Gadenavn 1, 4100 Ringsted' },
            ].map(field => (
              <div key={field.key}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#94a3b8', marginBottom: 6 }}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={form[field.key as keyof typeof form]}
                  onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  style={inputStyle}
                />
              </div>
            ))}

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#94a3b8', marginBottom: 6 }}>
                Adgangskode
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="••••••••"
                  style={{ ...inputStyle, paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex', alignItems: 'center' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Role */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#94a3b8', marginBottom: 6 }}>
                Rolle
              </label>
              <select
                value={form.role}
                onChange={e => setForm(prev => ({ ...prev, role: e.target.value }))}
                className="ems-select"
              >
                <option value="admin">Admin</option>
                <option value="guest">Gæst</option>
              </select>
            </div>

            {formSuccess && (
              <div style={{ padding: '10px 14px', background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)', borderRadius: 10, fontSize: 13, color: '#00ff88' }}>
                ✓ Bruger oprettet!
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 4 }}>
              Opret bruger
            </button>

            <div style={{ fontSize: 12, color: '#475569', textAlign: 'center' }}>
              Brugeren modtager en velkomst-email med login-oplysninger
            </div>
          </form>
        </div>

        {/* RIGHT — User table */}
        <div className="ems-card" style={{ borderColor: 'rgba(168,85,247,0.15)' }}>
          {/* Search */}
          <div style={{ position: 'relative', marginBottom: 20 }}>
            <Search size={16} color="#475569" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Søg efter bruger..."
              style={{ ...inputStyle, paddingLeft: 40 }}
            />
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Bruger', 'Rolle', 'Status', 'Oprettet', 'Handlinger'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, color: '#475569', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((user, i) => (
                  <tr
                    key={user.id}
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.03)',
                      background: i % 2 === 0 ? 'transparent' : 'rgba(168,85,247,0.02)',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(168,85,247,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(168,85,247,0.02)')}
                  >
                    {/* Avatar + name */}
                    <td style={{ padding: '12px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                          background: user.role === 'admin'
                            ? 'linear-gradient(135deg, #a855f7, #7c3aed)'
                            : 'linear-gradient(135deg, #475569, #334155)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 13, fontWeight: 700, color: 'white',
                          boxShadow: user.role === 'admin' ? '0 0 10px rgba(168,85,247,0.4)' : 'none',
                        }}>
                          {getInitials(user.name)}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#ffffff' }}>{user.name}</div>
                          <div style={{ fontSize: 11, color: '#475569' }}>{user.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role badge */}
                    <td style={{ padding: '12px 12px' }}>
                      <span className={user.role === 'admin' ? 'badge-purple' : 'badge-gray'}>
                        {user.role === 'admin' ? 'Admin' : 'Gæst'}
                      </span>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '12px 12px' }}>
                      <span className={user.active ? 'badge-green' : 'badge-gray'}>
                        {user.active ? 'Aktiv' : 'Inaktiv'}
                      </span>
                    </td>

                    {/* Created */}
                    <td style={{ padding: '12px 12px', fontSize: 12, color: '#475569', whiteSpace: 'nowrap' }}>
                      {user.created}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '12px 12px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          title="Rediger"
                          style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 8, padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#00d4ff', transition: 'all 0.15s' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,212,255,0.2)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,212,255,0.1)')}
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          title="Send reset email"
                          style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 8, padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#a855f7', transition: 'all 0.15s' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(168,85,247,0.2)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(168,85,247,0.1)')}
                        >
                          <Mail size={13} />
                        </button>
                        <button
                          title="Slet"
                          onClick={() => handleDelete(user.id)}
                          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#ef4444', transition: 'all 0.15s' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.2)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.1)')}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#475569' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
                <div style={{ fontSize: 14 }}>Ingen brugere fundet</div>
              </div>
            )}
          </div>

          <div style={{ marginTop: 16, fontSize: 12, color: '#475569' }}>
            {filtered.length} bruger{filtered.length !== 1 ? 'e' : ''} vist
          </div>
        </div>
      </div>
    </div>
  )
}
