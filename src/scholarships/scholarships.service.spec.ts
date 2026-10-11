import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ScholarshipsService } from './scholarships.service.js';
import { Scholarship } from './entities/scholarship.entity.js';

describe('ScholarshipsService', () => {
  let service: ScholarshipsService;
  let repository: Repository<Scholarship>;

  const scholarshipMock = {
    id: 1,
    name: 'Beca Excelencia Académica',
    description: 'Apoyo para estudiantes con buen rendimiento',
    amount: 500,
    startDate: new Date('2026-01-01'),
    endDate: new Date('2026-12-31'),
    isActive: true,
  };

  const queryBuilderMock = {
    andWhere: vi.fn(),
    orderBy: vi.fn(),
    addOrderBy: vi.fn(),
    skip: vi.fn(),
    take: vi.fn(),
    getManyAndCount: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    queryBuilderMock.andWhere.mockReturnValue(queryBuilderMock);
    queryBuilderMock.orderBy.mockReturnValue(queryBuilderMock);
    queryBuilderMock.addOrderBy.mockReturnValue(queryBuilderMock);
    queryBuilderMock.skip.mockReturnValue(queryBuilderMock);
    queryBuilderMock.take.mockReturnValue(queryBuilderMock);
    queryBuilderMock.getManyAndCount.mockResolvedValue([
      [scholarshipMock],
      1,
    ]);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScholarshipsService,
        {
          provide: getRepositoryToken(Scholarship),
          useValue: {
            create: vi.fn().mockImplementation((dto) => ({ ...dto })),
            save: vi.fn().mockImplementation((scholarship) =>
              Promise.resolve(scholarship),
            ),
            findOneBy: vi.fn().mockResolvedValue({ ...scholarshipMock }),
            remove: vi.fn().mockResolvedValue(scholarshipMock),
            createQueryBuilder: vi.fn().mockReturnValue(queryBuilderMock),
          },
        },
      ],
    }).compile();

    service = module.get<ScholarshipsService>(ScholarshipsService);
    repository = module.get<Repository<Scholarship>>(
      getRepositoryToken(Scholarship),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a scholarship', async () => {
    const dto = {
      name: 'Beca Excelencia Académica',
      description: 'Apoyo académico',
      amount: 500,
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      isActive: true,
    };

    const result = await service.create(dto);

    expect(repository.create).toHaveBeenCalledWith(dto);
    expect(repository.save).toHaveBeenCalled();
    expect(result).toMatchObject(dto);
  });

  it('should return a scholarship by ID', async () => {
    const result = await service.findOne(1);

    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(result).toMatchObject({ id: 1 });
  });

  it('should throw NotFoundException when the scholarship does not exist', async () => {
    vi.mocked(repository.findOneBy).mockResolvedValueOnce(null);

    await expect(service.findOne(999)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update a scholarship', async () => {
    const dto = {
      name: 'Beca Actualizada',
      amount: 750,
    };

    const result = await service.update(1, dto);

    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(repository.save).toHaveBeenCalled();
    expect(result).toMatchObject(dto);
  });

  it('should throw NotFoundException when updating a nonexistent scholarship', async () => {
    vi.mocked(repository.findOneBy).mockResolvedValueOnce(null);

    await expect(
      service.update(999, { name: 'Beca inexistente' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should delete a scholarship', async () => {
    const result = await service.remove(1);

    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(repository.remove).toHaveBeenCalled();
    expect(result).toMatchObject({ id: 1 });
  });

  it('should return paginated scholarships with metadata', async () => {
    const result = await service.findAll({
      page: 1,
      limit: 10,
      sortBy: 'id',
      order: 'ASC',
    });

    expect(repository.createQueryBuilder).toHaveBeenCalledWith(
      'scholarship',
    );
    expect(queryBuilderMock.skip).toHaveBeenCalledWith(0);
    expect(queryBuilderMock.take).toHaveBeenCalledWith(10);
    expect(result).toEqual({
      items: [scholarshipMock],
      meta: {
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    });
  });

  it('should apply search and active status filters', async () => {
    await service.findAll({
      search: 'Excelencia',
      isActive: true,
      page: 1,
      limit: 10,
      sortBy: 'name',
      order: 'ASC',
    });

    expect(queryBuilderMock.andWhere).toHaveBeenCalledTimes(2);
    expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
      'scholarship.name ILIKE :search',
      { search: '%Excelencia%' },
    );
    expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
      'scholarship.isActive = :isActive',
      { isActive: true },
    );
    expect(queryBuilderMock.orderBy).toHaveBeenCalledWith(
      'scholarship.name',
      'ASC',
    );
  });
});
