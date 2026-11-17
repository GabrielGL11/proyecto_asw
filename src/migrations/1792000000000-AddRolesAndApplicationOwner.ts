import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRolesAndApplicationOwner1792000000000
  implements MigrationInterface
{
  name = 'AddRolesAndApplicationOwner1792000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Roles cerrados; las cuentas existentes quedan con el menor privilegio.
    await queryRunner.query(
      `CREATE TYPE "users_role_enum" AS ENUM ('admin', 'reviewer', 'student')`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "role" "users_role_enum" NOT NULL DEFAULT 'student'`,
    );

    // Propietario de la solicitud. Las existentes quedan sin propietario (NULL):
    // solo admin/revisor pueden modificarlas.
    await queryRunner.query(
      `ALTER TABLE "applications" ADD "createdByUserId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "applications"
         ADD CONSTRAINT "FK_applications_createdByUserId"
         FOREIGN KEY ("createdByUserId") REFERENCES "users"("id")
         ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "applications" DROP CONSTRAINT "FK_applications_createdByUserId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "applications" DROP COLUMN "createdByUserId"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
    await queryRunner.query(`DROP TYPE "users_role_enum"`);
  }
}
