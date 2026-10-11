import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module.js';
import { TrackingService } from './tracking.service.js';
import { TrackingController } from './tracking.controller.js';
import { Tracking } from './entities/tracking.entity.js';
import { Application } from '../applications/entities/application.entity.js';

@Module({
    imports: [
        TypeOrmModule.forFeature([Tracking, Application]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        AuthModule,
    ],
    controllers: [TrackingController],
    providers: [TrackingService],
})
export class TrackingModule {}