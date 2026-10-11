
import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { ApplicationsService } from './applications.service.js';
import { Application } from './entities/application.entity.js';
import { Student } from '../students/entities/students.entity.js';
import { Scholarship } from '../scholarships/entities/scholarship.entity.js';

describe('ApplicationsService', () => {
  let service: ApplicationsService;

  let applicationsRepository: {
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
    find: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
    createQueryBuilder: ReturnType<typeof vi.fn>;
  };

  let studentsRepository: {
    findOne: ReturnType<typeof vi.fn>;
  };

  let scholarshipsRepository: {
    findOne: ReturnType<typeof vi.fn>;
  };

  let queryBuilderMock: {
    leftJoinAndSelect: ReturnType<typeof vi.fn>;
    andWhere: ReturnType<typeof vi.fn>;
    orderBy: ReturnType<typeof vi.fn>;
    addOrderBy: ReturnType<typeof vi.fn>;
    skip: ReturnType<typeof vi.fn>;
    take: ReturnType<typeof vi.fn>;
    getManyAndCount: ReturnType<typeof vi.fn>;
  };

  const studentMock = {
    id: 1,
    firstName: 'Carlos',
    lastName: 'Mendoza',
    email: 'carlos@example.com',
    isActive: true,
  };

  const scholarshipMock = {
    id: 2,
    name: 'Beca Excelencia Académica',
  };

  const applicationMock = {
    id: 1,
    student: studentMock,
    scholarship: scholarshipMock,
    gpa: 8.7,
    income: 1400,
    comment: 'Solicitud de prueba',
    status: 'pendiente',
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    queryBuilderMock = {
      leftJoinAndSelect: vi.fn(),
      andWhere: vi.fn(),
      orderBy: vi.fn(),
      addOrderBy: vi.fn(),
      skip: vi.fn(),
      take: vi.fn(),
      getManyAndCount: vi.fn(),
    };

    queryBuilderMock.leftJoinAndSelect.mockReturnValue(queryBuilderMock);
    queryBuilderMock.andWhere.mockReturnValue(queryBuilderMock);
    queryBuilderMock.orderBy.mockReturnValue(queryBuilderMock);
    queryBuilderMock.addOrderBy.mockReturnValue(queryBuilderMock);
    queryBuilderMock.skip.mockReturnValue(queryBuilderMock);
    queryBuilderMock.take.mockReturnValue(queryBuilderMock);
    queryBuilderMock.getManyAndCount.mockResolvedValue([
      [applicationMock],
      1,
    ]);

    applicationsRepository = {
      create: vi.fn((data) => data),
      save: vi.fn((data) => Promise.resolve(data)),
      findOne: vi.fn(),
      find: vi.fn(),
      remove: vi.fn(),
      createQueryBuilder: vi.fn().mockReturnValue(queryBuilderMock),
    };

    studentsRepository = {
      findOne: vi.fn(),
    };

    scholarshipsRepository = {
      findOne: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        {
          provide: getRepositoryToken(Application),
          useValue: applicationsRepository,
        },
        {
          provide: getRepositoryToken(Student),
          useValue: studentsRepository,
        },
        {
          provide: getRepositoryToken(Scholarship),
          useValue: scholarshipsRepository,
        },
      ],
    }).compile();

    service = module.get<ApplicationsService>(ApplicationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an application with pending status', async () => {
    studentsRepository.findOne.mockResolvedValue(studentMock);
    scholarshipsRepository.findOne.mockResolvedValue(scholarshipMock);
    applicationsRepository.findOne.mockResolvedValue(null);

    const dto = {
      studentId: 1,
      scholarshipId: 2,
      gpa: 8.7,
      income: 1400,
      comment: 'Necesita revision inicial',
    };

    const result = await service.create(dto);

    expect(applicationsRepository.create).toHaveBeenCalledWith({
      ...dto,
      student: studentMock,
      scholarship: scholarshipMock,
      status: 'pendiente',
    });
    expect(applicationsRepository.save).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({
      ...dto,
      student: studentMock,
      scholarship: scholarshipMock,
      status: 'pendiente',
    });
  });

  it('should throw NotFoundException when the student does not exist', async () => {
    studentsRepository.findOne.mockResolvedValue(null);

    await expect(
      service.create({
        studentId: 999,
        scholarshipId: 2,
        gpa: 8,
        income: 1000,
      }),
    ).rejects.toThrow(NotFoundException);

    expect(applicationsRepository.save).not.toHaveBeenCalled();
  });

  it('should reject an application from an inactive student', async () => {
    studentsRepository.findOne.mockResolvedValue({
      ...studentMock,
      isActive: false,
    });

    await expect(
      service.create({
        studentId: 1,
        scholarshipId: 2,
        gpa: 8,
        income: 1000,
      }),
    ).rejects.toThrow(BadRequestException);

    expect(scholarshipsRepository.findOne).not.toHaveBeenCalled();
    expect(applicationsRepository.save).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when the scholarship does not exist', async () => {
    studentsRepository.findOne.mockResolvedValue(studentMock);
    scholarshipsRepository.findOne.mockResolvedValue(null);

    await expect(
      service.create({
        studentId: 1,
        scholarshipId: 999,
        gpa: 8,
        income: 1000,
      }),
    ).rejects.toThrow(NotFoundException);

    expect(applicationsRepository.save).not.toHaveBeenCalled();
  });

  it('should reject a duplicate application', async () => {
    studentsRepository.findOne.mockResolvedValue(studentMock);
    scholarshipsRepository.findOne.mockResolvedValue(scholarshipMock);
    applicationsRepository.findOne.mockResolvedValue(applicationMock);

    await expect(
      service.create({
        studentId: 1,
        scholarshipId: 2,
        gpa: 8,
        income: 1000,
      }),
    ).rejects.toThrow(ConflictException);

    expect(applicationsRepository.save).not.toHaveBeenCalled();
  });

  it('should return an application by ID with its relations', async () => {
    applicationsRepository.findOne.mockResolvedValue(applicationMock);

    const result = await service.findOne(1);

    expect(result).toEqual(applicationMock);
    expect(applicationsRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: {
        student: true,
        scholarship: true,
        documents: true,
        trackings: true,
      },
    });
  });

  it('should throw NotFoundException when the application does not exist', async () => {
    applicationsRepository.findOne.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should return applications belonging to a student', async () => {
    applicationsRepository.find.mockResolvedValue([applicationMock]);

    const result = await service.findByStudent(1);

    expect(result).toEqual([applicationMock]);
    expect(applicationsRepository.find).toHaveBeenCalledWith({
      where: { student: { id: 1 } },
      relations: {
        student: true,
        scholarship: true,
      },
    });
  });

  it('should return applications belonging to a scholarship', async () => {
    applicationsRepository.find.mockResolvedValue([applicationMock]);

    const result = await service.findByScholarship(2);

    expect(result).toEqual([applicationMock]);
    expect(applicationsRepository.find).toHaveBeenCalledWith({
      where: { scholarship: { id: 2 } },
      relations: {
        student: true,
        scholarship: true,
      },
    });
  });

  it('should update an application', async () => {
    applicationsRepository.findOne.mockResolvedValue({
      ...applicationMock,
    });

    const result = await service.update(1, {
      comment: 'Documentación actualizada',
    });

    expect(result.comment).toBe('Documentación actualizada');
    expect(applicationsRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should throw NotFoundException when updating a nonexistent application', async () => {
    applicationsRepository.findOne.mockResolvedValue(null);

    await expect(
      service.update(999, {
        comment: 'Actualización',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should update the application status', async () => {
    applicationsRepository.findOne.mockResolvedValue({
      ...applicationMock,
    });

    const result = await service.updateStatus(1, 'revision');

    expect(result.status).toBe('revision');
    expect(applicationsRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should reject an invalid application status', async () => {
    await expect(
      service.updateStatus(1, 'estado_invalido'),
    ).rejects.toThrow(BadRequestException);

    expect(applicationsRepository.findOne).not.toHaveBeenCalled();
    expect(applicationsRepository.save).not.toHaveBeenCalled();
  });

  it('should remove an application', async () => {
    const application = { ...applicationMock };
    applicationsRepository.findOne.mockResolvedValue(application);
    applicationsRepository.remove.mockResolvedValue(application);

    const result = await service.remove(1);

    expect(applicationsRepository.remove).toHaveBeenCalledWith(application);
    expect(result).toEqual({
      message: 'Solicitud eliminada correctamente',
    });
  });

  it('should return paginated applications with metadata', async () => {
    const result = await service.findAll({
      page: 1,
      limit: 10,
      sortBy: 'id',
      order: 'ASC',
    });

    expect(result).toEqual({
      items: [applicationMock],
      meta: {
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    });

    expect(queryBuilderMock.skip).toHaveBeenCalledWith(0);
    expect(queryBuilderMock.take).toHaveBeenCalledWith(10);
  });

  it('should apply search, relation and status filters', async () => {
    await service.findAll({
      search: 'Carlos',
      studentId: 1,
      scholarshipId: 2,
      status: 'pendiente',
      activeOnly: true,
      page: 2,
      limit: 5,
      sortBy: 'gpa',
      order: 'DESC',
    });

    expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
      expect.stringContaining('student.firstName ILIKE :search'),
      { search: '%Carlos%' },
    );
    expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
      'student.id = :studentId',
      { studentId: 1 },
    );
    expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
      'scholarship.id = :scholarshipId',
      { scholarshipId: 2 },
    );
    expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
      'application.status = :status',
      { status: 'pendiente' },
    );
    expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
      'student.isActive = :active',
      { active: true },
    );

    expect(queryBuilderMock.orderBy).toHaveBeenCalledWith(
      'application.gpa',
      'DESC',
    );
    expect(queryBuilderMock.skip).toHaveBeenCalledWith(5);
    expect(queryBuilderMock.take).toHaveBeenCalledWith(5);
  });
});
