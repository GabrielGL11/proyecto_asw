# Evidencias — Entrega 3 (semanas 9, 10 y 11)

Guarda aquí las capturas (sin tokens completos ni contraseñas reales). Pasos y resultados esperados: `docs/ETAPA_3_DEMOSTRACION.md`.

| Archivo sugerido | Qué debe verse |
|---|---|
| `01_migracion_etapa3.png` | `npm run migration:run` aplicando `AddRolesAndApplicationOwner` |
| `02_login_accessToken.png` | Login `201` con `accessToken` y `user` (token recortado) |
| `03_auth_me_200.png` | `GET /auth/me` con token → `200` |
| `04_auth_me_401_sin_token.png` | `GET /auth/me` sin encabezado → `401` |
| `05_auth_me_401_token_alterado.png` | Token alterado → `401` |
| `06_patch_sin_token_401.png` | `PATCH /applications/:id` sin token |
| `07_patch_estudiante_ajeno_403.png` | Estudiante que no es propietario |
| `08_patch_propietario_200.png` | Estudiante propietario |
| `09_patch_revisor_200.png` | Revisor |
| `10_patch_admin_200.png` | Administrador |
| `11_users_estudiante_403.png` | `GET /users` con rol student |
| `12_users_admin_200.png` | `GET /users` con admin |
| `13_register_con_role_400.png` | Registro con `role` en el cuerpo → `400` |
| `14_login_429.png` | Sexto intento de login → `429` |
| `15_cors_permitido.png` | `Access-Control-Allow-Origin` presente |
| `16_cors_no_permitido.png` | Sin ese encabezado para un origen no permitido |
| `17_error_400_id_invalido.png` | Cuerpo de error uniforme (`PATCH /applications/abc`) |
| `18_error_404.png` | Cuerpo de error uniforme (`PATCH /applications/99999`) |
| `19_error_403.png` | Cuerpo de error uniforme (estudiante ajeno) |
| `20_log_consola_middleware.png` | Líneas del middleware de registro, sin tokens |
| `21_estructura_capas.png` | Archivos del controlador, caso de uso, puerto y adaptador |
| `22_409_correo_duplicado.png` | `POST /students` con correo repetido → `409` |
| `23_409_borrar_estudiante.png` | Borrar estudiante con solicitudes → `409` |
| `24_409_borrar_beca.png` | Borrar beca con solicitudes → `409` |
| `25_patch_studentId_400.png` | `PATCH /applications/:id` con `studentId` → `400` |
| `26_solicitud_estudiante_inactivo_400.png` | Solicitud a estudiante inactivo rechazada |
| `27_tests_y_build.png` | `npm test` y `npm run build` sin errores |
