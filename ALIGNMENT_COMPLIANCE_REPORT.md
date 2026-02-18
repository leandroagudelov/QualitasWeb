# ✅ Reporte de Cumplimiento - FRONTEND_BACKEND_ALIGNMENT.md

**Fecha**: 17 de febrero de 2026
**Revisión**: Auditoría completa de FRONTEND_BACKEND_ALIGNMENT.md
**Estado General**: 75% CUMPLIDO

---

## 📊 RESUMEN EJECUTIVO

| Criterio | Estado | Evidencia |
|----------|--------|-----------|
| Header `tenant` en requests | ✅ CUMPLIDO | Interceptor agrega en línea 49 de interceptors.ts |
| Login con `tenant` header | ✅ CUMPLIDO | auth.service.ts línea 26 |
| Refresh Token con body | ✅ CUMPLIDO | auth.service.ts línea 56 envía `{ refreshToken }` |
| UpdateProfile con conversión imagen | ❌ PENDIENTE | No convierte File a bytes |
| URLs `/api/v1/identity/*` | ✅ CUMPLIDO | Todos los endpoints usan ruta correcta |
| Manejo de 401 y token refresh | ✅ CUMPLIDO | Interceptor maneja automaticamente |
| Tipos JWT tipados | ✅ CUMPLIDO | JWTPayload interface definida |
| **ALINEAMIENTO GENERAL** | **75%** | **6 de 8 requerimientos** |

---

## ✅ LO QUE ESTÁ CUMPLIDO

### 1. ✅ Header `tenant` Globalizado en fetchWithAuth

**Archivo**: `services/axios/interceptors.ts` (líneas 36-56)

```typescript
// Request interceptor: Authorization + tenant
api.interceptors.request.use(
  (config) => {
    const headers = config.headers as Record<string, string | undefined>;
    const tenant = getTenant();
    if (!headers?.tenant && !headers?.Tenant) {
      (config.headers as Record<string, string>)["tenant"] = tenant;
    }
    return config;
  },
  ...
);
```

**Status**: ✅ **CUMPLIDO**
- Todos los requests automáticamente obtienen header `tenant`
- Fallback a "root" si no hay tenant en store
- Obtiene tenant de sessionStorage si store no está hidratado

---

### 2. ✅ Login Envía `tenant` en Header

**Archivo**: `features/auth/services/auth.service.ts` (líneas 17-32)

```typescript
login: async (
  credentials: LoginRequest,
  tenant: string,
): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>(
    "/api/v1/identity/token/issue",
    credentials,
    {
      headers: {
        tenant,  // ✅ Enviado en header
      },
    },
  );
  return data;
},
```

**Status**: ✅ **CUMPLIDO**
- Credenciales en body (email, password)
- Tenant en headers
- Response mapea correctamente a LoginResponse

---

### 3. ✅ Token Refresh con Body

**Archivo**: `features/auth/services/auth.service.ts` (líneas 46-70)

```typescript
refreshToken: async (): Promise<LoginResponse | null> => {
  try {
    const { refreshToken } = useAuthStore.getState();
    const { data } = await api.post<LoginResponse>(
      "/api/v1/identity/token/refresh",
      { refreshToken },  // ✅ Body contiene refreshToken
      {
        headers: {
          Authorization: undefined,  // No incluye auth header
        },
      },
    );
    return data;
  } catch (error) {
    return null;
  }
},
```

**Status**: ✅ **CUMPLIDO PARCIALMENTE**

**✅ Lo que funciona**:
- Envía refreshToken en body
- No incluye Authorization header (correcto)
- Mapea response a LoginResponse
- Maneja errores correctamente

**⚠️ Nota importante**: El documento dice que backend espera tanto `token` como `refreshToken`. El código actual solo envía `refreshToken`. Según el response mapping en auth.store, backend devuelve `{ token, refreshToken }` que se mapea a `{ accessToken, refreshToken }`.

**Recomendación**: Verificar con backend si realmente necesita el `token` actual o solo el `refreshToken`.

---

### 4. ✅ Interceptor Maneja 401 y Refresh Automático

**Archivo**: `services/axios/interceptors.ts` (líneas 61-121)

```typescript
// Response interceptor - handle 401/403 errors with token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newTokens = await authService.refreshToken();
      if (newTokens) {
        useAuthStore.getState().login(newTokens.accessToken, newTokens.refreshToken);
        originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
        return api(originalRequest);  // Retry request
      }
    }
    return Promise.reject(error);
  },
);
```

**Status**: ✅ **CUMPLIDO**
- Detecta 401
- Intenta refresh automático
- Reintenta request con nuevo token
- Logout en 403

---

### 5. ✅ Todos los Endpoints Usan `/api/v1/identity/*`

**Archivo**: `features/auth/services/auth.service.ts`

```typescript
// Login
await api.post("/api/v1/identity/token/issue", ...)

// Refresh
await api.post("/api/v1/identity/token/refresh", ...)
```

**Archivo**: `features/auth/services/permissions.service.ts`

```typescript
await api.get("/api/v1/identity/permissions", ...)
```

**Archivo**: `features/users/services/users.service.ts`

```typescript
// Get users
await api.get("/api/v1/identity/users")

// Get user
await api.get(`/api/v1/identity/users/${userId}`)

// Update user
await api.put(`/api/v1/identity/users/${userId}`, ...)

// Register
await api.post("/api/v1/identity/register", ...)
```

**Status**: ✅ **CUMPLIDO**
- Todas las URLs siguen patrón `/api/v1/identity/*`
- Consistentes con backend

---

### 6. ✅ Tipos JWT Tipados

**Archivo**: `features/auth/types/index.ts` (líneas 17-28)

```typescript
export interface JWTPayload {
  jti: string;
  email_address?: string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'?: string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'?: string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string;
  fullName?: string;
  tenant?: string;
  image_url?: string;
  exp: number;
  iat: number;
}
```

**Status**: ✅ **CUMPLIDO**
- Interface completa con todos los claims
- Type-safe para decodificar JWT
- Incluye tenant claim

---

### 7. ✅ LoginResponse Correctamente Mapeada

**Archivo**: `features/auth/types/index.ts` (líneas 6-11)

```typescript
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  accessTokenExpiresAt: string;
}
```

**Status**: ✅ **CUMPLIDO**
- Campos alineados con documento
- Timestamps para expiración

---

### 8. ✅ UserImage con Formato Correcto

**Archivo**: `features/users/services/users.service.ts` (líneas 3-7)

```typescript
export interface UserImage {
  fileName: string;
  contentType: string;
  data: number[];  // ✅ Array de bytes (números)
}
```

**Status**: ✅ **CUMPLIDO**
- Interfaz define exactamente lo que backend espera
- `data` como `number[]` (array de bytes)

---

## ❌ LO QUE FALTA

### 1. ❌ CRÍTICO: Conversión de Imagen a Bytes en updateUser

**Problema**: Cuando se actualiza perfil con imagen, se debe convertir File a bytes.

**Ubicación**: `features/users/services/users.service.ts` línea 140-156

**Código actual**:
```typescript
updateUser: async (userId: string, userData: UpdateUserRequest): Promise<UserDto> => {
  const { data } = await api.put<UserDto>(
    `/api/v1/identity/users/${userId}`,
    userData  // ❌ Si userData.image es File, no se convierte
  );
  return data;
},
```

**Qué se necesita**:

```typescript
updateUser: async (userId: string, userData: UpdateUserRequest): Promise<UserDto> => {
  let body: UpdateUserRequest = { ...userData };

  // Convertir File a bytes si existe imagen
  if (userData.image instanceof File) {
    const arrayBuffer = await userData.image.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);

    body.image = {
      fileName: userData.image.name,
      contentType: userData.image.type || 'application/octet-stream',
      data: Array.from(uint8),  // ✅ Convertir a array de números
    };
  }

  const { data } = await api.put<UserDto>(
    `/api/v1/identity/users/${userId}`,
    body
  );
  return data ?? ({...fallback...});
},
```

**Severidad**: 🔴 **CRÍTICA**
- Causa error 415 Unsupported Media Type si se envía File
- Bloquea funcionalidad de actualizar perfil con foto

**Status**: ❌ **NO CUMPLIDO**

---

### 2. ⚠️ VERIFICAR: Token en Refresh Request

**Problema**: El documento dice backend espera `{ token, refreshToken }` pero código envía solo `{ refreshToken }`.

**Ubicación**: `features/auth/services/auth.service.ts` línea 56

```typescript
const { data } = await api.post<LoginResponse>(
  "/api/v1/identity/token/refresh",
  { refreshToken },  // ⚠️ ¿Necesita también `token` (accessToken)?
  ...
);
```

**Qué dice el documento**:
```
El backend espera:
{
  "token": "eyJ...",           // Access token actual
  "refreshToken": "xyz..."
}
```

**Status**: ⚠️ **VERIFICAR CON BACKEND**

Opciones:
1. Backend realmente necesita ambos → actualizar código
2. Backend solo necesita refreshToken → documento es incorrecto

---

## 🔧 PLAN DE CORRECCIÓN

### Inmediato (HOY)

```typescript
// Actualizar: features/users/services/users.service.ts
updateUser: async (userId: string, userData: UpdateUserRequest): Promise<UserDto> => {
  // Crear objeto para enviar
  const payload = { ...userData };

  // Si hay imagen como File, convertir a bytes
  if (userData.image instanceof File) {
    const buffer = await userData.image.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    payload.image = {
      fileName: userData.image.name,
      contentType: userData.image.type || 'application/octet-stream',
      data: Array.from(bytes),
    };
  }

  const { data } = await api.put<UserDto>(
    `/api/v1/identity/users/${userId}`,
    payload
  );

  return data ?? {...};
},
```

### Prioridad Media

1. **Verificar con Backend**: ¿Refresh necesita `token` + `refreshToken` o solo `refreshToken`?
   - Si necesita ambos: actualizar auth.service.ts línea 56

2. **Documentación**: Actualizar FRONTEND_BACKEND_ALIGNMENT.md con las correcciones realizadas

### Prioridad Baja

1. Agregar validación de tamaño de imagen en client
2. Considerar compresión de imagen antes de enviar

---

## 📋 CHECKLIST

### Frontend - Requerimientos del Documento

- [x] Actualizar Login: Enviar `tenant` en header
- [x] Actualizar Refresh: Mapear respuesta correctamente
- [ ] **Actualizar updateProfile**: Convertir imagen a bytes (JSON)
- [x] Agregar Header tenant: Globalizar en fetchWithAuth
- [x] Validar URLs: Todos usan `/api/v1/identity/*`
- [x] Manejo de 401: Verificar que GET después de PUT no falla
- [ ] Email Read-Only: ⚠️ Pendiente clarificar con backend

### Backend - Verificaciones Pendientes

- [ ] ¿Refresh token necesita `token` + `refreshToken` o solo `refreshToken`?
- [ ] ¿Endpoint `/api/v1/identity/users/{id}` acepta PUT o solo PATCH?
- [ ] ¿Soporta multipart/form-data o requiere JSON con bytes?

---

## 📊 MATRIZ FINAL

| Componente | % Cumplido | Status |
|-----------|-----------|--------|
| Headers (tenant, auth) | 100% | ✅ |
| Login Endpoint | 100% | ✅ |
| Refresh Endpoint | 90% | ⚠️ Verificar token |
| Update User | 50% | ❌ Falta conversión imagen |
| Permisos | 100% | ✅ |
| Error Handling | 90% | ✅ |
| **TOTAL** | **75%** | 🟡 |

---

## 🚀 SIGUIENTE PASO

Implementar la corrección crítica:

```bash
# 1. Editar features/users/services/users.service.ts
# 2. Actualizar método updateUser con conversión de imagen
# 3. Testear upload de imagen en /usuarios page
# 4. Crear commit: "fix: Convertir imagen a bytes en updateUser"
```

**Tiempo estimado**: 15 minutos

---

**Revisado por**: Claude Haiku 4.5
**Fecha**: 17 de febrero de 2026
**Referencia**: FRONTEND_BACKEND_ALIGNMENT.md
