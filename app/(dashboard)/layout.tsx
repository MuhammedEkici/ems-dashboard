'use client'

import NavBar from '@/components/layout/NavBar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // TODO: Get user role from Supabase Auth
  const userRole: 'admin' | 'guest' = 'admin'
  const userName = 'Admin Bruger'

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f' }}>
      <NavBar userRole={userRole} userName={userName} />
      <main
        className="page-content"
        style={{
          paddingTop: 60 + 24,
          paddingLeft: 24,
          paddingRight: 24,
          paddingBottom: 40,
          maxWidth: 1400,
          margin: '0 auto',
        }}
      >
        {children}
      </main>
    </div>
  )
}
