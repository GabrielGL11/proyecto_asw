import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../auth/authenticated-user.interface.js';
import { UserRole } from '../users/user-role.enum.js';
import { ApplicationsService } from './applications.service.js';
import { UpdateApplicationUseCase } from './use-cases/update-application.use-case.js';
import { CreateApplicationDto } from './dto/create-application.dto.js';
import { ApplicationsQueryDto } from './dto/applications-query.dto.js';
import { UpdateApplicationDto } from './dto/update-application.dto.js';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto.js';
import { ParseApplicationIdPipe } from './pipes/parse-application-id.pipe.js';

@Controller('applications')
export class ApplicationsController {
  constructor(
    private readonly applicationsService: ApplicationsService,
    private readonly updateApplicationUseCase: UpdateApplicationUseCase,
  ) {}

  // Cualquier usuario autenticado puede crear; queda como propietario.
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createApplicationDto: CreateApplicationDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.applicationsService.create(createApplicationDto, user.id);
  }

  @Get()
  findAll(@Query() query: ApplicationsQueryDto) {
    return this.applicationsService.findAll(query);
  }

  @Get('student/:studentId')
  findByStudent(@Param('studentId', ParseApplicationIdPipe) studentId: number) {
    return this.applicationsService.findByStudent(studentId);
  }

  @Get('scholarship/:scholarshipId')
  findByScholarship(@Param('scholarshipId', ParseApplicationIdPipe) scholarshipId: number) {
    return this.applicationsService.findByScholarship(scholarshipId);
  }

  @Get(':id')
  findOne(@Param('id', ParseApplicationIdPipe) id: number) {
    return this.applicationsService.findOne(id);
  }

  // Admin, revisor o propietario (la regla de propiedad vive en el caso de uso).
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseApplicationIdPipe) id: number,
    @Body() updateApplicationDto: UpdateApplicationDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.updateApplicationUseCase.execute(id, updateApplicationDto, user);
  }

  // Aprobar/rechazar es decisión institucional: no la puede tomar el solicitante.
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.REVIEWER)
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseApplicationIdPipe) id: number,
    @Body() dto: UpdateApplicationStatusDto,
  ) {
    return this.applicationsService.updateStatus(id, dto.status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseApplicationIdPipe) id: number) {
    return this.applicationsService.remove(id);
  }
}
