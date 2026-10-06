import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationsService } from './applications.service.js';
import { ApplicationsController } from './applications.controller.js';
import { Application } from './entities/application.entity.js';
import { Student } from '../students/entities/students.entity.js';
import { Scholarship } from '../scholarships/entities/scholarship.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Application,
      Student,
      Scholarship,
    ]),
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
})
export class ApplicationsModule {}