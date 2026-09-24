import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto.js';
import { UpdateStudentDto } from './dto/update-student.dto.js';

type Student = {
    id: number;
    firstName: string;
    lastName: string;
    nationalId: string;
    email: string;
    age: number;
    career: string;
    semester: number;
    isActive: boolean;
};

@Injectable()
export class StudentsService {
    private readonly students: Student[] = [
    {
        id: 1,
        firstName: 'Steven',
        lastName: 'Guaman',
        nationalId: '1300000031',
        email: 'steven@uleam.edu.ec',
        age: 23,
        career: 'Economía',
        semester: 6,
        isActive: true,
    },
    ];
    findAll() {
    return this.students;
    }
    findOne(id: number) {
    const student = this.students.find(
        (student) => student.id === id,
    );
    if (!student) {
        throw new NotFoundException('Estudiante no encontrado');
    }
    return student;
    }
    create(createStudentDto: CreateStudentDto) {
    const newStudent: Student = {
        id: this.students.length + 1,
        ...createStudentDto,
    };
    this.students.push(newStudent);
    return newStudent;
    }
    update(id: number, updateStudentDto: UpdateStudentDto) {
    const student = this.findOne(id);
    Object.assign(student, updateStudentDto);
    return student;
    }
    remove(id: number) {
    const index = this.students.findIndex(
        (student) => student.id === id,
    );
    if (index === -1) {
        throw new NotFoundException('Estudiante no encontrado');
    }
    const deletedStudent = this.students.splice(index, 1);
    return deletedStudent[0];
    }
}