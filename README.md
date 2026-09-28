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
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

# Sistema de Gestión de Becas ULEAM

## Descripción

El proyecto forma parte del trabajo autónomo de desarrollo backend web y utiliza una arquitectura modular basada en **NestJS**.

El sistema busca gestionar el proceso de becas universitarias mediante diferentes recursos relacionados:

* Estudiantes.
* Becas.
* Solicitudes de becas.
* Documentos.
* Seguimiento de solicitudes.

## Modelo general

```text
Student 1:N Application N:1 Scholarship

Application 1:N Document

Application 1:N Tracking
```

## Flujo general

```text
Student
   │
   │ 1:N
   ▼
Application
   ├── N:1 ──> Scholarship
   ├── 1:N ──> Document
   └── 1:N ──> Tracking
```

Actualmente las relaciones entre los recursos se representan mediante identificadores como `studentId`, `scholarshipId` y `applicationId`.

---

# Tecnologías

* **Node.js**
* **NestJS**
* **TypeScript**
* **class-validator**
* **class-transformer**
* **@nestjs/mapped-types**
* **@nestjs/config**
* **@nestjs/typeorm**
* **TypeORM**
* **pg**
* **PostgreSQL**
* **npm**
* **Thunder Client** para las pruebas manuales de la API.

---

# Estado de la persistencia

El proyecto utiliza **PostgreSQL + TypeORM** para la persistencia de los datos mediante variables de entorno.

Se han creado las cinco entidades principales del sistema:

* `Student`
* `Scholarship`
* `Application`
* `Document`
* `Tracking`

También se utilizan las cinco tablas correspondientes en PostgreSQL:

```text
students
scholarships
applications
documents
tracking
```

La configuración utiliza `autoLoadEntities: true` para cargar automáticamente las entidades registradas mediante los módulos de TypeORM.

Los cinco servicios utilizan repositorios de TypeORM para realizar las operaciones de consulta, creación, actualización y eliminación.

---

# Arquitectura

El proyecto utiliza una arquitectura modular proporcionada por NestJS.

Cada recurso cuenta con su propio módulo y separa las responsabilidades principales:

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

Contiene la lógica de negocio y centraliza el manejo de recursos inexistentes mediante `NotFoundException`.

### DTO

Define y valida los datos recibidos mediante `class-validator`.

### Pipes

Permiten validar parámetros de entrada, especialmente los identificadores.

### Entity

Representa la estructura de los datos que se almacenan en PostgreSQL mediante TypeORM.

## Arquitectura de persistencia

La configuración general de persistencia utiliza el siguiente flujo:

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

Los servicios utilizan repositorios de TypeORM para realizar las operaciones de persistencia sobre PostgreSQL.

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

La contraseña no se almacena directamente en el código fuente.

## Variables de entorno

La configuración se realiza mediante un archivo `.env`.

Ejemplo:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=SG_Becas_ULEAM
DATABASE_USER=postgres
DATABASE_PASSWORD=change_me
```

El archivo `.env.example` documenta las variables necesarias sin incluir credenciales reales.

El archivo `.env` se encuentra incluido en `.gitignore` para evitar publicar información sensible.

---

# Configuración de TypeORM

La aplicación utiliza `@nestjs/config` para cargar las variables de entorno y `@nestjs/typeorm` para integrar TypeORM con NestJS.

La configuración se encuentra en:

```text
src/app.module.ts
```

Actualmente se utiliza:

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

## `synchronize`

Durante el desarrollo local se utiliza:

```ts
synchronize: true
```

Esta opción permite que TypeORM cree o ajuste automáticamente las tablas a partir de las entidades.

No se considera una estrategia adecuada para producción. En un entorno de producción se recomienda utilizar migraciones para controlar los cambios del esquema de la base de datos.

---

# Estructura del proyecto

Actualmente el proyecto cuenta con cinco módulos principales:

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

Las cinco entidades representan los modelos principales del sistema y se encuentran configuradas para trabajar con TypeORM.

---

# Entidades del sistema

## Students

El módulo `students` permite gestionar los estudiantes que pueden solicitar una beca.

### Datos del estudiante

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

La entidad se encuentra en:

```text
src/students/entities/students.entity.ts
```

La tabla correspondiente en PostgreSQL es:

```text
students
```

---

## Scholarships

El módulo `scholarships` permite gestionar las becas disponibles.

### Datos de la beca

```text
id
name
description
amount
startDate
endDate
isActive
```

La entidad se encuentra en:

```text
src/scholarships/entities/scholarship.entity.ts
```

La entidad utiliza:

```ts
@Entity('scholarships')
```

para representar la tabla `scholarships` en PostgreSQL.

### Tabla

```text
scholarships
```

---

## Applications

El módulo `applications` permite registrar y administrar las solicitudes de beca realizadas por los estudiantes.

### Datos de la solicitud

```text
id
studentId
scholarshipId
gpa
income
comment
status
```

La entidad utiliza la tabla:

```text
applications
```

### Estados

Las solicitudes utilizan los siguientes estados:

```text
pendiente
revision
aprobada
rechazada
correccion
```

### DTOs

El módulo utiliza:

```text
create-application.dto.ts
update-application.dto.ts
```

`UpdateApplicationDto` permite realizar actualizaciones parciales.

### Ejemplo de solicitud

```json
{
  "studentId": 1,
  "scholarshipId": 1,
  "gpa": 8.7,
  "income": 450,
  "comment": "Solicitud de beca por situación económica"
}
```

Los campos `studentId` y `scholarshipId` permiten identificar al estudiante y la beca asociados a la solicitud.

---

## Documents

El módulo `documents` permite gestionar los documentos asociados a una solicitud de beca.

### Datos del documento

```text
id
applicationId
name
url
status
```

La entidad utiliza la tabla:

```text
documents
```

### Estados

Los documentos pueden manejar los siguientes estados:

```text
pendiente
cargado
observado
aprobado
```

### DTOs

El módulo utiliza:

```text
create-document.dto.ts
update-document.dto.ts
```

### Ejemplo

```json
{
  "applicationId": 1,
  "name": "Certificado de notas",
  "url": "https://example.com/certificado-notas.pdf"
}
```

El campo `applicationId` permite identificar la solicitud a la que pertenece el documento.

---

## Tracking

El módulo `tracking` permite registrar y administrar el historial de seguimiento de las solicitudes de beca.

### Datos del seguimiento

```text
id
applicationId
status
comment
createdAt
```

La entidad utiliza la tabla:

```text
tracking
```

El campo `applicationId` permite identificar la solicitud relacionada con el seguimiento.

### Estados

Los registros de seguimiento admiten:

```text
pendiente
revision
aprobada
rechazada
correccion
```

### Ejemplo

```json
{
  "applicationId": 1,
  "status": "revision",
  "comment": "Documentación enviada a revisión."
}
```

---

# Endpoints

## Students

| Método | Endpoint        | Descripción                   |
| ------ | --------------- | ----------------------------- |
| GET    | `/students`     | Obtener todos los estudiantes |
| GET    | `/students/:id` | Obtener un estudiante por ID  |
| POST   | `/students`     | Crear un estudiante           |
| PATCH  | `/students/:id` | Actualizar un estudiante      |
| DELETE | `/students/:id` | Eliminar un estudiante        |

## Scholarships

| Método | Endpoint            | Descripción             |
| ------ | ------------------- | ----------------------- |
| GET    | `/scholarships`     | Obtener todas las becas |
| GET    | `/scholarships/:id` | Obtener una beca por ID |
| POST   | `/scholarships`     | Crear una beca          |
| PATCH  | `/scholarships/:id` | Actualizar una beca     |
| DELETE | `/scholarships/:id` | Eliminar una beca       |

## Applications

| Método | Endpoint                                   | Descripción                        |
| ------ | ------------------------------------------ | ---------------------------------- |
| GET    | `/applications`                            | Obtener todas las solicitudes      |
| GET    | `/applications/:id`                        | Obtener una solicitud por ID       |
| GET    | `/applications/student/:studentId`         | Obtener solicitudes por estudiante |
| GET    | `/applications/scholarship/:scholarshipId` | Obtener solicitudes por beca       |
| POST   | `/applications`                            | Crear una solicitud                |
| PATCH  | `/applications/:id`                        | Actualizar una solicitud           |
| PATCH  | `/applications/:id/status`                 | Cambiar el estado de una solicitud |
| DELETE | `/applications/:id`                        | Eliminar una solicitud             |

## Documents

| Método | Endpoint                                | Descripción                      |
| ------ | --------------------------------------- | -------------------------------- |
| GET    | `/documents`                            | Obtener todos los documentos     |
| GET    | `/documents/:id`                        | Obtener un documento por ID      |
| GET    | `/documents/application/:applicationId` | Obtener documentos por solicitud |
| POST   | `/documents`                            | Crear un documento               |
| PATCH  | `/documents/:id`                        | Actualizar un documento          |
| PATCH  | `/documents/:id/status`                 | Cambiar el estado del documento  |
| DELETE | `/documents/:id`                        | Eliminar un documento            |

## Tracking

| Método | Endpoint                               | Descripción                                |
| ------ | -------------------------------------- | ------------------------------------------ |
| GET    | `/tracking`                            | Obtener todos los registros de seguimiento |
| GET    | `/tracking/:id`                        | Obtener un registro de seguimiento         |
| GET    | `/tracking/application/:applicationId` | Obtener el historial de una solicitud      |
| POST   | `/tracking`                            | Crear un registro de seguimiento           |
| PATCH  | `/tracking/:id`                        | Actualizar un registro de seguimiento      |
| DELETE | `/tracking/:id`                        | Eliminar un registro de seguimiento        |

---

# Validación global

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

* Validar los datos enviados mediante DTOs.
* Transformar los valores cuando corresponde.
* Permitir únicamente propiedades definidas en los DTOs.
* Rechazar propiedades que no estén definidas en los DTOs.

Los errores de validación generan respuestas:

```text
400 Bad Request
```

Los recursos inexistentes generan:

```text
404 Not Found
```

---

# Manejo de errores

Los servicios centralizan la búsqueda de recursos y generan `NotFoundException` cuando un registro no existe.

Por ejemplo:

```text
GET /students/999
```

genera:

```text
404 Not Found
```

Los parámetros con identificadores inválidos son procesados mediante pipes personalizados.

Por ejemplo:

```text
GET /students/a
```

genera:

```text
400 Bad Request
```

Los datos que no cumplen las reglas definidas en los DTOs también generan:

```text
400 Bad Request
```

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

Instalar las dependencias:

```bash
npm install
```

---

# Configuración del entorno

Crear un archivo `.env` en la raíz del proyecto.

Ejemplo:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=SG_Becas_ULEAM
DATABASE_USER=postgres
DATABASE_PASSWORD=tu_contraseña
```

También se proporciona un archivo `.env.example` como referencia:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=SG_Becas_ULEAM
DATABASE_USER=postgres
DATABASE_PASSWORD=change_me
```

> No se debe publicar el archivo `.env`, ya que contiene las credenciales locales de PostgreSQL.

---

# Ejecución

## Modo desarrollo

```bash
npm run start
```

## Modo watch

```bash
npm run start:dev
```

## Modo producción

```bash
npm run start:prod
```

La aplicación se ejecuta actualmente en:

```text
http://localhost:5500
```

---

# Pruebas con Thunder Client

Las pruebas manuales de la API se realizan mediante **Thunder Client** en Visual Studio Code.

Se verificaron las operaciones CRUD, las validaciones, el manejo de errores y la persistencia de los cinco módulos.

## Students

### Obtener estudiantes

```http
GET http://localhost:5500/students
```

### Obtener un estudiante

```http
GET http://localhost:5500/students/1
```

### Crear un estudiante

```http
POST http://localhost:5500/students
Content-Type: application/json
```

```json
{
  "firstName": "Gabriel",
  "lastName": "Guaman",
  "nationalId": "1312345678",
  "email": "gabriel@example.com",
  "age": 22,
  "career": "Ingeniería de Software",
  "semester": 5,
  "isActive": true
}
```

### Actualizar un estudiante

```http
PATCH http://localhost:5500/students/1
Content-Type: application/json
```

```json
{
  "career": "Ingeniería de Software",
  "semester": 6
}
```

### Eliminar un estudiante

```http
DELETE http://localhost:5500/students/1
```

---

## Scholarships

### Obtener becas

```http
GET http://localhost:5500/scholarships
```

### Obtener una beca

```http
GET http://localhost:5500/scholarships/1
```

### Crear una beca

```http
POST http://localhost:5500/scholarships
Content-Type: application/json
```

```json
{
  "name": "Beca Socioeconómica",
  "description": "Apoyo económico para estudiantes.",
  "amount": 500,
  "startDate": "2026-10-01",
  "endDate": "2026-12-31",
  "isActive": true
}
```

### Actualizar una beca

```http
PATCH http://localhost:5500/scholarships/1
Content-Type: application/json
```

```json
{
  "amount": 900,
  "isActive": false
}
```

### Eliminar una beca

```http
DELETE http://localhost:5500/scholarships/1
```

---

## Applications

### Obtener solicitudes

```http
GET http://localhost:5500/applications
```

### Obtener una solicitud

```http
GET http://localhost:5500/applications/1
```

### Obtener solicitudes por estudiante

```http
GET http://localhost:5500/applications/student/1
```

### Obtener solicitudes por beca

```http
GET http://localhost:5500/applications/scholarship/1
```

### Crear una solicitud

```http
POST http://localhost:5500/applications
Content-Type: application/json
```

```json
{
  "studentId": 1,
  "scholarshipId": 1,
  "gpa": 9.2,
  "income": 650,
  "comment": "Solicitud de beca por mérito académico"
}
```

### Actualizar una solicitud

```http
PATCH http://localhost:5500/applications/1
Content-Type: application/json
```

```json
{
  "gpa": 9.5,
  "comment": "Solicitud actualizada por mérito académico"
}
```

### Cambiar estado

```http
PATCH http://localhost:5500/applications/1/status
Content-Type: application/json
```

```json
{
  "status": "aprobada"
}
```

### Eliminar una solicitud

```http
DELETE http://localhost:5500/applications/1
```

---

## Documents

### Obtener documentos

```http
GET http://localhost:5500/documents
```

### Obtener un documento

```http
GET http://localhost:5500/documents/1
```

### Obtener documentos de una solicitud

```http
GET http://localhost:5500/documents/application/1
```

### Crear un documento

```http
POST http://localhost:5500/documents
Content-Type: application/json
```

```json
{
  "applicationId": 1,
  "name": "Certificado de notas",
  "url": "https://example.com/certificado-notas.pdf"
}
```

### Actualizar un documento

```http
PATCH http://localhost:5500/documents/1
Content-Type: application/json
```

```json
{
  "name": "Certificado de notas actualizado",
  "url": "https://example.com/certificado-actualizado.pdf"
}
```

### Cambiar estado

```http
PATCH http://localhost:5500/documents/1/status
Content-Type: application/json
```

```json
{
  "status": "aprobado"
}
```

### Eliminar un documento

```http
DELETE http://localhost:5500/documents/1
```

---

## Tracking

### Obtener seguimientos

```http
GET http://localhost:5500/tracking
```

### Obtener un seguimiento

```http
GET http://localhost:5500/tracking/1
```

### Obtener historial de una solicitud

```http
GET http://localhost:5500/tracking/application/1
```

### Crear un seguimiento

```http
POST http://localhost:5500/tracking
Content-Type: application/json
```

```json
{
  "applicationId": 1,
  "status": "revision",
  "comment": "Documentación enviada a revisión."
}
```

### Actualizar un seguimiento

```http
PATCH http://localhost:5500/tracking/1
Content-Type: application/json
```

```json
{
  "status": "aprobada",
  "comment": "Solicitud aprobada correctamente y registrada."
}
```

### Eliminar un seguimiento

```http
DELETE http://localhost:5500/tracking/1
```

---

# Evidencias de la entrega

Las evidencias de las pruebas realizadas se encuentran organizadas en:

```text
Evidencias Entrega 1/
```

La estructura real de evidencias del proyecto es la siguiente:

```text
Evidencias Entrega 1/
│
├── 01-Students/
│   ├── DELETE-Eliminar-Estudiante.png
│   ├── GET-Actualizado-Estudiantes.png
│   ├── GET-Listar-Estudiantes.png
│   ├── GET-Obtener-Estudiante.png
│   ├── PATCH-Actualizar-Estudiante.png
│   └── POST-Crear-Estudiante.png
│
├── 02-Scholarships/
│   ├── DELETE-Eliminar-Beca.png
│   ├── GET-Actualizado-Becas.png
│   ├── GET-Listar-Becas.png
│   ├── GET-Obtener-Beca.png
│   ├── PATCH-Actualizar-Beca.png
│   └── POST-Crear-Beca.png
│
├── 03-Applications/
│   ├── DELETE-Eliminar-Solicitud.png
│   ├── GET-Actualizado-Solicitudes.png
│   ├── GET-Listar-Solicitudes.png
│   ├── GET-Obtener-Solicitud.png
│   ├── PATCH-Actualizar-Solicitud.png
│   └── POST-Crear-Solicitud.png
│
├── 04-Documents/
│   ├── DELETE-Eliminar-Documento.png
│   ├── GET-Actualizado-Documentos.png
│   ├── GET-Listar-Documentos.png
│   ├── GET-Obtener-Documento.png
│   ├── PATCH-Actualizar-Documento.png
│   └── POST-Crear-Documento.png
│
├── 05-Tracking/
│   ├── DELETE-Eliminar-Seguimiento.png
│   ├── GET-Actualizado-Seguimiento.png
│   ├── GET-Listar-Seguimientos.png
│   ├── GET-Obtener-Seguimiento.png
│   ├── PATCH-Actualizar-Seguimiento.png
│   └── POST-Crear-Seguimiento.png
│
├── 06-Validaciones/
│   ├── DTO-Validacion-Students.png
│   ├── ID-Invalido-Scholarships.png
│   └── Recurso-No-Encontrado-Applications.png
│
└── 07-Persistencia-PostgreSQL/
    ├── Actualizar_Pagina_Persiste.png
    ├── Antes_Registro_BD_Vacio.png
    ├── Antes_Registro_Vacio.png
    ├── Datos_Iguales.png
    ├── Registrar_Datos_BD.png
    ├── Registrar_Datos_N.png
    ├── Registrar_Datos_TC.png
    └── Server_Apagado_BD_Persiste.png
```

---

# Evidencias de CRUD

Cada módulo cuenta con evidencias de las operaciones principales realizadas mediante Thunder Client.

## Students

```text
01-Students/
├── DELETE-Eliminar-Estudiante.png
├── GET-Actualizado-Estudiantes.png
├── GET-Listar-Estudiantes.png
├── GET-Obtener-Estudiante.png
├── PATCH-Actualizar-Estudiante.png
└── POST-Crear-Estudiante.png
```

Las evidencias corresponden a:

* Creación de estudiante.
* Listado de estudiantes.
* Consulta de estudiante.
* Actualización de estudiante.
* Consulta posterior a la actualización.
* Eliminación de estudiante.

## Scholarships

```text
02-Scholarships/
├── DELETE-Eliminar-Beca.png
├── GET-Actualizado-Becas.png
├── GET-Listar-Becas.png
├── GET-Obtener-Beca.png
├── PATCH-Actualizar-Beca.png
└── POST-Crear-Beca.png
```

Las evidencias corresponden a las operaciones CRUD y a la consulta posterior a la actualización.

## Applications

```text
03-Applications/
├── DELETE-Eliminar-Solicitud.png
├── GET-Actualizado-Solicitudes.png
├── GET-Listar-Solicitudes.png
├── GET-Obtener-Solicitud.png
├── PATCH-Actualizar-Solicitud.png
└── POST-Crear-Solicitud.png
```

Las evidencias corresponden a las operaciones CRUD y a la consulta posterior a la actualización.

## Documents

```text
04-Documents/
├── DELETE-Eliminar-Documento.png
├── GET-Actualizado-Documentos.png
├── GET-Listar-Documentos.png
├── GET-Obtener-Documento.png
├── PATCH-Actualizar-Documento.png
└── POST-Crear-Documento.png
```

Las evidencias corresponden a las operaciones CRUD y a la consulta posterior a la actualización.

## Tracking

```text
05-Tracking/
├── DELETE-Eliminar-Seguimiento.png
├── GET-Actualizado-Seguimiento.png
├── GET-Listar-Seguimientos.png
├── GET-Obtener-Seguimiento.png
├── PATCH-Actualizar-Seguimiento.png
└── POST-Crear-Seguimiento.png
```

Las evidencias corresponden a las operaciones CRUD y a la consulta posterior a la actualización.

---

# Evidencias de validación

Durante las pruebas con Thunder Client se verificaron diferentes casos de validación.

Las evidencias se encuentran en:

```text
06-Validaciones/
```

La carpeta contiene:

```text
06-Validaciones/
├── DTO-Validacion-Students.png
├── ID-Invalido-Scholarships.png
└── Recurso-No-Encontrado-Applications.png
```

## Validación de DTO

Archivo:

```text
DTO-Validacion-Students.png
```

Se realizó una prueba con datos inválidos en `Students`.

Respuesta obtenida:

```json
{
  "message": [
    "firstName should not be empty",
    "lastName should not be empty",
    "nationalId should not be empty",
    "email must be an email",
    "age must not be less than 1",
    "career should not be empty",
    "semester must not be less than 1"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

## ID inválido

Archivo:

```text
ID-Invalido-Scholarships.png
```

Se realizó una prueba de identificador inválido en `Scholarships`.

Respuesta obtenida:

```json
{
  "message": "El ID debe ser un número entero positivo",
  "error": "Bad Request",
  "statusCode": 400
}
```

## Recurso no encontrado

Archivo:

```text
Recurso-No-Encontrado-Applications.png
```

Se realizó una prueba de búsqueda de un recurso inexistente en `Applications`.

Respuesta obtenida:

```json
{
  "message": "Solicitud no encontrada",
  "error": "Not Found",
  "statusCode": 404
}
```

---

# Persistencia en PostgreSQL

La aplicación utiliza PostgreSQL y TypeORM para almacenar los datos.

Los cinco servicios utilizan repositorios de TypeORM:

```text
StudentsService
      ↓
TypeORM Repository<Student>
      ↓
PostgreSQL
```

```text
ScholarshipsService
      ↓
TypeORM Repository<Scholarship>
      ↓
PostgreSQL
```

```text
ApplicationsService
      ↓
TypeORM Repository<Application>
      ↓
PostgreSQL
```

```text
DocumentsService
      ↓
TypeORM Repository<Document>
      ↓
PostgreSQL
```

```text
TrackingService
      ↓
TypeORM Repository<Tracking>
      ↓
PostgreSQL
```

Las tablas principales son:

```text
students
scholarships
applications
documents
tracking
```

La aplicación utiliza:

```ts
autoLoadEntities: true
```

y:

```ts
synchronize: true
```

durante el desarrollo local.

Los datos almacenados mediante los repositorios de TypeORM permanecen en PostgreSQL y no dependen de arreglos o almacenamiento temporal en memoria.

La persistencia fue verificada mediante pruebas realizadas desde Thunder Client y comprobaciones en PostgreSQL.

También se verificó que los registros permanecen disponibles después de detener y volver a iniciar la aplicación.

## Evidencias de persistencia

Las evidencias se encuentran en:

```text
07-Persistencia-PostgreSQL/
```

Contenido:

```text
07-Persistencia-PostgreSQL/
├── Actualizar_Pagina_Persiste.png
├── Antes_Registro_BD_Vacio.png
├── Antes_Registro_Vacio.png
├── Datos_Iguales.png
├── Registrar_Datos_BD.png
├── Registrar_Datos_N.png
├── Registrar_Datos_TC.png
└── Server_Apagado_BD_Persiste.png
```

Estas evidencias documentan el proceso de registro, almacenamiento y comprobación de los datos entre Thunder Client, la aplicación y PostgreSQL, incluyendo la verificación de persistencia después de reiniciar el servidor.

---

# Estado actual del proyecto

Actualmente se encuentran implementados:

* Configuración inicial de NestJS.
* Arquitectura modular.
* Módulo `students`.
* CRUD de `students`.
* DTOs de `students`.
* Validaciones de `students`.
* Pipe para validar IDs de `students`.
* Módulo `scholarships`.
* CRUD de `scholarships`.
* DTOs de `scholarships`.
* Validaciones de `scholarships`.
* Pipe para validar IDs de `scholarships`.
* Módulo `applications`.
* CRUD de `applications`.
* DTOs de `applications`.
* Validaciones de `applications`.
* Pipe para validar IDs de `applications`.
* Módulo `documents`.
* CRUD de `documents`.
* DTOs de `documents`.
* Validaciones de `documents`.
* Pipe para validar IDs de `documents`.
* Módulo `tracking`.
* CRUD de `tracking`.
* DTOs de `tracking`.
* Validaciones de `tracking`.
* Pipe para validar IDs de `tracking`.
* Pruebas manuales mediante Thunder Client.
* Instalación de dependencias de PostgreSQL y TypeORM.
* Configuración de variables de entorno.
* Configuración de `ConfigModule`.
* Configuración de `TypeOrmModule`.
* Entidad TypeORM de `students`.
* Entidad TypeORM de `scholarships`.
* Entidad TypeORM de `applications`.
* Entidad TypeORM de `documents`.
* Entidad TypeORM de `tracking`.
* Creación de las tablas correspondientes en PostgreSQL.
* Conexión de desarrollo con PostgreSQL.
* Repositorios TypeORM en los cinco servicios.
* Operaciones CRUD mediante repositorios TypeORM.
* Manejo de recursos inexistentes mediante `NotFoundException`.
* Validación global mediante `ValidationPipe`.
* Verificación de los endpoints mediante Thunder Client.
* Verificación de persistencia de los registros en PostgreSQL.
* Verificación de persistencia después de reiniciar la aplicación.
* Evidencias de CRUD.
* Evidencias de validaciones.
* Evidencias de persistencia en PostgreSQL.
* Organización de evidencias de la entrega.
* Documentación de las evidencias.
* Compilación del proyecto con TypeORM.

---

# Próximos pasos

Para esta primera etapa, las funcionalidades principales del backend se encuentran implementadas y documentadas.

Como posibles mejoras para futuras etapas se pueden considerar:

1. Implementar relaciones explícitas de TypeORM mediante `@ManyToOne` y `@OneToMany`, si son requeridas por la siguiente etapa del proyecto.
2. Implementar migraciones para controlar los cambios del esquema en ambientes de producción.
3. Incorporar pruebas automatizadas unitarias y end-to-end.
4. Incorporar autenticación y autorización.
5. Implementar funcionalidades adicionales del sistema de gestión de becas.

---

# Pruebas de NestJS

El proyecto dispone de los comandos de prueba proporcionados por NestJS:

### Pruebas unitarias

```bash
npm run test
```

### Pruebas end-to-end

```bash
npm run test:e2e
```

### Reporte de cobertura

```bash
npm run test:cov
```

Estos comandos pueden utilizarse para ampliar posteriormente la cobertura de pruebas automatizadas del proyecto.

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
