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

El proyecto se desarrolla de manera incremental para la asignatura de **Desarrollo Backend Web con NestJS**, manteniendo la continuidad de la primera etapa e incorporando persistencia relacional, consultas avanzadas y validaciones.

Repositorio: [GabrielGL11/proyecto_asw](https://github.com/GabrielGL11/proyecto_asw)

---

## 1. Descripción del proyecto

El Sistema de Gestión de Becas ULEAM permite administrar los principales recursos del proceso de becas universitarias:

- Estudiantes.
- Becas.
- Solicitudes de becas.
- Documentos.
- Seguimiento de solicitudes.

La API utiliza una arquitectura modular basada en NestJS. Los datos se almacenan en PostgreSQL y se administran mediante TypeORM.

Actualmente, el proyecto cuenta con cinco módulos principales, operaciones CRUD definidas, relaciones entre entidades, validaciones, manejo de errores y funcionalidades de búsqueda, filtrado, ordenamiento y paginación.

La autenticación mediante usuarios y JWT, así como las migraciones para la entrega final, continúan pendientes de implementación.

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
- Operaciones CRUD en los cinco controladores.
- Integración con PostgreSQL.
- Configuración mediante variables de entorno.
- Manejo de errores HTTP.
- Pruebas manuales de los endpoints.

### Etapa 2 — Modelo relacional, consultas y autenticación

La segunda etapa continúa el proyecto anterior, ampliando su modelo de datos y las funcionalidades de consulta.

**Implementado hasta el momento:**

- Relaciones `@ManyToOne` y `@OneToMany`.
- Claves foráneas entre las entidades.
- Consultas con información relacionada.
- Validación de existencia de estudiantes y becas al crear solicitudes.
- Validación de estudiantes activos.
- Prevención de solicitudes duplicadas.
- Consultas de solicitudes por estudiante y por beca.
- Filtros mediante parámetros de consulta.
- Búsqueda por texto en los módulos correspondientes.
- Paginación.
- Ordenamiento ascendente y descendente.
- Metadatos de paginación.
- Validación de parámetros de consulta.
- Rechazo de propiedades no permitidas.
- Pruebas de compilación, consultas, filtros y respuestas de error.

**Pendiente para completar la etapa:**

- Implementación y validación final de migraciones de TypeORM.
- Configuración de entrega con `synchronize: false`.
- Módulo de usuarios.
- Registro de usuarios.
- Hash de contraseñas.
- Inicio de sesión.
- Generación y validación de JWT.
- Protección de al menos dos endpoints de escritura.
- Pruebas completas de CRUD, integridad referencial y eliminación.
- Evidencias finales y documento de entrega.

---

## 3. Tecnologías utilizadas

- Node.js
- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- `pg`
- `@nestjs/config`
- `@nestjs/typeorm`
- `class-validator`
- `class-transformer`
- `@nestjs/mapped-types`
- npm
- Thunder Client

Las dependencias necesarias para autenticación, como las de JWT y hash de contraseñas, se incorporarán cuando se implemente esa parte del proyecto.

---

## 4. Arquitectura del sistema

El proyecto sigue una arquitectura modular. Cada recurso separa sus responsabilidades mediante controladores, servicios, DTOs y entidades.

```text
src/
├── students/
├── scholarships/
├── applications/
├── documents/
├── tracking/
├── app.module.ts
├── app.controller.ts
├── app.service.ts
└── main.ts
```

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

---

## 5. Modelo relacional

Las cinco entidades principales se relacionan de la siguiente manera:

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

- Las relaciones de `Application` con `Student` y `Scholarship` utilizan `RESTRICT`, según la configuración documentada de las entidades.
- Las relaciones de `Document` y `Tracking` con `Application` utilizan `CASCADE`, según la configuración documentada.

Estas reglas deben mantenerse alineadas con las restricciones reales de PostgreSQL y verificarse mediante pruebas de eliminación antes de dar por finalizada la entrega.

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

---

## 7. CRUD y endpoints disponibles

Los controladores exponen operaciones para crear, consultar, actualizar y eliminar registros. La existencia de estas rutas no sustituye las pruebas funcionales completas de cada operación.

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
| POST | `/applications` | Crear una solicitud |
| PATCH | `/applications/:id` | Actualizar una solicitud |
| PATCH | `/applications/:id/status` | Cambiar el estado de una solicitud |
| DELETE | `/applications/:id` | Eliminar una solicitud |

### Documents

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/documents` | Consultar documentos con filtros y paginación |
| GET | `/documents/:id` | Consultar un documento por ID |
| GET | `/documents/application/:applicationId` | Consultar documentos de una solicitud |
| POST | `/documents` | Crear un documento |
| PATCH | `/documents/:id` | Actualizar un documento |
| PATCH | `/documents/:id/status` | Cambiar el estado de un documento |
| DELETE | `/documents/:id` | Eliminar un documento |

### Tracking

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/tracking` | Consultar seguimientos con filtros y paginación |
| GET | `/tracking/:id` | Consultar un seguimiento por ID |
| GET | `/tracking/application/:applicationId` | Consultar seguimientos de una solicitud |
| POST | `/tracking` | Crear un seguimiento |
| PATCH | `/tracking/:id` | Actualizar un seguimiento |
| DELETE | `/tracking/:id` | Eliminar un seguimiento |

---

## 8. Búsqueda, filtros, ordenamiento y paginación

Los cinco módulos cuentan con DTOs de consulta para validar los parámetros recibidos mediante query params.

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

### Errores comprobados

| Caso | Respuesta |
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

### Reglas de negocio de las solicitudes

**Estudiante inexistente:** no se permite crear una solicitud con un estudiante que no existe.

**Beca inexistente:** no se permite crear una solicitud con una beca que no existe.

**Estudiante inactivo:** no se permite registrar una nueva solicitud con un estudiante inactivo.

**Solicitud duplicada:** la combinación de estudiante y beca debe ser única. Cuando se intenta crear una solicitud duplicada, el servicio está diseñado para responder con `409 Conflict`.

La respuesta específica de cada regla depende de las excepciones implementadas en el servicio correspondiente.

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
```

También se dispone de un archivo `.env.example` para indicar las variables requeridas sin publicar las credenciales reales:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=SG_Becas_ULEAM
DATABASE_USER=postgres
DATABASE_PASSWORD=change_me
```

El archivo `.env` debe permanecer excluido del control de versiones mediante `.gitignore`.

**No se deben publicar contraseñas reales en GitHub.**

### Configuración actual de TypeORM

La aplicación utiliza `@nestjs/config` y `@nestjs/typeorm` para configurar la conexión a PostgreSQL.

En el entorno de desarrollo se ha utilizado `synchronize: true` para mantener las tablas alineadas con las entidades durante la implementación.

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

Este fragmento describe la configuración de desarrollo actual; debe coincidir con el código real del repositorio.

### Pendiente para la entrega final

La especificación de la etapa requiere migraciones de TypeORM y desactivar la sincronización automática.

La transición prevista es:

```text
Configuración de desarrollo
        ↓
Crear y verificar migraciones
        ↓
Probar la aplicación con migraciones
        ↓
Configurar synchronize: false
```

No se debe desactivar `synchronize` en el entorno de entrega hasta haber preparado y probado las migraciones correspondientes.

---

## 11. Pruebas realizadas hasta el momento

Las siguientes comprobaciones se han ejecutado durante el desarrollo.

| Prueba | Resultado |
|---|---|
| Compilación con `npm run build` | Correcta |
| Consulta por ID en los cinco módulos | Correcta para los IDs probados |
| Consulta de una solicitud con relaciones | Correcta para el registro probado |
| Consulta de documento con su solicitud | Correcta para el registro probado |
| Consulta de seguimiento por ID | Correcta para el registro probado |
| Filtros combinados de becas | Correctos en la prueba realizada |
| Filtros combinados de estudiantes | Correctos en la prueba realizada |
| Filtros combinados de solicitudes | Correctos en la prueba realizada |
| Filtros combinados de documentos | Correctos en la prueba realizada |
| Filtros combinados de seguimiento | Correctos en la prueba realizada |
| Ordenamiento descendente de documentos | Correcto después del ajuste |
| Paginación de documentos | Correcta en las páginas probadas |
| Validación de parámetros inválidos | Correcta en los casos probados |
| Rechazo de propiedades desconocidas | Correcto en la prueba realizada |
| Consulta de IDs inexistentes en los cinco módulos | HTTP 404 en los casos probados |
| Beca sin nombre obligatorio | HTTP 400 |
| Estudiante con edad negativa | HTTP 400 |
| Documento con solicitud inexistente | HTTP 404 |
| Seguimiento con solicitud inexistente | HTTP 404 |

Estas pruebas confirman los casos indicados, pero no representan una garantía de que todos los escenarios posibles estén cubiertos.

### Pruebas que faltan completar

- Crear, actualizar y eliminar registros de prueba en los cinco módulos.
- Verificar todos los campos obligatorios y restricciones de los DTOs.
- Probar de forma específica las reglas de eliminación y las claves foráneas.
- Verificar la persistencia tras reiniciar el servidor y consultar nuevamente PostgreSQL.
- Comprobar las migraciones cuando estén implementadas.
- Probar registro, login y endpoints protegidos cuando se implemente JWT.

---

## 12. Instalación

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

Crear un archivo `.env` a partir de `.env.example` y configurar los datos de conexión a PostgreSQL.

Antes de iniciar la aplicación, verificar que PostgreSQL esté funcionando y que exista la base de datos configurada.

---

## 13. Ejecución de la aplicación

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

## 14. Comandos de comprobación

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

Las pruebas manuales de los endpoints se realizan mediante Thunder Client y, cuando corresponde, mediante PowerShell.

---

## 15. Evidencias del proyecto

Las capturas deben organizarse según las pruebas que realmente se hayan realizado.

Una estructura propuesta para la siguiente entrega es:

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

Las carpetas de migraciones y autenticación deberán completarse cuando esas funcionalidades estén implementadas y probadas.

Las evidencias anteriores deben conservarse si forman parte de la entrega de la primera etapa.

---

## 16. Lista de trabajo pendiente

### Consultas y validaciones

- [x] DTOs de consulta en los cinco módulos.
- [x] Búsqueda y filtros implementados según cada recurso.
- [x] Paginación.
- [x] Ordenamiento.
- [x] Metadatos de paginación.
- [x] Validación de parámetros de consulta.
- [x] Pruebas de varias combinaciones de filtros.
- [x] Pruebas de errores HTTP `400` y `404` en los casos documentados.
- [ ] Completar las pruebas de CRUD para los cinco módulos.
- [ ] Completar las pruebas de integridad referencial y eliminación.

### Persistencia y configuración

- [x] Entidades de TypeORM.
- [x] Conexión con PostgreSQL.
- [x] Relaciones entre los recursos.
- [ ] Crear y probar migraciones.
- [ ] Desactivar `synchronize` para la configuración final de entrega.
- [ ] Verificar toda la configuración final del entorno.

### Autenticación y seguridad

- [ ] Crear el módulo `users`.
- [ ] Implementar el registro de usuarios.
- [ ] Implementar el hash de contraseñas.
- [ ] Crear el módulo `auth`.
- [ ] Implementar el login.
- [ ] Generar tokens JWT.
- [ ] Implementar la validación de tokens.
- [ ] Configurar el guard de autenticación.
- [ ] Proteger al menos dos endpoints de escritura.
- [ ] Probar las respuestas de acceso autorizado y no autorizado.

### Documentación y entrega

- [ ] Completar las evidencias de las pruebas restantes.
- [ ] Preparar el documento final de la etapa.
- [ ] Verificar que `.env` no se publique en el repositorio.
- [ ] Ejecutar nuevamente `npm run build`.
- [ ] Revisar el estado final del repositorio y sus commits.

---

## 17. Recursos oficiales

- [Documentación de NestJS](https://docs.nestjs.com/)
- [Repositorio de NestJS](https://github.com/nestjs/nest)
- [Documentación de TypeORM](https://typeorm.io/)
- [Documentación de PostgreSQL](https://www.postgresql.org/docs/)
- [Documentación de class-validator](https://github.com/typestack/class-validator)

---

## Autoría

Proyecto académico desarrollado para la asignatura de **Desarrollo Backend Web con NestJS**.

**Universidad Laica Eloy Alfaro de Manabí (ULEAM)**

Repositorio: [https://github.com/GabrielGL11/proyecto_asw](https://github.com/GabrielGL11/proyecto_asw)
