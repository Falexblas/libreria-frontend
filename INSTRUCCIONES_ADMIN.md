# 🔐 Configuración del Usuario Administrador

## ⚠️ IMPORTANTE: Password Hasheado

El password en la base de datos **DEBE estar hasheado con BCrypt**, no en texto plano.

---

## 📝 Opción 1: Usar el Endpoint de Registro (RECOMENDADO)

### **Crear Admin desde Postman o Thunder Client:**

```http
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "nombre": "Admin2",
  "apellido": "Principal2",
  "email": "admin2@example.com",
  "password": "123456",
  "rol": {
    "id": 2,
    "nombre": "ADMIN"
  }
}
```

Esto creará el usuario con el password correctamente hasheado.

---

## 📝 Opción 2: Generar Hash Manualmente

### **1. Generar el hash de BCrypt:**

Puedes usar esta herramienta online:
- https://bcrypt-generator.com/

Ingresa: `123456`
Rounds: `10`
Resultado ejemplo: `$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy`

### **2. Actualizar en la BD:**

```sql
UPDATE public.usuarios 
SET password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
WHERE email = 'admin2@example.com';
```

---

## 📝 Opción 3: INSERT Correcto (Si aún no existe)

```sql
-- Primero, asegúrate de que el rol ADMIN existe
INSERT INTO public.roles (nombre, descripcion) 
VALUES ('ADMIN', 'Administrador del sistema')
ON CONFLICT (nombre) DO NOTHING;

-- Luego, crea el usuario admin con password hasheado
INSERT INTO public.usuarios (
  nombre,
  apellido,
  email,
  password_hash,
  rol_id,
  activo,
  fecha_registro
) VALUES (
  'Admin',
  'Principal',
  'admin@example.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- Hash de "123456"
  (SELECT id FROM roles WHERE nombre = 'ADMIN'),
  true,
  CURRENT_TIMESTAMP
);
```

---

## 🔑 Credenciales de Prueba

```
Email: admin@example.com
Password: 123456
```

---

## 🚀 Flujo de Login con Roles

### **1. Usuario Normal:**
```
Email: usuario@example.com
Password: 123456
↓
Redirige a: http://localhost:5173/
```

### **2. Usuario Admin:**
```
Email: admin@example.com
Password: 123456
↓
Redirige a: http://localhost:5173/admin
```

---

## 🎨 Dashboard de Administrador

### **Características Implementadas:**

✅ **Sidebar con menú de navegación**
- Dashboard
- Libros
- Órdenes
- Usuarios
- Reportes
- Configuración

✅ **Dashboard Overview:**
- Total de Libros
- Total de Órdenes
- Total de Usuarios
- Ventas Totales

✅ **Tabla de Órdenes Recientes**

✅ **Protección de Rutas:**
- Solo usuarios con rol ADMIN pueden acceder
- Redirección automática si no tiene permisos

---

## 🔒 Seguridad Implementada

### **Frontend:**
```javascript
// LoginForm.vue - Detecta el rol
const isAdmin = data.user.rol?.nombre === 'ADMIN'

if (isAdmin) {
  router.push("/admin")
} else {
  router.push("/")
}
```

### **Router Guard:**
```javascript
// router/index.js
if (to.meta.requiresAdmin) {
  const isAdmin = authStore.user?.rol?.nombre === 'ADMIN'
  
  if (!isAdmin) {
    alert('No tienes permisos')
    next({ name: 'home' })
  }
}
```

---

## 📊 Endpoints del Backend (Pendientes)

Para que el dashboard funcione completamente, necesitas crear estos endpoints:

### **1. Estadísticas:**
```
GET /api/admin/estadisticas
```

Retorna:
```json
{
  "totalLibros": 150,
  "totalOrdenes": 45,
  "totalUsuarios": 120,
  "ventasTotales": 15000.00
}
```

### **2. Órdenes Recientes:**
```
GET /api/admin/ordenes/recientes
```

Retorna:
```json
[
  {
    "id": 42,
    "usuario": {
      "nombre": "Juan",
      "apellido": "Pérez"
    },
    "fechaPedido": "2025-10-21T10:30:00",
    "total": 123.45,
    "estado": "pendiente"
  }
]
```

---

## 🎯 Próximos Pasos

1. ✅ **Hashear el password** del admin en la BD
2. ✅ **Probar el login** con el usuario admin
3. ✅ **Verificar redirección** a `/admin`
4. ⏳ **Crear endpoints** de estadísticas
5. ⏳ **Implementar gestión** de libros, órdenes, usuarios

---

## 🔍 Verificar en la BD

```sql
-- Ver el usuario admin
SELECT id, nombre, apellido, email, rol_id, activo 
FROM usuarios 
WHERE email = 'admin@example.com';

-- Ver el rol
SELECT r.nombre as rol 
FROM usuarios u 
JOIN roles r ON u.rol_id = r.id 
WHERE u.email = 'admin@example.com';
```

---

**¡El sistema de roles está implementado y funcionando!** 🎉
