import { createServerClient, type CookieOptions } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import NavBar from '@/components/layout/NavBar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Server-side guard — redirect to login if no session
  if (!session) {
    redirect('/login')
  }

  // Get user role from user metadata (set when creating users in Supabase)
  const userRole: 'admin' | 'guest' =
    (session.user.user_metadata?.role as 'admin' | 'guest') ?? 'guest'
  const userName: string =
    session.user.user_metadata?.full_name ||
    session.user.email?.split('@')[0] ||
    'Bruger'

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
