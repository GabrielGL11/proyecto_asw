import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/students.entity.js';
import { CreateStudentDto } from './dto/create-student.dto.js';
import { UpdateStudentDto } from './dto/update-student.dto.js';
import { StudentsQueryDto } from './dto/students-query.dto.js';

@Injectable()
export class StudentsService {
    constructor(
        @InjectRepository(Student)
        private readonly studentsRepository: Repository<Student>,
    ) {}
    async create(dto: CreateStudentDto) {
        const student = this.studentsRepository.create(dto);
        return this.studentsRepository.save(student);
    }
    async findAll(query: StudentsQueryDto) {
        const {
        search,
        career,
        semester,
        isActive,
        page = 1,
        limit = 10,
        sortBy = 'id',
        order = 'ASC',
        } = query;
        const allowedSortFields = [
        'id',
        'firstName',
        'lastName',
        'age',
        'semester',
        'career',
        ];
        const safeSortBy = allowedSortFields.includes(sortBy)
        ? sortBy
        : 'id';
        const qb = this.studentsRepository.createQueryBuilder('student');
        if (search?.trim()) {
        qb.andWhere(
            `(
            student.firstName ILIKE :search
            OR student.lastName ILIKE :search
            OR student.email ILIKE :search
            OR student.nationalId ILIKE :search
            )`,
            { search: `%${search.trim()}%` },
        );
        }
        if (career?.trim()) {
        qb.andWhere('student.career ILIKE :career', {
            career: `%${career.trim()}%`,
        });
        }
        if (semester !== undefined) {
        qb.andWhere('student.semester = :semester', { semester });
        }
        if (isActive !== undefined) {
        qb.andWhere('student.isActive = :isActive', { isActive });
        }
        qb.orderBy(`student.${safeSortBy}`, order);
        qb.addOrderBy('student.id', 'ASC');
        qb.skip((page - 1) * limit);
        qb.take(limit);
        const [items, total] = await qb.getManyAndCount();
        return {
        items,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
        };
    }
    async findOne(id: number) {
        const student = await this.studentsRepository.findOne({
        where: { id },
        });
        if (!student) {
        throw new NotFoundException(
            `No se encontró el estudiante con ID ${id}`,
        );
        }
        return student;
    }
    async update(id: number, dto: UpdateStudentDto) {
        const student = await this.findOne(id);
        Object.assign(student, dto);
        return this.studentsRepository.save(student);
    }
    async remove(id: number) {
        const student = await this.findOne(id);
        await this.studentsRepository.remove(student);
        return {
        message: 'Estudiante eliminado correctamente',
        };
    }
}
