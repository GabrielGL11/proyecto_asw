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

Backend desarrollado con **NestJS + TypeScript** para la gestión de becas estudiantiles de la Universidad Laica Eloy Alfaro de Manabí (ULEAM).

---

## Descripción

El proyecto forma parte del trabajo autónomo de **Desarrollo Backend Web con NestJS**.

El sistema permite gestionar el proceso de becas universitarias mediante diferentes recursos relacionados:

* Estudiantes.
* Becas.
* Solicitudes de becas.
* Documentos.
* Seguimiento de solicitudes.

La aplicación utiliza una arquitectura modular basada en NestJS, PostgreSQL como sistema de persistencia y TypeORM como ORM.

El proyecto mantiene la continuidad de la Etapa 1 y actualmente incorpora relaciones persistentes entre las principales entidades del dominio.

---

# Etapas del proyecto

## Etapa 1 — Fundamentos y definición de la API

En la primera etapa se implementaron:

* Arquitectura modular con NestJS.
* Módulos para estudiantes, becas, solicitudes, documentos y seguimiento.
* Operaciones CRUD.
* DTOs.
* Validaciones mediante `class-validator`.
* `ValidationPipe` global.
* Pipes personalizados para validar identificadores.
* Manejo de errores `400 Bad Request` y `404 Not Found`.
* Persistencia mediante PostgreSQL.
* Integración con TypeORM.
* Variables de entorno.
* Pruebas manuales mediante Thunder Client.
* Evidencias de las operaciones CRUD y persistencia.

## Etapa 2 — Modelo relacional y autenticación

La segunda etapa amplía la implementación anterior.

Actualmente ya se implementó la parte correspondiente al **modelo relacional y persistencia relacionada**, incluyendo:

* Relaciones `@ManyToOne` y `@OneToMany`.
* Claves foráneas mediante TypeORM.
* Integridad referencial.
* Reglas de eliminación.
* Consultas de información relacionada.
* Validación de existencia de Student y Scholarship al crear Application.
* Validación de estudiante activo.
* Prevención de solicitudes duplicadas.
* Persistencia de las relaciones en PostgreSQL.
* Verificación de persistencia después de reiniciar la aplicación.
* Consultas de Applications por estudiante y por beca.

Quedan pendientes para completar la Etapa 2:

* Búsqueda avanzada.
* Filtros mediante query params.
* Paginación.
* Ordenamiento.
* Metadatos de paginación.
* Migraciones de TypeORM.
* Módulo de usuarios.
* Registro de usuarios.
* Hash de contraseñas.
* Login.
* Emisión de JWT.
* Protección de rutas mediante JWT.

---

# Modelo relacional

Las entidades principales del sistema mantienen las siguientes relaciones:

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
Application
   │
   ├── N:1 ──> Scholarship
   │
   ├── 1:N ──> Document
   │
   └── 1:N ──> Tracking
```

Estas relaciones se encuentran implementadas mediante TypeORM y PostgreSQL.

---

# Relaciones implementadas

## Student → Application

Un estudiante puede tener varias solicitudes de beca.

```text
Student 1:N Application
```

La entidad `Student` utiliza:

```ts
@OneToMany('Application', 'student')
applications: Relation<Application[]>;
```

La entidad `Application` utiliza:

```ts
@ManyToOne('Student', 'applications', {
  nullable: false,
  onDelete: 'RESTRICT',
})
```

La relación utiliza `studentId` como clave foránea.

---

## Scholarship → Application

Una beca puede tener varias solicitudes.

```text
Scholarship 1:N Application
```

La entidad `Scholarship` utiliza:

```ts
@OneToMany('Application', 'scholarship')
applications: Relation<Application[]>;
```

La entidad `Application` utiliza:

```ts
@ManyToOne('Scholarship', 'applications', {
  nullable: false,
  onDelete: 'RESTRICT',
})
```

La relación utiliza `scholarshipId` como clave foránea.

---

## Application → Document

Una solicitud puede tener varios documentos.

```text
Application 1:N Document
```

La relación utiliza:

```ts
@OneToMany('Document', 'application')
documents: Relation<Document[]>;
```

y:

```ts
@ManyToOne('Application', 'documents', {
  nullable: false,
  onDelete: 'CASCADE',
})
```

Cuando una solicitud se elimina, sus documentos relacionados se eliminan mediante `CASCADE`.

---

## Application → Tracking

Una solicitud puede tener varios registros de seguimiento.

```text
Application 1:N Tracking
```

La relación utiliza:

```ts
@OneToMany('Tracking', 'application')
trackings: Relation<Tracking[]>;
```

y:

```ts
@ManyToOne('Application', 'trackings', {
  nullable: false,
  onDelete: 'CASCADE',
})
```

Cuando una solicitud se elimina, sus registros de seguimiento relacionados se eliminan mediante `CASCADE`.

---

# Integridad y reglas de negocio

El sistema incorpora reglas de negocio para la creación de solicitudes.

### Estudiante inexistente

Si el estudiante indicado no existe:

```text
404 Not Found
```

Mensaje:

```text
Estudiante no encontrado
```

### Beca inexistente

Si la beca indicada no existe:

```text
404 Not Found
```

Mensaje:

```text
Beca no encontrada
```

### Estudiante inactivo

Un estudiante inactivo no puede registrar una nueva solicitud:

```text
400 Bad Request
```

Mensaje:

```text
El estudiante está inactivo y no puede solicitar una beca
```

### Solicitud duplicada

Un estudiante no puede registrar dos solicitudes para la misma beca.

La entidad `Application` utiliza una restricción única compuesta:

```ts
@Unique(['student', 'scholarship'])
```

Además, el servicio verifica previamente si ya existe una solicitud.

Si se intenta registrar nuevamente:

```text
409 Conflict
```

Mensaje:

```text
El estudiante ya tiene una solicitud para esta beca
```

---

# Tecnologías

* Node.js
* NestJS
* TypeScript
* class-validator
* class-transformer
* @nestjs/mapped-types
* @nestjs/config
* @nestjs/typeorm
* TypeORM
* PostgreSQL
* pg
* npm
* Thunder Client

Las tecnologías relacionadas con autenticación, como JWT y bcrypt, se incorporarán durante la implementación pendiente de la Etapa 2.

---

# Arquitectura

El proyecto utiliza una arquitectura modular proporcionada por NestJS.

Cada recurso separa sus principales responsabilidades:

```text
Module
├── Controller
├── Service
├── DTO
├── Pipes
└── Entity
```

### Controller

Recibe las solicitudes HTTP y expone los endpoints de cada recurso.

### Service

Contiene la lógica de negocio y administra las operaciones sobre los recursos.

También centraliza el manejo de recursos inexistentes mediante excepciones de NestJS.

### DTO

Define y valida los datos recibidos mediante `class-validator`.

### Pipes

Permiten validar parámetros de entrada, especialmente los identificadores.

### Entity

Representa la estructura de los datos almacenados en PostgreSQL mediante TypeORM y define las relaciones entre entidades.

---

# Arquitectura de persistencia

El flujo de persistencia utilizado por la aplicación es:

```text
Controller
    ↓
Service
    ↓
TypeORM Repository
    ↓
TypeORM
    ↓
PostgreSQL
```

Los servicios utilizan repositorios de TypeORM para realizar las operaciones de consulta, creación, actualización y eliminación.

---

# Configuración de PostgreSQL

El proyecto utiliza una instancia local de PostgreSQL para el desarrollo.

## Base de datos

```text
Nombre: SG_Becas_ULEAM
Host: localhost
Puerto: 5432
Usuario: postgres
```

La contraseña se mantiene únicamente en el archivo `.env` local y no debe publicarse en el repositorio.

---

# Variables de entorno

La configuración se realiza mediante un archivo `.env`.

Ejemplo:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=SG_Becas_ULEAM
DATABASE_USER=postgres
DATABASE_PASSWORD=tu_contraseña
```

También se proporciona:

```text
.env.example
```

con valores de referencia:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=SG_Becas_ULEAM
DATABASE_USER=postgres
DATABASE_PASSWORD=change_me
```

El archivo `.env` se encuentra incluido en `.gitignore`.

No se deben publicar contraseñas reales ni otras credenciales sensibles.

---

# Configuración de TypeORM

La aplicación utiliza:

```text
@nestjs/config
@nestjs/typeorm
TypeORM
pg
```

para establecer la conexión entre NestJS y PostgreSQL.

La configuración de desarrollo utiliza:

```ts
ConfigModule.forRoot({
  isGlobal: true,
})
```

y:

```ts
TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    type: 'postgres',
    host: config.get<string>('DATABASE_HOST'),
    port: Number(config.get<string>('DATABASE_PORT')),
    username: config.get<string>('DATABASE_USER'),
    password: config.get<string>('DATABASE_PASSWORD'),
    database: config.get<string>('DATABASE_NAME'),
    autoLoadEntities: true,
    synchronize: true,
  }),
})
```

## Estado actual de `synchronize`

Durante el desarrollo actual se utiliza:

```ts
synchronize: true
```

Esto permite que TypeORM cree o actualice automáticamente las tablas a partir de las entidades.

Esta configuración se mantiene únicamente como mecanismo de desarrollo local.

### Pendiente para la entrega final de la Etapa 2

La especificación de la Etapa 2 requiere utilizar migraciones y no depender de `synchronize`.

La transición prevista es:

```text
synchronize: true
        ↓
Crear migraciones
        ↓
Verificar migraciones
        ↓
synchronize: false
```

Las migraciones todavía se encuentran pendientes de implementación.

---

# Entidades del sistema

## Students

El módulo `students` permite gestionar los estudiantes que pueden solicitar una beca.

### Datos

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

Tabla:

```text
students
```

El campo `email` se encuentra configurado como único en PostgreSQL.

---

## Scholarships

El módulo `scholarships` permite gestionar las becas disponibles.

### Datos

```text
id
name
description
amount
startDate
endDate
isActive
```

Tabla:

```text
scholarships
```

---

## Applications

El módulo `applications` permite registrar y administrar las solicitudes de beca realizadas por los estudiantes.

### Datos

```text
id
studentId
scholarshipId
gpa
income
comment
status
```

Tabla:

```text
applications
```

### Estados

```text
pendiente
revision
aprobada
rechazada
correccion
```

### Relaciones

```text
Student 1:N Application

Scholarship 1:N Application
```

### Reglas implementadas

* El estudiante debe existir.
* La beca debe existir.
* El estudiante debe estar activo.
* No se permite más de una solicitud del mismo estudiante para la misma beca.
* Las solicitudes se almacenan de forma persistente en PostgreSQL.

---

## Documents

El módulo `documents` permite gestionar los documentos asociados a una solicitud de beca.

### Datos

```text
id
applicationId
name
url
status
```

Tabla:

```text
documents
```

### Estados

```text
pendiente
cargado
observado
aprobado
```

### Relación

```text
Application 1:N Document
```

---

## Tracking

El módulo `tracking` permite registrar y administrar el historial de seguimiento de las solicitudes de beca.

### Datos

```text
id
applicationId
status
comment
createdAt
```

Tabla:

```text
tracking
```

### Estados

```text
pendiente
revision
aprobada
rechazada
correccion
```

### Relación

```text
Application 1:N Tracking
```

---

# Estructura del proyecto

```text
src/
│
├── applications/
│   ├── dto/
│   │   ├── create-application.dto.ts
│   │   └── update-application.dto.ts
│   ├── entities/
│   │   └── application.entity.ts
│   ├── pipes/
│   │   └── parse-application-id.pipe.ts
│   ├── applications.controller.ts
│   ├── applications.service.ts
│   └── applications.module.ts
│
├── documents/
│   ├── dto/
│   │   ├── create-document.dto.ts
│   │   └── update-document.dto.ts
│   ├── entities/
│   │   └── document.entity.ts
│   ├── pipes/
│   │   └── parse-document-id.pipe.ts
│   ├── documents.controller.ts
│   ├── documents.service.ts
│   └── documents.module.ts
│
├── scholarships/
│   ├── dto/
│   │   ├── create-scholarship.dto.ts
│   │   └── update-scholarship.dto.ts
│   ├── entities/
│   │   └── scholarship.entity.ts
│   ├── pipes/
│   │   └── parse-scholarship-id.pipe.ts
│   ├── scholarships.controller.ts
│   ├── scholarships.service.ts
│   └── scholarships.module.ts
│
├── students/
│   ├── dto/
│   │   ├── create-student.dto.ts
│   │   └── update-student.dto.ts
│   ├── entities/
│   │   └── students.entity.ts
│   ├── pipes/
│   │   └── parse-student-id.pipe.ts
│   ├── students.controller.ts
│   ├── students.service.ts
│   └── students.module.ts
│
├── tracking/
│   ├── dto/
│   │   ├── create-tracking.dto.ts
│   │   └── update-tracking.dto.ts
│   ├── entities/
│   │   └── tracking.entity.ts
│   ├── pipes/
│   │   └── parse-tracking-id.pipe.ts
│   ├── tracking.controller.ts
│   ├── tracking.service.ts
│   └── tracking.module.ts
│
├── app.module.ts
├── app.controller.ts
├── app.service.ts
└── main.ts
```

---

# Endpoints actuales

## Students

| Método | Endpoint        | Descripción                   |
| ------ | --------------- | ----------------------------- |
| GET    | `/students`     | Obtener todos los estudiantes |
| GET    | `/students/:id` | Obtener un estudiante         |
| POST   | `/students`     | Crear un estudiante           |
| PATCH  | `/students/:id` | Actualizar un estudiante      |
| DELETE | `/students/:id` | Eliminar un estudiante        |

## Scholarships

| Método | Endpoint            | Descripción             |
| ------ | ------------------- | ----------------------- |
| GET    | `/scholarships`     | Obtener todas las becas |
| GET    | `/scholarships/:id` | Obtener una beca        |
| POST   | `/scholarships`     | Crear una beca          |
| PATCH  | `/scholarships/:id` | Actualizar una beca     |
| DELETE | `/scholarships/:id` | Eliminar una beca       |

## Applications

| Método | Endpoint                                   | Descripción                              |
| ------ | ------------------------------------------ | ---------------------------------------- |
| GET    | `/applications`                            | Obtener solicitudes                      |
| GET    | `/applications/:id`                        | Obtener una solicitud con sus relaciones |
| GET    | `/applications/student/:studentId`         | Obtener solicitudes de un estudiante     |
| GET    | `/applications/scholarship/:scholarshipId` | Obtener solicitudes de una beca          |
| POST   | `/applications`                            | Crear una solicitud                      |
| PATCH  | `/applications/:id`                        | Actualizar una solicitud                 |
| PATCH  | `/applications/:id/status`                 | Cambiar estado                           |
| DELETE | `/applications/:id`                        | Eliminar una solicitud                   |

## Documents

| Método | Endpoint                                | Descripción                         |
| ------ | --------------------------------------- | ----------------------------------- |
| GET    | `/documents`                            | Obtener documentos                  |
| GET    | `/documents/:id`                        | Obtener un documento                |
| GET    | `/documents/application/:applicationId` | Obtener documentos de una solicitud |
| POST   | `/documents`                            | Crear un documento                  |
| PATCH  | `/documents/:id`                        | Actualizar un documento             |
| PATCH  | `/documents/:id/status`                 | Cambiar estado                      |
| DELETE | `/documents/:id`                        | Eliminar un documento               |

## Tracking

| Método | Endpoint                               | Descripción                        |
| ------ | -------------------------------------- | ---------------------------------- |
| GET    | `/tracking`                            | Obtener seguimientos               |
| GET    | `/tracking/:id`                        | Obtener un seguimiento             |
| GET    | `/tracking/application/:applicationId` | Obtener historial de una solicitud |
| POST   | `/tracking`                            | Crear un seguimiento               |
| PATCH  | `/tracking/:id`                        | Actualizar un seguimiento          |
| DELETE | `/tracking/:id`                        | Eliminar un seguimiento            |

---

# Validación global

El proyecto utiliza un `ValidationPipe` global:

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

* Validar datos mediante DTOs.
* Transformar valores cuando corresponde.
* Permitir únicamente propiedades definidas en los DTOs.
* Rechazar propiedades no definidas.

Los errores de validación generan:

```text
400 Bad Request
```

Los recursos inexistentes generan:

```text
404 Not Found
```

---

# Manejo de errores

Los servicios utilizan excepciones de NestJS para controlar diferentes situaciones.

### ID inválido

Ejemplo:

```text
GET /students/a
```

Respuesta:

```text
400 Bad Request
```

### Recurso inexistente

Ejemplo:

```text
GET /applications/999
```

Respuesta:

```text
404 Not Found
```

### Solicitud duplicada

Ejemplo:

```text
POST /applications
```

con el mismo estudiante y beca:

```text
409 Conflict
```

### Estudiante inactivo

Al intentar registrar una solicitud con un estudiante inactivo:

```text
400 Bad Request
```

---

# Consultas implementadas

Actualmente el módulo `applications` permite consultar información relacionada.

### Solicitudes por estudiante

```text
GET /applications/student/:studentId
```

Ejemplo:

```text
GET /applications/student/3
```

### Solicitudes por beca

```text
GET /applications/scholarship/:scholarshipId
```

Ejemplo:

```text
GET /applications/scholarship/5
```

### Consulta completa de una solicitud

```text
GET /applications/:id
```

La respuesta puede incluir:

```text
Application
├── Student
├── Scholarship
├── Documents
└── Tracking
```

---

# Persistencia relacional

La persistencia se realiza mediante PostgreSQL y TypeORM.

Las principales tablas son:

```text
students
scholarships
applications
documents
tracking
```

Las relaciones se almacenan mediante claves foráneas.

El flujo es:

```text
Student
   ↓
Application
   ├── Scholarship
   ├── Documents
   └── Tracking
```

La persistencia fue comprobada mediante Thunder Client y PostgreSQL.

También se verificó que los datos permanecen disponibles después de detener y volver a iniciar la aplicación.

Por ejemplo, después de reiniciar el servidor se recuperó correctamente la solicitud `Application` con ID `3`, incluyendo:

* Student `3`.
* Scholarship `5`.
* Document `3`.
* Tracking `3`.

Esto demuestra que la información relacionada permanece almacenada en PostgreSQL.

---

# Evidencias

Las evidencias de la Etapa 1 se encuentran organizadas en:

```text
Evidencias Entrega 1/
```

Las evidencias existentes incluyen:

```text
01-Students/
02-Scholarships/
03-Applications/
04-Documents/
05-Tracking/
06-Validaciones/
07-Persistencia-PostgreSQL/
```

Para las pruebas de la Etapa 2 se recomienda incorporar:

```text
Evidencias Entrega 2/
├── 01-Relaciones/
├── 02-Consultas/
├── 03-Persistencia-Relacional/
├── 04-Migraciones/
├── 05-Registro/
├── 06-Login-JWT/
└── 07-Rutas-Protegidas/
```

Las carpetas correspondientes a funcionalidades todavía no implementadas deberán completarse conforme avance la etapa.

---

# Estado actual del proyecto

## Etapa 1 — Implementado

* [x] Configuración inicial de NestJS.
* [x] Arquitectura modular.
* [x] Módulo `students`.
* [x] CRUD de `students`.
* [x] DTOs de `students`.
* [x] Validaciones de `students`.
* [x] Pipe para IDs de `students`.
* [x] Módulo `scholarships`.
* [x] CRUD de `scholarships`.
* [x] DTOs de `scholarships`.
* [x] Validaciones de `scholarships`.
* [x] Pipe para IDs de `scholarships`.
* [x] Módulo `applications`.
* [x] CRUD de `applications`.
* [x] DTOs de `applications`.
* [x] Validaciones de `applications`.
* [x] Pipe para IDs de `applications`.
* [x] Módulo `documents`.
* [x] CRUD de `documents`.
* [x] DTOs de `documents`.
* [x] Validaciones de `documents`.
* [x] Pipe para IDs de `documents`.
* [x] Módulo `tracking`.
* [x] CRUD de `tracking`.
* [x] DTOs de `tracking`.
* [x] Validaciones de `tracking`.
* [x] Pipe para IDs de `tracking`.
* [x] PostgreSQL.
* [x] TypeORM.
* [x] Variables de entorno.
* [x] Entidades TypeORM.
* [x] Repositorios TypeORM.
* [x] Persistencia de los registros.
* [x] `ValidationPipe` global.
* [x] Manejo de errores `400` y `404`.
* [x] Pruebas mediante Thunder Client.
* [x] Evidencias de CRUD.
* [x] Evidencias de validaciones.
* [x] Evidencias de persistencia.

## Etapa 2 — Implementado hasta el momento

* [x] Continuidad de la API de la Etapa 1.
* [x] Relaciones `@ManyToOne`.
* [x] Relaciones `@OneToMany`.
* [x] Claves foráneas.
* [x] Integridad referencial.
* [x] Reglas de eliminación mediante `onDelete`.
* [x] Consulta de información relacionada.
* [x] Persistencia relacional en PostgreSQL.
* [x] Validación de estudiante existente.
* [x] Validación de beca existente.
* [x] Validación de estudiante activo.
* [x] Prevención de solicitudes duplicadas.
* [x] Respuesta `409 Conflict` para solicitudes duplicadas.
* [x] Consultas de solicitudes por estudiante.
* [x] Consultas de solicitudes por beca.
* [x] Cambio de estado de una solicitud.
* [x] Verificación de persistencia después de reiniciar la aplicación.

## Etapa 2 — Pendiente

* [ ] Búsqueda avanzada mediante query params.
* [ ] Filtros mediante query params.
* [ ] Paginación.
* [ ] Ordenamiento.
* [ ] Metadatos de paginación.
* [ ] Validación de parámetros de consulta.
* [ ] Migraciones de TypeORM.
* [ ] Configuración final con `synchronize: false`.
* [ ] Módulo `users`.
* [ ] Registro de usuarios.
* [ ] Hash de contraseñas.
* [ ] Módulo `auth`.
* [ ] Login.
* [ ] Generación de JWT.
* [ ] JWT Guard.
* [ ] Protección de al menos dos endpoints de escritura.
* [ ] Evidencias de autenticación.
* [ ] Evidencias de rutas protegidas.
* [ ] Documento final de la Etapa 2.

---

# Instalación

Clonar el repositorio:

```bash
git clone https://github.com/GabrielGL11/proyecto_asw.git
```

Ingresar al proyecto:

```bash
cd proyecto_asw
```

Instalar dependencias:

```bash
npm install
```

Crear el archivo:

```text
.env
```

Configurar las variables correspondientes de PostgreSQL.

---

# Ejecución

## Desarrollo

```bash
npm run start
```

## Modo watch

```bash
npm run start:dev
```

## Producción

```bash
npm run start:prod
```

Actualmente la aplicación utiliza:

```text
http://localhost:5500
```

---

# Pruebas

## Pruebas unitarias

```bash
npm run test
```

## Pruebas end-to-end

```bash
npm run test:e2e
```

## Cobertura

```bash
npm run test:cov
```

Las pruebas manuales de los endpoints se realizan mediante **Thunder Client**.

---

# Base de datos

La base de datos utilizada durante el desarrollo es:

```text
SG_Becas_ULEAM
```

Tablas principales:

```text
students
scholarships
applications
documents
tracking
```

Las tablas se encuentran relacionadas mediante claves foráneas definidas por TypeORM.

---

# Próximos pasos

Para completar la Etapa 2 se deberán implementar:

1. Filtros mediante query params.
2. Paginación.
3. Ordenamiento.
4. Metadatos de paginación.
5. Migraciones de TypeORM.
6. Desactivación de `synchronize`.
7. Módulo de usuarios.
8. Registro seguro de usuarios.
9. Hash de contraseñas.
10. Login.
11. Emisión de JWT.
12. Guard de autenticación.
13. Protección de al menos dos operaciones de escritura.
14. Evidencias correspondientes.
15. Actualización final del documento de entrega.

---

# Repositorio

Repositorio del proyecto:

```text
https://github.com/GabrielGL11/proyecto_asw
```

---

# Recursos

* NestJS Documentation: https://docs.nestjs.com/
* NestJS GitHub: https://github.com/nestjs/nest
* NestJS Courses: https://courses.nestjs.com/
* NestJS Devtools: https://devtools.nestjs.com/

---

# Autoría

Proyecto académico desarrollado para la asignatura de **Desarrollo Backend Web**.

**ULEAM — Universidad Laica Eloy Alfaro de Manabí**
