# Changelog

Registro de cambios relevantes del Sistema de Gestión de Becas ULEAM.

## [Etapa 3] — Autorización, calidad y documentación

### Añadido
- **Roles y autorización:** roles `student`, `reviewer` y `admin`, decorador `@Roles()` y `RolesGuard`; regla de propiedad en solicitudes (`createdByUserId`); rutas de administración `GET /users` y `PATCH /users/:id/role`.
- **Seguridad:** CORS por entorno (`CORS_ORIGINS`), límite de solicitudes con `@nestjs/throttler` (60/min global, 5/min en login).
- **Manejo transversal:** `HttpErrorFilter` (formato uniforme de error), `RequestLoggerMiddleware`, `TimingInterceptor` (`X-Response-Time`) y `ValidationPipe` global.
- **Arquitectura:** `UpdateApplicationUseCase` con puerto `ApplicationRepository` y adaptador TypeORM.
- **`src/app.setup.ts`:** configuración transversal compartida por `main.ts` y las pruebas E2E.
- **Swagger / OpenAPI** (`src/swagger.setup.ts`): `/api/docs` y `/api/docs-json`, autenticación Bearer, DTOs y entidades con ejemplos, parámetros de consulta y respuestas de error (`@ApiErrorResponses`).
- **Pruebas E2E con Jest y Supertest** (35 casos, `npm run test:e2e`) sobre la base `_test`, que se crea y se recrea con las migraciones reales en cada archivo de prueba.
- **Migración de las pruebas de Vitest a Jest** (commit `1cbd9de`): `jest.config.mjs`, `jest-e2e.config.mjs` y `tsconfig.jest.json`.
- Migración `AddRolesAndApplicationOwner`.

### Corregido (observaciones resueltas)
- Correo duplicado de estudiantes: ahora responde `409 Conflict` (antes, error interno).
- Eliminar un estudiante o una beca con solicitudes: responde `409 Conflict`; se conserva `ON DELETE RESTRICT`.
- `PATCH /applications/:id` ya no permite cambiar `studentId` ni `scholarshipId`.
- `POST /auth/login` devuelve `accessToken` y `user` (`id`, `email`, `role`), sin contraseña ni hash.

### Cambiado
- Los DTOs de actualización usan `PartialType`/`OmitType` de `@nestjs/swagger` (en lugar de `@nestjs/mapped-types`) para heredar la documentación.
- `main.ts` delega la configuración en `configureApp` y `setupSwagger`.
- `ThrottlerModule` admite `THROTTLE_DISABLED=true` (solo pruebas E2E).

## [Etapa 2] — Modelo relacional, consultas y autenticación
Relaciones, filtros, paginación, ordenamiento, migraciones, registro y login con JWT.

## [Etapa 1] — Fundamentos
CRUD de estudiantes, becas, solicitudes, documentos y seguimiento con validación y PostgreSQL.
