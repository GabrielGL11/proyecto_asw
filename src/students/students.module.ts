import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsController } from './students.controller.js';
import { StudentsService } from './students.service.js';
import { Student } from './entities/students.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Student])],
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule {}