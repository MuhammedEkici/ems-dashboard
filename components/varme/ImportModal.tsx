'use client'

import { useState } from 'react'
import { X, Upload } from 'lucide-react'

interface ImportModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function VarmeImportModal({ isOpen, onClose }: ImportModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<any[]>([])
  const [step, setStep] = useState<'upload' | 'preview' | 'confirm'>('upload')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      // TODO: Parse CSV file with AI-assisted parsing
      // Expected columns: DateTime, ETime, LoopCount, WorkMode, Outdoor temp, TankUpperTemp, TankLowerTemp, RoomTemperature1, RoomTemperature2, HeatWater1Temp, Return temp, RadPump, etc.
      setPreview([
        { date: '2024-04-01', kwh: 45.2, avgTemp: 18.5 },
        { date: '2024-04-02', kwh: 42.1, avgTemp: 17.8 },
      ])
      setStep('preview')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-96 overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Importer varmedata</h2>
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
              Upload en CSV-fil med varmedata. Systemet vil automatisk parse relevante kolonner (DateTime, temperaturer, energiforbrug).
            </p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload size={32} className="mx-auto text-gray-400 mb-2" />
              <label className="cursor-pointer">
                <span className="text-purple-600 hover:text-purple-700 font-semibold">
                  Klik for at vælge fil
                </span>
                <input
                  type="file"
                  accept=".csv"
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
            <p className="text-gray-600">Forhåndsvisning af parsed data:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Dato</th>
                    <th className="text-left p-2">kWh forbrug</th>
                    <th className="text-left p-2">Gennemsnit temp</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="p-2">{row.date}</td>
                      <td className="p-2">{row.kwh}</td>
                      <td className="p-2">{row.avgTemp}°C</td>
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
              Bekræft import af varmedata:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Fil:</strong> {file?.name}
              </p>
              <p className="text-sm text-gray-700 mt-2">
                <strong>Rækker:</strong> {preview.length}
              </p>
              <p className="text-sm text-gray-700 mt-2">
                <strong>Periode:</strong> {preview[0]?.date} til {preview[preview.length - 1]?.date}
              </p>
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
