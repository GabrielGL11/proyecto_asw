import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScholarshipsController } from './scholarships.controller.js';
import { ScholarshipsService } from './scholarships.service.js';
import { Scholarship } from './entities/scholarship.entity.js';
@Module({
  imports: [TypeOrmModule.forFeature([Scholarship])],
  controllers: [ScholarshipsController],
  providers: [ScholarshipsService],
})
export class ScholarshipsModule {}