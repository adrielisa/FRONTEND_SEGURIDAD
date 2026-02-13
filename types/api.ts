// Tipos de datos de la API

export interface User {
  _id: string;
  id?: string;
  nombre: string;
  email: string;
  edad?: number;
  role: 'user' | 'admin';
  activo: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  user: User;
  token: string;
}

export interface RegisterData {
  nombre: string;
  email: string;
  password: string;
  edad?: number;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateUserData {
  nombre?: string;
  email?: string;
  edad?: number;
}

export interface UserStats {
  total: number;
  activos: number;
  admins: number;
  nuevosUltimaSemana: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
}
