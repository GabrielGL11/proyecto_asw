import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTrackingDto } from './dto/create-tracking.dto.js';
import { UpdateTrackingDto } from './dto/update-tracking.dto.js';
import { Tracking } from './entities/tracking.entity.js';

@Injectable()
export class TrackingService {
    constructor(
        @InjectRepository(Tracking)
        private readonly trackingRepository: Repository<Tracking>,
    ) {}

    findAll() {
        return this.trackingRepository.find();
    }

    async findOne(id: number) {
        const tracking = await this.trackingRepository.findOneBy({ id });
        if (!tracking) {
            throw new NotFoundException('Registro de seguimiento no encontrado');
        }
        return tracking;
    }

    findByApplication(applicationId: number) {
        return this.trackingRepository.findBy({ applicationId });
    }

    async create(createTrackingDto: CreateTrackingDto) {
        const tracking = this.trackingRepository.create({
            ...createTrackingDto,
            createdAt: new Date().toISOString(),
        });
        return this.trackingRepository.save(tracking);
    }

    async update(id: number, updateTrackingDto: UpdateTrackingDto) {
        const tracking = await this.findOne(id);
        Object.assign(tracking, updateTrackingDto);
        return this.trackingRepository.save(tracking);
    }

    async remove(id: number) {
        const tracking = await this.findOne(id);
        await this.trackingRepository.remove(tracking);
        return tracking;
    }
}