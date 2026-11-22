import { DataSource } from 'typeorm';
import { getTestDatabaseName } from '../test-env.js';
import { InitialSchema1791676800000 } from '../../src/migrations/1791676800000-InitialSchema.js';
import { CreateUsersTable1791725363913 } from '../../src/migrations/1791725363913-CreateUsersTable.js';
import { AddRolesAndApplicationOwner1792000000000 } from '../../src/migrations/1792000000000-AddRolesAndApplicationOwner.js';

function connection(database: string) {
  return {
    type: 'postgres' as const,
    host: process.env.DATABASE_HOST ?? 'localhost',
    port: Number(process.env.DATABASE_PORT ?? 5432),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database,
  };
}

/**
 * Deja la base de pruebas lista y VACÍA. Se llama en el beforeAll de cada
 * archivo E2E, antes de crear la aplicación:
 *  1. Crea la base `<nombre>_test` si no existe.
 *  2. Recrea el esquema vacío (borra todo lo que hubiera).
 *  3. Aplica las migraciones reales del proyecto.
 */
export async function prepareTestDatabase(): Promise<void> {
  const dbName = getTestDatabaseName();

  const admin = new DataSource(connection('postgres'));
  await admin.initialize();
  const exists = await admin.query(
    'SELECT 1 FROM pg_database WHERE datname = $1',
    [dbName],
  );
  if (exists.length === 0) {
    await admin.query(`CREATE DATABASE "${dbName}"`);
  }
  await admin.destroy();

  const testDb = new DataSource({
    ...connection(dbName),
    migrations: [
      InitialSchema1791676800000,
      CreateUsersTable1791725363913,
      AddRolesAndApplicationOwner1792000000000,
    ],
  });
  await testDb.initialize();
  await testDb.query('DROP SCHEMA public CASCADE');
  await testDb.query('CREATE SCHEMA public');
  await testDb.runMigrations();
  await testDb.destroy();
}
