# Sistema de Registros - Frontend

Sistema público de registros con protección anti-spam y detección de ataques XSS.

**Elaborado por:** Adriel Rodriguez y Sergio Trujillo  
**Asignatura:** Seguridad (IDYGS82)  
**Profesor:** Luis Villafaña

## 🚀 Tecnologías

- **Next.js 16.1.6** - React Framework con App Router
- **React 19** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Tailwind CSS 4** - Framework de estilos
- **React Hot Toast** - Notificaciones elegantes
- **DOMPurify** - Sanitización de HTML/XSS

## 📁 Estructura del Proyecto

```
CRUD_SEGURIDAD/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Página principal (CRUD)
│   ├── layout.tsx           # Layout global
│   ├── globals.css          # Estilos globales
│   └── favicon.ico          # Icono
├── src/                      # Código fuente
│   ├── types/               # Definiciones TypeScript
│   │   └── index.ts         # Entry, CooldownStatus
│   ├── utils/               # Utilidades
│   │   └── security.ts      # Detección XSS, sanitización, validación
│   └── config/              # Configuración
│       └── api.ts           # Endpoints de la API
├── .env.local               # Variables de entorno
├── package.json             # Dependencias
└── README.md                # Este archivo
```

## 🔒 Características de Seguridad

### Detección de Ataques XSS
El sistema detecta automáticamente intentos de ataque XSS antes de enviar datos al backend:

- 18 patrones de detección de XSS
- Bloqueo automático de IP por 5 minutos al detectar ataque
- Notificación visual al usuario

### Sanitización Dual
- **Cliente:** DOMPurify elimina tags HTML y scripts
- **Servidor:** Validación adicional con express-validator

### Validación de Contenido
- Mínimo: 10 caracteres
- Máximo: 50 caracteres
- Validación en tiempo real

### Protección contra Spam
- **Cooldown:** 30 segundos entre registros (por IP)
- **Rate Limiting:** 5 acciones cada 10 segundos
- **Bloqueo temporal:** 5-15 minutos por intentos de ataque

## 🛠️ Instalación

### Requisitos
- Node.js 18+
- npm o pnpm

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/adrielisa/CRUD_SEGURIDAD.git
cd CRUD_SEGURIDAD
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
Crear archivo `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

4. **Iniciar en desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📦 Scripts Disponibles

```bash
npm run dev      # Modo desarrollo
npm run build    # Construir para producción
npm start        # Iniciar producción
npm run lint     # Verificar código
```

## 🔌 API Endpoints

El frontend consume los siguientes endpoints del backend:

- `GET /api/v1/entries` - Listar registros
- `POST /api/v1/entries` - Crear registro
- `PUT /api/v1/entries/:id` - Actualizar registro
- `DELETE /api/v1/entries/:id` - Eliminar registro
- `POST /api/v1/entries/report-attack` - Reportar ataque detectado

## 🧪 Ejemplos de XSS para Probar

El sistema debería bloquear estos intentos:

```html
<script>alert('XSS')</script>
<img src=x onerror=alert('XSS')>
<svg onload=alert('XSS')>
<iframe src=javascript:alert('XSS')>
```

**Nota:** Al detectar estos patrones, se bloqueará tu IP por 5 minutos.

## 🎨 Características UI

- Notificaciones toast en esquina superior derecha
- Indicador visual de cooldown activo
- Contador en tiempo real de bloqueos
- Animaciones suaves con Tailwind
- Diseño responsivo
- Colores semánticos (verde=éxito, amarillo=advertencia, rojo=error)

## 🔧 Configuración API

Edita `src/config/api.ts` para cambiar los endpoints:

```typescript
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

export const API_ENDPOINTS = {
  entries: `${API_URL}/entries`,
  cooldownStatus: `${API_URL}/entries/cooldown/status`,
  reportAttack: `${API_URL}/entries/report-attack`,
} as const
```

## 📝 Tipos TypeScript

Definidos en `src/types/index.ts`:

```typescript
interface Entry {
  id: string
  contenido: string
  createdAt: string
  updatedAt: string
}

interface CooldownStatus {
  active: boolean
  type?: 'cooldown' | 'blocked'
  remainingSeconds: number
  reason?: string
}
```

## 🛡️ Utilidades de Seguridad

En `src/utils/security.ts`:

- `detectXSSAttack(text)` - Detecta patrones de ataque XSS
- `sanitizeInput(text)` - Elimina HTML y scripts
- `validateContentLength(text)` - Valida 10-50 caracteres

## 📚 Dependencias Principales

```json
{
  "dependencies": {
    "next": "^16.1.6",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-hot-toast": "^2.4.1",
    "isomorphic-dompurify": "^2.19.1",
    "tailwindcss": "^4.0.0"
  }
}
```

## 🚀 Despliegue

### Vercel (Recomendado)
```bash
npm i -g vercel
vercel
```

### Build Manual
```bash
npm run build
npm start
```

## 🤝 Colaboradores

- **Adriel Rodriguez** - [@adrielisa](https://github.com/adrielisa)
- **Sergio Trujillo** - Desarrollo y seguridad

## 📄 Licencia

Proyecto educativo para la asignatura de Seguridad - IDYGS82
