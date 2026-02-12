'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { usersService } from '@/services/users'
import LoginForm from '@/components/LoginForm'
import RegisterForm from '@/components/RegisterForm'
import Alert from '@/components/Alert'
import type { User } from '@/types/api'
import { ApiError } from '@/lib/api'

export default function Home() {
  const { user, loading: authLoading, logout } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [showRegister, setShowRegister] = useState(false)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (user) {
      loadUsers()
    }
  }, [user, page, search])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const response = await usersService.getUsers({
        page,
        limit: 10,
        search: search || undefined,
        sort: '-createdAt'
      })
      
      if (response.data?.users) {
        setUsers(response.data.users)
      }
      
      if (response.pagination) {
        setTotalPages(response.pagination.pages)
      }
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : 'Error al cargar usuarios'
      showAlert(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }

  const showAlert = (message: string, type: 'success' | 'error') => {
    setAlert({ message, type })
    setTimeout(() => setAlert(null), 5000)
  }

  const handleDeleteUser = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return

    try {
      await usersService.deleteUser(id)
      showAlert('Usuario eliminado exitosamente', 'success')
      loadUsers()
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : 'Error al eliminar usuario'
      showAlert(errorMessage, 'error')
    }
  }

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      if (isActive) {
        await usersService.deactivateUser(id)
        showAlert('Usuario desactivado exitosamente', 'success')
      } else {
        await usersService.activateUser(id)
        showAlert('Usuario activado exitosamente', 'success')
      }
      loadUsers()
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : 'Error al cambiar estado'
      showAlert(errorMessage, 'error')
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      showAlert('Sesión cerrada exitosamente', 'success')
    } catch (error) {
      showAlert('Error al cerrar sesión', 'error')
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-200 via-blue-200 to-indigo-700">
        <div className="text-white text-2xl">Cargando...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-200 via-blue-200 to-indigo-700 p-5 flex items-center justify-center">
        {showRegister ? (
          <RegisterForm 
            onSuccess={() => showAlert('Registro exitoso', 'success')}
            onToggleLogin={() => setShowRegister(false)}
          />
        ) : (
          <LoginForm 
            onSuccess={() => showAlert('Inicio de sesión exitoso', 'success')}
            onToggleRegister={() => setShowRegister(true)}
          />
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-200 via-blue-200 to-indigo-700 p-5">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        {/* Header con info del usuario */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-blue-500">
              Sistema CRUD - Gestión de Usuarios
            </h1>
            <p className="text-gray-600 mt-2">
              Bienvenido, <span className="font-semibold">{user.nombre}</span>
              {user.role === 'admin' && (
                <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Admin</span>
              )}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>

        {alert && <Alert message={alert.message} type={alert.type} />}

        {/* Buscador */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar usuarios..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Tabla de usuarios */}
        {loading ? (
          <div className="text-center py-8">
            <div className="text-gray-600">Cargando usuarios...</div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Edad</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td className="px-4 py-4 whitespace-nowrap">{u.nombre}</td>
                      <td className="px-4 py-4 whitespace-nowrap">{u.email}</td>
                      <td className="px-4 py-4 whitespace-nowrap">{u.edad || '-'}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          u.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {u.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap space-x-2">
                        {user.role === 'admin' && user._id !== u._id && (
                          <>
                            <button
                              onClick={() => handleToggleActive(u._id, u.activo)}
                              className={`px-3 py-1 text-xs rounded ${
                                u.activo
                                  ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                                  : 'bg-green-500 text-white hover:bg-green-600'
                              }`}
                            >
                              {u.activo ? 'Desactivar' : 'Activar'}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                            >
                              Eliminar
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-6">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <span className="text-gray-600">
                  Página {page} de {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
