import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module.js';
import { configureApp } from '../../src/app.setup.js';
import { setupSwagger } from '../../src/swagger.setup.js';

/**
 * Crea la aplicación completa con la MISMA configuración que main.ts
 * (configureApp). Se niega a continuar si la base no termina en `_test`.
 */
export async function createTestApp(
  options: { swagger?: boolean } = {},
): Promise<INestApplication> {
  const dbName = process.env.DATABASE_NAME ?? '';
  if (!dbName.endsWith('_test')) {
    throw new Error(
      `E2E bloqueado: la base "${dbName}" no termina en _test. No se ejecutan pruebas contra datos reales.`,
    );
  }

  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const app = moduleRef.createNestApplication();
  configureApp(app);
  if (options.swagger) setupSwagger(app);
  await app.init();
  return app;
}
