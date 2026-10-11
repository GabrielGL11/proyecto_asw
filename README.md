<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>

# Sistema de Gestión de Becas ULEAM

Backend desarrollado con **NestJS, TypeScript, TypeORM y PostgreSQL** para administrar las becas estudiantiles de la Universidad Laica Eloy Alfaro de Manabí (ULEAM).

El proyecto se desarrolla de manera incremental para la asignatura de **Desarrollo Backend Web con NestJS**, dando continuidad a la primera etapa e incorporando persistencia relacional, consultas avanzadas, migraciones y autenticación mediante JWT.

Repositorio: [GabrielGL11/proyecto_asw](https://github.com/GabrielGL11/proyecto_asw)

---

## 1. Descripción del proyecto

El Sistema de Gestión de Becas ULEAM permite administrar los principales recursos del proceso de becas universitarias:

- Estudiantes.
- Becas.
- Solicitudes de becas.
- Documentos.
- Seguimiento de solicitudes.
- Usuarios y autenticación.

La API utiliza una arquitectura modular basada en NestJS. Los datos se almacenan en PostgreSQL y se administran mediante TypeORM.

El proyecto cuenta con cinco módulos principales de negocio, operaciones CRUD, relaciones entre entidades, validaciones, manejo de errores HTTP, consultas relacionadas, filtros, búsqueda, ordenamiento y paginación.

Además, incorpora un módulo de usuarios y otro de autenticación para registrar usuarios, almacenar contraseñas mediante hash, iniciar sesión y generar tokens JWT. Los endpoints de escritura protegidos requieren un token válido.

---

## 2. Estado de las etapas

### Etapa 1 — Fundamentos y definición de la API

Esta etapa estableció la estructura inicial de la aplicación.

Funcionalidades implementadas:

- Arquitectura modular con NestJS.
- Módulos de estudiantes, becas, solicitudes, documentos y seguimiento.
- Entidades de TypeORM.
- DTOs para creación y actualización.
- Validaciones mediante `class-validator`.
- `ValidationPipe` global.
- Pipes para validar identificadores.
- Operaciones CRUD en los cinco módulos.
- Integración con PostgreSQL.
- Configuración mediante variables de entorno.
- Manejo de errores HTTP.
- Pruebas manuales de endpoints.

### Etapa 2 — Modelo relacional, consultas y autenticación

La segunda etapa continúa el proyecto anterior, ampliando su modelo de datos, las funcionalidades de consulta y los mecanismos de seguridad.

**Funcionalidades implementadas:**

- Relaciones `@ManyToOne` y `@OneToMany`.
- Claves foráneas entre las entidades.
- Reglas de integridad referencial.
- Consultas con información relacionada.
- Validación de existencia de estudiantes y becas al crear solicitudes.
- Validación de estudiantes activos.
- Prevención de solicitudes duplicadas.
- Consultas de solicitudes por estudiante y por beca.
- Filtros mediante parámetros de consulta.
- Búsqueda por texto en los módulos correspondientes.
- Paginación y ordenamiento ascendente y descendente.
- Metadatos de paginación.
- Validación de parámetros de consulta.
- Rechazo de propiedades no permitidas.
- Configuración de TypeORM con `synchronize: false`.
- Configuración de migraciones de TypeORM.
- Registro de usuarios.
- Hash de contraseñas mediante bcrypt.
- Inicio de sesión.
- Generación y validación de tokens JWT.
- Protección de endpoints de escritura mediante un guard de autenticación.
- Prueba de acceso sin token y creación de una solicitud con token válido.

**Pendiente para completar la entrega:**

- Completar las pruebas de todas las operaciones CRUD.
- Verificar las reglas de eliminación y la integridad referencial.
- Completar las pruebas de migraciones desde una base de datos limpia.
- Probar de forma específica todos los endpoints protegidos.
- Completar las pruebas de contraseñas incorrectas, tokens inválidos y expirados.
- Organizar las evidencias finales.
- Preparar el documento académico de entrega.

---

## 3. Tecnologías utilizadas

- Node.js.
- NestJS.
- TypeScript.
- PostgreSQL.
- TypeORM.
- `pg`.
- `@nestjs/config`.
- `@nestjs/typeorm`.
- `class-validator`.
- `class-transformer`.
- `@nestjs/mapped-types`.
- `@nestjs/jwt`.
- `@nestjs/passport`.
- `passport`.
- `passport-jwt`.
- `bcrypt`.
- `@types/passport-jwt`.
- `@types/bcrypt`.
- `typeorm-ts-node-esm`.
- npm.
- Thunder Client.

---

## 4. Arquitectura del sistema

El proyecto sigue una arquitectura modular. Cada recurso separa sus responsabilidades mediante controladores, servicios, DTOs y entidades.

Estructura general:

```text
src/
├── auth/
├── users/
├── students/
├── scholarships/
├── applications/
├── documents/
├── tracking/
├── migrations/
├── data-source.ts
├── app.module.ts
├── app.controller.ts
├── app.service.ts
└── main.ts
```

Los módulos de autenticación y usuarios complementan los cinco módulos principales de negocio.

Cada módulo de recurso contiene, según corresponda:

```text
modulo/
├── dto/
├── entities/
├── pipes/
├── modulo.controller.ts
├── modulo.service.ts
└── modulo.module.ts
```

### Responsabilidades

- **Controller:** expone los endpoints HTTP y recibe los parámetros y cuerpos de las peticiones.
- **Service:** implementa la lógica de negocio y las operaciones sobre los datos.
- **DTO:** define la estructura de entrada y las reglas de validación.
- **Pipe:** valida y transforma parámetros cuando corresponde.
- **Entity:** representa las tablas y las relaciones administradas por TypeORM.
- **Repository:** permite consultar, insertar, actualizar y eliminar registros.
- **Guard:** controla el acceso a las rutas protegidas mediante autenticación.
- **Strategy:** extrae y valida el token JWT.
- **Migration:** registra cambios controlados en la estructura de la base de datos.

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
Cliente recibe access_token
    ↓
Petición con Authorization: Bearer <token>
    ↓
JwtAuthGuard
    ↓
JwtStrategy valida el token
    ↓
Acceso al endpoint protegido
```

---

## 5. Modelo relacional

Las entidades principales se relacionan de la siguiente manera:

```text
Student 1:N Application N:1 Scholarship

Application 1:N Document

Application 1:N Tracking
```

Representación general:

```text
Student
   │
   │ 1:N
   ▼
Application ◄──── N:1 ──── Scholarship
   │
   ├── 1:N ──► Document
   │
   └── 1:N ──► Tracking
```

### Student — Application

Un estudiante puede registrar varias solicitudes de beca.

La entidad `Application` mantiene la clave foránea del estudiante mediante `studentId`.

### Scholarship — Application

Una beca puede estar relacionada con varias solicitudes.

La entidad `Application` mantiene la clave foránea de la beca mediante `scholarshipId`.

### Application — Document

Una solicitud puede tener varios documentos asociados mediante `applicationId`.

### Application — Tracking

Una solicitud puede tener varios registros de seguimiento mediante `applicationId`.

Las relaciones se representan en TypeORM mediante decoradores como `@ManyToOne` y `@OneToMany`.

### Reglas de eliminación

La configuración de las relaciones contempla reglas de integridad referencial:

- Las relaciones de `Application` con `Student` y `Scholarship` utilizan `RESTRICT`.
- Las relaciones de `Document` y `Tracking` con `Application` utilizan `CASCADE`.

Estas reglas deben mantenerse alineadas con las restricciones reales de PostgreSQL.

---

## 6. Entidades del sistema

### 6.1. Students

Representa a los estudiantes que pueden solicitar becas.

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

Tabla: `students`.

El correo electrónico se encuentra configurado como único.

### 6.2. Scholarships

Representa las becas disponibles.

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

Tabla: `scholarships`.

### 6.3. Applications

Representa las solicitudes de becas.

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

Tabla: `applications`.

Estados utilizados:

```text
pendiente
revision
aprobada
rechazada
correccion
```

Reglas de negocio implementadas:

- El estudiante debe existir.
- La beca debe existir.
- El estudiante debe estar activo para registrar una solicitud.
- No se permite más de una solicitud del mismo estudiante para la misma beca.
- Se comprueba la existencia de los registros relacionados antes de crear una solicitud.

La combinación de estudiante y beca utiliza una restricción única compuesta, complementada con una comprobación en el servicio.

### 6.4. Documents

Representa los documentos asociados a las solicitudes.

Campos principales:

```text
id
applicationId
name
url
status
```

Tabla: `documents`.

Estados utilizados:

```text
pendiente
cargado
observado
aprobado
```

### 6.5. Tracking

Representa el historial de seguimiento de las solicitudes.

Campos principales:

```text
id
applicationId
status
comment
createdAt
```

Tabla: `tracking`.

Los registros de seguimiento permiten consultar el historial relacionado con una solicitud.

### 6.6. Users

Representa las cuentas que pueden autenticarse en la API.

Campos principales:

```text
id
email
password
```

Tabla: `users`.

Características:

- El correo electrónico es único.
- La contraseña se almacena mediante un hash generado con bcrypt.
- La contraseña está configurada para no incluirse en las consultas normales de la entidad.
- El registro devuelve información pública del usuario, sin exponer la contraseña.
- El inicio de sesión valida las credenciales y devuelve un token JWT.

La tabla `users` está creada en PostgreSQL y la migración correspondiente se ejecutó correctamente.

---

## 7. CRUD y endpoints disponibles

Los controladores exponen operaciones para crear, consultar, actualizar y eliminar registros. Las rutas indicadas describen la API; la cobertura funcional completa de cada operación debe verificarse mediante pruebas.

### Students

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/students` | Consultar estudiantes con filtros y paginación |
| GET | `/students/:id` | Consultar un estudiante por ID |
| POST | `/students` | Crear un estudiante |
| PATCH | `/students/:id` | Actualizar un estudiante |
| DELETE | `/students/:id` | Eliminar un estudiante |

### Scholarships

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/scholarships` | Consultar becas con filtros y paginación |
| GET | `/scholarships/:id` | Consultar una beca por ID |
| POST | `/scholarships` | Crear una beca |
| PATCH | `/scholarships/:id` | Actualizar una beca |
| DELETE | `/scholarships/:id` | Eliminar una beca |

### Applications

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/applications` | Consultar solicitudes con filtros y paginación |
| GET | `/applications/:id` | Consultar una solicitud con sus relaciones |
| GET | `/applications/student/:studentId` | Consultar solicitudes de un estudiante |
| GET | `/applications/scholarship/:scholarshipId` | Consultar solicitudes de una beca |
| POST | `/applications` | Crear una solicitud; requiere JWT |
| PATCH | `/applications/:id` | Actualizar una solicitud; requiere JWT |
| PATCH | `/applications/:id/status` | Cambiar el estado; requiere JWT |
| DELETE | `/applications/:id` | Eliminar una solicitud; requiere JWT |

### Documents

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/documents` | Consultar documentos con filtros y paginación |
| GET | `/documents/:id` | Consultar un documento por ID |
| GET | `/documents/application/:applicationId` | Consultar documentos de una solicitud |
| POST | `/documents` | Crear un documento; requiere JWT |
| PATCH | `/documents/:id` | Actualizar un documento; requiere JWT |
| PATCH | `/documents/:id/status` | Cambiar el estado; requiere JWT |
| DELETE | `/documents/:id` | Eliminar un documento; requiere JWT |

Las rutas de escritura de `Applications` y `Documents` están configuradas para utilizar el guard JWT. Las pruebas específicas de cada ruta deben completarse antes de afirmar que todos los casos están verificados.

### Tracking

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/tracking` | Consultar seguimientos con filtros y paginación |
| GET | `/tracking/:id` | Consultar un seguimiento por ID |
| GET | `/tracking/application/:applicationId` | Consultar seguimientos de una solicitud |
| POST | `/tracking` | Crear un seguimiento |
| PATCH | `/tracking/:id` | Actualizar un seguimiento |
| DELETE | `/tracking/:id` | Eliminar un seguimiento |

### Auth

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/auth/register` | Registrar un usuario |
| POST | `/auth/login` | Iniciar sesión y obtener un JWT |

El registro y el inicio de sesión no requieren un token previo. El token recibido después del inicio de sesión se utiliza para acceder a las rutas protegidas.

---

## 8. Búsqueda, filtros, ordenamiento y paginación

Los módulos de negocio cuentan con DTOs de consulta para validar los parámetros recibidos mediante query params.

Las consultas se construyen en los servicios utilizando TypeORM y sus repositorios.

### Funcionalidades implementadas

- Búsqueda por texto en los módulos que la admiten.
- Filtros por campos específicos de cada recurso.
- Filtros por identificadores relacionados.
- Ordenamiento ascendente (`ASC`) y descendente (`DESC`).
- Paginación mediante `page` y `limit`.
- Validación del número de página y del límite.
- Restricción del tamaño máximo de página a 50 registros.
- Validación de campos permitidos para ordenar.
- Metadatos con el total de registros y páginas.

### Ejemplo de consulta de becas

```http
GET /scholarships?search=beca&isActive=true&page=1&limit=5&sortBy=name&order=ASC
```

### Ejemplo de consulta de estudiantes

```http
GET /students?career=Software&semester=5&isActive=true&page=1&limit=5&sortBy=lastName&order=ASC
```

### Ejemplo de consulta de solicitudes

```http
GET /applications?studentId=1&scholarshipId=1&status=pendiente&page=1&limit=5&sortBy=gpa&order=DESC
```

### Ejemplo de consulta de documentos

```http
GET /documents?applicationId=1&status=pendiente&page=1&limit=5&sortBy=name&order=ASC
```

### Ejemplo de consulta de seguimiento

```http
GET /tracking?applicationId=1&status=revision&page=1&limit=5&sortBy=createdAt&order=DESC
```

Los nombres y valores de los parámetros deben corresponder a los definidos en el DTO de cada módulo.

### Estructura de respuesta

Las consultas paginadas utilizan una estructura general como la siguiente:

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

Donde:

- `items`: registros correspondientes a la página solicitada.
- `total`: cantidad total de registros que cumplen los filtros.
- `page`: página actual.
- `limit`: cantidad máxima de registros solicitados.
- `totalPages`: número total de páginas calculado a partir del total y el límite.

### Ejemplo de paginación

```http
GET /documents?page=1&limit=1
GET /documents?page=2&limit=1
```

Estas consultas permiten verificar que los registros se distribuyen entre páginas y que los metadatos se actualizan según el resultado.

### Semana 6 — Consultas de datos

Contrato común de los listados:

| Parámetro | Regla | Valor por defecto |
|---|---|---|
| `page` | Entero ≥ 1 | `1` |
| `limit` | Entero de 1 a 50 | `10` |
| `sortBy` | Solo campos permitidos por recurso | `id` |
| `order` | `ASC` o `DESC` | `ASC` |

Un valor inválido o un parámetro desconocido responde `400 Bad Request` cuando así lo establece la validación del DTO.

| Recurso | Filtros y búsqueda | `sortBy` permitido |
|---|---|---|
| `/scholarships` | `search`, `isActive` | `id`, `name`, `amount`, `startDate`, `endDate` |
| `/students` | `search`, `career`, `semester`, `isActive` | `id`, `firstName`, `lastName`, `age`, `semester`, `career` |
| `/applications` | `search`, `studentId`, `scholarshipId`, `status`, `activeOnly` | `id`, `gpa`, `income`, `status` |
| `/documents` | `search`, `applicationId`, `status` | `id`, `name`, `status`, `applicationId` |
| `/tracking` | `search`, `applicationId`, `status` | `id`, `status`, `createdAt`, `applicationId` |

### Solicitudes relacionadas (`QueryBuilder`)

- `GET /applications` permite consultar solicitudes y cargar relaciones cuando así lo configura el servicio.
- La búsqueda puede utilizar `ILIKE` para comparar texto sin distinguir mayúsculas y minúsculas.
- `activeOnly=true` limita las solicitudes a estudiantes activos cuando se aplica en el servicio.
- Los parámetros de búsqueda deben enviarse como parámetros de consulta SQL, evitando interpolar directamente el texto recibido.
- El ordenamiento debe utilizar una lista cerrada de campos permitidos.
- Una búsqueda sin coincidencias debe devolver una respuesta satisfactoria con `items: []`, cuando el servicio esté diseñado para ello.

### Ejemplos de URL

```http
GET /scholarships?isActive=true&page=2&limit=5&sortBy=name&order=ASC
GET /applications?search=ana&page=1&limit=5
GET /applications?search=software&activeOnly=true&page=1&limit=2&sortBy=gpa&order=DESC
GET /applications?studentId=1&status=pendiente
GET /applications?search=inexistente
GET /scholarships?limit=200
```

---

## 9. Validaciones y manejo de errores

El proyecto utiliza un `ValidationPipe` global configurado en `main.ts`:

```ts
app.useGlobalPipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
);
```

Esta configuración permite:

- Validar los datos recibidos mediante DTOs.
- Transformar parámetros cuando corresponde.
- Rechazar propiedades que no están definidas en los DTOs.
- Aplicar restricciones a los parámetros de consulta.

### Errores contemplados

| Caso | Respuesta esperada |
|---|---|
| Parámetro de página no numérico | `400 Bad Request` |
| Límite superior al máximo permitido | `400 Bad Request` |
| Identificador de filtro no válido | `400 Bad Request` |
| Estado de documento no permitido | `400 Bad Request` |
| Campo de ordenamiento desconocido | `400 Bad Request` |
| Propiedad de consulta desconocida | `400 Bad Request` |
| Consulta de un ID inexistente | `404 Not Found` |
| Creación de documento con solicitud inexistente | `404 Not Found` |
| Creación de seguimiento con solicitud inexistente | `404 Not Found` |
| Beca sin nombre obligatorio | `400 Bad Request` |
| Estudiante con edad negativa | `400 Bad Request` |
| Credenciales incorrectas | `401 Unauthorized` |
| Petición protegida sin JWT válido | `401 Unauthorized` |

Las respuestas específicas dependen de las excepciones implementadas en cada servicio y de las validaciones del DTO correspondiente.

### Reglas de negocio de las solicitudes

**Estudiante inexistente:** no se permite crear una solicitud con un estudiante que no existe.

**Beca inexistente:** no se permite crear una solicitud con una beca que no existe.

**Estudiante inactivo:** no se permite registrar una nueva solicitud con un estudiante inactivo.

**Solicitud duplicada:** la combinación de estudiante y beca debe ser única. Cuando se intenta crear una solicitud duplicada, el servicio está diseñado para responder con `409 Conflict`.

**Autenticación:** las rutas de escritura protegidas requieren un token JWT válido.

---

## 10. Configuración de PostgreSQL

La base de datos utilizada durante el desarrollo local es:

```text
Nombre: SG_Becas_ULEAM
Host: localhost
Puerto: 5432
Usuario: postgres
```

La aplicación utiliza PostgreSQL como almacenamiento persistente y TypeORM como herramienta de mapeo objeto-relacional.

Las tablas principales son:

```text
students
scholarships
applications
documents
tracking
users
migrations
```

Las relaciones entre las tablas se representan mediante claves foráneas.

### Variables de entorno

El proyecto utiliza un archivo `.env` local para la conexión:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=SG_Becas_ULEAM
DATABASE_USER=postgres
DATABASE_PASSWORD=tu_contraseña

JWT_SECRET=tu_secreto_jwt
JWT_EXPIRES_IN=3600
```

El archivo `.env.example` debe indicar las variables necesarias sin publicar las credenciales reales. Por ejemplo:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=SG_Becas_ULEAM
DATABASE_USER=postgres
DATABASE_PASSWORD=change_me

JWT_SECRET=replace_with_a_secure_secret
JWT_EXPIRES_IN=3600
```

El archivo `.env` debe permanecer excluido del control de versiones mediante `.gitignore`.

**No se deben publicar contraseñas reales ni el secreto JWT en GitHub.** El valor de `JWT_SECRET` debe ser privado, aleatorio y suficientemente seguro.

### Configuración actual de TypeORM

La aplicación utiliza `@nestjs/config` y `@nestjs/typeorm` para configurar la conexión a PostgreSQL.

La configuración de entrega utiliza:

```ts
synchronize: false
```

Esto evita que TypeORM modifique automáticamente la estructura de las tablas al iniciar la aplicación. Los cambios del esquema deben administrarse mediante migraciones.

### Migraciones de TypeORM

El archivo `src/data-source.ts` configura una fuente de datos independiente para ejecutar migraciones:

- Carga las entidades del proyecto.
- Lee las variables de entorno.
- Identifica los archivos de migración de `src/migrations`.
- Mantiene `synchronize: false`.

Los comandos disponibles son:

```bash
npm run migration:generate -- src/migrations/NombreMigracion
npm run migration:run
npm run migration:revert
```

`migration:generate` genera una migración a partir de las diferencias detectadas entre las entidades y el esquema de la base de datos. `migration:run` ejecuta las migraciones pendientes y `migration:revert` revierte la última migración ejecutada, siempre que la operación sea compatible con su implementación.

**Estado actual:** se registró el esquema inicial existente en el historial de migraciones y se ejecutó correctamente `CreateUsersTable1791725363913`, que creó la tabla `users`.

Antes de utilizar una base de datos nueva, se debe comprobar que todas las migraciones necesarias para crear el esquema completo estén disponibles y puedan ejecutarse en el orden correcto. El historial de migraciones debe mantenerse coherente con el estado real de PostgreSQL.

No se debe volver a ejecutar ni modificar arbitrariamente el historial de migraciones sobre la base existente sin revisar primero su estado.

---

## 11. Autenticación y seguridad JWT

La autenticación permite registrar usuarios, verificar sus credenciales y proteger endpoints de escritura.

### Registro de usuarios

Endpoint:

```http
POST /auth/register
Content-Type: application/json
```

Cuerpo de ejemplo:

```json
{
  "email": "usuario@example.com",
  "password": "Prueba123!"
}
```

La contraseña debe cumplir las reglas de validación del DTO.

Al registrar un usuario:

1. Se verifica si el correo ya está registrado.
2. Se genera un hash de la contraseña mediante bcrypt.
3. Se almacena el usuario en PostgreSQL.
4. Se devuelve información pública del usuario, sin la contraseña.

Ejemplo de respuesta:

```json
{
  "id": 1,
  "email": "usuario@example.com"
}
```

### Inicio de sesión

Endpoint:

```http
POST /auth/login
Content-Type: application/json
```

Cuerpo de ejemplo:

```json
{
  "email": "usuario@example.com",
  "password": "Prueba123!"
}
```

Si las credenciales son correctas, el servidor devuelve un token JWT:

```json
{
  "access_token": "<token_jwt>"
}
```

El token contiene información de identificación del usuario y tiene un tiempo de expiración configurado mediante `JWT_EXPIRES_IN`.

No se debe publicar un token real en el README ni subirlo al repositorio.

### Uso del token

Para acceder a un endpoint protegido, el cliente debe enviar el encabezado:

```http
Authorization: Bearer <token_jwt>
```

En Thunder Client se puede configurar desde **Auth → Bearer**, pegando únicamente el valor de `access_token`, sin las comillas y sin escribir la palabra `Bearer` manualmente.

### Protección de endpoints

El guard `JwtAuthGuard` utiliza la estrategia JWT para validar el token recibido.

Las rutas de escritura de `Applications` y `Documents` están configuradas para requerir autenticación.

Los endpoints públicos de consulta pueden seguir accesibles sin token, según la configuración de sus controladores.

### Pruebas de autenticación realizadas

| Prueba | Resultado |
|---|---|
| Registro de usuario | Correcto; devuelve ID y correo |
| Inicio de sesión con credenciales válidas | Correcto; devuelve `access_token` |
| `POST /applications` sin token | `401 Unauthorized` |
| `POST /applications` con token y cuerpo vacío | `400 Bad Request` por validación de campos |
| `POST /applications` con token y datos válidos | Correcto; solicitud creada en PostgreSQL |

La creación de la solicitud con ID `4` confirmó que el endpoint aceptó la petición autenticada y persistió los datos relacionados con el estudiante y la beca.

Las pruebas de acceso sin token y con token deben repetirse en las demás rutas protegidas, y deben completarse las pruebas con credenciales incorrectas y tokens inválidos o expirados.

---

## 12. Pruebas realizadas hasta el momento

Las siguientes comprobaciones se han ejecutado durante el desarrollo.

| Prueba | Resultado |
|---|---|
| Compilación del proyecto | Correcta en las ejecuciones realizadas |
| Consulta por ID en los módulos de negocio | Correcta para los IDs probados |
| Consulta de solicitud con relaciones | Correcta para el registro probado |
| Consulta de documentos y seguimientos relacionados | Correcta en los casos probados |
| Filtros combinados de los módulos | Correctos en las pruebas realizadas |
| Ordenamiento y paginación | Correctos en los casos probados |
| Validación de parámetros inválidos | Correcta en los casos probados |
| Rechazo de propiedades desconocidas | Correcto en la prueba realizada |
| Consulta de IDs inexistentes | HTTP 404 en los casos probados |
| Registro de usuario | Correcto |
| Inicio de sesión y generación de JWT | Correcto |
| Acceso sin token a `POST /applications` | HTTP 401 |
| Creación de solicitud con JWT | Correcta |
| Ejecución de la migración de usuarios | Correcta |

Estas pruebas confirman los casos indicados, pero no representan una garantía de que todos los escenarios posibles estén cubiertos.

### Pruebas que faltan completar

- Crear, actualizar y eliminar registros de prueba en los cinco módulos de negocio.
- Verificar los campos obligatorios y las restricciones de los DTOs.
- Probar las reglas de eliminación y las claves foráneas.
- Verificar la persistencia tras reiniciar el servidor.
- Probar las migraciones en una base de datos de prueba limpia.
- Probar registro duplicado y contraseña incorrecta.
- Probar un token inválido y un token expirado.
- Probar cada endpoint de escritura protegido con y sin token.
- Verificar los casos de error de las rutas protegidas.
- Completar las evidencias y el documento de entrega.

---

## 13. Instalación

Clonar el repositorio:

```bash
git clone https://github.com/GabrielGL11/proyecto_asw.git
```

Ingresar a la carpeta:

```bash
cd proyecto_asw
```

Instalar las dependencias:

```bash
npm install
```

Crear un archivo `.env` a partir de `.env.example` y configurar los datos de conexión a PostgreSQL y las variables JWT.

Antes de iniciar la aplicación, verificar que PostgreSQL esté funcionando y que exista la base de datos configurada.

Si se utiliza una base de datos nueva, ejecutar únicamente las migraciones necesarias para construir el esquema completo, después de comprobar el estado y el orden de las migraciones.

---

## 14. Ejecución de la aplicación

### Desarrollo

```bash
npm run start
```

### Desarrollo con recarga automática

```bash
npm run start:dev
```

### Producción

```bash
npm run start:prod
```

La API se utiliza actualmente en:

```text
http://localhost:5500
```

El puerto depende de la configuración de la aplicación.

---

## 15. Comandos de comprobación

### Compilar el proyecto

```bash
npm run build
```

### Ejecutar pruebas unitarias

```bash
npm run test
```

### Ejecutar pruebas end-to-end

```bash
npm run test:e2e
```

### Obtener cobertura de pruebas

```bash
npm run test:cov
```

### Generar una migración

```bash
npm run migration:generate -- src/migrations/NombreMigracion
```

### Ejecutar migraciones pendientes

```bash
npm run migration:run
```

### Revertir la última migración

```bash
npm run migration:revert
```

Las pruebas manuales de los endpoints se realizan mediante Thunder Client y, cuando corresponde, mediante PowerShell.

---

## 16. Evidencias del proyecto

Las capturas deben organizarse según las pruebas que realmente se hayan realizado.

Estructura propuesta para la entrega:

```text
Evidencias Entrega 2/
├── 01-Modelo-Relacional/
├── 02-Consultas-Filtros/
├── 03-Paginacion-Ordenamiento/
├── 04-Validaciones-Errores/
├── 05-Persistencia-PostgreSQL/
├── 06-Migraciones/
├── 07-Registro-Usuarios/
├── 08-Login-JWT/
└── 09-Rutas-Protegidas/
```

Las evidencias de autenticación deben incluir, cuando se realicen:

- Registro de usuario.
- Inicio de sesión y respuesta con `access_token`.
- Petición protegida sin token y respuesta `401`.
- Petición protegida con token válido.
- Creación correcta de una solicitud.
- Pruebas de acceso a las rutas protegidas de documentos.

Las evidencias de migraciones deben reflejar las operaciones realmente ejecutadas y el estado de PostgreSQL.

Las evidencias anteriores deben conservarse si forman parte de la entrega de la primera etapa.

---

## 17. Lista de trabajo pendiente

### Consultas y validaciones

- [x] DTOs de consulta en los módulos de negocio.
- [x] Búsqueda y filtros implementados según cada recurso.
- [x] Paginación.
- [x] Ordenamiento.
- [x] Metadatos de paginación.
- [x] Validación de parámetros de consulta.
- [x] Pruebas de varias combinaciones de filtros.
- [x] Pruebas de errores HTTP `400` y `404` en los casos documentados.
- [ ] Completar las pruebas CRUD para los cinco módulos.
- [ ] Completar las pruebas de integridad referencial y eliminación.

### Persistencia y configuración

- [x] Entidades de TypeORM.
- [x] Conexión con PostgreSQL.
- [x] Relaciones entre los recursos.
- [x] Configuración de `synchronize: false`.
- [x] Fuente de datos para migraciones.
- [x] Registro de la migración inicial en el historial de la base existente.
- [x] Ejecución de la migración para crear la tabla `users`.
- [ ] Verificar la reconstrucción completa del esquema mediante migraciones en una base de datos limpia.
- [ ] Verificar la configuración final del entorno de entrega.

### Autenticación y seguridad

- [x] Crear el módulo `users`.
- [x] Implementar el registro de usuarios.
- [x] Implementar el hash de contraseñas con bcrypt.
- [x] Crear el módulo `auth`.
- [x] Implementar el login.
- [x] Generar tokens JWT.
- [x] Implementar la validación de tokens.
- [x] Configurar el guard de autenticación.
- [x] Proteger endpoints de escritura de solicitudes y documentos.
- [x] Comprobar el rechazo de una solicitud sin token.
- [x] Comprobar el acceso autenticado al crear una solicitud.
- [ ] Probar todos los endpoints protegidos sin token y con token.
- [ ] Completar las pruebas de credenciales incorrectas.
- [ ] Completar las pruebas de tokens inválidos y expirados.

### Documentación y entrega

- [ ] Completar las evidencias de las pruebas restantes.
- [ ] Preparar el documento final de la etapa.
- [ ] Verificar que `.env` no se publique en el repositorio.
- [ ] Ejecutar nuevamente `npm run build`.
- [ ] Revisar el estado final del repositorio y sus commits.
- [ ] Confirmar que la documentación coincide con la versión final del código.

---

## 18. Recursos oficiales

- [Documentación de NestJS](https://docs.nestjs.com/)
- [Repositorio de NestJS](https://github.com/nestjs/nest)
- [Documentación de TypeORM](https://typeorm.io/)
- [Documentación de PostgreSQL](https://www.postgresql.org/docs/)
- [Documentación de class-validator](https://github.com/typestack/class-validator)
- [Documentación de Passport](https://www.passportjs.org/)
- [Documentación de JWT en NestJS](https://docs.nestjs.com/security/authentication)

---

## Autoría

Proyecto académico desarrollado para la asignatura de **Desarrollo Backend Web con NestJS**.

**Universidad Laica Eloy Alfaro de Manabí (ULEAM)**

Repositorio: [https://github.com/GabrielGL11/proyecto_asw](https://github.com/GabrielGL11/proyecto_asw)