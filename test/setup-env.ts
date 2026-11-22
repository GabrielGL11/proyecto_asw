import { getTestDatabaseName } from './test-env.js';

// Se ejecuta antes de cada archivo E2E (setupFiles de jest-e2e.config.mjs):
// apunta la aplicación a la base _test y desactiva el límite de solicitudes
// (el login permite 5 por minuto y las pruebas inician sesión muchas veces).
process.env.NODE_ENV = 'test';
process.env.DATABASE_NAME = getTestDatabaseName();
process.env.THROTTLE_DISABLED = 'true';
process.env.JWT_SECRET ??= 'clave-secreta-solo-para-pruebas-e2e-0123456789';
process.env.JWT_EXPIRES_IN ??= '3600';
