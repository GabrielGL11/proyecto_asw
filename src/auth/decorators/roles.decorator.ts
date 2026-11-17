import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/user-role.enum.js';

export const ROLES_KEY = 'roles';

/** Declara qué roles pueden ejecutar una ruta (la decisión la toma RolesGuard). */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
