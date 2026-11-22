import { config } from 'dotenv';

// Carga .env sin sobrescribir variables ya definidas en el entorno.
config({ quiet: true });

/**
 * Nombre de la base de datos de pruebas. Siempre termina en `_test`:
 * las pruebas E2E se niegan a ejecutarse contra cualquier otra base para
 * no modificar nunca los datos reales.
 */
export function getTestDatabaseName(): string {
  const explicit = process.env.DATABASE_NAME_TEST;
  const base = process.env.DATABASE_NAME ?? 'SG_Becas_ULEAM';
  const name = explicit ?? (base.endsWith('_test') ? base : `${base}_test`);
  if (!name.endsWith('_test')) {
    throw new Error(
      `La base de pruebas debe terminar en "_test" (recibido: "${name}")`,
    );
  }
  return name;
}
