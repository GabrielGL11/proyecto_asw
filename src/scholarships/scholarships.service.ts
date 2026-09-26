import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateScholarshipDto } from './dto/create-scholarship.dto.js';
import { UpdateScholarshipDto } from './dto/update-scholarship.dto.js';
import { Scholarship } from './entities/scholarship.entity.js';
@Injectable()
export class ScholarshipsService {
    constructor(
        @InjectRepository(Scholarship)
        private readonly scholarshipsRepository: Repository<Scholarship>,
    ) {}
    findAll() {
        return this.scholarshipsRepository.find();
    }
    async findOne(id: number) {
        const scholarship = await this.scholarshipsRepository.findOneBy({
        id,
        });
        if (!scholarship) {
        throw new NotFoundException('Beca no encontrada');
        }
        return scholarship;
    }
    async create(createScholarshipDto: CreateScholarshipDto) {
        const scholarship = this.scholarshipsRepository.create(
        createScholarshipDto,
        );
        return this.scholarshipsRepository.save(scholarship);
    }
    async update(
        id: number,
        updateScholarshipDto: UpdateScholarshipDto,
    ) {
        const scholarship = await this.findOne(id);
        Object.assign(scholarship, updateScholarshipDto);
        return this.scholarshipsRepository.save(scholarship);
    }
    async remove(id: number) {
        const scholarship = await this.findOne(id);
        await this.scholarshipsRepository.remove(scholarship);
        return scholarship;
    }
}