'use client'

import { useState } from 'react'
import { LogOut, Settings, HelpCircle, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface TopBarProps {
  userName?: string
}

export default function TopBar({ userName = 'Admin Bruger' }: TopBarProps) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    // TODO: Connect to Supabase Auth logout
    router.push('/login')
  }

  return (
    <>
      <div className="fixed top-0 right-0 left-64 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-30">
        <div className="flex-1" />

        {/* Right side - User menu and help */}
        <div className="flex items-center space-x-4">
          {/* Help Icon */}
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            title="Hjælp"
          >
            <HelpCircle size={20} className="text-gray-600" />
          </button>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition"
            >
              <span className="text-gray-700 font-medium">{userName}</span>
              <ChevronDown size={16} className="text-gray-600" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 text-gray-700">
                  <Settings size={16} />
                  <span>Brugerindstillinger</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 text-gray-700 border-t border-gray-200"
                >
                  <LogOut size={16} />
                  <span>Log ud</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Hjælp & Support</h2>
            <p className="text-gray-600 mb-6">
              Har du spørgsmål eller brug for assistance? Kontakt os:
            </p>
            <div className="space-y-3">
              <p className="text-gray-700">
                <strong>Email:</strong> support@prosolenergi.dk
              </p>
              <p className="text-gray-700">
                <strong>Telefon:</strong> +45 40 40 40 40
              </p>
              <p className="text-gray-700">
                <strong>Åbningstider:</strong> Man-Fre 9:00-17:00
              </p>
            </div>
            <button
              onClick={() => setShowHelp(false)}
              className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Luk
            </button>
          </div>
        </div>
      )}
    </>
  )
}
