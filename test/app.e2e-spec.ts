import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from './helpers/app.js';
import { prepareTestDatabase } from './helpers/database.js';
import {
  type Accounts,
  PASSWORD,
  bearer,
  createAccounts,
  expectErrorFormat,
} from './helpers/accounts.js';

/**
 * PARTE 1 — Raíz, validación, login y rutas sin token (CP-01 a CP-16).
 * HTTP real contra la base de datos _test.
 */
describe('API Becas ULEAM (E2E): raíz, validación, login y rutas sin token', () => {
  let app: INestApplication;
  let acc: Accounts;
  const run = Date.now();
  const api = () => request(app.getHttpServer());

  beforeAll(async () => {
    await prepareTestDatabase();
    app = await createTestApp();
    acc = await createAccounts(app);
  });

  afterAll(async () => {
    await app.close();
  });

  // ───────────────────────── Raíz ─────────────────────────
  describe('Raíz', () => {
    it('CP-01 GET / responde 200 con la página de bienvenida', async () => {
      const res = await api().get('/').expect(200);
      expect(res.text).toMatch(/Sistema de Gestión de Becas ULEAM/);
    });
  });

  // ─────────────────────── Validación ───────────────────────
  describe('Validación', () => {
    it('CP-02 registro con correo y contraseña inválidos → 400 con lista de errores', async () => {
      const res = await api()
        .post('/auth/register')
        .send({ email: 'no-es-correo', password: '123' })
        .expect(400);
      expect(Array.isArray(res.body.message)).toBe(true);
      expect(res.body.message.length).toBeGreaterThanOrEqual(2);
      expectErrorFormat(res.body, 400, '/auth/register');
    });

    it('CP-03 registro con el campo no permitido role → 400', async () => {
      const res = await api()
        .post('/auth/register')
        .send({ email: `intruso.${run}@example.com`, password: PASSWORD, role: 'admin' })
        .expect(400);
      expectErrorFormat(res.body, 400);
    });

    it('CP-04 crear estudiante con cuerpo vacío (admin) → 400', async () => {
      const res = await api().post('/students').set(bearer(acc.admin.token)).send({}).expect(400);
      expectErrorFormat(res.body, 400, '/students');
    });

    it('CP-05 crear solicitud con cuerpo vacío → 400', async () => {
      const res = await api().post('/applications').set(bearer(acc.student1.token)).send({}).expect(400);
      expectErrorFormat(res.body, 400, '/applications');
    });

    it('CP-06 consulta con limit=51 → 400', async () => {
      const res = await api().get('/students?limit=51').expect(400);
      expectErrorFormat(res.body, 400);
    });

    it('CP-07 consulta con sortBy=password → 400', async () => {
      const res = await api().get('/students?sortBy=password').expect(400);
      expectErrorFormat(res.body, 400);
    });
  });

  // ───────────────────────── Login ─────────────────────────
  describe('Login', () => {
    it('CP-08 login correcto → 201 con accessToken y usuario sin contraseña', async () => {
      const res = await api()
        .post('/auth/login')
        .send({ email: acc.student1.email, password: PASSWORD })
        .expect(201);
      expect(typeof res.body.accessToken).toBe('string');
      expect(res.body.user).toEqual({ id: acc.student1.id, email: acc.student1.email, role: 'student' });
      expect(JSON.stringify(res.body)).not.toMatch(/password|hash/i);
    });

    it('CP-09 contraseña incorrecta → 401', async () => {
      const res = await api()
        .post('/auth/login')
        .send({ email: acc.student1.email, password: 'Incorrecta123!' })
        .expect(401);
      expectErrorFormat(res.body, 401);
      expect(res.body.accessToken).toBeUndefined();
    });

    it('CP-10 correo inexistente → 401', async () => {
      await api()
        .post('/auth/login')
        .send({ email: `nadie.${run}@example.com`, password: PASSWORD })
        .expect(401);
    });

    it('CP-11 GET /auth/me con token válido → 200 con id, email y role', async () => {
      const res = await api().get('/auth/me').set(bearer(acc.admin.token)).expect(200);
      expect(res.body).toEqual({ id: acc.admin.id, email: acc.admin.email, role: 'admin' });
    });

    it('CP-12 GET /auth/me sin token y con token alterado → 401', async () => {
      await api().get('/auth/me').expect(401);

      // Se reemplaza el payload y se conserva la firma original → firma inválida.
      const [header, , signature] = acc.admin.token.split('.');
      const payload = Buffer.from(JSON.stringify({ sub: 1, email: 'falso@example.com' })).toString('base64url');
      await api()
        .get('/auth/me')
        .set(bearer(`${header}.${payload}.${signature}`))
        .expect(401);
    });
  });

  // ───────────────────────── Sin token ─────────────────────────
  describe('Rutas protegidas sin token', () => {
    it('CP-13 POST /scholarships sin token → 401 con formato uniforme', async () => {
      const res = await api().post('/scholarships').send({}).expect(401);
      expectErrorFormat(res.body, 401, '/scholarships');
    });

    it('CP-14 PATCH /applications/1 sin token → 401', async () => {
      await api().patch('/applications/1').send({ comment: 'x' }).expect(401);
    });

    it('CP-15 DELETE /students/1 sin token → 401', async () => {
      await api().delete('/students/1').expect(401);
    });

    it('CP-16 GET /users sin token → 401', async () => {
      await api().get('/users').expect(401);
    });
  });
});
