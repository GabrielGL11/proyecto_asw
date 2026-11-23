# Guía para los dos compañeros — Swagger y pruebas E2E (Etapa 3, con Jest)

Gabriel ya migró las pruebas a Jest (commit `1cbd9de`) y actualizó el README. Lo que falta son **Swagger** y las **pruebas E2E CP-02 a CP-35**, repartido en dos partes. Cada compañero aplica su zip, lo prueba y hace **sus propios commits** (la rúbrica pide commits atribuibles a cada integrante).

> **Estado actual:** el **Compañero 1 ya subió su parte** y ya está en `main` (base común, Swagger de Auth y Users, y E2E CP-01 a CP-25 y CP-34). **Solo falta el Compañero 2.**

| | Compañero 1 | Compañero 2 |
|---|---|---|
| **Estado** | ✅ **Ya subido** (ya está en `main`) | ⏳ **Pendiente** |
| **Zip** | `COMPANERO_1_base_auth_roles.zip` | `COMPANERO_2_swagger_dominio_y_e2e.zip` |
| **Base común** | `app.setup.ts`, Swagger, helpers y base `_test` | — (usa la base del Compañero 1) |
| **Swagger** | Auth, Users y ruta raíz | Students, Scholarships, Applications, Documents, Tracking |
| **E2E** | CP-01 a CP-25 y CP-34 | CP-26 a CP-33 y CP-35 |

## Orden de trabajo

1. ✅ **El Compañero 1 ya subió su parte.** Sus archivos comunes ya están en `main`; no tiene que hacer nada más.
2. ⏳ **El Compañero 2 va ahora:** hace `git pull` (trae lo del Compañero 1) antes de `npm install`, de probar y de subir.
3. Al final, Gabriel integra, corre todo y completa README y Word con resultados reales.

## Pasos para el Compañero 2 (el Compañero 1 ya los hizo)

```bash
git checkout main
git pull
git checkout -b etapa3-swagger-e2e-NOMBRE      # ej.: etapa3-swagger-e2e-anthony
# descomprime TU zip encima de la carpeta del proyecto (acepta reemplazar archivos)
git config user.name  "Tu Nombre"              # para que el commit salga a tu nombre
git config user.email "tu-correo-de-github"
npm install
```

Haz los commits sugeridos, sube la rama (`git push -u origin <rama>`) y abre un Pull Request hacia `main` para que Gabriel lo fusione. El repositorio trabaja sobre `main`; si el grupo usa otra rama de etapa, cámbiala en el primer comando.

---

## Compañero 1 — Base, Auth y roles ✅ YA SUBIDO

> Esta parte **ya está en `main`**. Se conserva como referencia de lo que hizo; no hay que repetir nada.

Archivos: `package.json`, `jest-e2e.config.mjs`, `.env.example`, `src/app.setup.ts`, `src/swagger.setup.ts`, `src/main.ts`, `src/app.module.ts`, `src/common/dto/*`, `src/common/swagger/*`, `src/app.controller.ts`, `src/auth/*` (controlador y DTOs), `src/users/*` (controlador, DTO y entidad), `test/test-env.ts`, `test/setup-env.ts`, `test/helpers/*`, `test/app.e2e-spec.ts`, `test/throttle.e2e-spec.ts`, `test/roles-students.e2e-spec.ts`.

```bash
npm install                                  # instala @nestjs/swagger y actualiza package-lock.json
npm test                                     # deben seguir los 91 aprobados
npm run test:e2e -- app.e2e throttle.e2e     # CP-01 a CP-16 y CP-34

git add src/app.setup.ts src/swagger.setup.ts src/main.ts src/app.module.ts
git commit -m "refactor: move global app configuration to app.setup and add Swagger bootstrap"

git add package.json package-lock.json src/common
git commit -m "feat: add @nestjs/swagger and shared OpenAPI error and pagination decorators"

git add jest-e2e.config.mjs test/test-env.ts test/setup-env.ts test/helpers .env.example
git commit -m "test(e2e): add Jest e2e setup with isolated _test database and helpers"

git add test/app.e2e-spec.ts test/throttle.e2e-spec.ts
git commit -m "test(e2e): implement CP-01 to CP-16 and CP-34 (validation, login, no token, 429)"

# >>> hasta aquí: git push (hecho) <<<

git add src/app.controller.ts src/auth src/users
git commit -m "docs(swagger): document root, auth and users endpoints"

npm run test:e2e -- roles-students           # CP-17 a CP-25
git add test/roles-students.e2e-spec.ts
git commit -m "test(e2e): implement CP-17 to CP-25 (roles and students CRUD)"
```

## Compañero 2 — Swagger del dominio y E2E de solicitudes ⏳ PENDIENTE (le toca ahora)

Archivos: `src/students/*`, `src/scholarships/*`, `src/applications/*`, `src/documents/*`, `src/tracking/*` (solo controladores, DTOs y entidades), `test/applications.e2e-spec.ts`, `test/swagger.e2e-spec.ts`.

Antes de probar: `git pull` (ya trae lo del Compañero 1, que está en `main`) y `npm install`.

```bash
git add src/students src/scholarships
git commit -m "docs(swagger): document students and scholarships endpoints, DTOs and entities"

git add src/applications
git commit -m "docs(swagger): document applications endpoints, DTOs and entity"

git add src/documents src/tracking
git commit -m "docs(swagger): document documents and tracking endpoints, DTOs and entities"

npm run test:e2e -- applications.e2e         # CP-26 a CP-33
git add test/applications.e2e-spec.ts
git commit -m "test(e2e): implement CP-26 to CP-33 (applications and referential integrity)"

npm run test:e2e -- swagger.e2e              # CP-35 (necesita lo del Compañero 1 integrado)
git add test/swagger.e2e-spec.ts
git commit -m "test(e2e): verify the OpenAPI contract (CP-35)"
```

---

## Cierre (Gabriel)

El antiguo `CHANGELOG.md` se unió al `README.md` (sección 21, «Registro de cambios»); ya no existe como archivo aparte.

Con ambas ramas fusionadas en `main`:

```bash
git pull
npm install
npm test                # 91 pruebas unitarias
npm run test:e2e        # 35 casos E2E (5 archivos)
npm run build           # compilación sin errores
```

Después, **solo con los resultados reales**: completar la sección 14 del README y el Word y guardar las capturas en `Evidencias/Evidencias Entrega 3/`.

## Requisitos para las pruebas E2E

- PostgreSQL en ejecución y `.env` con `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD`.
- El usuario de PostgreSQL debe poder crear bases de datos (se crea `SG_Becas_ULEAM_test` sola).
- Las pruebas **nunca** tocan `SG_Becas_ULEAM`: se niegan a correr si la base no termina en `_test`.

## Si algo falla

- **No encuentra `@nestjs/swagger`**: falta `npm install` después del `git pull`.
- **`database "..._test" does not exist` / permiso denegado**: el usuario de PostgreSQL no puede crear bases; créala a mano: `CREATE DATABASE "SG_Becas_ULEAM_test";`.
- **Error al cargar `@nestjs/swagger` desde Jest (ESM)**: avisar a Gabriel con el mensaje completo; se ajusta `jest-e2e.config.mjs`.
- **`429 Too Many Requests` en pruebas**: las E2E fijan `THROTTLE_DISABLED=true` en `test/setup-env.ts`; no lo quites.