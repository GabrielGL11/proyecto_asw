import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { UserRole } from '../user-role.enum.js';

export class UpdateUserRoleDto {
  @ApiProperty({ enum: UserRole, example: UserRole.REVIEWER })
  @IsEnum(UserRole)
  role: UserRole;
}
