import type { UserRole } from '../users/user-role.enum.js';

/** Identidad segura que la estrategia JWT deja en `req.user`. */
export interface AuthenticatedUser {
  id: number;
  email: string;
  role: UserRole;
}
