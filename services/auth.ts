// Servicio de autenticación
import { fetchApi, setToken, removeToken } from '@/lib/api';
import type { AuthUser, RegisterData, LoginData, ChangePasswordData, User } from '@/types/api';

export const authService = {
  // Registrar nuevo usuario
  async register(data: RegisterData): Promise<AuthUser> {
    const response = await fetchApi<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.data?.token) {
      setToken(response.data.token);
    }

    return response.data as AuthUser;
  },

  // Iniciar sesión
  async login(data: LoginData): Promise<AuthUser> {
    const response = await fetchApi<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.data?.token) {
      setToken(response.data.token);
    }

    return response.data as AuthUser;
  },

  // Obtener perfil del usuario actual
  async getProfile(): Promise<User> {
    const response = await fetchApi<{ user: User }>('/auth/me');
    return response.data!.user;
  },

  // Cerrar sesión
  async logout(): Promise<void> {
    try {
      await fetchApi('/auth/logout', {
        method: 'POST',
      });
    } finally {
      removeToken();
    }
  },

  // Cambiar contraseña
  async changePassword(data: ChangePasswordData): Promise<void> {
    await fetchApi('/auth/change-password', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false;
  },
};
