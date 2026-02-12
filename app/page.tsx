'use client'

import { useState, useEffect } from 'react'
import UserForm from '@/components/UserForm'
import UserTable from '@/components/UserTable'
import EditModal from '@/components/EditModal'
import Alert from '@/components/Alert'

export interface User {
  id: number
  nombre: string
  email: string
  edad: number
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([])
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/usuarios')
      if (!response.ok) throw new Error('Error al obtener usuarios')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      showAlert('Error al cargar usuarios: ' + (error as Error).message, 'error')
    }
  }

  const showAlert = (message: string, type: 'success' | 'error') => {
    setAlert({ message, type })
    setTimeout(() => setAlert(null), 5000)
  }

  const handleCreateUser = async (nombre: string, email: string, edad: number) => {
    try {
      const response = await fetch('http://localhost:3000/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, edad })
      })

      const data = await response.json()

      if (response.ok) {
        showAlert('Usuario creado exitosamente', 'success')
        loadUsers()
        return true
      } else {
        const errorMsg = data.errors 
          ? data.errors.map((e: any) => e.msg).join(', ')
          : data.error || 'Error al crear usuario'
        showAlert(errorMsg, 'error')
        return false
      }
    } catch (error) {
      showAlert('Error de conexión: ' + (error as Error).message, 'error')
      return false
    }
  }

  const handleUpdateUser = async (id: number, nombre: string, email: string, edad: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/usuarios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, edad })
      })

      const data = await response.json()

      if (response.ok) {
        showAlert('Usuario actualizado exitosamente', 'success')
        setIsModalOpen(false)
        setEditingUser(null)
        loadUsers()
        return true
      } else {
        const errorMsg = data.errors 
          ? data.errors.map((e: any) => e.msg).join(', ')
          : data.error || 'Error al actualizar usuario'
        showAlert(errorMsg, 'error')
        return false
      }
    } catch (error) {
      showAlert('Error de conexión: ' + (error as Error).message, 'error')
      return false
    }
  }

  const handleDeleteUser = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return

    try {
      const response = await fetch(`http://localhost:3000/api/usuarios/${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (response.ok) {
        showAlert('Usuario eliminado exitosamente', 'success')
        loadUsers()
      } else {
        const errorMsg = data.errors 
          ? data.errors.map((e: any) => e.msg).join(', ')
          : data.error || 'Error al eliminar usuario'
        showAlert(errorMsg, 'error')
      }
    } catch (error) {
      showAlert('Error de conexión: ' + (error as Error).message, 'error')
    }
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-200 to-indigo-700 p-5">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-blue-500 text-center mb-8">
        Sistema CRUD - Gestión de Usuarios
        </h1>

        {alert && <Alert message={alert.message} type={alert.type} />}

        <UserForm onSubmit={handleCreateUser} />
        
        <UserTable 
          users={users} 
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />

        {isModalOpen && editingUser && (
          <EditModal
            user={editingUser}
            onClose={() => {
              setIsModalOpen(false)
              setEditingUser(null)
            }}
            onUpdate={handleUpdateUser}
          />
        )}
      </div>
    </div>
  )
}
