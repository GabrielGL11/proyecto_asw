
import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

import { ApplicationsService } from './applications.service.js';
import { Application } from './entities/application.entity.js';
import { Student } from '../students/entities/students.entity.js';
import { Scholarship } from '../scholarships/entities/scholarship.entity.js';

describe('ApplicationsService', () => {
  let service: ApplicationsService;

  let applicationsRepository: {
    create: ReturnType<typeof jest.fn>;
    save: ReturnType<typeof jest.fn>;
    findOne: ReturnType<typeof jest.fn>;
    find: ReturnType<typeof jest.fn>;
    remove: ReturnType<typeof jest.fn>;
    createQueryBuilder: ReturnType<typeof jest.fn>;
  };

  let studentsRepository: {
    findOne: ReturnType<typeof jest.fn>;
  };

  let scholarshipsRepository: {
    findOne: ReturnType<typeof jest.fn>;
  };

  let queryBuilderMock: {
    leftJoinAndSelect: ReturnType<typeof jest.fn>;
    andWhere: ReturnType<typeof jest.fn>;
    orderBy: ReturnType<typeof jest.fn>;
    addOrderBy: ReturnType<typeof jest.fn>;
    skip: ReturnType<typeof jest.fn>;
    take: ReturnType<typeof jest.fn>;
    getManyAndCount: ReturnType<typeof jest.fn>;
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
    name: 'Beca Excelencia AcadÃ©mica',
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
    jest.clearAllMocks();

    queryBuilderMock = {
      leftJoinAndSelect: jest.fn(),
      andWhere: jest.fn(),
      orderBy: jest.fn(),
      addOrderBy: jest.fn(),
      skip: jest.fn(),
      take: jest.fn(),
      getManyAndCount: jest.fn(),
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
      create: jest.fn((data) => data),
      save: jest.fn((data) => Promise.resolve(data)),
      findOne: jest.fn(),
      find: jest.fn(),
      remove: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilderMock),
    };

    studentsRepository = {
      findOne: jest.fn(),
    };

    scholarshipsRepository = {
      findOne: jest.fn(),
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

  it('should store the authenticated user as the owner of the application', async () => {
    studentsRepository.findOne.mockResolvedValue(studentMock);
    scholarshipsRepository.findOne.mockResolvedValue(scholarshipMock);
    applicationsRepository.findOne.mockResolvedValue(null);

    await service.create(
      { studentId: 1, scholarshipId: 2, gpa: 8.7, income: 1400 },
      7,
    );

    expect(applicationsRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ createdByUserId: 7, status: 'pendiente' }),
    );
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
