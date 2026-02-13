# Investigación de Vulnerabilidades - CRUD con Next.js

## Tecnologías Utilizadas
- **Next.js 16.1.6** (Framework React)
- **React 19** (Biblioteca de UI)
- **TypeScript** (Lenguaje tipado)
- **Tailwind CSS** (Framework de estilos)
- **Express + SQLite** (Backend)

---

## 🔴 Vulnerabilidades Identificadas

### 1. **XSS (Cross-Site Scripting)**

#### Descripción
Inyección de código malicioso (JavaScript) en campos de entrada que se renderizan en el navegador.

#### Vectores de Ataque en Nuestro Proyecto
- Campos de formulario: `nombre`, `email`, `edad`
- Datos mostrados en la tabla sin sanitización adecuada
- Modal de edición

#### Ejemplos de Payloads XSS
```html
<script>alert('XSS Vulnerability')</script>
<img src=x onerror=alert('XSS')>
<svg/onload=alert('XSS')>
<iframe src="javascript:alert('XSS')">
<body onload=alert('XSS')>
```

#### Prueba
Ingresar en el campo "nombre":
```
<img src=x onerror=alert(document.cookie)>
```

#### Mitigación
- React automáticamente escapa el contenido con `{}`, pero NO con `dangerouslySetInnerHTML`
- Usar bibliotecas como `DOMPurify` para sanitizar entrada
- Implementar CSP (Content Security Policy)

---

### 2. **SQL Injection**

#### Descripción
Inyección de código SQL malicioso en campos de entrada para manipular la base de datos.

#### Vectores de Ataque
- Campos `nombre`, `email`, `edad` si no están sanitizados en el backend
- Parámetros de URL para editar/eliminar usuarios

#### Ejemplos de Payloads
```sql
' OR '1'='1
'; DROP TABLE usuarios; --
admin'--
' UNION SELECT * FROM usuarios--
1' AND 1=1--
```

#### Prueba
Ingresar en campo edad:
```
1' OR '1'='1
```

#### Mitigación Actual
- El backend usa `express-validator` y consultas preparadas con SQLite
- Sin embargo, siempre validar y sanitizar en ambos lados (cliente y servidor)

---

### 3. **CSRF (Cross-Site Request Forgery)**

#### Descripción
Un atacante puede hacer que un usuario autenticado ejecute acciones no deseadas.

#### Vectores de Ataque
- Formularios POST sin tokens CSRF
- Operaciones DELETE sin confirmación adicional
- Ausencia de validación de origen de peticiones

#### Ejemplo de Ataque
```html
<form action="http://localhost:3000/api/usuarios/1" method="DELETE">
  <input type="submit" value="Ganar premio">
</form>
```

#### Mitigación
- Implementar tokens CSRF
- Validar header `Referer` o `Origin`
- Usar SameSite cookies
- Implementar autenticación con tokens JWT

---

### 4. **Ausencia de Autenticación y Autorización**

#### Descripción
Cualquier persona puede acceder y modificar los datos sin autenticarse.

#### Riesgos
- Usuarios no autorizados pueden crear/editar/eliminar registros
- No hay control de sesiones
- No hay roles ni permisos

#### Mitigación
- Implementar NextAuth.js o similar
- Usar JWT para autenticación
- Implementar middleware de autorización
- Validar permisos en cada endpoint

---

### 5. **Exposición de Información Sensible**

#### Descripción
Datos sensibles expuestos en el frontend o en mensajes de error.

#### Vectores de Ataque
- Mensajes de error detallados que revelan estructura de BD
- Emails visibles públicamente
- IDs predecibles (secuenciales)
- Configuración visible en código fuente

#### Ejemplo
```javascript
// Mensaje de error que expone información
Error: SQLITE_ERROR: no such table usuarios
```

#### Mitigación
- Usar UUIDs en lugar de IDs secuenciales
- Mensajes de error genéricos en producción
- No exponer información sensible en el frontend
- Encriptar datos sensibles

---

### 6. **Validación Insuficiente del Lado del Servidor**

#### Descripción
El proyecto valida en el cliente pero puede ser bypasseada.

#### Riesgos
- Modificar peticiones con herramientas como Burp Suite o Postman
- Enviar datos que no cumplen las validaciones del cliente

#### Ejemplo de Ataque
```javascript
// Bypass usando fetch directamente
fetch('http://localhost:3000/api/usuarios', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    nombre: 'A'.repeat(10000), // Nombre muy largo
    email: 'invalido',
    edad: -999
  })
})
```

#### Mitigación Actual
- El backend tiene `express-validator`
- Implementar rate limiting (ya existe con `express-rate-limit`)
- Validar SIEMPRE en el servidor

---

### 7. **CORS Misconfiguration**

#### Descripción
Configuración incorrecta de CORS que permite peticiones desde cualquier origen.

#### Riesgo Actual
- Si se configura CORS con `origin: '*'`, cualquier sitio puede hacer peticiones

#### Mitigación Actual
```javascript
// En server.js está configurado correctamente:
app.use(cors({
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
}))
```

---

### 8. **Dependency Vulnerabilities**

#### Descripción
Vulnerabilidades en paquetes de npm utilizados.

#### Verificación
```bash
npm audit
```

#### Mitigación
- Ejecutar `npm audit fix` regularmente
- Mantener dependencias actualizadas
- Usar herramientas como Snyk o Dependabot
- Revisar periódicamente CVEs

---

### 9. **Rate Limiting Insuficiente**

#### Descripción
Sin límites adecuados, un atacante puede hacer DoS (Denial of Service).

#### Mitigación Actual
El backend tiene:
```javascript
// Rate limiting general
max: 100 requests por 15 minutos

// Rate limiting para escritura
max: 20 requests por 15 minutos
```

#### Mejoras
- Implementar CAPTCHA para formularios
- Límites más estrictos por IP
- Implementar ban temporal para IPs abusivas

---

### 10. **Client-Side Storage Vulnerabilities**

#### Descripción
Uso inseguro de localStorage o sessionStorage para datos sensibles.

#### Riesgos
- XSS puede acceder a localStorage
- Datos no encriptados
- Persistencia indefinida

#### Mitigación
- No almacenar tokens de sesión en localStorage
- Usar httpOnly cookies para tokens
- Encriptar datos sensibles antes de almacenar

---

## 🔐 Recomendaciones de Seguridad

### Implementaciones Prioritarias

1. **Autenticación y Autorización**
   - NextAuth.js con estrategia JWT
   - Middleware de protección de rutas
   - Roles y permisos

2. **Content Security Policy (CSP)**
```javascript
// En next.config.ts
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data:;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`
```

3. **Sanitización de Entrada**
```bash
npm install dompurify isomorphic-dompurify
```

4. **HTTPS en Producción**
   - Certificados SSL/TLS
   - HSTS headers
   - Secure cookies

5. **Logging y Monitoreo**
   - Registrar intentos de ataque
   - Alertas de actividad sospechosa
   - Análisis de logs

---

## 🧪 Herramientas para Probar Vulnerabilidades

1. **OWASP ZAP** - Scanner de vulnerabilidades web
2. **Burp Suite** - Proxy para interceptar peticiones
3. **SQLMap** - Herramienta de SQL injection
4. **XSSer** - Herramienta de XSS
5. **Postman** - Pruebas de API
6. **npm audit** - Análisis de dependencias

---

## 📚 Referencias

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/deploying/production-checklist#security)
- [React Security Best Practices](https://react.dev/learn/security)
- [CWE - Common Weakness Enumeration](https://cwe.mitre.org/)

---

## ✅ Estado de Seguridad del Proyecto

| Vulnerabilidad | Presente | Mitigada | Notas |
|----------------|----------|----------|-------|
| XSS | ⚠️ Parcial | ✅ | React escapa por defecto |
| SQL Injection | ⚠️ Posible | ✅ | Backend usa consultas preparadas |
| CSRF | ❌ Sí | ❌ | Sin tokens CSRF |
| Auth/Authz | ❌ Sí | ❌ | Sin autenticación |
| Rate Limiting | ⚠️ Parcial | ✅ | Implementado en backend |
| CORS | ✅ | ✅ | Configurado correctamente |
| Input Validation | ⚠️ Parcial | ⚠️ | Cliente + servidor |
| HTTPS | ❌ | ⚠️ | Solo en producción |

---

**Fecha de Investigación:** 12 de febrero de 2026  
**Equipo:** [Tus nombres]  
**Proyecto:** CRUD con Next.js - Actividad de Seguridad
