<p align="center">

  <a href="https://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>

</p>

<h1 align="center">Sistema de Gestión de Becas ULEAM</h1>

<p align="center">
Backend desarrollado con <strong>NestJS + TypeScript</strong> para la gestión de becas estudiantiles de la Universidad Laica Eloy Alfaro de Manabí (ULEAM).
</p>

---

## Descripción

El proyecto forma parte del trabajo autónomo de desarrollo backend web y utiliza una arquitectura modular basada en **NestJS**.

El sistema busca gestionar el proceso de becas universitarias mediante diferentes recursos relacionados:

* Estudiantes.
* Becas.
* Solicitudes de becas.
* Documentos.
* Seguimiento de solicitudes.

### Modelo general

```text
Student 1:N Application N:1 Scholarship

Application 1:N Document

Application 1:N Tracking
```

### Flujo general

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

## Tecnologías

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
* **Thunder Client** para las pruebas de la API

### Estado de la persistencia

Actualmente el proyecto cuenta con una configuración de desarrollo utilizando **PostgreSQL + TypeORM** mediante variables de entorno.

Se han creado las cinco entidades principales del sistema:

* `Student`
* `Scholarship`
* `Application`
* `Document`
* `Tracking`

También se han creado las cinco tablas correspondientes en la base de datos PostgreSQL:

```text
students
scholarships
applications
documents
tracking
```

La configuración utiliza `autoLoadEntities: true` para cargar automáticamente las entidades registradas mediante los módulos de TypeORM.

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

El **Controller** recibe las solicitudes HTTP.

El **Service** contiene la lógica de negocio.

Los **DTOs** definen y validan los datos recibidos.

Los **Pipes** permiten validar parámetros como los identificadores.

Las **Entities** representan las estructuras de datos que son persistidas mediante TypeORM.

### Arquitectura de persistencia

La configuración general de persistencia utiliza el siguiente flujo:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
TypeORM
    ↓
PostgreSQL
```

Los módulos que utilizan repositorios de TypeORM realizan sus operaciones de consulta, creación, actualización y eliminación directamente sobre PostgreSQL.

---

# Configuración de PostgreSQL

El proyecto utiliza una instancia local de PostgreSQL para el desarrollo.

### Base de datos

```text
Nombre: SG_Becas_ULEAM
Host: localhost
Puerto: 5432
Usuario: postgres
```

La contraseña no se almacena directamente en el código fuente.

### Variables de entorno

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

### `synchronize`

Se utiliza:

```ts
synchronize: true
```

únicamente durante el desarrollo local.

Esta opción permite que TypeORM cree o ajuste automáticamente las tablas a partir de las entidades.

No se considera una estrategia adecuada para producción. En etapas posteriores se podrán utilizar migraciones para controlar los cambios del esquema de la base de datos.

---

# Estructura del proyecto

Actualmente el proyecto cuenta con los cinco módulos principales:

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

> Los nombres exactos de los archivos de las entidades deben coincidir con los existentes en el repositorio.

Las cinco entidades representan actualmente los modelos principales del sistema y se encuentran configuradas para trabajar con TypeORM.

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

### Ejemplo de estructura

```ts
@Entity('scholarships')
export class Scholarship {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  amount: number;

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @Column()
  isActive: boolean;
}
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
| GET    | `/tracking/:id`                        | Obtener un registro por ID                 |
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

### Modo desarrollo

```bash
npm run start
```

### Modo watch

```bash
npm run start:dev
```

### Modo producción

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

# Evidencias de validación

Durante las pruebas con Thunder Client se verificaron casos de éxito y error en los diferentes módulos.

### Ejemplos de respuestas esperadas

```text
GET /students          → 200 OK
GET /students/1       → 200 OK
POST /students        → 201 Created

GET /scholarships     → 200 OK
GET /scholarships/1   → 200 OK
POST /scholarships    → 201 Created

GET /applications     → 200 OK
GET /applications/1   → 200 OK
POST /applications    → 201 Created

GET /documents        → 200 OK
POST /documents       → 201 Created

GET /tracking         → 200 OK
GET /tracking/1       → 200 OK
POST /tracking        → 201 Created
```

### Validaciones

También se contemplan casos como:

```text
ID inválido              → 400 Bad Request
Datos inválidos          → 400 Bad Request
Propiedad no permitida   → 400 Bad Request
Recurso inexistente      → 404 Not Found
```

Ejemplo:

```http
GET /students/a
```

Respuesta esperada:

```text
400 Bad Request
```

Ejemplo:

```http
GET /students/999
```

Respuesta esperada:

```text
404 Not Found
```

---

# Base de datos

La configuración actual utiliza PostgreSQL y TypeORM.

Al iniciar la aplicación correctamente se verificó que TypeORM pudiera conectarse a PostgreSQL y crear las tablas correspondientes.

Las tablas principales actualmente creadas son:

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

---

# Estado actual del proyecto

Actualmente se encuentran implementados:

* [x] Configuración inicial de NestJS.
* [x] Arquitectura modular.
* [x] Módulo `students`.
* [x] CRUD de `students`.
* [x] DTOs de `students`.
* [x] Validaciones de `students`.
* [x] Pipe para validar IDs de `students`.
* [x] Módulo `scholarships`.
* [x] CRUD de `scholarships`.
* [x] DTOs de `scholarships`.
* [x] Validaciones de `scholarships`.
* [x] Pipe para validar IDs de `scholarships`.
* [x] Módulo `applications`.
* [x] CRUD de `applications`.
* [x] DTOs de `applications`.
* [x] Validaciones de `applications`.
* [x] Pipe para validar IDs de `applications`.
* [x] Módulo `documents`.
* [x] CRUD de `documents`.
* [x] DTOs de `documents`.
* [x] Validaciones de `documents`.
* [x] Pipe para validar IDs de `documents`.
* [x] Módulo `tracking`.
* [x] CRUD de `tracking`.
* [x] DTOs de `tracking`.
* [x] Validaciones de `tracking`.
* [x] Pipe para validar IDs de `tracking`.
* [x] Pruebas manuales con Thunder Client.
* [x] Instalación de dependencias de PostgreSQL y TypeORM.
* [x] Configuración de variables de entorno.
* [x] Configuración de `ConfigModule`.
* [x] Configuración de `TypeOrmModule`.
* [x] Entidad TypeORM de `students`.
* [x] Entidad TypeORM de `scholarships`.
* [x] Entidad TypeORM de `applications`.
* [x] Entidad TypeORM de `documents`.
* [x] Entidad TypeORM de `tracking`.
* [x] Creación de la tabla `students`.
* [x] Creación de la tabla `scholarships`.
* [x] Creación de la tabla `applications`.
* [x] Creación de la tabla `documents`.
* [x] Creación de la tabla `tracking`.
* [x] Conexión de desarrollo con PostgreSQL.
* [x] Compilación exitosa del proyecto con TypeORM.

### Pendiente

* [ ] Verificar la persistencia mediante repositorios TypeORM en los módulos que todavía utilicen almacenamiento temporal.
* [ ] Verificar las operaciones CRUD de cada módulo directamente contra PostgreSQL.
* [ ] Definir relaciones TypeORM explícitas (`@ManyToOne`, `@OneToMany`) si son requeridas por el diseño final.
* [ ] Verificar la persistencia de los registros después de reiniciar la aplicación.
* [ ] Realizar pruebas de integración con la base de datos.
* [ ] Completar la documentación final de evidencias.
* [ ] Preparar migraciones para un entorno de producción.

---

# Próximos pasos

1. Verificar los repositorios TypeORM de cada módulo.
2. Comprobar las operaciones CRUD directamente en PostgreSQL.
3. Verificar las relaciones entre estudiantes, solicitudes, becas, documentos y seguimientos.
4. Mantener el mismo contrato HTTP de los endpoints.
5. Verificar la persistencia después de reiniciar la aplicación.
6. Realizar pruebas de integración.
7. Actualizar las evidencias del proyecto.
8. Completar la documentación final.

---

# Pruebas de NestJS

Para ejecutar las pruebas unitarias:

```bash
npm run test
```

Para ejecutar las pruebas end-to-end:

```bash
npm run test:e2e
```

Para obtener el reporte de cobertura:

```bash
npm run test:cov
```

---

# Recursos

* [NestJS Documentation](https://docs.nestjs.com)
* [NestJS GitHub](https://github.com/nestjs/nest)
* [NestJS Courses](https://courses.nestjs.com/)
* [NestJS Devtools](https://devtools.nestjs.com/)

---

# Autoría

Proyecto académico desarrollado para la asignatura de Desarrollo Backend Web.

**ULEAM — Universidad Laica Eloy Alfaro de Manabí**
