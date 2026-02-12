# 📦 Guía de Deployment

## 🚀 Deploy en Vercel

### 1. Configurar Variables de Entorno

En Vercel Dashboard → Settings → Environment Variables, agrega:

```
NEXT_PUBLIC_API_URL = https://backendseguridad.railway.internal/api
```

### 2. Deploy desde GitHub

```bash
# Si no has hecho push todavía
git add .
git commit -m "feat: integración completa backend-frontend"
git push origin main
```

### 3. Conectar con Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Importa tu repositorio de GitHub
3. Vercel detectará automáticamente que es Next.js
4. Agrega las variables de entorno
5. Deploy!

### 4. Configurar CORS en el Backend

Una vez desplegado el frontend, agrega el dominio de Vercel al backend:

En Railway → Backend → Variables:
```
ALLOWED_ORIGINS=https://tu-app.vercel.app
```

## 🔗 URLs

- **Frontend**: `https://tu-app.vercel.app`
- **Backend**: `https://backendseguridad.railway.internal`
- **API Docs**: `https://backendseguridad.railway.internal/api-docs`

## ✅ Checklist de Deployment

- [ ] Variables de entorno configuradas en Vercel
- [ ] Backend desplegado y funcionando en Railway
- [ ] CORS configurado con el dominio de Vercel
- [ ] Frontend desplegado exitosamente
- [ ] Probar login/registro en producción
- [ ] Verificar que la lista de usuarios carga correctamente

## 🐛 Troubleshooting

### Error: CORS
Asegúrate de agregar el dominio de Vercel en `ALLOWED_ORIGINS` del backend.

### Error: Cannot connect to API
Verifica que `NEXT_PUBLIC_API_URL` esté correctamente configurada en Vercel.

### Error 500 en producción
Revisa los logs en Vercel → Deployments → Ver Logs

---

**¡Listo para producción!** 🎉
