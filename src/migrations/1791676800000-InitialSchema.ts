import type { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1791676800000 implements MigrationInterface {
  name = 'InitialSchema1791676800000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "applications_status_enum" AS ENUM ('pendiente', 'revision', 'aprobada', 'rechazada', 'correccion')`,
    );
    await queryRunner.query(
      `CREATE TYPE "documents_status_enum" AS ENUM ('pendiente', 'cargado', 'observado', 'aprobado')`,
    );
    await queryRunner.query(
      `CREATE TABLE "students" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "nationalId" character varying NOT NULL, "email" character varying NOT NULL, "age" integer NOT NULL, "career" character varying NOT NULL, "semester" integer NOT NULL, "isActive" boolean NOT NULL, CONSTRAINT "UQ_students_email" UNIQUE ("email"), CONSTRAINT "PK_students_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "scholarships" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "amount" integer NOT NULL, "startDate" character varying NOT NULL, "endDate" character varying NOT NULL, "isActive" boolean NOT NULL, CONSTRAINT "PK_scholarships_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_users_email" UNIQUE ("email"), CONSTRAINT "PK_users_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "applications" ("id" SERIAL NOT NULL, "studentId" integer NOT NULL, "scholarshipId" integer NOT NULL, "gpa" numeric(10,2) NOT NULL, "income" numeric(10,2) NOT NULL, "comment" character varying, "status" "applications_status_enum" NOT NULL DEFAULT 'pendiente', CONSTRAINT "UQ_applications_student_scholarship" UNIQUE ("studentId", "scholarshipId"), CONSTRAINT "PK_applications_id" PRIMARY KEY ("id"), CONSTRAINT "FK_applications_studentId" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE NO ACTION, CONSTRAINT "FK_applications_scholarshipId" FOREIGN KEY ("scholarshipId") REFERENCES "scholarships"("id") ON DELETE RESTRICT ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `CREATE TABLE "documents" ("id" SERIAL NOT NULL, "applicationId" integer NOT NULL, "name" character varying NOT NULL, "url" character varying, "status" "documents_status_enum" NOT NULL DEFAULT 'pendiente', CONSTRAINT "PK_documents_id" PRIMARY KEY ("id"), CONSTRAINT "FK_documents_applicationId" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `CREATE TABLE "tracking" ("id" SERIAL NOT NULL, "applicationId" integer NOT NULL, "status" character varying NOT NULL, "comment" character varying, "createdAt" character varying NOT NULL, CONSTRAINT "PK_tracking_id" PRIMARY KEY ("id"), CONSTRAINT "FK_tracking_applicationId" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "tracking"`);
    await queryRunner.query(`DROP TABLE "documents"`);
    await queryRunner.query(`DROP TABLE "applications"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "scholarships"`);
    await queryRunner.query(`DROP TABLE "students"`);
    await queryRunner.query(`DROP TYPE "documents_status_enum"`);
    await queryRunner.query(`DROP TYPE "applications_status_enum"`);
  }
}
