import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { ApplicationsService } from './applications.service.js';
import { CreateApplicationDto } from './dto/create-application.dto.js';
import { ApplicationsQueryDto } from './dto/applications-query.dto.js';
import { UpdateApplicationDto } from './dto/update-application.dto.js';
import { ParseApplicationIdPipe } from './pipes/parse-application-id.pipe.js';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createApplicationDto: CreateApplicationDto) {
    return this.applicationsService.create(createApplicationDto);
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

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id', ParseApplicationIdPipe) id: number, @Body() updateApplicationDto: UpdateApplicationDto) {
    return this.applicationsService.update(id, updateApplicationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateStatus(@Param('id', ParseApplicationIdPipe) id: number, @Body('status') status: string) {
    return this.applicationsService.updateStatus(id, status as any);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseApplicationIdPipe) id: number) {
    return this.applicationsService.remove(id);
  }
}
