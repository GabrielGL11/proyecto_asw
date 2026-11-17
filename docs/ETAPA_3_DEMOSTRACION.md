# Demostración — Avance de Etapa 3 (semanas 9, 10 y 11)

Todas las pruebas se hacen en Thunder Client / Postman contra `http://localhost:5500`.
**No muestres tokens completos ni contraseñas reales en las capturas.**

## 0. Preparación

1. `npm install @nestjs/throttler` (una sola vez) y `npm run migration:run`.
2. `npm run start:dev`.
3. Registra tres cuentas con `POST /auth/register` (`{"email": "...", "password": "Prueba123!"}`):
   `admin@example.com`, `revisor@example.com`, `estudiante1@example.com` y `estudiante2@example.com`.
4. Promueve al administrador en la base de datos:
   `UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';`
5. Inicia sesión como admin y asigna el rol del revisor:
   `PATCH /users/<id_revisor>/role` con `{"role": "reviewer"}` → `200`.
6. Inicia sesión con cada cuenta (`POST /auth/login`) y guarda los tokens `T_admin`, `T_revisor`, `T_est1`, `T_est2`.
7. Con `T_est1` crea una solicitud: `POST /applications` (`studentId`, `scholarshipId`, `gpa`, `income`). Anota su `id`.
   Crea además una beca con `T_admin` si no existe ninguna.

## 1. Semana 9 — JWT

| # | Petición | Resultado esperado |
|---|---|---|
| 1 | `POST /auth/login` correcto | `201` con `accessToken` y `user` (sin hash) |
| 2 | `POST /auth/login` con contraseña incorrecta | `401`, sin token |
| 3 | `GET /auth/me` con Bearer válido | `200` `{id, email, role}` |
| 4 | `GET /auth/me` sin encabezado | `401` |
| 5 | `GET /auth/me` con token alterado (cambia un carácter) | `401` |
| 6 | `POST /applications` sin token | `401` y no se crea nada |
| 7 | `POST /applications` con token y cuerpo inválido | `400` |

## 2. Semana 10 — Autorización y seguridad

**Misma ruta, cinco casos:** `PATCH /applications/<id>` con `{"comment": "Actualizado"}`

| Caso | Token | Código | Por qué |
|---|---|---|---|
| Sin token | — | `401` | No hay identidad |
| Estudiante ajeno | `T_est2` | `403` | Identidad válida, pero no es el propietario |
| Estudiante propietario | `T_est1` | `200` | Es el propietario |
| Revisor | `T_revisor` | `200` | Puede gestionar cualquier solicitud |
| Administrador | `T_admin` | `200` | Puede gestionar cualquier solicitud |

**Ruta exclusiva de administración:** `GET /users`

| Token | Código |
|---|---|
| Sin token | `401` |
| `T_est1` (rol student) | `403` |
| `T_admin` | `200` |

**Otros controles**

| Prueba | Resultado |
|---|---|
| `POST /auth/register` con `"role": "admin"` en el cuerpo | `400` (el rol no se acepta) |
| `PATCH /applications/<id>/status` con `T_est1` | `403` (el solicitante no se aprueba solo) |
| `POST /auth/login` seis veces seguidas (en menos de un minuto) | del sexto intento: `429` |
| CORS permitido: `curl -i -H "Origin: http://localhost:5173" http://localhost:5500/scholarships` | incluye `Access-Control-Allow-Origin: http://localhost:5173` |
| CORS no permitido: mismo comando con `Origin: http://sitio-malo.com` | **sin** encabezado `Access-Control-Allow-Origin` |
| Ruta protegida con CORS permitido y sin token | sigue dando `401` |

HTTPS/TLS: mostrar la sección 19 del README.

## 3. Semana 11 — Arquitectura y componentes transversales (hasta 8 min)

Muestra en `PATCH /applications/...` con `T_est1`:

| Caso | Petición | Código |
|---|---|---|
| Correcta | `PATCH /applications/<id>` | `200` |
| Identificador inválido | `PATCH /applications/abc` | `400` |
| Recurso inexistente | `PATCH /applications/99999` | `404` |
| Prohibida | `PATCH /applications/<id>` con `T_est2` | `403` |

En cada una comprueba que el cuerpo del error tiene `statusCode`, `error`, `message`, `path` y `timestamp`, **sin trazas**.
En la consola del servidor se ve una línea por solicitud (`GET /ruta 200 12ms`) sin cuerpos ni tokens.
El encabezado de la respuesta incluye `X-Response-Time`.

Después señala en el código dónde vive cada cosa:

- **HTTP:** `src/applications/applications.controller.ts`
- **Regla de negocio + propiedad:** `src/applications/use-cases/update-application.use-case.ts`
- **Contrato (puerto):** `src/applications/domain/application.repository.ts`
- **Persistencia (adaptador):** `src/applications/infrastructure/typeorm-application.repository.ts`
- **Transversales:** `src/common/` y `src/main.ts`

## 4. Correcciones de la revisión (409 y PATCH)

| Prueba | Resultado |
|---|---|
| `POST /students` con un correo ya existente | `409` |
| `DELETE /students/<id con solicitudes>` con `T_admin` | `409` |
| `DELETE /scholarships/<id con solicitudes>` con `T_admin` | `409` |
| `PATCH /applications/<id>` con `studentId` en el cuerpo | `400` |
| Solicitud para un estudiante inactivo | `400` |
