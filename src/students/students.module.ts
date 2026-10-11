import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module.js';
import { StudentsController } from './students.controller.js';
import { StudentsService } from './students.service.js';
import { Student } from './entities/students.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule {}