import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application, ApplicationStatus } from './entities/application.entity.js';
import { CreateApplicationDto } from './dto/create-application.dto.js';
import { UpdateApplicationDto } from './dto/update-application.dto.js';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationsRepository: Repository<Application>,
  ) {}

  create(createApplicationDto: CreateApplicationDto) {
    const application = this.applicationsRepository.create({
      ...createApplicationDto,
      status: 'pendiente',
    });
    return this.applicationsRepository.save(application);
  }

  findAll() {
    return this.applicationsRepository.find();
  }

  async findOne(id: number) {
    const application = await this.applicationsRepository.findOneBy({ id });

    if (!application) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    return application;
  }

  async update(id: number, updateApplicationDto: UpdateApplicationDto) {
    const application = await this.findOne(id);
    Object.assign(application, updateApplicationDto);
    return this.applicationsRepository.save(application);
  }

  async remove(id: number) {
    const application = await this.findOne(id);
    return this.applicationsRepository.remove(application);
  }

  findByStudent(studentId: number) {
    return this.applicationsRepository.findBy({ studentId });
  }

  findByScholarship(scholarshipId: number) {
    return this.applicationsRepository.findBy({ scholarshipId });
  }

  async updateStatus(id: number, status: ApplicationStatus) {
    const application = await this.findOne(id);
    application.status = status;
    return this.applicationsRepository.save(application);
  }
}