import { ConflictException } from '@nestjs/common';

/** Códigos de error de PostgreSQL */
export const PG_UNIQUE_VIOLATION = '23505';
export const PG_FOREIGN_KEY_VIOLATION = '23503';

/** Obtiene el código SQLSTATE de un error de TypeORM/pg (si lo tiene). */
export function getPgErrorCode(error: unknown): string | undefined {
  const e = error as { code?: string; driverError?: { code?: string } } | null;
  return e?.driverError?.code ?? e?.code;
}

/**
 * Si el error corresponde al código de PostgreSQL indicado devuelve un 409
 * con el mensaje dado; si no, devuelve el mismo error para relanzarlo.
 * Uso: `throw toConflictIfPgCode(error, PG_UNIQUE_VIOLATION, 'mensaje');`
 */
export function toConflictIfPgCode(
  error: unknown,
  pgCode: string,
  message: string,
): unknown {
  return getPgErrorCode(error) === pgCode
    ? new ConflictException(message)
    : error;
}
