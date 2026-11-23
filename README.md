# Sistema de Gestión de Becas ULEAM

Backend desarrollado con **NestJS, TypeScript, TypeORM y PostgreSQL** para administrar los procesos de becas estudiantiles de la Universidad Laica Eloy Alfaro de Manabí (ULEAM).

Proyecto académico de la asignatura **Desarrollo Backend Web con NestJS — Tercera Etapa**.

**Repositorio:** https://github.com/GabrielGL11/proyecto_asw

---

## 1. Descripción del proyecto

El Sistema de Gestión de Becas ULEAM es una API REST que permite administrar la información relacionada con las becas universitarias y sus procesos asociados.

Los principales recursos del sistema son:

- **Estudiantes (Students):** información de los estudiantes.
- **Becas (Scholarships):** becas disponibles y sus características.
- **Solicitudes (Applications):** solicitudes presentadas por los estudiantes.
- **Documentos (Documents):** documentos asociados a las solicitudes.
- **Seguimiento (Tracking):** historial y seguimiento de los procesos.
- **Usuarios (Users):** cuentas utilizadas para la autenticación.

La aplicación utiliza una arquitectura modular de NestJS. PostgreSQL proporciona la persistencia de los datos y TypeORM administra las entidades, las relaciones y las consultas a la base de datos.

El proyecto incorpora operaciones CRUD, validación de datos, manejo de errores HTTP, integridad referencial, filtros, búsquedas, paginación, ordenamiento, migraciones versionadas y autenticación mediante JWT.

## 2. Objetivos del sistema

- Administrar los recursos relacionados con los procesos de becas.
- Mantener relaciones entre estudiantes, becas, solicitudes, documentos y seguimientos.
- Garantizar la integridad de la información mediante claves foráneas y restricciones.
- Facilitar consultas mediante filtros, búsquedas, ordenamiento y paginación.
- Proteger las operaciones de escritura mediante autenticación JWT.
- Gestionar los cambios de estructura de la base de datos mediante migraciones.
- Validar los datos recibidos y responder con códigos HTTP apropiados.
- Implementar autorización basada en roles y propiedad de recursos.
- Verificar las reglas de negocio mediante pruebas unitarias y pruebas de integración E2E.

## 3. Etapas del proyecto

### Etapa 1 — Fundamentos y definición de la API

Se desarrolló la estructura inicial del backend, incluyendo:

- Arquitectura modular con NestJS.
- Módulos para estudiantes, becas, solicitudes, documentos y seguimiento.
- Entidades y DTOs.
- Operaciones CRUD.
- Validaciones mediante `class-validator`.
- `ValidationPipe` global.
- Pipes para validar identificadores.
- Manejo de errores HTTP.
- Integración con PostgreSQL y TypeORM.
- Configuración mediante variables de entorno.
- Pruebas manuales con Thunder Client.

### Etapa 2 — Modelo relacional, consultas y autenticación

Se incorporaron las funcionalidades de la segunda etapa:

- Relaciones `@ManyToOne` y `@OneToMany`.
- Claves foráneas y restricciones de integridad.
- Reglas de eliminación y prevención de solicitudes duplicadas.
- Validación de estudiantes y becas al crear solicitudes.
- Validación de estudiantes activos.
- Consultas de información relacionada.
- Filtros, búsquedas y parámetros de consulta.
- Paginación y metadatos de resultados.
- Ordenamiento mediante `sortBy` y `order`.
- Validación de parámetros de consulta.
- Migraciones versionadas de TypeORM.
- Configuración de persistencia con `synchronize: false`.
- Registro de usuarios y hash de contraseñas mediante bcrypt.
- Inicio de sesión y generación de JWT.
- Estrategia y guard de autenticación.
- Protección de operaciones de escritura.

### Etapa 3 — Autorización, seguridad y arquitectura

Se incorporaron las funcionalidades correspondientes a la tercera etapa (semanas 9 a 11):

- JWT con `accessToken`, `GET /auth/me` e identidad segura en `req.user`.
- Roles cerrados (`admin`, `reviewer`, `student`) con `RolesGuard` y `@Roles()`.
- Ruta exclusiva de administración (`/users`) y regla de propiedad en solicitudes.
- CORS por entorno, limitación de solicitudes (`429`) y requisito de HTTPS/TLS.
- Middleware de registro, filtro global de errores e interceptor de tiempo.
- Caso de uso con puerto de repositorio y adaptador TypeORM.
- Respuestas `409` para correos duplicados y eliminaciones con solicitudes asociadas.
- Pruebas unitarias con Jest y repositorios simulados.
- Pruebas de integración HTTP con Jest y Supertest.
- Configuración independiente para pruebas unitarias y E2E.

La migración de las pruebas automatizadas de Vitest a Jest se registró en el commit `1cbd9de`.

## 4. Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| Node.js y npm | Entorno de ejecución y administración de dependencias |
| NestJS | Framework para el desarrollo del backend |
| TypeScript | Lenguaje de programación |
| PostgreSQL | Base de datos relacional |
| TypeORM | Mapeo objeto-relacional, repositorios y migraciones |
| `pg` | Conexión con PostgreSQL |
| `@nestjs/config` | Configuración mediante variables de entorno |
| `class-validator` | Validación de datos |
| `class-transformer` | Transformación de datos |
| Joi | Validación de las variables de entorno al arrancar |
| `@nestjs/jwt` | Generación y manejo de JWT |
| `@nestjs/passport` | Integración de Passport con NestJS |
| `passport-jwt` | Estrategia JWT |
| bcrypt | Hash de contraseñas |
| Jest | Framework de pruebas unitarias y E2E |
| ts-jest | Transformación de archivos TypeScript para Jest |
| Supertest | Pruebas de integración mediante peticiones HTTP |
| Thunder Client | Pruebas manuales de la API |

## 5. Arquitectura del sistema

El proyecto utiliza una arquitectura modular que separa las responsabilidades de los controladores, servicios, DTOs, entidades y módulos.

### Estructura general

```text
src/
├── auth/
├── users/
├── students/
├── scholarships/
├── applications/
├── documents/
├── tracking/
├── common/            (filtro de errores, middleware, interceptor)
├── migrations/
├── data-source.ts
├── app.module.ts
├── app.controller.ts
├── app.service.ts
└── main.ts
```

Cada módulo contiene su controller, service, DTOs y entidad.

### Responsabilidades

- **Controller:** recibe solicitudes HTTP y define los endpoints.
- **Service:** implementa la lógica de negocio y las operaciones sobre los recursos.
- **DTO:** define y valida los datos de entrada.
- **Entity:** representa la estructura de los datos y sus relaciones.
- **Repository:** permite consultar y modificar los registros mediante TypeORM.
- **Guard:** controla el acceso a las rutas protegidas.
- **Migration:** registra cambios versionados en el esquema de la base de datos.

### Flujo de persistencia

```text
Cliente HTTP
    ↓
Controller
    ↓
Service
    ↓
TypeORM Repository
    ↓
PostgreSQL
```

### Flujo de autenticación

```text
Cliente HTTP
    ↓
POST /auth/login
    ↓
Validación de credenciales
    ↓
Verificación de contraseña con bcrypt
    ↓
Generación de JWT
    ↓
Cliente recibe accessToken
    ↓
Authorization: Bearer <token>
    ↓
JwtAuthGuard y JwtStrategy
    ↓
Acceso autorizado al endpoint protegido
```

## 6. Modelo relacional

Las entidades principales mantienen las siguientes relaciones:

```text
Student 1:N Application N:1 Scholarship

Application 1:N Document

Application 1:N Tracking
```

### Relaciones entre entidades

**Student — Application**

Un estudiante puede registrar varias solicitudes de becas, pero cada solicitud pertenece a un estudiante.

**Scholarship — Application**

Una beca puede recibir varias solicitudes, pero cada solicitud corresponde a una beca.

**Application — Document**

Una solicitud puede contener varios documentos, y cada documento pertenece a una solicitud.

**Application — Tracking**

Una solicitud puede tener varios registros de seguimiento.

### Claves foráneas y reglas de eliminación

La entidad `Application` mantiene las claves foráneas `studentId` y `scholarshipId`.

Las relaciones entre solicitudes, estudiantes y becas utilizan la regla `ON DELETE RESTRICT`, que impide eliminar estudiantes o becas cuando existen solicitudes relacionadas.

Las relaciones de documentos y seguimientos con sus solicitudes utilizan las reglas de eliminación configuradas en las entidades y migraciones correspondientes.

### Prevención de solicitudes duplicadas

El sistema evita que un mismo estudiante registre más de una solicitud para la misma beca mediante una restricción única compuesta y una validación en el servicio.

Cuando se intenta registrar una solicitud duplicada, la API devuelve:

```text
409 Conflict
```

## 7. Entidades principales

### 7.1. Students

Tabla: `students`.

Campos principales:

```text
id
firstName
lastName
nationalId
email
age
career
semester
isActive
```

El correo electrónico se encuentra configurado como único.

### 7.2. Scholarships

Tabla: `scholarships`.

Campos principales:

```text
id
name
description
amount
startDate
endDate
isActive
```

Permite administrar las becas disponibles y consultar sus características.

### 7.3. Applications

Tabla: `applications`.

Campos principales:

```text
id
studentId
scholarshipId
gpa
income
comment
status
```

Estados de las solicitudes:

```text
pendiente
revision
aprobada
rechazada
correccion
```

Reglas de negocio:

- El estudiante debe existir.
- La beca debe existir.
- El estudiante debe estar activo para presentar una nueva solicitud.
- No se permite una solicitud duplicada del mismo estudiante para la misma beca.
- Se validan las relaciones antes de crear la solicitud.

### 7.4. Documents

Tabla: `documents`.

Campos principales:

```text
id
applicationId
name
url
status
```

Estados de los documentos:

```text
pendiente
cargado
observado
aprobado
```

Los documentos están asociados a una solicitud mediante `applicationId`.

### 7.5. Tracking

Tabla: `tracking`.

Campos principales:

```text
id
applicationId
status
comment
createdAt
```

Permite registrar y consultar el seguimiento de las solicitudes.

### 7.6. Users

Tabla: `users`.

Campos principales:

```text
id
email
password
role
```

Características:

- Correo electrónico único.
- Contraseñas almacenadas mediante hashes generados con bcrypt.
- Registro de usuarios.
- Inicio de sesión con validación de credenciales.
- Generación de tokens JWT para la autenticación.
- Asignación de roles para controlar los permisos.

La entidad configura la contraseña para que no se seleccione en las consultas habituales de TypeORM, salvo cuando el servicio necesita recuperarla expresamente para verificar las credenciales.

## 8. Endpoints de la API

La API utiliza métodos HTTP para consultar, crear, actualizar y eliminar recursos. La columna **Acceso** indica qué se exige en el servidor: `Público`, `JWT` (cualquier usuario autenticado) o `JWT + rol`.

### 8.1. Students

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| GET | `/students` | Consultar estudiantes | Público |
| GET | `/students/:id` | Consultar un estudiante | Público |
| POST | `/students` | Crear estudiante | JWT + `admin`/`reviewer` |
| PATCH | `/students/:id` | Actualizar estudiante | JWT + `admin`/`reviewer` |
| DELETE | `/students/:id` | Eliminar estudiante (`409` si tiene solicitudes) | JWT + `admin` |

### 8.2. Scholarships

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| GET | `/scholarships` | Consultar becas | Público |
| GET | `/scholarships/:id` | Consultar una beca | Público |
| POST | `/scholarships` | Crear beca | JWT + `admin` |
| PATCH | `/scholarships/:id` | Actualizar beca | JWT + `admin` |
| DELETE | `/scholarships/:id` | Eliminar beca (`409` si tiene solicitudes) | JWT + `admin` |

### 8.3. Applications

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| GET | `/applications` | Consultar solicitudes | Público |
| GET | `/applications/:id` | Consultar una solicitud | Público |
| GET | `/applications/student/:studentId` | Solicitudes de un estudiante | Público |
| GET | `/applications/scholarship/:scholarshipId` | Solicitudes de una beca | Público |
| POST | `/applications` | Crear solicitud (el usuario queda como propietario) | JWT |
| PATCH | `/applications/:id` | Actualizar solicitud (`403` si no es admin, revisor ni propietario) | JWT + propiedad |
| PATCH | `/applications/:id/status` | Cambiar estado | JWT + `admin`/`reviewer` |
| DELETE | `/applications/:id` | Eliminar solicitud | JWT + `admin` |

`PATCH /applications/:id` ya no permite cambiar `studentId` ni `scholarshipId`: el DTO los rechaza con `400`.

### 8.4. Documents

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| GET | `/documents` | Consultar documentos | Público |
| GET | `/documents/:id` | Consultar un documento | Público |
| GET | `/documents/application/:applicationId` | Documentos de una solicitud | Público |
| POST | `/documents` | Crear documento | JWT |
| PATCH | `/documents/:id` | Actualizar documento | JWT + `admin`/`reviewer` |
| PATCH | `/documents/:id/status` | Cambiar estado | JWT + `admin`/`reviewer` |
| DELETE | `/documents/:id` | Eliminar documento | JWT + `admin`/`reviewer` |

### 8.5. Tracking

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| GET | `/tracking` | Consultar seguimientos | Público |
| GET | `/tracking/:id` | Consultar un seguimiento | Público |
| GET | `/tracking/application/:applicationId` | Seguimiento de una solicitud | Público |
| POST | `/tracking` | Crear seguimiento | JWT + `admin`/`reviewer` |
| PATCH | `/tracking/:id` | Actualizar seguimiento | JWT + `admin`/`reviewer` |
| DELETE | `/tracking/:id` | Eliminar seguimiento | JWT + `admin`/`reviewer` |

### 8.6. Auth

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| POST | `/auth/register` | Registrar usuario (siempre con rol `student`) | Público |
| POST | `/auth/login` | Iniciar sesión (máx. 5 por minuto, luego `429`) | Público |
| GET | `/auth/me` | Identidad autenticada (`id`, `email`, `role`) | JWT |

### 8.7. Users (administración)

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| GET | `/users` | Listar usuarios | JWT + `admin` |
| PATCH | `/users/:id/role` | Cambiar el rol de un usuario | JWT + `admin` |

### 8.8. Ruta principal

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| GET | `/` | Verificar la respuesta principal de la API | Público |

El registro y el inicio de sesión son públicos porque permiten obtener las credenciales necesarias para acceder a las operaciones protegidas.

## 9. Búsquedas, filtros, ordenamiento y paginación

Los módulos de consulta utilizan DTOs específicos para definir los parámetros admitidos y validar sus valores.

### Parámetros de consulta

Según el recurso, se admiten parámetros como:

- `search`: búsqueda por texto.
- `career`: filtro por carrera.
- `semester`: filtro por semestre.
- `isActive`: filtro por estado de actividad.
- `studentId`: filtro por estudiante.
- `scholarshipId`: filtro por beca.
- `applicationId`: filtro por solicitud.
- `status`: filtro por estado.
- `activeOnly`: filtro relacionado con el estado activo del estudiante en las solicitudes.
- `page`: número de página.
- `limit`: cantidad de registros por página.
- `sortBy`: campo permitido para ordenar.
- `order`: orden ascendente `ASC` o descendente `DESC`.

Los parámetros disponibles dependen del módulo. Los campos de ordenamiento se limitan a los permitidos por cada consulta.

### Ejemplo de consulta de becas

```http
GET /scholarships?search=beca&isActive=true&page=1&limit=5&sortBy=name&order=ASC
```

### Ejemplo de consulta de solicitudes

```http
GET /applications?studentId=1&scholarshipId=1&status=pendiente&page=1&limit=5&sortBy=gpa&order=DESC
```

### Paginación

El parámetro `page` indica la página solicitada y `limit` determina la cantidad máxima de registros por página. Se estableció un límite máximo de 50 registros por página.

La respuesta paginada utiliza una estructura con registros y metadatos:

```json
{
  "items": [],
  "meta": {
    "total": 2,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

Los campos significan:

- `items`: registros devueltos.
- `total`: total de registros que cumplen los filtros.
- `page`: página actual.
- `limit`: cantidad máxima de registros por página.
- `totalPages`: número total de páginas.

Los valores fuera de los límites y los parámetros no permitidos se rechazan mediante las validaciones configuradas.

## 10. Validación y manejo de errores HTTP

La aplicación utiliza un `ValidationPipe` global configurado para transformar los valores de entrada, validar los DTOs y rechazar propiedades no permitidas.

```ts
app.useGlobalPipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
);
```

### Códigos HTTP utilizados

| Código | Significado |
|---|---|
| `400 Bad Request` | Datos de entrada o parámetros inválidos |
| `401 Unauthorized` | Credenciales incorrectas o autenticación no válida |
| `403 Forbidden` | Identidad válida sin permiso (rol o propiedad) |
| `404 Not Found` | Recurso inexistente |
| `409 Conflict` | Conflicto: correo duplicado, solicitud duplicada o eliminación de un recurso con solicitudes asociadas |
| `429 Too Many Requests` | Se superó el límite de solicitudes |
| `500 Internal Server Error` | Error inesperado (sin detalles internos en la respuesta) |

Todas las respuestas de error tienen la misma forma mediante el filtro global `HttpErrorFilter`:

```json
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "No se encontró el estudiante con ID 999",
  "path": "/students/999",
  "timestamp": "2026-11-16T15:00:00.000Z"
}
```

Los servicios utilizan excepciones de NestJS para gestionar los errores y devolver respuestas HTTP apropiadas.

## 11. Configuración de PostgreSQL y variables de entorno

La aplicación utiliza PostgreSQL como sistema de persistencia.

Configuración local de referencia:

```text
Host: localhost
Puerto: 5432
Base de datos: SG_Becas_ULEAM
Usuario: postgres
```

Las credenciales se configuran mediante variables de entorno. El archivo `.env` debe mantenerse local y excluido del repositorio.

### Variables de entorno

El archivo `.env.example` sirve como plantilla para configurar el entorno local:

```env
NODE_ENV=development
PORT=5500

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=SG_Becas_ULEAM
DATABASE_USER=postgres
DATABASE_PASSWORD=replace-with-your-local-password

JWT_SECRET=replace-with-a-random-secret-of-at-least-32-characters
JWT_EXPIRES_IN=3600

CORS_ORIGINS=http://localhost:5173
```

`CORS_ORIGINS` admite varios orígenes separados por coma. Solo esos orígenes podrán leer respuestas desde un navegador.

Los valores anteriores son ejemplos. Cada integrante debe configurar sus propias credenciales y un secreto JWT privado.

**No se deben publicar contraseñas reales, tokens activos ni secretos en el repositorio o en las capturas de evidencia.**

### Configuración de TypeORM

La configuración de entrega utiliza:

```ts
synchronize: false
```

De esta forma, TypeORM no modifica automáticamente el esquema de la base de datos al iniciar la aplicación. Los cambios estructurales se gestionan mediante migraciones versionadas.

## 12. Migraciones de TypeORM

Las migraciones permiten crear y modificar el esquema de PostgreSQL de forma controlada y reproducible.

La fuente de datos está definida en:

```text
src/data-source.ts
```

Las migraciones del proyecto se encuentran en:

```text
src/migrations/
```

Entre las migraciones implementadas se encuentran:

- `1791676800000-InitialSchema.ts`: crea el esquema inicial de estudiantes, becas, solicitudes, documentos y seguimiento.
- `1791725363913-CreateUsersTable.ts`: crea la tabla de usuarios.
- `AddRolesAndApplicationOwner`: incorpora los roles de usuario y la propiedad de las solicitudes.

### Comandos de migración

Consultar el historial:

```bash
npx typeorm-ts-node-esm migration:show -d src/data-source.ts
```

Ejecutar las migraciones pendientes:

```bash
npm run migration:run
```

Revertir la última migración:

```bash
npm run migration:revert
```

Generar una migración:

```bash
npm run migration:generate -- src/migrations/NombreMigracion
```

Los comandos deben ejecutarse con la configuración de base de datos correcta. Antes de generar o ejecutar migraciones, se debe comprobar que `DATABASE_NAME` apunta a la base de datos deseada.

### Verificación

La ejecución de las dos migraciones iniciales se comprobó en una base de datos de prueba independiente. El historial mostró ambas migraciones como ejecutadas:

```text
[X] 1 InitialSchema1791676800000
[X] 2 CreateUsersTable1791725363913
```

La migración `AddRolesAndApplicationOwner` corresponde a los cambios incorporados en la tercera etapa y debe aplicarse en el entorno correspondiente mediante `npm run migration:run`.

## 13. Registro y autenticación JWT

El sistema utiliza bcrypt para proteger las contraseñas y JWT para autenticar las peticiones a las rutas protegidas.

### Registro de usuario

Endpoint:

```http
POST /auth/register
Content-Type: application/json
```

Ejemplo de cuerpo:

```json
{
  "email": "usuario@example.com",
  "password": "Prueba123!"
}
```

El correo debe ser único. El sistema almacena el hash de la contraseña, no la contraseña en texto plano.

### Inicio de sesión

Endpoint:

```http
POST /auth/login
Content-Type: application/json
```

Ejemplo de cuerpo:

```json
{
  "email": "usuario@example.com",
  "password": "Prueba123!"
}
```

Con credenciales válidas, la API devuelve un token JWT y una representación segura del usuario:

```json
{
  "accessToken": "<token_jwt>",
  "user": {
    "id": 1,
    "email": "usuario@example.com",
    "role": "student"
  }
}
```

El payload del token contiene solo `sub` y `email` (sin contraseña, hash ni rol). El rol se consulta en la base de datos en cada solicitud, por lo que un cambio de rol surte efecto de inmediato. Con credenciales incorrectas responde `401` sin emitir token.

`GET /auth/me` con el encabezado `Authorization: Bearer <token>` devuelve la identidad autenticada.

### Uso del token

Para realizar una petición a una ruta protegida, se envía el token en el encabezado:

```http
Authorization: Bearer <token_jwt>
```

`JwtAuthGuard` y `JwtStrategy` verifican la autenticación antes de permitir el acceso.

### Pruebas de autenticación realizadas

Se contemplan los siguientes comportamientos:

- Registro de usuarios.
- Rechazo de correos duplicados.
- Rechazo de credenciales incorrectas con `401 Unauthorized`.
- Rechazo de solicitudes a rutas protegidas sin autenticación.
- Rechazo de tokens inválidos.
- Verificación de la identidad autenticada.
- Comprobación de que la respuesta de autenticación no expone contraseñas.

Estos comportamientos también cuentan con cobertura mediante pruebas unitarias y escenarios E2E definidos.

## 14. Pruebas automatizadas y compilación

El proyecto utiliza **Jest** como framework de pruebas automatizadas y **Supertest** para realizar pruebas de integración HTTP.

La estrategia de pruebas se divide en pruebas unitarias y pruebas end-to-end (E2E).

### 14.1. Pruebas unitarias

Se implementaron pruebas unitarias con Jest para verificar los servicios, casos de uso, guards, filtros y controladores. Los repositorios se sustituyen por objetos simulados (*mocks*), lo que permite comprobar las reglas de negocio sin depender de una conexión real a PostgreSQL.

La cobertura contempla operaciones CRUD, validaciones, reglas de integridad, permisos, propiedad de recursos y manejo de errores.

| Módulo | Pruebas | Casos principales |
|---|---:|---|
| StudentsService | 13 | CRUD, filtros, paginación, correo duplicado y eliminación con solicitudes asociadas. |
| ScholarshipsService | 10 | CRUD, filtros, paginación y restricciones de eliminación. |
| ApplicationsService | 16 | Creación de solicitudes, estudiante inactivo, beca inexistente y solicitudes duplicadas. |
| UpdateApplicationUseCase | 6 | Propiedad de solicitudes, permisos de administrador y revisor, errores 403 y 404. |
| DocumentsService | 15 | Creación, validación de solicitudes, estados, filtros y paginación. |
| TrackingService | 13 | Creación, ordenamiento por fecha, filtros y paginación. |
| AuthService | 5 | Registro, hash de contraseñas, correos duplicados e inicio de sesión. |
| RolesGuard | 4 | Autorización según los roles permitidos y usuario autenticado. |
| HttpErrorFilter | 3 | Formato uniforme de errores, validaciones y ocultamiento de detalles internos. |
| Controladores y AppController | 6 | Instanciación de controladores y respuesta principal de la API. |
| **Total** | **91** | **15 archivos de prueba.** |

**Configuración:**

- `jest.config.mjs`: configuración de Jest para pruebas unitarias.
- `ts-jest`: transformación de archivos TypeScript.
- Los repositorios se simulan mediante mocks para aislar la lógica de negocio.

Ejecutar las pruebas unitarias:

```bash
npm test
```

### 14.2. Pruebas de integración E2E

Se configuraron pruebas end-to-end mediante **Jest y Supertest**. Estas pruebas levantan la aplicación NestJS y realizan peticiones HTTP para comprobar el comportamiento de los endpoints, las validaciones y las respuestas del servidor.

La configuración E2E es independiente de las pruebas unitarias:

- `jest-e2e.config.mjs`: configuración de Jest para pruebas E2E.
- `tsconfig.jest.json`: configuración de TypeScript para compilar las pruebas en CommonJS.
- `Supertest`: permite enviar peticiones HTTP a la aplicación durante las pruebas.

Ejecutar las pruebas E2E:

```bash
npm run test:e2e
```

Actualmente se encuentra implementado y ejecutado el caso **CP-01**, correspondiente a la consulta `GET /`, que verifica que la API responda correctamente con código HTTP 200 y su página de bienvenida.

Se definieron 33 escenarios de prueba (CP-01 a CP-33), organizados en los siguientes grupos:

| Grupo | Casos | Escenarios contemplados |
|---|---|---|
| Raíz | CP-01 | Respuesta principal de la API. |
| Validación | CP-02 a CP-07 | Registro, DTOs, parámetros inválidos y límites de paginación. |
| Login | CP-08 a CP-12 | Inicio de sesión, credenciales inválidas, token JWT e identidad autenticada. |
| Sin token | CP-13 a CP-16 | Rechazo de operaciones protegidas sin autenticación. |
| Roles | CP-17 a CP-19 | Permisos de student, reviewer y admin, y administración de roles. |
| CRUD estudiantes | CP-20 a CP-25 | Creación, consulta, actualización, paginación y eliminación. |
| Solicitudes | CP-26 a CP-31 | Creación, duplicados, propiedad, actualización y cambios de estado. |
| Integridad | CP-32 a CP-33 | Restricciones de eliminación y permisos sobre solicitudes asociadas. |

**Importante:** Los escenarios CP-02 a CP-33 están definidos como casos previstos para ampliar la cobertura E2E, pero todavía están pendientes de implementación. No deben considerarse pruebas ejecutadas ni resultados aprobados.

### 14.3. Resultados de ejecución

Resultados de las ejecuciones realizadas:

| Indicador | Resultado |
|---|---:|
| Archivos de pruebas unitarias aprobados | 15 |
| Pruebas unitarias aprobadas | 91 |
| Pruebas unitarias fallidas | 0 |
| Archivos de pruebas E2E aprobados | 1 |
| Pruebas E2E aprobadas | 1 (CP-01) |
| Pruebas E2E fallidas | 0 |

### 14.4. Compilación

La compilación del proyecto se realiza mediante TypeScript y el comando:

```bash
npm run build
```

El resultado de compilación debe registrarse después de ejecutar el comando y comprobar que finalice sin errores.

Las pruebas unitarias permiten verificar de manera aislada las reglas de negocio, mientras que las pruebas E2E comprueban la interacción HTTP con la aplicación. Ambas estrategias complementan las pruebas manuales realizadas con Thunder Client.

## 15. Instalación y ejecución

### Requisitos previos

- Node.js y npm instalados.
- PostgreSQL instalado y en ejecución.
- Acceso a una base de datos PostgreSQL.
- Git para clonar el repositorio.

### Clonar el repositorio

```bash
git clone https://github.com/GabrielGL11/proyecto_asw.git
cd proyecto_asw
```

### Instalar dependencias

```bash
npm install
```

### Configurar el entorno

Crear un archivo `.env` tomando como referencia `.env.example`.

Configurar las variables de conexión a PostgreSQL y el secreto JWT. Verificar que la base de datos seleccionada sea la correcta antes de ejecutar las migraciones.

### Aplicar las migraciones

```bash
npm run migration:run
```

### Iniciar el servidor

Modo desarrollo:

```bash
npm run start:dev
```

Modo normal:

```bash
npm run start
```

Modo producción, después de compilar:

```bash
npm run build
npm run start:prod
```

La dirección local prevista para el servidor es:

```text
http://localhost:5500
```

El puerto efectivo depende de la configuración de entorno utilizada.

### Documentación Swagger

Durante el desarrollo, la documentación de la API está disponible en:

```text
http://localhost:5500/api/docs
```

El puerto efectivo depende de la configuración del entorno.

## 16. Comandos de comprobación

| Propósito | Comando |
|---|---|
| Iniciar en desarrollo | `npm run start:dev` |
| Compilar el proyecto | `npm run build` |
| Ejecutar pruebas unitarias | `npm test` |
| Ejecutar pruebas unitarias con detalle | `npm test -- --verbose` |
| Ejecutar pruebas E2E | `npm run test:e2e` |
| Ejecutar migraciones | `npm run migration:run` |
| Revertir última migración | `npm run migration:revert` |
| Consultar migraciones | `npx typeorm-ts-node-esm migration:show -d src/data-source.ts` |

Las pruebas unitarias utilizan Jest y las pruebas E2E utilizan Jest junto con Supertest. La configuración de cada tipo de prueba se mantiene independiente.

## 17. Evidencias del proyecto

Las evidencias de las entregas se organizan en carpetas dentro del repositorio:

```text
Evidencias/
├── Evidencias Entrega 1/
├── Evidencias Entrega 2/
└── Evidencias Entrega 3/
```

Las evidencias de la tercera etapa incluyen capturas relacionadas con:

- Configuración de Jest para pruebas unitarias.
- Ejecución de los 15 archivos de pruebas unitarias.
- Resultado de las 91 pruebas unitarias aprobadas.
- Configuración independiente de las pruebas E2E.
- Ejecución del caso CP-01 mediante Jest y Supertest.
- Configuración de autorización y roles.
- Protección de rutas y propiedad de solicitudes.
- Componentes transversales de seguridad.
- Migración `AddRolesAndApplicationOwner`.
- Compilación del backend.

Repositorio de evidencias de la tercera etapa:

https://github.com/GabrielGL11/proyecto_asw/tree/etapa3-autorizacion-seguridad/Evidencias/Evidencias%20Entrega%203

Las capturas deben corresponder a ejecuciones reales y no deben mostrar credenciales, contraseñas, secretos JWT ni tokens activos.

## 18. Verificaciones realizadas antes de la entrega

Antes de la entrega de la tercera etapa se consideran las siguientes verificaciones:

- [x] Relaciones entre las entidades principales.
- [x] Claves foráneas y restricciones de integridad.
- [x] Prevención de solicitudes duplicadas.
- [x] Consultas con filtros, paginación y ordenamiento.
- [x] Migraciones verificadas en una base de prueba independiente.
- [x] Configuración de TypeORM con `synchronize: false`.
- [x] Registro, login y autenticación JWT.
- [x] Roles `admin`, `reviewer` y `student`.
- [x] Protección de rutas mediante guards.
- [x] Validación de propiedad de solicitudes.
- [x] Manejo uniforme de errores HTTP.
- [x] Migración de pruebas automatizadas de Vitest a Jest.
- [x] 15 archivos de pruebas unitarias aprobados.
- [x] 91 pruebas unitarias aprobadas.
- [x] Configuración independiente para pruebas E2E.
- [x] Caso E2E CP-01 implementado y aprobado.
- [ ] Implementación de los escenarios E2E CP-02 a CP-33.
- [ ] Verificación final de compilación mediante `npm run build`.
- [x] Archivo `.env` excluido del repositorio.
- [x] Tabla de endpoints contrastada con los controladores y guards.
- [x] Documentación de instalación, configuración y ejecución actualizada.

## 19. Autorización y seguridad (Etapa 3)

La autenticación responde «¿quién eres?»; la autorización, «¿puedes hacer esto aquí y ahora?». Ambas se aplican en el servidor.

### Roles

| Rol | Descripción |
|---|---|
| `student` | Valor por defecto de toda cuenta nueva (menor privilegio). Crea solicitudes y modifica las suyas. |
| `reviewer` | Personal del comité de becas: gestiona estudiantes, estados, documentos y seguimiento. |
| `admin` | Administra becas, usuarios, roles y eliminaciones. |

El rol **nunca** se acepta en el registro: `POST /auth/register` rechaza cualquier campo `role` (`400`). Solo un administrador cambia roles con `PATCH /users/:id/role`.

### Matriz de acceso

| Acción | Sin token | student ajeno | student propietario | reviewer | admin |
|---|---|---|---|---|---|
| `PATCH /applications/:id` | 401 | 403 | 200 | 200 | 200 |
| `PATCH /applications/:id/status` | 401 | 403 | 403 | 200 | 200 |
| `DELETE /applications/:id` | 401 | 403 | 403 | 403 | 200 |
| `POST/PATCH/DELETE /scholarships` | 401 | 403 | 403 | 403 | 200 |
| `GET /users`, `PATCH /users/:id/role` | 401 | 403 | 403 | 403 | 200 |

### Propiedad de recursos

`POST /applications` guarda en `createdByUserId` el id del usuario autenticado (nunca se toma del cuerpo).

`UpdateApplicationUseCase` permite modificar una solicitud solo a un administrador, un revisor o a su propietario; en otro caso lanza `403`.

Las solicitudes creadas antes de esta etapa no tienen propietario y solo las modifican `admin` y `reviewer`.

### Crear el primer administrador

Registra una cuenta con `POST /auth/register` y promuévela directamente en la base de datos (después podrá asignar roles por la API):

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

### CORS

`app.enableCors` admite únicamente los orígenes de `CORS_ORIGINS`, los métodos `GET, POST, PATCH, DELETE` y los encabezados `Content-Type` y `Authorization`.

CORS **no** es autorización: no impide llamadas desde Postman, Thunder Client o un servidor; por eso JWT y roles se siguen exigiendo.

### Limitación de solicitudes

`@nestjs/throttler` aplica un límite global de 60 solicitudes por minuto por IP y uno más estricto en `POST /auth/login`: 5 por minuto.

El sexto intento recibe `429 Too Many Requests` sin revelar si el correo o la contraseña eran correctos.

### HTTPS / TLS (requisito de producción)

En desarrollo se usa `http://localhost`. **En producción la API debe servirse únicamente por HTTPS/TLS**, normalmente con terminación TLS en un proxy, balanceador o la plataforma de despliegue.

Sin HTTPS un token Bearer puede ser interceptado aunque su firma sea válida.

Los secretos (`JWT_SECRET`, credenciales de base de datos) viven solo en variables de entorno del servidor y nunca en el repositorio.

## 20. Arquitectura y componentes transversales (Etapa 3)

### Componentes transversales

| Componente | Archivo | Función |
|---|---|---|
| Middleware | `src/common/middleware/request-logger.middleware.ts` | Registra método, ruta, estado y duración. No registra encabezados, cuerpos ni tokens. |
| Filter global | `src/common/filters/http-error.filter.ts` | Respuesta de error uniforme; no expone trazas ni SQL (los errores inesperados salen como `500` genérico). |
| Interceptor | `src/common/interceptors/timing.interceptor.ts` | Añade el encabezado `X-Response-Time`. |
| Pipes | `ValidationPipe` global y `ParseXxxIdPipe` | Validan DTOs e identificadores (`400`). |

### Módulo en capas: Applications (actualizar solicitud)

```text
ApplicationsController            ← HTTP (rutas, guards, DTOs)
        ↓
UpdateApplicationUseCase          ← regla de negocio + propiedad
        ↓
ApplicationRepository (puerto)    ← src/applications/domain/application.repository.ts
        ↓
TypeOrmApplicationRepository      ← adaptador técnico (TypeORM)
        ↓
PostgreSQL
```

- Si cambia la regla «solo el propietario puede editar», cambia **`UpdateApplicationUseCase`**.
- Si se reemplaza TypeORM, cambia **`TypeOrmApplicationRepository`**.
- El controlador conserva el contrato HTTP.

### Migración de la etapa

`AddRolesAndApplicationOwner` crea el tipo `users_role_enum`, la columna `users.role` (por defecto `student`) y `applications.createdByUserId` con su clave foránea (`ON DELETE SET NULL`).

Aplicar con:

```bash
npm run migration:run
```

### Verificaciones de la Etapa 3

- [x] Configuración de roles y autorización.
- [x] Validación de propiedad de solicitudes.
- [x] Componentes transversales implementados.
- [x] Migración de pruebas de Vitest a Jest.
- [x] 91 pruebas unitarias aprobadas.
- [x] Configuración de pruebas E2E con Jest y Supertest.
- [x] Caso CP-01 ejecutado correctamente.
- [ ] Implementación de los escenarios E2E CP-02 a CP-33.
- [ ] Comprobación final de compilación.
- [ ] Aplicación de las migraciones pendientes en la base de datos de entrega.
- [ ] Evidencias finales de la etapa incorporadas al repositorio.

## 21. Registro de cambios

Cambios relevantes del Sistema de Gestión de Becas ULEAM, por etapa.

### [Etapa 3] — Autorización, calidad y documentación

#### Añadido
- **Roles y autorización:** roles `student`, `reviewer` y `admin`, decorador `@Roles()` y `RolesGuard`; regla de propiedad en solicitudes (`createdByUserId`); rutas de administración `GET /users` y `PATCH /users/:id/role`.
- **Seguridad:** CORS por entorno (`CORS_ORIGINS`), límite de solicitudes con `@nestjs/throttler` (60/min global, 5/min en login).
- **Manejo transversal:** `HttpErrorFilter` (formato uniforme de error), `RequestLoggerMiddleware`, `TimingInterceptor` (`X-Response-Time`) y `ValidationPipe` global.
- **Arquitectura:** `UpdateApplicationUseCase` con puerto `ApplicationRepository` y adaptador TypeORM.
- **`src/app.setup.ts`:** configuración transversal compartida por `main.ts` y las pruebas E2E.
- **Swagger / OpenAPI** (`src/swagger.setup.ts`): `/api/docs` y `/api/docs-json`, autenticación Bearer, DTOs y entidades con ejemplos, parámetros de consulta y respuestas de error (`@ApiErrorResponses`).
- **Pruebas E2E con Jest y Supertest** (35 casos, `npm run test:e2e`) sobre la base `_test`, que se crea y se recrea con las migraciones reales en cada archivo de prueba.
- **Migración de las pruebas de Vitest a Jest** (commit `1cbd9de`): `jest.config.mjs`, `jest-e2e.config.mjs` y `tsconfig.jest.json`.
- Migración `AddRolesAndApplicationOwner`.

#### Corregido (observaciones resueltas)
- Correo duplicado de estudiantes: ahora responde `409 Conflict` (antes, error interno).
- Eliminar un estudiante o una beca con solicitudes: responde `409 Conflict`; se conserva `ON DELETE RESTRICT`.
- `PATCH /applications/:id` ya no permite cambiar `studentId` ni `scholarshipId`.
- `POST /auth/login` devuelve `accessToken` y `user` (`id`, `email`, `role`), sin contraseña ni hash.

#### Cambiado
- Los DTOs de actualización usan `PartialType`/`OmitType` de `@nestjs/swagger` (en lugar de `@nestjs/mapped-types`) para heredar la documentación.
- `main.ts` delega la configuración en `configureApp` y `setupSwagger`.
- `ThrottlerModule` admite `THROTTLE_DISABLED=true` (solo pruebas E2E).

### [Etapa 2] — Modelo relacional, consultas y autenticación
Relaciones, filtros, paginación, ordenamiento, migraciones, registro y login con JWT.

### [Etapa 1] — Fundamentos
CRUD de estudiantes, becas, solicitudes, documentos y seguimiento con validación y PostgreSQL.

## 22. Recursos oficiales

- [Documentación de NestJS](https://docs.nestjs.com/)
- [Repositorio de NestJS](https://github.com/nestjs/nest)
- [Documentación de TypeORM](https://typeorm.io/)
- [Documentación de PostgreSQL](https://www.postgresql.org/docs/)
- [class-validator](https://github.com/typestack/class-validator)
- [Passport.js](https://www.passportjs.org/)
- [Autenticación en NestJS](https://docs.nestjs.com/security/authentication)
- [Documentación de Joi](https://joi.dev/api/)
- [Documentación de Jest](https://jestjs.io/docs/getting-started)
- [Documentación de Supertest](https://github.com/ladjs/supertest)

---

## Autoría

Proyecto académico desarrollado para la asignatura **Desarrollo Backend Web con NestJS**.

**Universidad:** Universidad Laica Eloy Alfaro de Manabí (ULEAM)

**Integrantes:**

- Jose Gabriel Alava Barcia
- Anthony Gabriel Guaman Lucio
- Jordan Josue Solorzano Zambrano

**Carrera:** Software, 5.º «B»

**Docente:** Ing. Joffre Edgardo Panchana Flores, Mg.

**Repositorio:** https://github.com/GabrielGL11/proyecto_asw