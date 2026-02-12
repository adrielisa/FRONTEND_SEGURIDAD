'use client'

import { useState } from 'react'

interface UserFormProps {
  onSubmit: (nombre: string, email: string, edad: number) => Promise<boolean>
}

export default function UserForm({ onSubmit }: UserFormProps) {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [edad, setEdad] = useState('')

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

    const success = await onSubmit(nombre.trim(), email.trim(), edadNum)
    
    if (success) {
      setNombre('')
      setEmail('')
      setEdad('')
    }
  }

  return (
    <div className="bg-gray-50 p-6 rounded-xl mb-8">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Agregar Nuevo Usuario</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre:
          </label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            required
          />
        </div>

        <div>
          <label htmlFor="edad" className="block text-sm font-medium text-gray-700 mb-2">
            Edad:
          </label>
          <input
            type="number"
            id="edad"
            value={edad}
            onChange={(e) => setEdad(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl"
        >
          Guardar Usuario
        </button>
      </form>
    </div>
  )
}
