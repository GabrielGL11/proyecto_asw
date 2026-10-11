import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Application } from './applications/entities/application.entity.js';
import { Document } from './documents/entities/document.entity.js';
import { Scholarship } from './scholarships/entities/scholarship.entity.js';
import { Student } from './students/entities/students.entity.js';
import { Tracking } from './tracking/entities/tracking.entity.js';
import { User } from './users/entities/user.entity.js';

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT ?? 5432),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [Application, Document, Scholarship, Student, Tracking, User],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: false,
});
