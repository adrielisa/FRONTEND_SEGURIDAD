'use client'

import React, { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import type { Entry, CooldownStatus } from '@/src/types'
import { detectXSSAttack, sanitizeInput, validateContentLength } from '@/src/utils/security'
import { API_ENDPOINTS } from '@/src/config/api'

interface ApiResponse {
  cooldown?: CooldownStatus
  [key: string]: unknown
}

export default function SecureLogPage() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [contenido, setContenido] = useState('')
  const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState<CooldownStatus>({ active: false, remainingSeconds: 0 })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')

  useEffect(() => {
    loadEntries()
  }, [])

  // Temporizador local para decrementar el cooldown sin hacer peticiones
  useEffect(() => {
    if (!cooldown.active || cooldown.remainingSeconds <= 0) return

    const timer = setInterval(() => {
      setCooldown(prev => {
        if (prev.remainingSeconds <= 1) {
          return { active: false, remainingSeconds: 0 }
        }
        return { ...prev, remainingSeconds: prev.remainingSeconds - 1 }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [cooldown.active, cooldown.remainingSeconds])

  const updateCooldownFromResponse = (data: ApiResponse) => {
    // Actualizar cooldown desde la respuesta del servidor
    if (data.cooldown) {
      setCooldown({
        active: true,
        type: data.cooldown.type || 'cooldown',
        remainingSeconds: data.cooldown.remainingSeconds || 30,
        reason: data.cooldown.reason
      })
    }
  }

  const loadEntries = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.entries)
      const data = await res.json()
      if (data.success) {
        setEntries(data.data)
      }
    } catch (error) {
      console.error('Error loading entries:', error)
    }
  }

  // Reportar ataque al backend
  const reportAttack = async (attackType: string = 'XSS') => {
    try {
      const res = await fetch(API_ENDPOINTS.reportAttack, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attackType })
      })

      const data = await res.json()
      
      if (data.cooldown) {
        updateCooldownFromResponse(data)
      }

      showAlert(data.message || 'Intento de ataque detectado, serás baneado por 5 min :)', 'warning')
    } catch (error) {
      console.error('Error reporting attack:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validation = validateContentLength(contenido)
    if (!validation.valid) {
      showAlert(validation.error!, 'error')
      return
    }

    // Detectar ataque ANTES de sanitizar
    if (detectXSSAttack(contenido)) {
      setLoading(true)
      await reportAttack('XSS')
      setLoading(false)
      setContenido('') // Limpiar el input
      return
    }

    const sanitized = sanitizeInput(contenido)

    setLoading(true)
    try {
      const res = await fetch(API_ENDPOINTS.entries, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contenido: sanitized })
      })

      const data = await res.json()

      if (res.ok && data.success) {
        showAlert('Registro creado exitosamente', 'success')
        setContenido('')
        loadEntries()
      } else {
        const alertType = (data.error?.includes('bloqueada') || data.error?.includes('ataque')) ? 'warning' : 'error'
        showAlert(data.message || data.error || 'Error al crear registro', alertType)
        updateCooldownFromResponse(data)
      }
    } catch {
      showAlert('Error de conexión. Intenta nuevamente.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (id: string) => {
    const validation = validateContentLength(editContent)
    if (!validation.valid) {
      showAlert(validation.error!, 'error')
      return
    }

    // Detectar ataque ANTES de sanitizar
    if (detectXSSAttack(editContent)) {
      setLoading(true)
      await reportAttack('XSS')
      setLoading(false)
      setEditingId(null)
      setEditContent('') // Limpiar el input
      return
    }

    const sanitized = sanitizeInput(editContent)

    setLoading(true)
    try {
      const res = await fetch(`${API_ENDPOINTS.entries}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contenido: sanitized })
      })

      const data = await res.json()

      if (res.ok && data.success) {
        showAlert('Registro actualizado exitosamente', 'success')
        setEditingId(null)
        setEditContent('')
        loadEntries()
      } else {
        const alertType = (data.error?.includes('bloqueada') || data.error?.includes('ataque')) ? 'warning' : 'error'
        showAlert(data.message || data.error || 'Error al actualizar registro', alertType)
        updateCooldownFromResponse(data)
      }
    } catch {
      showAlert('Error de conexión. Intenta nuevamente.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este registro?')) return

    setLoading(true)
    try {
      const res = await fetch(`${API_ENDPOINTS.entries}/${id}`, {
        method: 'DELETE'
      })

      const data = await res.json()

      if (res.ok && data.success) {
        showAlert('Registro eliminado exitosamente', 'success')
        loadEntries()
      } else {
        const alertType = (data.error?.includes('bloqueada') || data.error?.includes('ataque')) ? 'warning' : 'error'
        showAlert(data.message || data.error || 'Error al eliminar registro', alertType)
        updateCooldownFromResponse(data)
      }
    } catch {
      showAlert('Error de conexión. Intenta nuevamente.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (entry: Entry) => {
    setEditingId(entry.id)
    setEditContent(entry.contenido)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditContent('')
  }

  const showAlert = (message: string, type: 'success' | 'error' | 'warning') => {
    if (type === 'success') {
      toast.success(message, { duration: 4000 })
    } else if (type === 'warning') {
      toast(message, { 
        icon: '⚠️',
        duration: 5000,
        style: {
          background: '#fef3c7',
          color: '#92400e',
          border: '1px solid #fbbf24'
        }
      })
    } else {
      toast.error(message, { duration: 4000 })
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 to-slate-200 p-8">
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          className: 'font-medium',
          style: {
            borderRadius: '10px',
            padding: '16px',
          }
        }}
      />
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-3">
            Sistema de Registros
          </h1>
          <p className="text-gray-600 text-lg">
            Elaborado por <span className="font-semibold text-indigo-700">Adriel Rodriguez</span> y <span className="font-semibold text-indigo-700">Sergio Trujillo</span>
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">

          {/* Input Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold text-gray-700">Crear nuevo registro</h2>
              {cooldown.active && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  cooldown.type === 'blocked' 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  {cooldown.type === 'blocked' ? '🔒 Bloqueado' : '⏱️ Espera'}: {cooldown.remainingSeconds}s
                </span>
              )}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="text"
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                placeholder="Escribe tu registro aquí..."
                disabled={loading || cooldown.active}
                maxLength={50}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={loading || cooldown.active || !contenido.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Agregar
              </button>
            </form>

            <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
              <span>Mínimo 10, máximo 50 caracteres</span>
              <span className={contenido.length < 10 ? 'text-orange-600 font-medium' : contenido.length > 45 ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
                {contenido.length} / 50
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="max-h-[500px] overflow-y-auto hide-scrollbar">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className="bg-gray-100 border-b-2 border-gray-300">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 bg-gray-100">Contenido</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 w-48 bg-gray-100">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-4 py-12 text-center text-gray-400">
                      No hay registros aún. Crea el primero arriba.
                    </td>
                  </tr>
                ) : (
                  entries.map((entry) => (
                    <tr key={entry.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-4">
                        {editingId === entry.id ? (
                          <input
                            type="text"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            maxLength={50}
                            className="w-full px-3 py-2 border border-indigo-300 rounded text-gray-900 focus:ring-2 focus:ring-indigo-500"
                          />
                        ) : (
                          <span className="text-gray-900">{entry.contenido}</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {editingId === entry.id ? (
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleUpdate(entry.id)}
                              disabled={loading || cooldown.active}
                              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={() => startEdit(entry)}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(entry.id)}
                              disabled={loading}
                              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                              Eliminar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {entries.length > 0 && (
            <div className="mt-6 text-center text-sm text-gray-500">
              Total de registros: <span className="font-semibold text-gray-700">{entries.length}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
