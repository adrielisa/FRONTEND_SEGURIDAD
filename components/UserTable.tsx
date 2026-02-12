'use client'

import { User } from '@/app/page'

interface UserTableProps {
  users: User[]
  onEdit: (user: User) => void
  onDelete: (id: number) => void
}

export default function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Lista de Usuarios</h2>
      <div className="overflow-x-auto rounded-xl shadow-lg">
        <table className="w-full bg-white">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-4 px-6 text-left">ID</th>
              <th className="py-4 px-6 text-left">Nombre</th>
              <th className="py-4 px-6 text-left">Email</th>
              <th className="py-4 px-6 text-left">Edad</th>
              <th className="py-4 px-6 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  No hay usuarios registrados
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">{user.id}</td>
                  <td className="py-4 px-6">{user.nombre}</td>
                  <td className="py-4 px-6">{user.email}</td>
                  <td className="py-4 px-6">{user.edad}</td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => onEdit(user)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-green-600 transition-colors text-sm font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete(user.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
