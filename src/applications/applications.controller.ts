import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApplicationsService } from './applications.service.js';
import { CreateApplicationDto } from './dto/create-application.dto.js';
import { UpdateApplicationDto } from './dto/update-application.dto.js';
import { ApplicationsQueryDto } from './dto/applications-query.dto.js';

@Controller('applications')
  export class ApplicationsController {
    constructor(
      private readonly applicationsService: ApplicationsService,
    ) {}
    @Post()
    create(@Body() dto: CreateApplicationDto) {
      return this.applicationsService.create(dto);
    }
    @Get()
    findAll(@Query() query: ApplicationsQueryDto) {
      return this.applicationsService.findAll(query);
    }
    @Get('student/:studentId')
    findByStudent(
      @Param('studentId', ParseIntPipe) studentId: number,
    ) {
      return this.applicationsService.findByStudent(studentId);
    }
    @Get('scholarship/:scholarshipId')
    findByScholarship(
      @Param('scholarshipId', ParseIntPipe) scholarshipId: number,
    ) {
      return this.applicationsService.findByScholarship(scholarshipId);
    }
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
      return this.applicationsService.findOne(id);
    }
    @Patch(':id')
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() dto: UpdateApplicationDto,
    ) {
      return this.applicationsService.update(id, dto);
    }
    @Patch(':id/status')
    updateStatus(
      @Param('id', ParseIntPipe) id: number,
      @Body() body: { status: string },
    ) {
      return this.applicationsService.updateStatus(id, body.status);
    }
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.applicationsService.remove(id);
    }
}
