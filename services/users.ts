// Servicio de usuarios
import { fetchApi } from '@/lib/api';
import type { User, UpdateUserData, UserStats, PaginationParams } from '@/types/api';

export const usersService = {
  // Listar usuarios con paginación
  async getUsers(params: PaginationParams = {}) {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.sort) searchParams.append('sort', params.sort);

    const query = searchParams.toString();
    const endpoint = `/users${query ? `?${query}` : ''}`;

    return await fetchApi<{ users: User[] }>(endpoint);
  },

  // Obtener usuario por ID
  async getUserById(id: string): Promise<User> {
    const response = await fetchApi<{ user: User }>(`/users/${id}`);
    return response.data!.user;
  },

  // Actualizar usuario
  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    const response = await fetchApi<{ user: User }>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return response.data!.user;
  },

  // Eliminar usuario
  async deleteUser(id: string): Promise<void> {
    await fetchApi(`/users/${id}`, {
      method: 'DELETE',
    });
  },

  // Cambiar rol de usuario (solo admin)
  async changeUserRole(id: string, role: 'user' | 'admin'): Promise<User> {
    const response = await fetchApi<{ user: User }>(`/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
    return response.data!.user;
  },

  // Activar usuario (solo admin)
  async activateUser(id: string): Promise<User> {
    const response = await fetchApi<{ user: User }>(`/users/${id}/activate`, {
      method: 'PATCH',
    });
    return response.data!.user;
  },

  // Desactivar usuario (solo admin)
  async deactivateUser(id: string): Promise<User> {
    const response = await fetchApi<{ user: User }>(`/users/${id}/deactivate`, {
      method: 'PATCH',
    });
    return response.data!.user;
  },

  // Obtener estadísticas (solo admin)
  async getStats(): Promise<UserStats> {
    const response = await fetchApi<UserStats>('/users/stats');
    return response.data as UserStats;
  },
};
