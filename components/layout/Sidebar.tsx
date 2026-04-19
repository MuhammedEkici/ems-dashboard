'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight, Home, Zap, Droplet, Flame, Sun, FileText, Users } from 'lucide-react'

interface SidebarProps {
  userRole?: 'admin' | 'guest'
}

export default function Sidebar({ userRole = 'guest' }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true)
  const pathname = usePathname()

  const navItems = [
    { href: '/forside', label: 'Forside', icon: Home },
    { href: '/el', label: 'El', icon: Zap },
    { href: '/vand', label: 'Vand', icon: Droplet },
    { href: '/varme', label: 'Varme', icon: Flame },
    { href: '/solceller', label: 'Solceller', icon: Sun },
    { href: '/rapport', label: 'Rapport', icon: FileText },
    ...(userRole === 'admin' ? [{ href: '/brugere', label: 'Brugere', icon: Users }] : []),
  ]

  const isActive = (href: string) => pathname === href

  return (
    <div
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-purple-900 text-white transition-all duration-300 flex flex-col h-screen fixed left-0 top-0 z-40`}
      style={{ backgroundColor: '#2d1b4e' }}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-purple-800">
        {isOpen && <h1 className="text-xl font-bold">Ekici EMS</h1>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 hover:bg-purple-800 rounded transition"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                active
                  ? 'bg-purple-700 text-white'
                  : 'text-purple-200 hover:bg-purple-800'
              }`}
            >
              <Icon size={20} />
              {isOpen && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-purple-800 text-sm text-purple-300">
        {isOpen && <p>© 2024 Ekici EMS</p>}
      </div>
    </div>
  )
}
