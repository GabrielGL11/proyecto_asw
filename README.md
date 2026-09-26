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

Actualmente se ha configurado la conexión de desarrollo con **PostgreSQL + TypeORM** mediante variables de entorno.

El módulo **`scholarships`** ya cuenta con una entidad de TypeORM, una tabla en PostgreSQL y persistencia mediante `Repository`.

Los demás módulos mantienen actualmente su implementación original mientras se realiza progresivamente la migración hacia persistencia con TypeORM.

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

Las **Entities** representan las estructuras de datos que serán persistidas mediante TypeORM.

### Arquitectura de persistencia

Para el módulo `scholarships`, el flujo actual es:

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

El servicio de `scholarships` utiliza `Repository<Scholarship>` para realizar las operaciones de consulta, creación, actualización y eliminación de registros.

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
  inject: [ConfigService],

  useFactory: (config: ConfigService) => ({
    type: 'postgres',

    host: config.getOrThrow<string>('DATABASE_HOST'),

    port: Number(
      config.getOrThrow<string>('DATABASE_PORT'),
    ),

    username: config.getOrThrow<string>('DATABASE_USER'),

    password: config.getOrThrow<string>('DATABASE_PASSWORD'),

    database: config.getOrThrow<string>('DATABASE_NAME'),

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

La entidad `scholarship.entity.ts` representa actualmente el modelo persistente de las becas.

---

# Módulos implementados

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

### Endpoints

| Método | Endpoint        | Descripción                   |
| ------ | --------------- | ----------------------------- |
| GET    | `/students`     | Obtener todos los estudiantes |
| GET    | `/students/:id` | Obtener un estudiante por ID  |
| POST   | `/students`     | Crear un estudiante           |
| PATCH  | `/students/:id` | Actualizar un estudiante      |
| DELETE | `/students/:id` | Eliminar un estudiante        |

### Validaciones

El módulo utiliza DTOs y `class-validator`.

Se validan:

* Nombre obligatorio.
* Apellido obligatorio.
* Cédula obligatoria.
* Correo electrónico válido.
* Edad como número entero positivo.
* Carrera obligatoria.
* Semestre entre 1 y 10.
* Estado activo como booleano.
* ID como número entero positivo.

Las actualizaciones utilizan `PartialType`, permitiendo modificar únicamente los campos enviados.

---

# Scholarships

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

### Persistencia

El módulo utiliza actualmente **TypeORM + PostgreSQL**.

La entidad se encuentra en:

```text
src/scholarships/entities/scholarship.entity.ts
```

La entidad utiliza:

```ts
@Entity('scholarships')
```

para representar la tabla `scholarships` en PostgreSQL.

El módulo registra la entidad mediante:

```ts
TypeOrmModule.forFeature([Scholarship])
```

El servicio utiliza un repositorio de TypeORM:

```ts
@InjectRepository(Scholarship)
private readonly scholarshipsRepository: Repository<Scholarship>
```

Las operaciones CRUD se realizan directamente sobre PostgreSQL mediante este repositorio.

### Endpoints

| Método | Endpoint            | Descripción             |
| ------ | ------------------- | ----------------------- |
| GET    | `/scholarships`     | Obtener todas las becas |
| GET    | `/scholarships/:id` | Obtener una beca por ID |
| POST   | `/scholarships`     | Crear una beca          |
| PATCH  | `/scholarships/:id` | Actualizar una beca     |
| DELETE | `/scholarships/:id` | Eliminar una beca       |

### Validaciones

El módulo utiliza DTOs con `class-validator` y un pipe personalizado para validar los IDs.

Las actualizaciones utilizan `PartialType`.

### Persistencia verificada

Se realizaron pruebas mediante Thunder Client para verificar:

* Consulta de becas.
* Creación de becas.
* Consulta por ID.
* Actualización de becas.
* Eliminación de becas.
* Persistencia de los registros en PostgreSQL.

Los registros creados mediante `POST /scholarships` fueron almacenados en la tabla `scholarships`.

---

# Applications

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

### Endpoints

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

### Datos para crear una solicitud

El `CreateApplicationDto` utiliza los siguientes campos:

```json
{
  "studentId": 1,
  "scholarshipId": 1,
  "gpa": 8.7,
  "income": 450,
  "comment": "Solicitud de beca por situación económica"
}
```

### Validaciones

Se valida:

* `studentId` como entero positivo.
* `scholarshipId` como entero positivo.
* `gpa` como número mayor o igual a 0.
* `income` como número mayor o igual a 0.
* `comment` como texto opcional.
* ID como número entero positivo.

### Estados

Las solicitudes utilizan estados para representar el avance del proceso:

* `pendiente`
* `revision`
* `aprobada`
* `rechazada`
* `correccion`

El estado puede ser gestionado por el endpoint específico de cambio de estado.

---

# Documents

El módulo `documents` permite gestionar los documentos asociados a una solicitud de beca.

### Datos del documento

```text
id

applicationId

name

url

status
```

### Endpoints

| Método | Endpoint                                | Descripción                      |
| ------ | --------------------------------------- | -------------------------------- |
| GET    | `/documents`                            | Obtener todos los documentos     |
| GET    | `/documents/:id`                        | Obtener un documento por ID      |
| GET    | `/documents/application/:applicationId` | Obtener documentos por solicitud |
| POST   | `/documents`                            | Crear un documento               |
| PATCH  | `/documents/:id`                        | Actualizar un documento          |
| PATCH  | `/documents/:id/status`                 | Cambiar el estado del documento  |
| DELETE | `/documents/:id`                        | Eliminar un documento            |

### Datos para crear un documento

El `CreateDocumentDto` utiliza:

```json
{
  "applicationId": 1,
  "name": "Certificado de notas",
  "url": "https://example.com/certificado-notas.pdf"
}
```

### Validaciones

Se valida:

* `applicationId` como entero positivo.
* `name` obligatorio y de tipo texto.
* `url` opcional y de tipo texto.
* ID como número entero positivo.

### Estados

Los documentos pueden manejar los siguientes estados:

* `pendiente`
* `cargado`
* `observado`
* `aprobado`

---

# Tracking

El módulo `tracking` permite registrar y administrar el historial de seguimiento de las solicitudes de beca.

Cada registro permite conocer el estado de una solicitud y almacenar un comentario relacionado con el seguimiento.

### Datos del seguimiento

```text
id

applicationId

status

comment

createdAt
```

### Endpoints

| Método | Endpoint                               | Descripción                                |
| ------ | -------------------------------------- | ------------------------------------------ |
| GET    | `/tracking`                            | Obtener todos los registros de seguimiento |
| GET    | `/tracking/:id`                        | Obtener un registro por ID                 |
| GET    | `/tracking/application/:applicationId` | Obtener el historial de una solicitud      |
| POST   | `/tracking`                            | Crear un registro de seguimiento           |
| PATCH  | `/tracking/:id`                        | Actualizar un registro de seguimiento      |
| DELETE | `/tracking/:id`                        | Eliminar un registro de seguimiento        |

### Datos para crear un seguimiento

El `CreateTrackingDto` utiliza:

```json
{
  "applicationId": 1,
  "status": "revision",
  "comment": "Documentación enviada a revisión."
}
```

### Estados

Los registros de seguimiento admiten los siguientes estados:

* `pendiente`
* `revision`
* `aprobada`
* `rechazada`
* `correccion`

### Validaciones

El DTO `CreateTrackingDto` valida:

* `applicationId` obligatorio, entero y positivo.
* `status` obligatorio y limitado a los estados permitidos.
* `comment` opcional, de tipo texto y no vacío cuando se proporciona.

Las rutas que reciben un ID de seguimiento utilizan `ParseTrackingIdPipe` para validar que sea un entero positivo.

El parámetro `applicationId` utilizado para consultar el historial se convierte y valida mediante `ParseIntPipe`.

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

Los errores de validación generan respuestas HTTP:

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
PATCH http://localhost:5500/scholarships/2
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
DELETE http://localhost:5500/scholarships/2
```

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
  "studentId": 2,
  "scholarshipId": 2,
  "gpa": 9.2,
  "income": 650,
  "comment": "Solicitud de beca por mérito académico"
}
```

### Actualizar una solicitud

```http
PATCH http://localhost:5500/applications/4
Content-Type: application/json
```

```json
{
  "gpa": 9.5,
  "comment": "Solicitud actualizada por mérito académico"
}
```

### Eliminar una solicitud

```http
DELETE http://localhost:5500/applications/4
```

---

## Documents

### Obtener documentos

```http
GET http://localhost:5500/documents
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
PATCH http://localhost:5500/documents/2
Content-Type: application/json
```

```json
{
  "name": "Certificado de notas actualizado",
  "url": "https://example.com/certificado-actualizado.pdf"
}
```

### Eliminar un documento

```http
DELETE http://localhost:5500/documents/2
```

---

## Tracking

### Obtener seguimientos

```http
GET http://localhost:5500/tracking
```

### Obtener un seguimiento

```http
GET http://localhost:5500/tracking/2
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
PATCH http://localhost:5500/tracking/2
Content-Type: application/json
```

```json
{
  "status": "aprobada",
  "comment": "Solicitud aprobada correctamente y registrada."
}
```

### Actualización parcial

```http
PATCH http://localhost:5500/tracking/2
Content-Type: application/json
```

```json
{
  "comment": "Solicitud aprobada correctamente y registrada."
}
```

### Eliminar un seguimiento

```http
DELETE http://localhost:5500/tracking/3
```

---

# Evidencias de validación

Durante las pruebas con Thunder Client se verificaron casos de éxito y error en los diferentes módulos.

## Scholarships

```text
GET /scholarships       → 200 OK
GET /scholarships/1    → 200 OK
POST /scholarships     → 201 Created
PATCH /scholarships/2  → 200 OK
DELETE /scholarships/2 → 200 OK
```

También se verificó que los registros creados y actualizados mediante la API fueran almacenados correctamente en PostgreSQL.

## Applications

```text
GET /applications                 → 200 OK

GET /applications/1              → 200 OK

POST /applications               → 201 Created

PATCH /applications/4            → 200 OK

DELETE /applications/4           → 200 OK

GET /applications/4             → 404 Not Found

GET /applications/a             → 400 Bad Request

POST con datos inválidos         → 400 Bad Request
```

## Documents

```text
GET /documents                   → 200 OK

POST /documents                  → 201 Created

PATCH /documents/2               → 200 OK

DELETE /documents/2              → 200 OK

GET /documents/2                 → 404 Not Found

GET /documents/a                 → 400 Bad Request

POST con datos inválidos         → 400 Bad Request
```

## Tracking

```text
GET /tracking                    → 200 OK

GET /tracking/2                  → 200 OK

POST /tracking                   → 201 Created

PATCH /tracking/2                → 200 OK

PATCH /tracking/2                → 200 OK

DELETE /tracking/3               → 200 OK

DELETE /tracking/999             → 404 Not Found
```

### Validaciones de Tracking

Durante las pruebas también se verificaron:

```text
PATCH con status inválido        → 400 Bad Request

PATCH con applicationId: 0       → 400 Bad Request

PATCH con applicationId: "abc"   → 400 Bad Request

PATCH con comment vacío          → 400 Bad Request

PATCH con propiedad no permitida → 400 Bad Request
```

### Ejemplo de estado inválido

```json
{
  "status": "cancelada"
}
```

Respuesta:

```json
{
  "message": [
    "status must be one of the following values: pendiente, revision, aprobada, rechazada, correccion"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

### Ejemplo de propiedad no permitida

```json
{
  "estado": "pendiente"
}
```

Respuesta:

```json
{
  "message": [
    "property estado should not exist"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

### Ejemplo de recurso inexistente

```http
DELETE /tracking/999
```

Respuesta:

```json
{
  "message": "Registro de seguimiento no encontrado",
  "error": "Not Found",
  "statusCode": 404
}
```

---

# Manejo de errores

El backend contempla errores relacionados con:

* Datos inválidos.
* Propiedades no permitidas.
* IDs inválidos.
* Recursos inexistentes.

### ID inválido

```http
GET /students/a
```

Respuesta:

```text
400 Bad Request
```

### Recurso inexistente

```http
GET /students/999
```

Respuesta:

```text
404 Not Found
```

Estos criterios también se aplican a los módulos de `scholarships`, `applications`, `documents` y `tracking`, de acuerdo con las validaciones implementadas en cada módulo.

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
* [x] Configuración inicial de `TypeOrmModule`.
* [x] Compilación exitosa del proyecto con TypeORM.
* [x] Entidad TypeORM de `scholarships`.
* [x] Registro de `Scholarship` mediante `TypeOrmModule.forFeature`.
* [x] Creación de la tabla `scholarships` mediante TypeORM.
* [x] Persistencia de `scholarships` mediante `Repository`.
* [x] CRUD de `scholarships` conectado a PostgreSQL.
* [x] Verificación de registros mediante PostgreSQL.

### Pendiente

* [ ] Crear las entidades TypeORM de los demás módulos.
* [ ] Registrar las entidades restantes en sus módulos.
* [ ] Crear las tablas restantes mediante TypeORM.
* [ ] Migrar los servicios restantes desde almacenamiento en memoria hacia repositorios TypeORM.
* [ ] Definir las relaciones entre entidades.
* [ ] Verificar la persistencia de los demás módulos después de reiniciar la aplicación.
* [ ] Realizar pruebas de integración con la base de datos.
* [ ] Completar la documentación final de evidencias.

---

# Próximos pasos

1. Crear las entidades TypeORM para los módulos restantes.
2. Registrar las entidades mediante `TypeOrmModule.forFeature`.
3. Crear las tablas correspondientes mediante TypeORM.
4. Sustituir los arreglos temporales de los módulos restantes por repositorios TypeORM.
5. Definir las relaciones entre entidades.
6. Mantener el mismo contrato HTTP de los endpoints.
7. Verificar la persistencia después de reiniciar la aplicación.
8. Realizar pruebas de integración.
9. Actualizar las evidencias del proyecto.
10. Completar la documentación final.

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

Proyecto académico desarrollado para la asignatura de desarrollo backend web.

**ULEAM — Universidad Laica Eloy Alfaro de Manabí**
