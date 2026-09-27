import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackingController } from './tracking.controller.js';
import { TrackingService } from './tracking.service.js';
import { Tracking } from './entities/tracking.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Tracking])],
  controllers: [TrackingController],
  providers: [TrackingService],
})
export class TrackingModule {}