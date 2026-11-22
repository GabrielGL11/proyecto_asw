# Qué actualizar en README y Word (solo después de ejecutar)

No escribas «aprobado» hasta ver el resultado real en tu terminal.

## README.md — sección 14.2 (pruebas E2E)

Reemplaza el bloque «Actualmente se encuentra implementado…» y la tabla de grupos por:

- Archivos: `test/app.e2e-spec.ts` (CP-01 a CP-16), `test/roles-students.e2e-spec.ts` (CP-17 a CP-25), `test/applications.e2e-spec.ts` (CP-26 a CP-33), `test/throttle.e2e-spec.ts` (CP-34) y `test/swagger.e2e-spec.ts` (CP-35).
- Base de datos aparte `<DATABASE_NAME>_test` (por defecto `SG_Becas_ULEAM_test`, configurable con `DATABASE_NAME_TEST`): cada archivo la crea si no existe, recrea el esquema vacío y aplica las migraciones reales (`test/helpers/database.ts`). Las pruebas se niegan a correr si el nombre no termina en `_test`.
- Configuración: `jest-e2e.config.mjs` (`setupFiles` → `test/setup-env.ts`, `maxWorkers: 1`, `testTimeout: 30000`) y `tsconfig.jest.json`.
- El límite de solicitudes se desactiva con `THROTTLE_DISABLED=true` solo en pruebas; CP-34 lo reactiva para comprobar el `429`.

## README.md — sección 14.3 (resultados)

Sustituye la fila E2E con los números que muestre `npm run test:e2e`, por ejemplo:

| Archivos de pruebas E2E aprobados | `<5>` |
| Pruebas E2E aprobadas | `<35>` |
| Pruebas E2E fallidas | `<0>` |

## README.md — marcas de verificación (secciones 18 y 20)

Cambia `- [ ] Implementación de los escenarios E2E CP-02 a CP-33.` por `[x]` solo cuando `npm run test:e2e` pase. Añade:
- [ ] Swagger publicado en `/api/docs` y `/api/docs-json` (CP-35).
- [ ] `npm run build` sin errores.

## README.md — Swagger (sección 15)

Añade al final de «Documentación Swagger»: el contrato JSON está en `http://localhost:5500/api/docs-json`; para probar rutas con candado ejecutar `POST /auth/login`, copiar `accessToken` y pulsar **Authorize** (sin escribir `Bearer`). La configuración está en `src/swagger.setup.ts`.

## Word (TA_Etapa3_…_Jest.docx)

- Tabla E2E: ya incluye CP-34 y CP-35.
- «Resultados de la ejecución»: completa archivos y pruebas E2E aprobadas (esperado: 5 archivos y 35 pruebas) y la compilación.
- Cambia el texto del comando `npm run test:e2e` a «35 casos» solo si el resultado fue 35.
