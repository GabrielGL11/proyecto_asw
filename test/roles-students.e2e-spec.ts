import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from './helpers/app.js';
import { prepareTestDatabase } from './helpers/database.js';
import {
  type Accounts,
  bearer,
  createAccounts,
  expectErrorFormat,
  scholarshipBody,
  studentBody,
} from './helpers/accounts.js';

/**
 * PARTE 2 — Acceso por rol y CRUD de estudiantes (CP-17 a CP-25).
 * Los casos son secuenciales: CP-20 crea el estudiante que usan CP-22 a CP-24.
 */
describe('API Becas ULEAM (E2E): roles y CRUD de estudiantes', () => {
  let app: INestApplication;
  let acc: Accounts;
  const run = Date.now();
  const api = () => request(app.getHttpServer());

  let studentId: number;
  let studentEmail: string;

  beforeAll(async () => {
    await prepareTestDatabase();
    app = await createTestApp();
    acc = await createAccounts(app);
  });

  afterAll(async () => {
    await app.close();
  });

  // ───────────────────────── Roles ─────────────────────────
  describe('Acceso por rol', () => {
    it('CP-17 crear beca como student, reviewer y admin → 403, 403 y 201', async () => {
      const body = scholarshipBody(`Beca E2E ${run}`);
      await api().post('/scholarships').set(bearer(acc.student1.token)).send(body).expect(403);
      await api().post('/scholarships').set(bearer(acc.reviewer.token)).send(body).expect(403);
      const res = await api().post('/scholarships').set(bearer(acc.admin.token)).send(body).expect(201);
      expect(res.body.id).toBeGreaterThan(0);
    });

    it('CP-18 GET /users como student, reviewer y admin → 403, 403 y 200 sin contraseñas', async () => {
      await api().get('/users').set(bearer(acc.student1.token)).expect(403);
      await api().get('/users').set(bearer(acc.reviewer.token)).expect(403);
      const res = await api().get('/users').set(bearer(acc.admin.token)).expect(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(4);
      for (const user of res.body) expect(user.password).toBeUndefined();
    });

    it('CP-19 cambiar un rol: no admin, rol inválido y usuario inexistente → 403, 400 y 404', async () => {
      await api()
        .patch(`/users/${acc.student2.id}/role`)
        .set(bearer(acc.student1.token))
        .send({ role: 'admin' })
        .expect(403);
      await api()
        .patch(`/users/${acc.student2.id}/role`)
        .set(bearer(acc.admin.token))
        .send({ role: 'superusuario' })
        .expect(400);
      const res = await api()
        .patch('/users/999999/role')
        .set(bearer(acc.admin.token))
        .send({ role: 'reviewer' })
        .expect(404);
      expectErrorFormat(res.body, 404, '/users/999999/role');
    });
  });

  // ───────────────────── CRUD de estudiantes ─────────────────────
  describe('CRUD de estudiantes (operación crítica)', () => {
    it('CP-20 el revisor crea un estudiante y se consulta → 201 y 200', async () => {
      studentEmail = `maria.${run}@live.uleam.edu.ec`;
      const created = await api()
        .post('/students')
        .set(bearer(acc.reviewer.token))
        .send(studentBody(studentEmail))
        .expect(201);
      studentId = created.body.id;
      const res = await api().get(`/students/${studentId}`).expect(200);
      expect(res.body.email).toBe(studentEmail);
    });

    it('CP-21 listado con paginación → 200 con items y meta', async () => {
      const res = await api().get('/students?page=1&limit=5').expect(200);
      expect(Array.isArray(res.body.items)).toBe(true);
      expect(res.body.items.length).toBeLessThanOrEqual(5);
      expect(res.body.meta.page).toBe(1);
      expect(res.body.meta.limit).toBe(5);
      expect(res.body.meta.total).toBeGreaterThanOrEqual(1);
    });

    it('CP-22 el revisor actualiza al estudiante → 200', async () => {
      const res = await api()
        .patch(`/students/${studentId}`)
        .set(bearer(acc.reviewer.token))
        .send({ career: 'Tecnologías de la Información', semester: 6 })
        .expect(200);
      expect(res.body.career).toBe('Tecnologías de la Información');
      expect(res.body.semester).toBe(6);
    });

    it('CP-23 crear con un correo ya existente → 409', async () => {
      const res = await api()
        .post('/students')
        .set(bearer(acc.reviewer.token))
        .send(studentBody(studentEmail))
        .expect(409);
      expectErrorFormat(res.body, 409, '/students');
    });

    it('CP-24 student crea o elimina; reviewer elimina → 403', async () => {
      await api()
        .post('/students')
        .set(bearer(acc.student1.token))
        .send(studentBody(`otro.${run}@live.uleam.edu.ec`))
        .expect(403);
      await api().delete(`/students/${studentId}`).set(bearer(acc.student1.token)).expect(403);
      await api().delete(`/students/${studentId}`).set(bearer(acc.reviewer.token)).expect(403);
    });

    it('CP-25 el admin elimina un estudiante y luego se consulta → 200 y 404', async () => {
      const created = await api()
        .post('/students')
        .set(bearer(acc.reviewer.token))
        .send(studentBody(`desechable.${run}@live.uleam.edu.ec`))
        .expect(201);
      const id = created.body.id;
      await api().delete(`/students/${id}`).set(bearer(acc.admin.token)).expect(200);
      const res = await api().get(`/students/${id}`).expect(404);
      expectErrorFormat(res.body, 404, `/students/${id}`);
    });
  });
});
