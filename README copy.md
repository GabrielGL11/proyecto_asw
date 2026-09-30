src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Sistema de Gestión de Becas ULEAM

Backend desarrollado con **NestJS + TypeScript** para la gestión de becas estudiantiles de la Universidad Laica Eloy Alfaro de Manabí (ULEAM).

---

## Descripción

El proyecto forma parte del trabajo autónomo de **Desarrollo Backend Web con NestJS**.

El sistema busca gestionar el proceso de becas universitarias mediante diferentes recursos relacionados:

* Estudiantes.
* Becas.
* Solicitudes de becas.
* Documentos.
* Seguimiento de solicitudes.

El proyecto se desarrolla mediante una arquitectura modular basada en NestJS y utiliza PostgreSQL como sistema de persistencia mediante TypeORM.

---

# Etapas del proyecto

## Etapa 1 — Fundamentos y definición de la API

En la primera etapa se implementaron los fundamentos principales de la API:

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

La segunda etapa amplía la implementación anterior y tiene como objetivos:

1. Implementar relaciones reales entre las entidades mediante TypeORM y PostgreSQL.
2. Aplicar claves foráneas e integridad referencial.
3. Definir el comportamiento de eliminación de registros relacionados.
4. Implementar consultas con filtros, búsqueda, paginación y ordenamiento.
5. Incorporar migraciones para controlar la evolución del esquema de la base de datos.
6. Implementar un módulo de usuarios y autenticación.
7. Registrar usuarios almacenando contraseñas mediante hash.
8. Implementar inicio de sesión mediante JWT.
9. Proteger mediante JWT al menos dos operaciones de escritura.
10. Documentar y demostrar las pruebas correspondientes.

Las funcionalidades de esta segunda etapa se incorporarán progresivamente al proyecto.

---

# Modelo general

Las entidades principales del sistema son:

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

El modelo propuesto para la Etapa 2 contempla relaciones reales mediante TypeORM:

```text
Student 1:N Application N:1 Scholarship

Application 1:N Document

Application 1:N Tracking
```

En la Etapa 1 las relaciones se manejaban principalmente mediante identificadores como:

```text
studentId
scholarshipId
applicationId
```

En la Etapa 2 estos vínculos serán implementados mediante relaciones de TypeORM y claves foráneas en PostgreSQL.

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
* JWT
* bcrypt

Las últimas tecnologías relacionadas con autenticación y seguridad serán utilizadas durante la implementación de la Etapa 2.

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

También centraliza el manejo de recursos inexistentes mediante `NotFoundException`.

### DTO

Define y valida los datos recibidos mediante `class-validator`.

### Pipes

Permiten validar parámetros de entrada, especialmente los identificadores.

### Entity

Representa la estructura de los datos almacenados en PostgreSQL mediante TypeORM.

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

Actualmente la configuración de desarrollo utiliza:

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

## Estado de `synchronize`

Durante el desarrollo local de la primera etapa se utiliza:

```ts
synchronize: true
```

Esta configuración permite que TypeORM cree o actualice automáticamente las tablas a partir de las entidades.

### Cambio requerido para la Etapa 2

La entrega de la segunda etapa requiere utilizar **migraciones** y no depender de `synchronize`.

Por esta razón, durante la implementación de la Etapa 2 se realizará la siguiente transición:

```text
synchronize: true
        ↓
synchronize: false
        ↓
Migraciones de TypeORM
```

El cambio se realizará después de crear y verificar correctamente las migraciones del proyecto.

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

Entidad:

```ts
@Entity('scholarships')
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

### Relaciones previstas

En la Etapa 2 se implementarán:

```text
Student 1:N Application

Scholarship 1:N Application
```

La entidad `Application` tendrá las referencias correspondientes mediante relaciones de TypeORM y claves foráneas en PostgreSQL.

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

### Relación prevista

```text
Application 1:N Document
```

La relación será implementada mediante TypeORM y una clave foránea sobre `applicationId`.

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

### Relación prevista

```text
Application 1:N Tracking
```

La relación será implementada mediante TypeORM y una clave foránea sobre `applicationId`.

---

# Estructura del proyecto

La estructura principal es:

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

Durante la Etapa 2 se incorporarán nuevos módulos y carpetas para:

```text
auth/
users/
migrations/
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

| Método | Endpoint                                   | Descripción                          |
| ------ | ------------------------------------------ | ------------------------------------ |
| GET    | `/applications`                            | Obtener solicitudes                  |
| GET    | `/applications/:id`                        | Obtener una solicitud                |
| GET    | `/applications/student/:studentId`         | Obtener solicitudes de un estudiante |
| GET    | `/applications/scholarship/:scholarshipId` | Obtener solicitudes de una beca      |
| POST   | `/applications`                            | Crear una solicitud                  |
| PATCH  | `/applications/:id`                        | Actualizar una solicitud             |
| PATCH  | `/applications/:id/status`                 | Cambiar estado                       |
| DELETE | `/applications/:id`                        | Eliminar una solicitud               |

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

Los servicios utilizan `NotFoundException` cuando un recurso solicitado no existe.

Ejemplo:

```text
GET /students/999
```

Respuesta:

```text
404 Not Found
```

Los identificadores inválidos son procesados mediante pipes personalizados.

Ejemplo:

```text
GET /students/a
```

Respuesta:

```text
400 Bad Request
```

---

# Etapa 2 — Modelo relacional

La implementación de la segunda etapa incorporará relaciones reales entre las entidades.

## Relaciones principales

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

## Objetivos de las relaciones

Se deberán implementar:

* `@OneToMany`
* `@ManyToOne`
* Claves foráneas.
* Integridad referencial.
* Comportamiento explícito ante eliminación.
* Consultas de información relacionada.

Por ejemplo:

```text
Student
   ↓
Applications del estudiante
```

y:

```text
Application
   ↓
Student
Scholarship
Documents
Tracking
```

---

# Etapa 2 — Consultas

La segunda etapa incorporará consultas mediante parámetros HTTP.

Se deberán implementar:

* Búsqueda.
* Filtros.
* Paginación.
* Ordenamiento.

Ejemplo conceptual:

```text
GET /applications?page=1&limit=10
```

También se podrán incorporar parámetros de filtrado relacionados con el recurso.

La respuesta deberá incluir información de paginación, por ejemplo:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

Los parámetros deberán ser validados y documentados.

---

# Etapa 2 — Migraciones

Las migraciones serán utilizadas para controlar los cambios realizados en el esquema de PostgreSQL.

La estructura prevista será:

```text
src/
└── migrations/
    ├── ...
```

El objetivo es evitar depender de:

```ts
synchronize: true
```

para la entrega de la segunda etapa.

Las migraciones deberán permitir reproducir de manera controlada la estructura de la base de datos.

---

# Etapa 2 — Autenticación

Se incorporará un sistema de usuarios y autenticación.

La estructura prevista será:

```text
src/
├── users/
└── auth/
```

## Registro

Se implementará un endpoint para registrar usuarios.

La contraseña deberá almacenarse mediante un algoritmo de hash.

La contraseña en texto plano:

* no se almacenará en PostgreSQL;
* no se devolverá en las respuestas de la API.

## Inicio de sesión

Se implementará un endpoint de login que permitirá autenticar al usuario.

El proceso será:

```text
Usuario
   ↓
Login
   ↓
Validación de credenciales
   ↓
JWT
   ↓
Acceso a rutas protegidas
```

---

# Etapa 2 — JWT

La autenticación utilizará JSON Web Token (JWT).

El flujo será:

```text
POST /auth/login
       ↓
Credenciales válidas
       ↓
JWT
       ↓
Authorization: Bearer <token>
       ↓
Ruta protegida
```

Las rutas protegidas requerirán un token válido.

---

# Protección de endpoints

La segunda etapa requiere proteger al menos dos operaciones de escritura mediante JWT.

Entre las operaciones que podrán protegerse se encuentran:

```text
POST
PATCH
DELETE
```

El objetivo es demostrar dos situaciones:

### Sin autenticación

```text
Solicitud
   ↓
Ruta protegida
   ↓
401 Unauthorized
```

### Con autenticación

```text
Solicitud + JWT
   ↓
Ruta protegida
   ↓
Operación permitida
```

Los endpoints definitivos protegidos se documentarán cuando sean implementados.

---

# Evidencias

Las evidencias de la Etapa 1 se encuentran organizadas en:

```text
Evidencias Entrega 1/
```

Entre ellas se encuentran evidencias de:

* CRUD de estudiantes.
* CRUD de becas.
* CRUD de solicitudes.
* CRUD de documentos.
* CRUD de seguimiento.
* Validación de DTOs.
* IDs inválidos.
* Recursos no encontrados.
* Persistencia en PostgreSQL.
* Persistencia después de reiniciar la aplicación.

Para la Etapa 2 se incorporará una organización adicional para evidenciar:

```text
Evidencias Entrega 2/
├── 01-Relaciones/
├── 02-Filtros-Paginacion/
├── 03-Migraciones/
├── 04-Registro/
├── 05-Login-JWT/
├── 06-Rutas-Protegidas/
└── 07-Persistencia-Relacional/
```

Estas carpetas se crearán conforme se realicen las pruebas correspondientes.

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

## Etapa 2 — Pendiente de implementación

* [ ] Relaciones explícitas `@ManyToOne` y `@OneToMany`.
* [ ] Claves foráneas en PostgreSQL.
* [ ] Integridad referencial.
* [ ] Comportamiento de eliminación de relaciones.
* [ ] Consulta de información relacionada.
* [ ] Búsqueda y filtros mediante query params.
* [ ] Paginación.
* [ ] Ordenamiento.
* [ ] Metadatos de paginación.
* [ ] Validación de parámetros de consulta.
* [ ] Migraciones de TypeORM.
* [ ] Configuración final sin `synchronize`.
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
* [ ] Actualización del diagrama relacional.
* [ ] Documentación final de la Etapa 2.

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

Con la implementación de la Etapa 2 se incorporarán las relaciones y claves foráneas correspondientes.

---

# Repositorio

Repositorio del proyecto:

```text
https://github.com/GabrielGL11/proyecto_asw
```

---

# Recursos

* [NestJS Documentation](https://docs.nestjs.com/)
* [NestJS GitHub](https://github.com/nestjs/nest)
* [NestJS Courses](https://courses.nestjs.com/)
* [NestJS Devtools](https://devtools.nestjs.com/)

---

# Autoría

Proyecto académico desarrollado para la asignatura de **Desarrollo Backend Web**.

**ULEAM — Universidad Laica Eloy Alfaro de Manabí**