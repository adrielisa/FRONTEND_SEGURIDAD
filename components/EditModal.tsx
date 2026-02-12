'use client'

import { useState } from 'react'
import { User } from '@/app/page'

interface EditModalProps {
  user: User
  onClose: () => void
  onUpdate: (id: number, nombre: string, email: string, edad: number) => Promise<boolean>
}

export default function EditModal({ user, onClose, onUpdate }: EditModalProps) {
  const [nombre, setNombre] = useState(user.nombre)
  const [email, setEmail] = useState(user.email)
  const [edad, setEdad] = useState(user.edad.toString())

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validación en cliente
    if (!nombre || nombre.length < 2 || nombre.length > 100) {
      alert('El nombre debe tener entre 2 y 100 caracteres')
      return
    }

    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
      alert('El nombre solo puede contener letras y espacios')
      return
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Debe ingresar un email válido')
      return
    }

    const edadNum = parseInt(edad)
    if (!edadNum || edadNum < 1 || edadNum > 150) {
      alert('La edad debe estar entre 1 y 150')
      return
    }

    await onUpdate(user.id, nombre.trim(), email.trim(), edadNum)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fadeIn">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Editar Usuario</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl font-bold transition-colors"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="editNombre" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre:
            </label>
            <input
              type="text"
              id="editNombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="editEmail" className="block text-sm font-medium text-gray-700 mb-2">
              Email:
            </label>
            <input
              type="email"
              id="editEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="editEdad" className="block text-sm font-medium text-gray-700 mb-2">
              Edad:
            </label>
            <input
              type="number"
              id="editEdad"
              value={edad}
              onChange={(e) => setEdad(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow-lg"
            >
              Actualizar Usuario
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
