
import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { DocumentsService } from './documents.service.js';
import { Document } from './entities/document.entity.js';
import { Application } from '../applications/entities/application.entity.js';

describe('DocumentsService', () => {
  let service: DocumentsService;

  const applicationMock = { id: 10 };

  const documentMock = {
    id: 1,
    applicationId: 10,
    application: applicationMock,
    name: 'Certificado de matrícula',
    url: 'https://example.com/acta.pdf',
    status: 'pendiente',
  };

  const queryBuilderMock = {
    leftJoinAndSelect: vi.fn(),
    andWhere: vi.fn(),
    orderBy: vi.fn(),
    addOrderBy: vi.fn(),
    skip: vi.fn(),
    take: vi.fn(),
    getManyAndCount: vi.fn(),
  };

  const documentsRepository = {
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

    queryBuilderMock.leftJoinAndSelect.mockReturnValue(queryBuilderMock);
    queryBuilderMock.andWhere.mockReturnValue(queryBuilderMock);
    queryBuilderMock.orderBy.mockReturnValue(queryBuilderMock);
    queryBuilderMock.addOrderBy.mockReturnValue(queryBuilderMock);
    queryBuilderMock.skip.mockReturnValue(queryBuilderMock);
    queryBuilderMock.take.mockReturnValue(queryBuilderMock);
    queryBuilderMock.getManyAndCount.mockResolvedValue([
      [documentMock],
      1,
    ]);

    documentsRepository.create.mockImplementation((data) => data);
    documentsRepository.save.mockImplementation((data) =>
      Promise.resolve(data),
    );
    documentsRepository.createQueryBuilder.mockReturnValue(queryBuilderMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        {
          provide: getRepositoryToken(Document),
          useValue: documentsRepository,
        },
        {
          provide: getRepositoryToken(Application),
          useValue: applicationsRepository,
        },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a document with default pending status', async () => {
    applicationsRepository.findOne.mockResolvedValue(applicationMock);

    const dto = {
      applicationId: 10,
      name: 'Acta de matrícula',
      url: 'https://example.com/acta.pdf',
    };

    const result = await service.create(dto);

    expect(documentsRepository.create).toHaveBeenCalledWith({
      ...dto,
      application: applicationMock,
      status: 'pendiente',
    });
    expect(documentsRepository.save).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({
      ...dto,
      application: applicationMock,
      status: 'pendiente',
    });
  });

  it('should throw NotFoundException when creating for a nonexistent application', async () => {
    applicationsRepository.findOne.mockResolvedValue(null);

    await expect(
      service.create({
        applicationId: 999,
        name: 'Certificado',
        url: 'https://example.com/certificado.pdf',
      }),
    ).rejects.toThrow(NotFoundException);

    expect(documentsRepository.save).not.toHaveBeenCalled();
  });

  it('should return a document by ID', async () => {
    documentsRepository.findOne.mockResolvedValue(documentMock);

    const result = await service.findOne(1);

    expect(result).toEqual(documentMock);
    expect(documentsRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: { application: true },
    });
  });

  it('should throw NotFoundException when the document does not exist', async () => {
    documentsRepository.findOne.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should filter documents by application', async () => {
    documentsRepository.find.mockResolvedValue([documentMock]);

    const result = await service.findByApplication(10);

    expect(result).toEqual([documentMock]);
    expect(documentsRepository.find).toHaveBeenCalledWith({
      where: { applicationId: 10 },
      relations: { application: true },
    });
  });

  it('should update a document', async () => {
    documentsRepository.findOne.mockResolvedValue({ ...documentMock });

    const result = await service.update(1, {
      name: 'Certificado actualizado',
    });

    expect(result.name).toBe('Certificado actualizado');
    expect(documentsRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should update the application associated with a document', async () => {
    const anotherApplication = { id: 20 };
    documentsRepository.findOne.mockResolvedValue({ ...documentMock });
    applicationsRepository.findOne.mockResolvedValue(anotherApplication);

    const result = await service.update(1, {
      applicationId: 20,
    });

    expect(result.applicationId).toBe(20);
    expect(result.application).toEqual(anotherApplication);
    expect(documentsRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should throw NotFoundException when assigning a nonexistent application', async () => {
    documentsRepository.findOne.mockResolvedValue({ ...documentMock });
    applicationsRepository.findOne.mockResolvedValue(null);

    await expect(
      service.update(1, { applicationId: 999 }),
    ).rejects.toThrow(NotFoundException);

    expect(documentsRepository.save).not.toHaveBeenCalled();
  });

  it('should update the document status', async () => {
    documentsRepository.findOne.mockResolvedValue({ ...documentMock });

    const result = await service.updateStatus(1, 'observado');

    expect(result.status).toBe('observado');
    expect(result.name).toBe('Certificado de matrícula');
    expect(documentsRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should reject an invalid document status', async () => {
    await expect(
      service.updateStatus(1, 'estado_invalido'),
    ).rejects.toThrow(BadRequestException);

    expect(documentsRepository.findOne).not.toHaveBeenCalled();
    expect(documentsRepository.save).not.toHaveBeenCalled();
  });

  it('should remove a document', async () => {
    documentsRepository.findOne.mockResolvedValue({ ...documentMock });

    const result = await service.remove(1);

    expect(documentsRepository.remove).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      message: 'Documento eliminado correctamente',
    });
  });

  it('should return paginated documents with metadata', async () => {
    const result = await service.findAll({
      page: 1,
      limit: 10,
      sortBy: 'id',
      order: 'ASC',
    });

    expect(result).toEqual({
      items: [documentMock],
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
      search: 'Certificado',
      applicationId: 10,
      status: 'pendiente',
      page: 2,
      limit: 5,
      sortBy: 'name',
      order: 'DESC',
    });

    expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
      expect.stringContaining('document.name ILIKE :search'),
      { search: '%Certificado%' },
    );
    expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
      'document.applicationId = :applicationId',
      { applicationId: 10 },
    );
    expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
      'document.status = :status',
      { status: 'pendiente' },
    );
    expect(queryBuilderMock.orderBy).toHaveBeenCalledWith(
      'document.name',
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