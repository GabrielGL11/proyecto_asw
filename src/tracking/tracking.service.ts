import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tracking } from './entities/tracking.entity.js';
import { Application } from '../applications/entities/application.entity.js';
import { CreateTrackingDto } from './dto/create-tracking.dto.js';
import { UpdateTrackingDto } from './dto/update-tracking.dto.js';
import { TrackingQueryDto } from './dto/tracking-query.dto.js';

@Injectable()
    export class TrackingService {
    constructor(
        @InjectRepository(Tracking)
        private readonly trackingRepository: Repository<Tracking>,
        @InjectRepository(Application)
        private readonly applicationsRepository: Repository<Application>,
    ) {}
    async create(dto: CreateTrackingDto) {
        const application = await this.applicationsRepository.findOne({
        where: { id: dto.applicationId },
        });
        if (!application) {
        throw new NotFoundException('La solicitud no existe');
        }
        const tracking = this.trackingRepository.create({
        ...dto,
        application,
        createdAt: new Date().toISOString(),
        });
        return this.trackingRepository.save(tracking);
    }
    async findAll(query: TrackingQueryDto) {
        const {
        search,
        applicationId,
        status,
        page = 1,
        limit = 10,
        sortBy = 'id',
        order = 'ASC',
        } = query;
        const allowedSortFields = [
        'id',
        'status',
        'createdAt',
        'applicationId',
        ] as const;
        const safeSortBy = allowedSortFields.includes(
        sortBy as (typeof allowedSortFields)[number],
        )
        ? sortBy
        : 'id';
        const safeOrder = order === 'DESC' ? 'DESC' : 'ASC';
        const safePage = Math.max(1, Number(page) || 1);
        const safeLimit = Math.min(50, Math.max(1, Number(limit) || 10));
        const qb = this.trackingRepository.createQueryBuilder('tracking');
        if (search?.trim()) {
        qb.andWhere(
            `(
            tracking.status ILIKE :search
            OR tracking.comment ILIKE :search
            OR CAST(tracking.id AS TEXT) ILIKE :search
            )`,
            { search: `%${search.trim()}%` },
        );
        }
        if (applicationId !== undefined) {
        qb.andWhere('tracking.applicationId = :applicationId', {
            applicationId,
        });
        }
        if (status) {
        qb.andWhere('tracking.status = :status', { status });
        }
        qb.orderBy(`tracking.${safeSortBy}`, safeOrder);
        qb.addOrderBy('tracking.id', 'ASC');
        qb.skip((safePage - 1) * safeLimit);
        qb.take(safeLimit);
        const [items, total] = await qb.getManyAndCount();
        return {
        items,
        meta: {
            total,
            page: safePage,
            limit: safeLimit,
            totalPages: Math.ceil(total / safeLimit),
        },
        };
    }
    async findOne(id: number) {
        const tracking = await this.trackingRepository.findOne({
        where: { id },
        });
        if (!tracking) {
        throw new NotFoundException(
            `No se encontró el seguimiento con ID ${id}`,
        );
        }
        return tracking;
    }
    async findByApplication(applicationId: number) {
        return this.trackingRepository.find({
        where: { applicationId },
        order: { createdAt: 'DESC' },
        });
    }
    async update(id: number, dto: UpdateTrackingDto) {
        const tracking = await this.findOne(id);
        if (dto.applicationId !== undefined) {
        const application = await this.applicationsRepository.findOne({
            where: { id: dto.applicationId },
        });
        if (!application) {
            throw new NotFoundException('La solicitud no existe');
        }
        tracking.application = application;
        tracking.applicationId = application.id;
        }
        Object.assign(tracking, dto);
        return this.trackingRepository.save(tracking);
    }
    async remove(id: number) {
        const tracking = await this.findOne(id);
        await this.trackingRepository.remove(tracking);
        return {
        message: 'Seguimiento eliminado correctamente',
        };
    }
}