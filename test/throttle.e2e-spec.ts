import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from './helpers/app.js';
import { prepareTestDatabase } from './helpers/database.js';

/** PARTE 1 — Límite de solicitudes (CP-34). */
describe('Limitación de solicitudes (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    await prepareTestDatabase();
    // En las demás pruebas el límite se desactiva; aquí se activa a propósito.
    process.env.THROTTLE_DISABLED = 'false';
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
    process.env.THROTTLE_DISABLED = 'true';
  });

  it('CP-34 el sexto intento de login en un minuto → 429', async () => {
    const statuses: number[] = [];
    for (let i = 0; i < 6; i++) {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'nadie@example.com', password: 'Incorrecta123!' });
      statuses.push(res.status);
    }
    expect(statuses.slice(0, 5)).toEqual([401, 401, 401, 401, 401]);
    expect(statuses[5]).toBe(429);
  });
});
