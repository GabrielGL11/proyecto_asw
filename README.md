# Sistema de Gestión de Becas ULEAM

Backend desarrollado con **NestJS, TypeScript, TypeORM y PostgreSQL** para administrar los procesos de becas estudiantiles de la Universidad Laica Eloy Alfaro de Manabí (ULEAM).

El proyecto se desarrolla para la asignatura **Desarrollo Backend Web con NestJS**, dando continuidad a la etapa inicial e incorporando persistencia relacional, consultas avanzadas, migraciones y autenticación mediante JWT.

**Repositorio:** [GabrielGL11/proyecto_asw](https://github.com/GabrielGL11/proyecto_asw)

---

## 1. Descripción del proyecto

El Sistema de Gestión de Becas ULEAM permite administrar los siguientes recursos:

- Estudiantes.
- Becas.
- Solicitudes de becas.
- Documentos.
- Seguimiento de solicitudes.
- Usuarios y autenticación.

La aplicación utiliza una arquitectura modular de NestJS. PostgreSQL almacena los datos y TypeORM gestiona las entidades, relaciones y operaciones de persistencia.

Entre sus funcionalidades se encuentran las operaciones CRUD, validaciones, manejo de errores HTTP, relaciones entre entidades, búsqueda, filtros, paginación, ordenamiento y autenticación JWT.

## 2. Etapas del proyecto

### Etapa 1 — Fundamentos y definición de la API

Se implementó la estructura inicial del backend:

- Arquitectura modular con NestJS.
- Módulos de estudiantes, becas, solicitudes, documentos y seguimiento.
- Entidades y DTOs.
- Validaciones mediante `class-validator`.
- `ValidationPipe` global.
- Validación de identificadores.
- Operaciones CRUD.
- Integración con PostgreSQL.
- Configuración mediante variables de entorno.
- Manejo de errores HTTP.

### Etapa 2 — Modelo relacional, consultas y autenticación

Se incorporaron las siguientes funcionalidades:

- Relaciones `@ManyToOne` y `@OneToMany`.
- Claves foráneas y restricciones de integridad.
- Validación de estudiantes y becas al crear solicitudes.
- Validación de estudiantes activos.
- Prevención de solicitudes duplicadas.
- Búsqueda, filtros, paginación y ordenamiento.
- Metadatos de paginación.
- Validación de parámetros de consulta.
- Configuración de TypeORM con `synchronize: false` para la entrega.
- Fuente de datos y estructura de migraciones.
- Registro de usuarios.
- Hash de contraseñas mediante bcrypt.
- Inicio de sesión y generación de JWT.
- Estrategia y guard JWT.
- Protección de rutas de escritura de solicitudes y documentos.

## 3. Tecnologías utilizadas

- Node.js y npm.
- NestJS y TypeScript.
- PostgreSQL.
- TypeORM y `pg`.
- `@nestjs/config`.
- `@nestjs/typeorm`.
- `class-validator` y `class-transformer`.
- `@nestjs/mapped-types`.
- Joi.
- `@nestjs/jwt`.
- `@nestjs/passport`.
- Passport y `passport-jwt`.
- bcrypt.
- `typeorm-ts-node-esm`.
- Vitest.
- Thunder Client para pruebas manuales.

## 4. Arquitectura del sistema

El proyecto separa responsabilidades mediante controladores, servicios, DTOs, entidades, repositorios, pipes y guards.

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
└── main.ts
```

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
Acceso al endpoint protegido
```

## 5. Modelo relacional

Las relaciones principales del sistema son:

```text
Student 1:N Application N:1 Scholarship

Application 1:N Document

Application 1:N Tracking
```

- **Student — Application:** un estudiante puede registrar varias solicitudes.
- **Scholarship — Application:** una beca puede tener varias solicitudes.
- **Application — Document:** una solicitud puede contener varios documentos.
- **Application — Tracking:** una solicitud puede tener varios registros de seguimiento.

La entidad `Application` mantiene las claves foráneas `studentId` y `scholarshipId`. Las entidades `Document` y `Tracking` mantienen la clave foránea `applicationId`.

### Reglas de eliminación

- Las relaciones entre solicitudes, estudiantes y becas utilizan `ON DELETE RESTRICT`.
- Las relaciones de documentos y seguimientos con solicitudes están configuradas según las reglas de eliminación definidas en sus entidades y migraciones.

Las claves foráneas de `applications.studentId` y `applications.scholarshipId` se comprobaron en PostgreSQL con la regla `ON DELETE RESTRICT`.

## 6. Entidades principales

### 6.1. Students

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

El correo electrónico está configurado como único.

### 6.2. Scholarships

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

### 6.3. Applications

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

Estados permitidos:

```text
pendiente
revision
aprobada
rechazada
correccion
```

Reglas de negocio:

- El estudiante debe existir y estar activo.
- La beca debe existir.
- No se permite más de una solicitud del mismo estudiante para la misma beca.
- Se comprueba la existencia de los registros relacionados antes de crear una solicitud.

La combinación de estudiante y beca cuenta con una restricción única compuesta y una comprobación adicional en el servicio.

### 6.4. Documents

Tabla: `documents`.

Campos principales:

```text
id
applicationId
name
url
status
```

Estados utilizados:

```text
pendiente
cargado
observado
aprobado
```

### 6.5. Tracking

Tabla: `tracking`.

Campos principales:

```text
id
applicationId
status
comment
createdAt
```

Permite consultar el historial de seguimiento asociado a cada solicitud.

### 6.6. Users

Tabla: `users`.

Campos principales:

```text
id
email
password
```

Características:

- Correo electrónico único.
- Contraseñas almacenadas mediante hash de bcrypt.
- Contraseña excluida de las respuestas públicas.
- Registro de usuarios.
- Inicio de sesión con generación de JWT.

La migración de creación de usuarios se ejecutó correctamente en la base de datos de desarrollo.

## 7. Endpoints de la API

### Students

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/students` | Consultar estudiantes |
| GET | `/students/:id` | Consultar un estudiante |
| POST | `/students` | Crear estudiante |
| PATCH | `/students/:id` | Actualizar estudiante |
| DELETE | `/students/:id` | Eliminar estudiante |

### Scholarships

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/scholarships` | Consultar becas con filtros |
| GET | `/scholarships/:id` | Consultar una beca |
| POST | `/scholarships` | Crear beca |
| PATCH | `/scholarships/:id` | Actualizar beca |
| DELETE | `/scholarships/:id` | Eliminar beca |

### Applications

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/applications` | Consultar solicitudes con filtros |
| GET | `/applications/:id` | Consultar solicitud y relaciones |
| GET | `/applications/student/:studentId` | Consultar solicitudes de un estudiante |
| GET | `/applications/scholarship/:scholarshipId` | Consultar solicitudes de una beca |
| POST | `/applications` | Crear solicitud; requiere JWT |
| PATCH | `/applications/:id` | Actualizar solicitud; requiere JWT |
| PATCH | `/applications/:id/status` | Cambiar estado; requiere JWT |
| DELETE | `/applications/:id` | Eliminar solicitud; requiere JWT |

### Documents

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/documents` | Consultar documentos |
| GET | `/documents/:id` | Consultar documento |
| GET | `/documents/application/:applicationId` | Consultar documentos de una solicitud |
| POST | `/documents` | Crear documento; requiere JWT |
| PATCH | `/documents/:id` | Actualizar documento; requiere JWT |
| PATCH | `/documents/:id/status` | Cambiar estado; requiere JWT |
| DELETE | `/documents/:id` | Eliminar documento; requiere JWT |

### Tracking

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/tracking` | Consultar seguimientos |
| GET | `/tracking/:id` | Consultar seguimiento |
| GET | `/tracking/application/:applicationId` | Consultar seguimientos de una solicitud |
| POST | `/tracking` | Crear seguimiento |
| PATCH | `/tracking/:id` | Actualizar seguimiento |
| DELETE | `/tracking/:id` | Eliminar seguimiento |

### Auth

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/auth/register` | Registrar usuario |
| POST | `/auth/login` | Iniciar sesión y obtener JWT |

La protección efectiva de cada endpoint depende de los guards y decoradores definidos en los controladores.

## 8. Búsqueda, filtros, ordenamiento y paginación

Las consultas utilizan DTOs y servicios con TypeORM para procesar los parámetros admitidos por cada recurso.

Parámetros habituales:

- `search`: búsqueda por texto.
- `studentId`, `scholarshipId` y `applicationId`: filtros por relaciones.
- `status`, `career`, `semester` e `isActive`: filtros específicos.
- `page` y `limit`: paginación.
- `sortBy` y `order`: ordenamiento.

Ejemplo de consulta:

```http
GET /scholarships?search=beca&isActive=true&page=1&limit=5&sortBy=name&order=ASC
```

Ejemplo de consulta de solicitudes:

```http
GET /applications?studentId=1&scholarshipId=1&status=pendiente&page=1&limit=5&sortBy=gpa&order=DESC
```

La estructura general de las respuestas paginadas es:

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

- `items`: registros de la página.
- `total`: total de registros que cumplen los filtros.
- `page`: página actual.
- `limit`: máximo de registros por página.
- `totalPages`: cantidad total de páginas.

La validación de consultas restringe la página a valores enteros mayores o iguales a 1 y limita el tamaño de página al intervalo de 1 a 50. Los campos de ordenamiento permitidos dependen del recurso.

## 9. Validaciones y manejo de errores

La aplicación utiliza un `ValidationPipe` global en `main.ts`:

```ts
app.useGlobalPipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
);
```

Esta configuración transforma los datos de entrada, valida los DTOs y rechaza propiedades no permitidas.

| Código HTTP | Significado |
|---|---|
| `400 Bad Request` | Datos o parámetros inválidos |
| `401 Unauthorized` | Falta de autenticación válida o credenciales incorrectas |
| `404 Not Found` | Recurso inexistente |
| `409 Conflict` | Conflicto, por ejemplo, correo duplicado |

Se realizaron pruebas de validación de datos, manejo de recursos inexistentes, prevención de duplicados y autenticación.

## 10. PostgreSQL, variables de entorno y migraciones

La base de datos utilizada durante el desarrollo local es:

```text
Nombre: SG_Becas_ULEAM
Host: localhost
Puerto: 5432
Usuario: postgres
```

Tablas principales:

```text
students
scholarships
applications
documents
tracking
users
migrations
```

### Variables de entorno

El archivo `.env` contiene la configuración local de PostgreSQL y JWT. Los nombres de las variables deben coincidir con los utilizados en la configuración del proyecto.

Ejemplo ilustrativo:

```env
NODE_ENV=development
PORT=5500

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=SG_Becas_ULEAM
DATABASE_USER=postgres
DATABASE_PASSWORD=tu_contraseña_local

JWT_SECRET=un_secreto_aleatorio_y_privado
JWT_EXPIRES_IN=3600
```

Los valores son ejemplos y no deben sustituir las credenciales locales reales.

El archivo `.env` debe permanecer excluido del control de versiones. El archivo `.env.example` debe contener únicamente valores de ejemplo, sin contraseñas ni secretos reales.

### Configuración de TypeORM

La configuración de entrega utiliza:

```ts
synchronize: false
```

Los cambios de esquema se gestionan mediante migraciones, evitando que TypeORM modifique automáticamente las tablas al iniciar la aplicación.

### Migraciones

La fuente de datos para las migraciones se encuentra en `src/data-source.ts`.

Comandos disponibles:

```bash
npm run migration:generate -- src/migrations/NombreMigracion
npm run migration:run
npm run migration:revert
```

`migration:revert` revierte la última migración ejecutada y debe utilizarse con precaución.

La migración de creación de usuarios se ejecutó correctamente en la base de desarrollo.

## 11. Autenticación y seguridad JWT

La autenticación utiliza bcrypt para almacenar hashes de contraseñas y JWT para proteger rutas seleccionadas.

### Registro

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

### Inicio de sesión

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

Cuando las credenciales son correctas, la API devuelve un `access_token`.

Para acceder a una ruta protegida se utiliza el encabezado:

```http
Authorization: Bearer <token_jwt>
```

No deben publicarse tokens reales, contraseñas ni secretos JWT en el README o en el repositorio.

### Pruebas de seguridad realizadas

Se verificaron escenarios como el registro duplicado, el rechazo de credenciales incorrectas, las solicitudes sin token y las operaciones autenticadas con datos válidos e inválidos.

También se comprobó el rechazo de una solicitud sin token y la creación autenticada de un documento.

## 12. Pruebas automatizadas y compilación

Se ejecutaron las pruebas automatizadas con Vitest:

```bash
npm test -- --reporter=verbose
```

Resultado de la ejecución más reciente:

| Indicador | Resultado |
|---|---:|
| Archivos de prueba aprobados | 11 |
| Pruebas aprobadas | 69 |
| Pruebas fallidas | 0 |

Los servicios de estudiantes, becas, solicitudes, documentos y seguimiento cuentan con pruebas de sus operaciones y comportamientos relevantes, incluidos filtros y paginación en los casos implementados.

También se ejecutó:

```bash
npm run build
```

La ejecución final compartida no mostró errores de compilación.

## 13. Instalación y ejecución

Clonar el repositorio:

```bash
git clone https://github.com/GabrielGL11/proyecto_asw.git
```

Entrar al proyecto:

```bash
cd proyecto_asw
```

Instalar dependencias:

```bash
npm install
```

Crear el archivo `.env` a partir de `.env.example` y configurar las variables locales.

Verificar que PostgreSQL esté ejecutándose y que la base configurada exista.

Iniciar la aplicación:

```bash
npm run start:dev
```

La aplicación utiliza el puerto configurado en las variables de entorno. El puerto local previsto es `5500`.

## 14. Comandos de comprobación

Compilar:

```bash
npm run build
```

Ejecutar todas las pruebas:

```bash
npm test
```

Ejecutar pruebas con detalle:

```bash
npm test -- --reporter=verbose
```

Ejecutar pruebas end-to-end:

```bash
npm run test:e2e
```

Obtener cobertura:

```bash
npm run test:cov
```

Ejecutar migraciones pendientes:

```bash
npm run migration:run
```

## 15. Documentación y evidencias

La entrega académica debe incluir las evidencias requeridas por la actividad, organizadas por funcionalidad:

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

El documento Word debe incluir el diagrama relacional, las pruebas realizadas, las credenciales de prueba no sensibles y la tabla definitiva de endpoints protegidos.

Las capturas de evidencia no deben mostrar contraseñas reales, secretos JWT ni el contenido sensible de `.env`.

## 16. Verificaciones finales de entrega

Las funcionalidades principales y las pruebas automatizadas están implementadas. Para cerrar la entrega, resta confirmar los siguientes puntos:

- [ ] Comprobar que los datos persisten después de reiniciar la API.
- [ ] Verificar la reconstrucción del esquema completo en una base de datos independiente mediante migraciones, sin modificar la base de desarrollo.
- [ ] Confirmar, si aún no se documentó, el rechazo de tokens JWT inválidos y expirados.
- [ ] Revisar el documento Word y completar las evidencias que exija la rúbrica.
- [ ] Confirmar que `.env` está excluido de Git y que no hay secretos en los archivos preparados para publicar.
- [ ] Ejecutar las comprobaciones finales y revisar el estado de Git antes de crear el commit definitivo y sincronizar con GitHub.

## 17. Recursos oficiales

- [NestJS](https://docs.nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [PostgreSQL](https://www.postgresql.org/docs/)
- [class-validator](https://github.com/typestack/class-validator)
- [Passport](https://www.passportjs.org/)
- [Autenticación en NestJS](https://docs.nestjs.com/security/authentication)
- [Joi](https://joi.dev/api/)

---

## Autoría

Proyecto académico desarrollado para la asignatura **Desarrollo Backend Web con NestJS**.

**Universidad Laica Eloy Alfaro de Manabí (ULEAM)**

Repositorio: [https://github.com/GabrielGL11/proyecto_asw](https://github.com/GabrielGL11/proyecto_asw)