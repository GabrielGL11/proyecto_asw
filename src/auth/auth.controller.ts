import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { CurrentUser } from './decorators/current-user.decorator.js';
import type { AuthenticatedUser } from './authenticated-user.interface.js';
import { ApiErrorResponses } from '../common/swagger/api-errors.decorator.js';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Registrar usuario (siempre con rol student)' })
  @ApiCreatedResponse({
    description: 'Usuario creado',
    schema: { example: { id: 1, email: 'estudiante@example.com', role: 'student' } },
  })
  @ApiErrorResponses(400, 409)
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  // Más estricto que el límite global: esta ruta recibe credenciales.
  // Al sexto intento en un minuto responde 429 Too Many Requests.
  @ApiOperation({ summary: 'Iniciar sesión (máximo 5 intentos por minuto)' })
  @ApiCreatedResponse({
    description: 'Token de acceso y usuario sin contraseña',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: { id: 1, email: 'estudiante@example.com', role: 'student' },
      },
    },
  })
  @ApiErrorResponses(400, 401, 429)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Identidad del usuario autenticado' })
  @ApiOkResponse({
    schema: { example: { id: 1, email: 'estudiante@example.com', role: 'student' } },
  })
  @ApiErrorResponses(401)
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: AuthenticatedUser) {
    return user;
  }
}
