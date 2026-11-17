import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from '../entities/application.entity.js';
import type { ApplicationRepository } from '../domain/application.repository.js';

/** Adaptador: traduce el contrato del puerto a TypeORM. */
@Injectable()
export class TypeOrmApplicationRepository implements ApplicationRepository {
  constructor(
    @InjectRepository(Application)
    private readonly repository: Repository<Application>,
  ) {}

  findById(id: number) {
    return this.repository.findOne({
      where: { id },
      relations: {
        student: true,
        scholarship: true,
        documents: true,
        trackings: true,
      },
    });
  }

  save(application: Application) {
    return this.repository.save(application);
  }
}
