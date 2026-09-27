import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto.js';
import { UpdateStudentDto } from './dto/update-student.dto.js';
import { Student } from './entities/students.entity.js';

@Injectable()
export class StudentsService {
    constructor(
        @InjectRepository(Student)
        private readonly studentsRepository: Repository<Student>,
    ) {}

    findAll() {
        return this.studentsRepository.find();
    }

    async findOne(id: number) {
        const student = await this.studentsRepository.findOneBy({ id });
        if (!student) {
            throw new NotFoundException('Estudiante no encontrado');
        }
        return student;
    }

    async create(createStudentDto: CreateStudentDto) {
        const student = this.studentsRepository.create(createStudentDto);
        return this.studentsRepository.save(student);
    }

    async update(id: number, updateStudentDto: UpdateStudentDto) {
        const student = await this.findOne(id);
        Object.assign(student, updateStudentDto);
        return this.studentsRepository.save(student);
    }

    async remove(id: number) {
        const student = await this.findOne(id);
        await this.studentsRepository.remove(student);
        return student;
    }
}