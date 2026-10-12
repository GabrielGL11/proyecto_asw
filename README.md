# Sistema de Gestión de Becas ULEAM

Backend desarrollado con **NestJS, TypeScript, TypeORM y PostgreSQL** para administrar los procesos de becas estudiantiles de la Universidad Laica Eloy Alfaro de Manabí (ULEAM).

Proyecto académico de la asignatura **Desarrollo Backend Web con NestJS — Segunda Etapa**.

**Repositorio:** [https://github.com/GabrielGL11/proyecto_asw](https://github.com/GabrielGL11/proyecto_asw)

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
| Joi | Validación de configuración, cuando corresponda |
| `@nestjs/jwt` | Generación y manejo de JWT |
| `@nestjs/passport` | Integración de Passport con NestJS |
| `passport-jwt` | Estrategia JWT |
| bcrypt | Hash de contraseñas |
| Vitest | Pruebas automatizadas |
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
├── migrations/
├── data-source.ts
├── app.module.ts
├── app.controller.ts
├── app.service.ts
└── main.ts
```

Cada módulo contiene los componentes necesarios para gestionar su recurso, según su implementación.

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
Cliente recibe access_token
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
```

Características:

- Correo electrónico único.
- Contraseñas almacenadas mediante hashes generados con bcrypt.
- Registro de usuarios.
- Inicio de sesión con validación de credenciales.
- Generación de tokens JWT para la autenticación.

La entidad configura la contraseña para que no se seleccione en las consultas habituales de TypeORM, salvo cuando el servicio necesita recuperarla expresamente para verificar las credenciales.

## 8. Endpoints de la API

La API utiliza métodos HTTP para consultar, crear, actualizar y eliminar recursos.

### 8.1. Students

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| GET | `/students` | Consultar estudiantes | Público |
| GET | `/students/:id` | Consultar un estudiante | Público |
| POST | `/students` | Crear estudiante | JWT |
| PATCH | `/students/:id` | Actualizar estudiante | JWT |
| DELETE | `/students/:id` | Eliminar estudiante | JWT |

### 8.2. Scholarships

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| GET | `/scholarships` | Consultar becas | Público |
| GET | `/scholarships/:id` | Consultar una beca | Público |
| POST | `/scholarships` | Crear beca | JWT |
| PATCH | `/scholarships/:id` | Actualizar beca | JWT |
| DELETE | `/scholarships/:id` | Eliminar beca | JWT |

### 8.3. Applications

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| GET | `/applications` | Consultar solicitudes | Público |
| GET | `/applications/:id` | Consultar una solicitud | Público |
| GET | `/applications/student/:studentId` | Consultar solicitudes de un estudiante | Público |
| GET | `/applications/scholarship/:scholarshipId` | Consultar solicitudes de una beca | Público |
| POST | `/applications` | Crear solicitud | JWT |
| PATCH | `/applications/:id` | Actualizar solicitud | JWT |
| PATCH | `/applications/:id/status` | Cambiar estado | JWT |
| DELETE | `/applications/:id` | Eliminar solicitud | JWT |

### 8.4. Documents

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| GET | `/documents` | Consultar documentos | Público |
| GET | `/documents/:id` | Consultar un documento | Público |
| GET | `/documents/application/:applicationId` | Consultar documentos de una solicitud | Público |
| POST | `/documents` | Crear documento | JWT |
| PATCH | `/documents/:id` | Actualizar documento | JWT |
| PATCH | `/documents/:id/status` | Cambiar estado | JWT |
| DELETE | `/documents/:id` | Eliminar documento | JWT |

### 8.5. Tracking

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| GET | `/tracking` | Consultar seguimientos | Público |
| GET | `/tracking/:id` | Consultar un seguimiento | Público |
| GET | `/tracking/application/:applicationId` | Consultar seguimiento de una solicitud | Público |
| POST | `/tracking` | Crear seguimiento | JWT |
| PATCH | `/tracking/:id` | Actualizar seguimiento | JWT |
| DELETE | `/tracking/:id` | Eliminar seguimiento | JWT |

### 8.6. Auth

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| POST | `/auth/register` | Registrar usuario | Público |
| POST | `/auth/login` | Iniciar sesión y obtener JWT | Público |

### 8.7. Ruta principal

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| GET | `/` | Verificar la respuesta principal de la API | Público |

Las rutas de escritura indicadas como JWT están protegidas mediante `JwtAuthGuard`. El registro y el inicio de sesión son públicos porque permiten obtener las credenciales necesarias para acceder a las operaciones protegidas.

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
| `404 Not Found` | Recurso inexistente |
| `409 Conflict` | Conflicto, como un correo o una solicitud duplicados |

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
```

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

La ejecución de las dos migraciones se comprobó en una base de datos de prueba independiente. El historial mostró ambas migraciones como ejecutadas:

```text
[X] 1 InitialSchema1791676800000
[X] 2 CreateUsersTable1791725363913
```

Esta prueba permite comprobar que el esquema puede construirse desde cero mediante las migraciones, sin depender de `synchronize: true`.

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

Con credenciales válidas, la API devuelve un token JWT.

### Uso del token

Para realizar una petición a una ruta protegida, se envía el token en el encabezado:

```http
Authorization: Bearer <token_jwt>
```

`JwtAuthGuard` y `JwtStrategy` verifican la autenticación antes de permitir el acceso.

### Pruebas de autenticación realizadas

Se comprobó el comportamiento de la API en los siguientes escenarios:

- Registro de usuarios.
- Rechazo de correos duplicados.
- Rechazo de credenciales incorrectas con `401 Unauthorized`.
- Rechazo de solicitudes a rutas protegidas sin autenticación.
- Creación autenticada de documentos.
- Rechazo de solicitudes duplicadas con `409 Conflict`.

La comprobación de tokens inválidos o expirados debe documentarse como realizada únicamente cuando se haya ejecutado la prueba correspondiente.

## 14. Pruebas automatizadas y compilación

El proyecto utiliza Vitest para ejecutar las pruebas automatizadas.

Ejecutar las pruebas:

```bash
npm test
```

Ejecutarlas con detalle:

```bash
npm test -- --reporter=verbose
```

Resultado de la ejecución compartida:

| Indicador | Resultado |
|---|---:|
| Archivos de prueba aprobados | 11 |
| Pruebas aprobadas | 69 |
| Pruebas fallidas | 0 |

También se comprobó la compilación del backend mediante:

```bash
npm run build
```

La ejecución compartida finalizó sin errores de compilación.

Las pruebas manuales de los endpoints se realizaron mediante Thunder Client, mientras que las pruebas automatizadas permiten verificar los comportamientos implementados en los módulos y servicios.

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

## 16. Comandos de comprobación

| Propósito | Comando |
|---|---|
| Compilar | `npm run build` |
| Ejecutar pruebas | `npm test` |
| Ejecutar pruebas detalladas | `npm test -- --reporter=verbose` |
| Ejecutar pruebas end-to-end | `npm run test:e2e` |
| Generar cobertura | `npm run test:cov` |
| Ejecutar migraciones | `npm run migration:run` |
| Revertir última migración | `npm run migration:revert` |
| Consultar migraciones | `npx typeorm-ts-node-esm migration:show -d src/data-source.ts` |

Los comandos de pruebas end-to-end y cobertura dependen de la configuración y los scripts presentes en `package.json`.

## 17. Evidencias del proyecto

Las evidencias se organizan por entrega en el repositorio:

```text
Evidencias/
├── Evidencias Entrega 1/
└── Evidencias Entrega 2/
```

Las evidencias de la segunda etapa incluyen capturas relacionadas con:

- Modelo relacional y relaciones entre entidades.
- Claves foráneas y restricciones.
- Filtros, búsquedas, paginación y ordenamiento.
- Configuración de TypeORM.
- Ejecución de migraciones.
- Registro de usuarios e inicio de sesión.
- Protección de rutas mediante JWT.
- Pruebas automatizadas.
- Compilación del backend.
- Persistencia de datos en PostgreSQL.

Repositorio de evidencias:

[https://github.com/GabrielGL11/proyecto_asw/tree/main/Evidencias/Evidencias%20Entrega%202](https://github.com/GabrielGL11/proyecto_asw/tree/main/Evidencias/Evidencias%20Entrega%202)

Las capturas deben corresponder a resultados reales y no deben mostrar credenciales, contraseñas reales, secretos JWT ni tokens activos.

## 18. Verificaciones de entrega

Antes de una nueva entrega o demostración, se recomienda confirmar los siguientes puntos:

- [x] Relaciones entre las entidades principales.
- [x] Claves foráneas y restricciones de integridad.
- [x] Prevención de solicitudes duplicadas.
- [x] Consultas con filtros, paginación y ordenamiento.
- [x] Migraciones verificadas en una base de prueba independiente.
- [x] Configuración de TypeORM con `synchronize: false` para la entrega.
- [x] Registro, login y autenticación JWT implementados.
- [x] Rutas de escritura protegidas mediante JWT.
- [x] Pruebas automatizadas aprobadas según la ejecución compartida.
- [x] Compilación sin errores según la ejecución compartida.
- [x] Archivo `.env` excluido del repositorio.
- [x] Tabla de endpoints contrastada con los controladores y guards.
- [x] Revisar que los comandos documentados coincidan con la versión actual de `package.json`.
- [x] Revisar el estado final de Git antes de realizar el commit y el push.

## 19. Recursos oficiales

- [Documentación de NestJS](https://docs.nestjs.com/)
- [Repositorio de NestJS](https://github.com/nestjs/nest)
- [Documentación de TypeORM](https://typeorm.io/)
- [Documentación de PostgreSQL](https://www.postgresql.org/docs/)
- [class-validator](https://github.com/typestack/class-validator)
- [Passport.js](https://www.passportjs.org/)
- [Autenticación en NestJS](https://docs.nestjs.com/security/authentication)
- [Documentación de Joi](https://joi.dev/api/)

---

## Autoría

Proyecto académico desarrollado para la asignatura **Desarrollo Backend Web con NestJS**.

**Universidad:** Universidad Laica Eloy Alfaro de Manabí (ULEAM)

**Integrantes:**

- Jose Gabriel Alava Barcia
- Anthony Gabriel Guaman Lucio
- Jordan Josue Solorzano Zambrano

**Carrera:** Software, 5.º “B”

**Docente:** Ing. Joffre Edgardo Panchana Flores, Mg.

**Repositorio:** [https://github.com/GabrielGL11/proyecto_asw](https://github.com/GabrielGL11/proyecto_asw)
