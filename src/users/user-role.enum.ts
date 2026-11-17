/**
 * Roles cerrados del sistema. El valor por defecto de una cuenta nueva es
 * STUDENT (el de menor privilegio).
 */
export enum UserRole {
  ADMIN = 'admin',
  REVIEWER = 'reviewer',
  STUDENT = 'student',
}
