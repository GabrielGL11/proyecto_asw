import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { StudentsService } from './students.service.js';
import { CreateStudentDto } from './dto/create-student.dto.js';
import { UpdateStudentDto } from './dto/update-student.dto.js';
import { ParseStudentIdPipe } from './pipes/parse-student-id.pipe.js';

@Controller('students')
export class StudentsController {
    constructor(
    private readonly studentsService: StudentsService,
    ) {}
    @Get()
    findAll() {
    return this.studentsService.findAll();
    }
    @Get(':id')
    findOne(@Param('id', ParseStudentIdPipe) id: number) {
    return this.studentsService.findOne(id);
    }
    @Post()
    create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
    }
    @Patch(':id')
    update(
    @Param('id', ParseStudentIdPipe) id: number,
    @Body() updateStudentDto: UpdateStudentDto,
    ) {
    return this.studentsService.update(id, updateStudentDto);
    }
    @Delete(':id')
    remove(@Param('id', ParseStudentIdPipe) id: number) {
    return this.studentsService.remove(id);
    }
}