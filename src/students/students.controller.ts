import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { StudentsService } from './students.service.js';
import { CreateStudentDto } from './dto/create-student.dto.js';
import { UpdateStudentDto } from './dto/update-student.dto.js';
import { StudentsQueryDto } from './dto/students-query.dto.js';

@Controller('students')
export class StudentsController {
    constructor(
        private readonly studentsService: StudentsService,
    ) {}
    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() dto: CreateStudentDto) {
        return this.studentsService.create(dto);
    }
    @Get()
    findAll(@Query() query: StudentsQueryDto) {
        return this.studentsService.findAll(query);
    }
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.studentsService.findOne(id);
    }
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateStudentDto,
    ) {
        return this.studentsService.update(id, dto);
    }
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.studentsService.remove(id);
    }
}