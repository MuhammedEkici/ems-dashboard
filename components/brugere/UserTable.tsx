'use client'

import { Edit2, Trash2 } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'guest'
  createdAt: string
}

interface UserTableProps {
  users: User[]
  onEdit: (user: User) => void
  onDelete: (userId: string) => void
}

export default function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-3 font-semibold text-gray-700">Navn</th>
            <th className="text-left p-3 font-semibold text-gray-700">E-mail</th>
            <th className="text-left p-3 font-semibold text-gray-700">Rolle</th>
            <th className="text-left p-3 font-semibold text-gray-700">Oprettet</th>
            <th className="text-left p-3 font-semibold text-gray-700">Handlinger</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b hover:bg-gray-50">
              <td className="p-3 text-gray-700">{user.name}</td>
              <td className="p-3 text-gray-700">{user.email}</td>
              <td className="p-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {user.role === 'admin' ? 'Admin' : 'Gæst'}
                </span>
              </td>
              <td className="p-3 text-gray-700 text-sm">
                {new Date(user.createdAt).toLocaleDateString('da-DK')}
              </td>
              <td className="p-3 flex space-x-2">
                <button
                  onClick={() => onEdit(user)}
                  className="p-2 hover:bg-blue-100 rounded-lg transition text-blue-600"
                  title="Rediger"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => onDelete(user.id)}
                  className="p-2 hover:bg-red-100 rounded-lg transition text-red-600"
                  title="Slet"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
