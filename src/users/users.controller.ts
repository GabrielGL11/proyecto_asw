import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { ApiErrorResponses } from '../common/swagger/api-errors.decorator.js';
import { UsersService } from './users.service.js';
import { UpdateUserRoleDto } from './dto/update-user-role.dto.js';
import { UserRole } from './user-role.enum.js';
import { User } from './entities/user.entity.js';

/** Rutas exclusivas de administración: JWT + rol ADMIN. */
@ApiTags('Usuarios (admin)')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Listar usuarios (sin contraseñas). Solo admin' })
  @ApiOkResponse({ type: [User] })
  @ApiErrorResponses(401, 403)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Cambiar el rol de un usuario. Solo admin' })
  @ApiOkResponse({
    schema: { example: { id: 2, email: 'revisor@example.com', role: 'reviewer' } },
  })
  @ApiErrorResponses(400, 401, 403, 404)
  @Patch(':id/role')
  updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserRoleDto,
  ) {
    return this.usersService.updateRole(id, dto.role);
  }
}
