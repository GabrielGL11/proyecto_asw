import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';

export const PASSWORD = 'Prueba123!';

export type Account = { id: number; email: string; token: string };
export type Accounts = {
  admin: Account;
  reviewer: Account;
  student1: Account;
  student2: Account;
};

export const bearer = (token: string) => ({ Authorization: `Bearer ${token}` });

/** Cuerpo válido para crear un estudiante (se pueden sobrescribir campos). */
export const studentBody = (
  email: string,
  extra: Record<string, unknown> = {},
) => ({
  firstName: 'María',
  lastName: 'Zambrano',
  nationalId: '1312345678',
  email,
  age: 20,
  career: 'Software',
  semester: 5,
  isActive: true,
  ...extra,
});

/** Cuerpo válido para crear una beca. */
export const scholarshipBody = (name: string) => ({
  name,
  description: 'Beca creada por las pruebas E2E',
  amount: 1500,
  startDate: '2026-01-01',
  endDate: '2026-12-31',
  isActive: true,
});

/**
 * Verifica la forma uniforme de error del filtro global HttpErrorFilter:
 * { statusCode, error, message, path, timestamp } y sin trazas internas.
 */
export function expectErrorFormat(
  body: Record<string, unknown>,
  status: number,
  path?: string,
): void {
  expect(body.statusCode).toBe(status);
  expect(typeof body.error).toBe('string');
  expect(body.message).toBeDefined();
  expect(typeof body.path).toBe('string');
  if (path) expect(body.path).toBe(path);
  expect(Number.isNaN(Date.parse(String(body.timestamp)))).toBe(false);
  expect(JSON.stringify(body)).not.toContain('at ');
}

async function register(app: INestApplication, email: string) {
  await request(app.getHttpServer())
    .post('/auth/register')
    .send({ email, password: PASSWORD })
    .expect(201);
}

async function login(app: INestApplication, email: string): Promise<Account> {
  const res = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ email, password: PASSWORD })
    .expect(201);
  return { id: res.body.user.id, email, token: res.body.accessToken };
}

/**
 * Crea cuatro cuentas con correos únicos y sus tokens:
 *  - admin: se promueve en la base (igual que explica el README),
 *  - reviewer: lo promueve el admin con PATCH /users/:id/role,
 *  - student1 y student2: quedan con el rol por defecto.
 */
export async function createAccounts(app: INestApplication): Promise<Accounts> {
  const run = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const emails = {
    admin: `admin.${run}@example.com`,
    reviewer: `revisor.${run}@example.com`,
    s1: `estudiante1.${run}@example.com`,
    s2: `estudiante2.${run}@example.com`,
  };
  for (const email of Object.values(emails)) await register(app, email);

  await app
    .get(DataSource)
    .query(`UPDATE users SET role = 'admin' WHERE email = $1`, [emails.admin]);

  const admin = await login(app, emails.admin);
  const reviewer = await login(app, emails.reviewer);
  await request(app.getHttpServer())
    .patch(`/users/${reviewer.id}/role`)
    .set(bearer(admin.token))
    .send({ role: 'reviewer' })
    .expect(200);
  const student1 = await login(app, emails.s1);
  const student2 = await login(app, emails.s2);
  return { admin, reviewer, student1, student2 };
}
