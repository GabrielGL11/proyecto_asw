import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ApplicationsService } from './applications.service.js';

describe('ApplicationsService', () => {
  let service: ApplicationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplicationsService],
    }).compile();

    service = module.get<ApplicationsService>(ApplicationsService);
  });

  it('should create an application with default status and allow filtering by student', () => {
    const application = service.create({
      studentId: 1,
      scholarshipId: 2,
      gpa: 8.7,
      income: 1400,
      comment: 'Necesita revisión inicial',
    });

    expect(application.status).toBe('pendiente');
    expect(service.findByStudent(1)).toHaveLength(1);
    expect(service.findByStudent(1)[0].id).toBe(application.id);
  });

  it('should update status and throw when the application is not found', () => {
    const application = service.create({
      studentId: 1,
      scholarshipId: 2,
      gpa: 8.5,
      income: 1200,
    });

    expect(service.updateStatus(application.id, 'revision')).toMatchObject({
      status: 'revision',
      id: application.id,
    });

    expect(() => service.findOne(999)).toThrow(NotFoundException);
  });
});
