import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { ApplicationsService } from './applications.service.js';
import { ApplicationsController } from './applications.controller.js';
import { Application } from './entities/application.entity.js';
import { Student } from '../students/entities/students.entity.js';
import { Scholarship } from '../scholarships/entities/scholarship.entity.js';
import { AuthModule } from '../auth/auth.module.js';
import { APPLICATION_REPOSITORY } from './domain/application.repository.js';
import { TypeOrmApplicationRepository } from './infrastructure/typeorm-application.repository.js';
import { UpdateApplicationUseCase } from './use-cases/update-application.use-case.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Application,
      Student,
      Scholarship,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
  ],
  controllers: [ApplicationsController],
  providers: [
    ApplicationsService,
    UpdateApplicationUseCase,
    { provide: APPLICATION_REPOSITORY, useClass: TypeOrmApplicationRepository },
  ],
})
export class ApplicationsModule {}