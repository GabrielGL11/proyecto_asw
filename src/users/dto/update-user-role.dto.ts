import { IsEnum } from 'class-validator';
import { UserRole } from '../user-role.enum.js';

export class UpdateUserRoleDto {
  @IsEnum(UserRole)
  role: UserRole;
}
