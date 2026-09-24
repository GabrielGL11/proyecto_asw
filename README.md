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
* **npm**
* **Thunder Client** para pruebas de la API

La persistencia con **PostgreSQL + TypeORM** será incorporada posteriormente como parte de la implementación del proyecto.

---

## Arquitectura

El proyecto utiliza una arquitectura modular proporcionada por NestJS.

Cada recurso cuenta con su propio módulo y separa las responsabilidades principales:

```text
Module
├── Controller
├── Service
├── DTO
└── Pipes
```

El **Controller** recibe las solicitudes HTTP, el **Service** contiene la lógica del recurso, los **DTOs** validan los datos recibidos y los **Pipes** permiten validar parámetros como los identificadores.

---

# Estructura del proyecto

Actualmente el proyecto cuenta con los siguientes módulos:

```text
src/
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
├── scholarships/
│   ├── dto/
│   │   ├── create-scholarship.dto.ts
│   │   └── update-scholarship.dto.ts
│   ├── pipes/
│   │   └── parse-scholarship-id.pipe.ts
│   ├── scholarships.controller.ts
│   ├── scholarships.service.ts
│   └── scholarships.module.ts
│
├── app.module.ts
├── app.controller.ts
├── app.service.ts
└── main.ts
```

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

El módulo utiliza DTOs y validaciones mediante `class-validator`.

Se validan, entre otros:

* Nombre y apellido obligatorios.
* Cédula obligatoria.
* Correo electrónico válido.
* Edad como número entero positivo.
* Carrera obligatoria.
* Semestre entre 1 y 10.
* Estado activo como booleano.

También se utiliza un pipe personalizado para validar que el ID sea un número entero positivo.

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

Las actualizaciones utilizan `PartialType`, permitiendo modificar únicamente los campos necesarios.

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

Esto permite:

* Validar los datos enviados en los DTOs.
* Transformar los valores cuando corresponde.
* Eliminar propiedades no permitidas.
* Rechazar propiedades que no estén definidas en los DTOs.

Los errores de validación generan respuestas HTTP **400 Bad Request**.

Los recursos inexistentes generan respuestas HTTP **404 Not Found**.

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

Los endpoints pueden probarse utilizando **Thunder Client** desde Visual Studio Code.

### Obtener estudiantes

```http
GET http://localhost:5500/students
```

### Obtener una beca

```http
GET http://localhost:5500/scholarships/1
```

### Crear estudiante

```http
POST http://localhost:5500/students
Content-Type: application/json
```

```json
{
  "firstName": "María",
  "lastName": "Gómez",
  "nationalId": "1307654321",
  "email": "maria.gomez@uleam.edu.ec",
  "age": 20,
  "career": "Ingeniería de Software",
  "semester": 4,
  "isActive": true
}
```

### Actualizar estudiante

```http
PATCH http://localhost:5500/students/1
Content-Type: application/json
```

```json
{
  "semester": 5
}
```

### Eliminar estudiante

```http
DELETE http://localhost:5500/students/1
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

---

# Estado actual del proyecto

Actualmente se encuentran implementados:

* [x] Configuración inicial de NestJS.
* [x] Arquitectura modular.
* [x] Módulo `scholarships`.
* [x] CRUD de `scholarships`.
* [x] DTOs de `scholarships`.
* [x] Validaciones de `scholarships`.
* [x] Pipe para validar IDs de `scholarships`.
* [x] Módulo `students`.
* [x] CRUD de `students`.
* [x] DTOs de `students`.
* [x] Validaciones de `students`.
* [x] Pipe para validar IDs de `students`.

Pendiente:

* [ ] Módulo `applications`.
* [ ] Módulo `documents`.
* [ ] Módulo `tracking`.
* [ ] Persistencia con PostgreSQL.
* [ ] Integración con TypeORM.
* [ ] Variables de entorno para la conexión a la base de datos.
* [ ] Entidades y relaciones de base de datos.
* [ ] Migración del CRUD en memoria hacia persistencia.
* [ ] Documentación de pruebas y evidencias del proyecto.

---

# Próximos pasos

1. Implementar el módulo `applications`.
2. Implementar el módulo `documents`.
3. Implementar el módulo `tracking`.
4. Incorporar PostgreSQL.
5. Integrar TypeORM.
6. Crear las entidades y relaciones.
7. Migrar el CRUD actual desde memoria hacia persistencia.
8. Configurar variables de entorno.
9. Documentar las pruebas y evidencias del proyecto.

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
