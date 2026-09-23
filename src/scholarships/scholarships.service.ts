import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateScholarshipDto } from './dto/create-scholarship.dto.js';
import { UpdateScholarshipDto } from './dto/update-scholarship.dto.js';

type Scholarship = {
    id: number;
    name: string;
    description: string;
    amount: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
};
@Injectable()
export class ScholarshipsService {
    private readonly scholarships: Scholarship[] = [
    {
        id: 1,
        name: 'Beca Socioeconómica',
        description: 'Apoyo económico para estudiantes.',
        amount: 500,
        startDate: '2026-10-01',
        endDate: '2026-12-31',
        isActive: true,
    },
    ];
    findAll() {
    return this.scholarships;
    }
    findOne(id: number) {
    const scholarship = this.scholarships.find(
        (scholarship) => scholarship.id === id,
    );
    if (!scholarship) {
        throw new NotFoundException('Beca no encontrada');
    }
    return scholarship;
    }
    create(createScholarshipDto: CreateScholarshipDto) {
    const newScholarship: Scholarship = {
        id: this.scholarships.length + 1,
        ...createScholarshipDto,
    };
    this.scholarships.push(newScholarship);
    return newScholarship;
    }
    update(id: number, updateScholarshipDto: UpdateScholarshipDto) {
    const scholarship = this.findOne(id);
    Object.assign(scholarship, updateScholarshipDto);
    return scholarship;
    }
    remove(id: number) {
    const index = this.scholarships.findIndex(
        (scholarship) => scholarship.id === id,
    );
    if (index === -1) {
        throw new NotFoundException('Beca no encontrada');
    }
    const deletedScholarship = this.scholarships.splice(index, 1);
    return deletedScholarship[0];
    }
}