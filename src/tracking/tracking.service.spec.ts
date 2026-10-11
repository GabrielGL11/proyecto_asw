
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { TrackingService } from './tracking.service.js';
import { Tracking } from './entities/tracking.entity.js';
import { Application } from '../applications/entities/application.entity.js';

describe('TrackingService', () => {
  let service: TrackingService;

  const applicationMock = { id: 10 };

  const trackingMock = {
    id: 1,
    applicationId: 10,
    application: applicationMock,
    status: 'revision',
    comment: 'Solicitud en revisión',
    createdAt: '2026-10-11T12:00:00.000Z',
  };

  const queryBuilderMock = {
    andWhere: vi.fn(),
    orderBy: vi.fn(),
    addOrderBy: vi.fn(),
    skip: vi.fn(),
    take: vi.fn(),
    getManyAndCount: vi.fn(),
  };

  const trackingRepository = {
    create: vi.fn(),
    save: vi.fn(),
    find: vi.fn(),
    findOne: vi.fn(),
    remove: vi.fn(),
    createQueryBuilder: vi.fn(),
  };

  const applicationsRepository = {
    findOne: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    queryBuilderMock.andWhere.mockReturnValue(queryBuilderMock);
    queryBuilderMock.orderBy.mockReturnValue(queryBuilderMock);
    queryBuilderMock.addOrderBy.mockReturnValue(queryBuilderMock);
    queryBuilderMock.skip.mockReturnValue(queryBuilderMock);
    queryBuilderMock.take.mockReturnValue(queryBuilderMock);
    queryBuilderMock.getManyAndCount.mockResolvedValue([
      [trackingMock],
      1,
    ]);

    trackingRepository.create.mockImplementation((data) => data);
    trackingRepository.save.mockImplementation((data) =>
      Promise.resolve(data),
    );
    trackingRepository.createQueryBuilder.mockReturnValue(queryBuilderMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrackingService,
        {
          provide: getRepositoryToken(Tracking),
          useValue: trackingRepository,
        },
        {
          provide: getRepositoryToken(Application),
          useValue: applicationsRepository,
        },
      ],
    }).compile();

    service = module.get<TrackingService>(TrackingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a tracking record with a creation date', async () => {
    applicationsRepository.findOne.mockResolvedValue(applicationMock);

    const dto = {
      applicationId: 10,
      status: 'revision',
      comment: 'Solicitud en revisión',
    };

    const result = await service.create(dto);

    expect(trackingRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        ...dto,
        application: applicationMock,
        createdAt: expect.any(String),
      }),
    );
    expect(Number.isNaN(Date.parse(result.createdAt))).toBe(false);
    expect(trackingRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should throw NotFoundException when creating for a nonexistent application', async () => {
    applicationsRepository.findOne.mockResolvedValue(null);

    await expect(
      service.create({
        applicationId: 999,
        status: 'revision',
        comment: 'Prueba',
      }),
    ).rejects.toThrow(NotFoundException);

    expect(trackingRepository.save).not.toHaveBeenCalled();
  });

  it('should return a tracking record by ID', async () => {
    trackingRepository.findOne.mockResolvedValue(trackingMock);

    const result = await service.findOne(1);

    expect(result).toEqual(trackingMock);
    expect(trackingRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should throw NotFoundException when the tracking record does not exist', async () => {
    trackingRepository.findOne.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should return tracking records for an application ordered by date', async () => {
    trackingRepository.find.mockResolvedValue([trackingMock]);

    const result = await service.findByApplication(10);

    expect(result).toEqual([trackingMock]);
    expect(trackingRepository.find).toHaveBeenCalledWith({
      where: { applicationId: 10 },
      order: { createdAt: 'DESC' },
    });
  });

  it('should update a tracking record', async () => {
    trackingRepository.findOne.mockResolvedValue({ ...trackingMock });

    const result = await service.update(1, {
      comment: 'Se revisaron los documentos',
    });

    expect(result.comment).toBe('Se revisaron los documentos');
    expect(trackingRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should update the application associated with a tracking record', async () => {
    const anotherApplication = { id: 20 };

    trackingRepository.findOne.mockResolvedValue({ ...trackingMock });
    applicationsRepository.findOne.mockResolvedValue(anotherApplication);

    const result = await service.update(1, {
      applicationId: 20,
    });

    expect(result.applicationId).toBe(20);
    expect(result.application).toEqual(anotherApplication);
    expect(trackingRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should throw NotFoundException when assigning a nonexistent application', async () => {
    trackingRepository.findOne.mockResolvedValue({ ...trackingMock });
    applicationsRepository.findOne.mockResolvedValue(null);

    await expect(
      service.update(1, { applicationId: 999 }),
    ).rejects.toThrow(NotFoundException);

    expect(trackingRepository.save).not.toHaveBeenCalled();
  });

  it('should remove a tracking record', async () => {
    trackingRepository.findOne.mockResolvedValue({ ...trackingMock });

    const result = await service.remove(1);

    expect(trackingRepository.remove).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      message: 'Seguimiento eliminado correctamente',
    });
  });

  it('should return paginated tracking records with metadata', async () => {
    const result = await service.findAll({
      page: 1,
      limit: 10,
      sortBy: 'id',
      order: 'ASC',
    });

    expect(result).toEqual({
      items: [trackingMock],
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

  it('should apply search, application and status filters', async () => {
    await service.findAll({
      search: 'revisión',
      applicationId: 10,
      status: 'revision',
      page: 2,
      limit: 5,
      sortBy: 'status',
      order: 'DESC',
    });

    expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
      expect.stringContaining('tracking.status ILIKE :search'),
      { search: '%revisión%' },
    );
    expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
      'tracking.applicationId = :applicationId',
      { applicationId: 10 },
    );
    expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
      'tracking.status = :status',
      { status: 'revision' },
    );

    expect(queryBuilderMock.orderBy).toHaveBeenCalledWith(
      'tracking.status',
      'DESC',
    );
    expect(queryBuilderMock.skip).toHaveBeenCalledWith(5);
    expect(queryBuilderMock.take).toHaveBeenCalledWith(5);
  });

  it('should enforce pagination limits', async () => {
    await service.findAll({
      page: 0,
      limit: 100,
      sortBy: 'id',
      order: 'ASC',
    });

    expect(queryBuilderMock.skip).toHaveBeenCalledWith(0);
    expect(queryBuilderMock.take).toHaveBeenCalledWith(50);
  });
});