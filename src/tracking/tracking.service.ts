import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackingDto } from './dto/create-tracking.dto.js';
import { UpdateTrackingDto } from './dto/update-tracking.dto.js';

type Tracking = {
    id: number;
    applicationId: number;
    status: string;
    comment?: string;
    createdAt: string;
};

@Injectable()
export class TrackingService {
    private readonly trackings: Tracking[] = [
        {
            id: 1,
            applicationId: 1,
            status: 'pendiente',
            comment: 'Solicitud registrada.',
            createdAt: new Date().toISOString(),
        },
    ];

    findAll() {
        return this.trackings;
    }

    findOne(id: number) {
        const tracking = this.trackings.find((tracking) => tracking.id === id);
        if (!tracking) {
            throw new NotFoundException('Registro de seguimiento no encontrado');
        }
        return tracking;
    }

    findByApplication(applicationId: number) {
        return this.trackings.filter(
            (tracking) => tracking.applicationId === applicationId,
        );
    }

    create(createTrackingDto: CreateTrackingDto) {
        const newTracking: Tracking = {
            id: this.trackings.length + 1,
            createdAt: new Date().toISOString(),
            ...createTrackingDto,
        };
        this.trackings.push(newTracking);
        return newTracking;
    }

    update(id: number, updateTrackingDto: UpdateTrackingDto) {
        const tracking = this.findOne(id);
        Object.assign(tracking, updateTrackingDto);
        return tracking;
    }

    remove(id: number) {
        const index = this.trackings.findIndex((tracking) => tracking.id === id);
        if (index === -1) {
            throw new NotFoundException('Registro de seguimiento no encontrado');
        }
        const deleted = this.trackings.splice(index, 1);
        return deleted[0];
    }
}