'use client'

import { useState } from 'react'
import { X, Upload } from 'lucide-react'

interface ImportModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ImportModal({ isOpen, onClose }: ImportModalProps) {
  const [_file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<any[]>([])
  const [step, setStep] = useState<'upload' | 'preview' | 'confirm'>('upload')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      // TODO: Parse Excel/CSV file and show preview
      setPreview([
        { month: 'Januar', 2024: 12.5, 2023: 14.2 },
        { month: 'Februar', 2024: 11.2, 2023: 13.8 },
      ])
      setStep('preview')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-96 overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Importer vanddata</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {step === 'upload' && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Upload en Excel- eller CSV-fil med vanddata. Format: Kolonne A = månedsnavne, Kolonne B+ = år (2022-2026)
            </p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload size={32} className="mx-auto text-gray-400 mb-2" />
              <label className="cursor-pointer">
                <span className="text-purple-600 hover:text-purple-700 font-semibold">
                  Klik for at vælge fil
                </span>
                <input
                  type="file"
                  accept=".xlsx,.csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <p className="text-sm text-gray-500 mt-2">eller træk fil hertil</p>
            </div>
          </div>
        )}

        {step === 'preview' && (
          <div className="space-y-4">
            <p className="text-gray-600">Forhåndsvisning af data:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Måned</th>
                    <th className="text-left p-2">2023</th>
                    <th className="text-left p-2">2024</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="p-2">{row.month}</td>
                      <td className="p-2">{row[2023]}</td>
                      <td className="p-2">{row[2024]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setStep('upload')}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Tilbage
              </button>
              <button
                onClick={() => setStep('confirm')}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
              >
                Næste
              </button>
            </div>
          </div>
        )}

        {step === 'confirm' && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Vælg hvilke måneder/år du vil tilføje eller overskrive:
            </p>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-gray-700">Januar 2024 (tilføj)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-gray-700">Februar 2024 (tilføj)</span>
              </label>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setStep('preview')}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Tilbage
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
              >
                Bekræft & Importer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
