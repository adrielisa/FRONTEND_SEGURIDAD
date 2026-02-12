# 🚀 Integración Backend-Frontend Completa

## ✅ Configuración Realizada

### 📁 Estructura de Archivos Creados

```
├── .env.local                      # Variables de entorno
├── lib/
│   └── api.ts                      # Configuración de API y fetch helper
├── types/
│   └── api.ts                      # Tipos TypeScript para la API
├── services/
│   ├── auth.ts                     # Servicio de autenticación
│   └── users.ts                    # Servicio de usuarios
├── hooks/
│   └── useAuth.tsx                 # Hook de autenticación con Context
└── components/
    ├── LoginForm.tsx               # Formulario de login
    └── RegisterForm.tsx            # Formulario de registro
```

### 🔧 Configuración de la API

**Backend URL**: `https://backendseguridad.railway.internal/api`

Configurado en `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://backendseguridad.railway.internal/api
```

### 🔐 Sistema de Autenticación

#### Características Implementadas:
- ✅ Login con email y contraseña
- ✅ Registro de nuevos usuarios
- ✅ Validación de contraseñas (8+ caracteres, mayúsculas, minúsculas, números y caracteres especiales)
- ✅ JWT Token guardado en localStorage
- ✅ Context API para gestión global del estado de autenticación
- ✅ Protección de rutas (solo usuarios autenticados)
- ✅ Cierre de sesión

#### Hook useAuth:
```typescript
const { user, loading, login, register, logout, isAuthenticated } = useAuth()
```

### 👥 Gestión de Usuarios

#### Funcionalidades Implementadas:
- ✅ Listar usuarios con paginación
- ✅ Búsqueda de usuarios
- ✅ Ver información detallada (nombre, email, edad, rol, estado)
- ✅ Activar/Desactivar usuarios (solo admin)
- ✅ Eliminar usuarios (solo admin)
- ✅ Indicadores visuales de rol (user/admin)
- ✅ Indicadores de estado (activo/inactivo)

#### Servicio usersService:
```typescript
// Listar usuarios
const response = await usersService.getUsers({ 
  page: 1, 
  limit: 10, 
  search: 'texto',
  sort: '-createdAt'
})

// Eliminar usuario
await usersService.deleteUser(id)

// Cambiar estado
await usersService.activateUser(id)
await usersService.deactivateUser(id)

// Cambiar rol
await usersService.changeUserRole(id, 'admin')

// Estadísticas
const stats = await usersService.getStats()
```

### 📡 Endpoints de la API

#### Autenticación
```
POST   /api/auth/register          - Registro
POST   /api/auth/login             - Login
GET    /api/auth/me                - Obtener perfil
POST   /api/auth/logout            - Cerrar sesión
PATCH  /api/auth/change-password   - Cambiar contraseña
```

#### Usuarios
```
GET    /api/users                  - Listar usuarios (paginado)
GET    /api/users/:id              - Obtener usuario por ID
PATCH  /api/users/:id              - Actualizar usuario
DELETE /api/users/:id              - Eliminar usuario
PATCH  /api/users/:id/role         - Cambiar rol (admin)
PATCH  /api/users/:id/activate     - Activar usuario (admin)
PATCH  /api/users/:id/deactivate   - Desactivar usuario (admin)
GET    /api/users/stats            - Estadísticas (admin)
```

### 🎨 UI/UX

- Diseño con Tailwind CSS
- Formularios con validación en tiempo real
- Alertas para feedback del usuario
- Paginación de usuarios
- Buscador en tiempo real
- Estados de carga
- Indicadores visuales de rol y estado
- Diseño responsive

### 🔒 Seguridad

- ✅ Tokens JWT en headers Authorization
- ✅ Validación de contraseñas seguras
- ✅ Manejo de errores seguro
- ✅ Protección de rutas
- ✅ Control de permisos por rol

### 🚀 Cómo Usar

#### 1. Configurar variables de entorno
```bash
# Copiar archivo de ejemplo
cp .env.example .env.local

# Editar .env.local con la URL correcta del backend
NEXT_PUBLIC_API_URL=https://tu-backend.railway.internal/api
```

#### 2. Instalar dependencias
```bash
npm install
```

#### 3. Ejecutar en desarrollo
```bash
npm run dev
```

#### 4. Compilar para producción
```bash
npm run build
npm start
```

### 📝 Uso del Sistema

1. **Primera vez**: Crea una cuenta con el formulario de registro
2. **Login**: Inicia sesión con tu email y contraseña
3. **Dashboard**: Verás la lista de usuarios del sistema
4. **Búsqueda**: Usa el buscador para filtrar usuarios
5. **Administración**: Si eres admin, puedes activar/desactivar y eliminar usuarios
6. **Logout**: Cierra sesión desde el botón en el header

### 🎯 Próximas Mejoras Sugeridas

- [ ] Editar perfil de usuario
- [ ] Cambiar contraseña desde el perfil
- [ ] Dashboard con estadísticas (gráficas)
- [ ] Crear nuevos usuarios desde el admin
- [ ] Filtros avanzados (por rol, estado, fecha)
- [ ] Exportar lista de usuarios
- [ ] Logs de actividad
- [ ] Recuperación de contraseña

### 🐛 Solución de Problemas

#### Error: "Cannot connect to API"
- Verifica que la URL en `.env.local` sea correcta
- Asegúrate que el backend esté desplegado y funcionando
- Verifica que CORS esté configurado en el backend

#### Error: "Unauthorized"
- El token puede haber expirado
- Cierra sesión y vuelve a iniciar sesión
- Verifica que el token se esté enviando en los headers

#### Error: "Forbidden"
- No tienes permisos para esa acción
- Algunas acciones requieren rol de admin

### 📚 Documentación de la API

Documentación completa Swagger disponible en:
`https://backendseguridad.railway.internal/api-docs`

---

**Desarrollado con Next.js 16 + TypeScript + Tailwind CSS**
