# ⚠️ IMPORTANTE: URL del Backend

## 🌐 URLs de Railway

Railway proporciona dos tipos de URLs:

### 1. URL Interna (Private Networking)
```
backendseguridad.railway.internal
```
- ✅ Solo funciona dentro de la red privada de Railway
- ✅ Para comunicación entre servicios de Railway
- ❌ NO funciona desde fuera de Railway (frontend en Vercel)

### 2. URL Pública (Recomendada)
```
https://backendseguridad.up.railway.app
```
o similar, dependiendo de tu configuración.

- ✅ Funciona desde cualquier lugar
- ✅ Necesaria para frontend en Vercel
- ✅ Accesible públicamente

## 🔧 Cómo Obtener la URL Pública

### Opción 1: Panel de Railway
1. Ve a [railway.app](https://railway.app)
2. Selecciona tu proyecto "backendseguridad"
3. Ve a la pestaña "Settings"
4. En "Domains" verás:
   - **Public Domain**: Esta es tu URL pública (ej: `backendseguridad.up.railway.app`)
   - **Private Network**: Esta es la URL interna (`.railway.internal`)

### Opción 2: Generar un Dominio Público
Si no tienes dominio público:
1. Railway → Settings → Networking
2. Click en "Generate Domain"
3. Railway creará automáticamente: `algo.up.railway.app`

## 📝 Actualizar la Configuración

### En Local (`.env.local`):
```env
# Reemplaza con tu URL pública de Railway
NEXT_PUBLIC_API_URL=https://backendseguridad.up.railway.app/api
```

### En Vercel (Environment Variables):
```
NEXT_PUBLIC_API_URL=https://backendseguridad.up.railway.app/api
```

### En Railway Backend (ALLOWED_ORIGINS):
```
ALLOWED_ORIGINS=http://localhost:3000,https://tu-app.vercel.app
```

## ✅ Verificar que Funciona

Prueba en tu navegador:
```
https://tu-url-de-railway.up.railway.app/api/health
```

Deberías ver una respuesta como:
```json
{
  "status": "OK",
  "timestamp": "..."
}
```

## 🚨 Si Ya Desplegaste con URL Incorrecta

### 1. Actualiza `.env.local`
```bash
# Edita el archivo
code .env.local

# Cambia la URL de .railway.internal a .up.railway.app
NEXT_PUBLIC_API_URL=https://backendseguridad.up.railway.app/api
```

### 2. Reinicia el servidor local
```bash
# Detén el servidor (Ctrl+C)
# Vuelve a iniciar
npm run dev
```

### 3. Actualiza en Vercel
1. Vercel Dashboard → Settings → Environment Variables
2. Edita `NEXT_PUBLIC_API_URL`
3. Usa la URL pública: `https://backendseguridad.up.railway.app/api`
4. Redeploy desde Vercel Dashboard

## 📌 Resumen

| Contexto | URL a Usar |
|----------|------------|
| Frontend en Vercel | URL Pública (`.up.railway.app`) |
| Frontend Local | URL Pública (`.up.railway.app`) |
| Servicio dentro de Railway | URL Interna (`.railway.internal`) |
| Documentación API | URL Pública + `/api-docs` |

---

**Nota**: La URL `.railway.internal` solo sirve para comunicación entre servicios dentro de Railway. Para todo lo demás, usa la URL pública `.up.railway.app`
