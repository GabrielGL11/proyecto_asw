import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateScholarshipDto } from './dto/create-scholarship.dto.js';
import { UpdateScholarshipDto } from './dto/update-scholarship.dto.js';
import { ScholarshipsQueryDto } from './dto/scholarships-query.dto.js';
import { Scholarship } from './entities/scholarship.entity.js';

@Injectable()
    export class ScholarshipsService {
    constructor(
        @InjectRepository(Scholarship)
        private readonly scholarshipsRepository: Repository<Scholarship>,
    ) {}
    async findAll(query: ScholarshipsQueryDto) {
        const {
        search,
        isActive,
        page = 1,
        limit = 10,
        sortBy = 'id',
        order = 'ASC',
        } = query;
        const allowedSortFields = [
        'id',
        'name',
        'amount',
        'startDate',
        'endDate',
        ] as const;
        const safeSortBy = allowedSortFields.includes(
        sortBy as (typeof allowedSortFields)[number],
        )
        ? sortBy
        : 'id';
        const qb = this.scholarshipsRepository
        .createQueryBuilder('scholarship');
        if (search?.trim()) {
        qb.andWhere('scholarship.name ILIKE :search', {
            search: `%${search.trim()}%`,
        });
        }
        if (isActive !== undefined) {
        qb.andWhere('scholarship.isActive = :isActive', {
            isActive,
        });
        }
        qb.orderBy(`scholarship.${safeSortBy}`, order)
        .addOrderBy('scholarship.id', 'ASC')
        .skip((page - 1) * limit)
        .take(limit);
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