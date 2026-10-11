import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { StudentsService } from './students.service.js';
import { Student } from './entities/students.entity.js';

describe('StudentsService', () => {
  let service: StudentsService;
  let repository: Repository<Student>;

  const studentMock = {
    id: 1,
    firstName: 'Carlos',
    lastName: 'Mendoza',
    nationalId: '1300000001',
    email: 'carlos@example.com',
    age: 22,
    career: 'Software',
    semester: 5,
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
      [studentMock],
      1,
    ]);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        {
          provide: getRepositoryToken(Student),
          useValue: {
            create: vi.fn().mockReturnValue({ ...studentMock }),
            save: vi.fn().mockImplementation((student) =>
              Promise.resolve(student),
            ),
            findOne: vi.fn().mockResolvedValue({ ...studentMock }),
            remove: vi.fn().mockResolvedValue(studentMock),
            createQueryBuilder: vi.fn().mockReturnValue(queryBuilderMock),
          },
        },
      ],
    }).compile();

    service = module.get<StudentsService>(StudentsService);
    repository = module.get<Repository<Student>>(
      getRepositoryToken(Student),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a student', async () => {
    const dto = {
      firstName: 'Carlos',
      lastName: 'Mendoza',
      nationalId: '1300000001',
      email: 'carlos@example.com',
      age: 22,
      career: 'Software',
      semester: 5,
      isActive: true,
    };

    const result = await service.create(dto);

    expect(repository.create).toHaveBeenCalledWith(dto);
    expect(repository.save).toHaveBeenCalled();
    expect(result).toMatchObject(dto);
  });

  it('should return a student by ID', async () => {
    const result = await service.findOne(1);

    expect(repository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(result).toMatchObject({ id: 1 });
  });

  it('should throw NotFoundException when the student does not exist', async () => {
    vi.mocked(repository.findOne).mockResolvedValueOnce(null);

    await expect(service.findOne(999)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update a student', async () => {
    const dto = {
      career: 'Ingeniería de Software',
      semester: 6,
    };

    const result = await service.update(1, dto);

    expect(repository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(repository.save).toHaveBeenCalled();
    expect(result).toMatchObject(dto);
  });

  it('should throw NotFoundException when updating a nonexistent student', async () => {
    vi.mocked(repository.findOne).mockResolvedValueOnce(null);

    await expect(
      service.update(999, { career: 'Software' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should delete a student', async () => {
    const result = await service.remove(1);

    expect(repository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(repository.remove).toHaveBeenCalled();
    expect(result).toEqual({
      message: 'Estudiante eliminado correctamente',
    });
  });

  it('should return paginated students with metadata', async () => {
    const result = await service.findAll({
      page: 1,
      limit: 10,
      sortBy: 'id',
      order: 'ASC',
    });

    expect(repository.createQueryBuilder).toHaveBeenCalledWith('student');
    expect(queryBuilderMock.skip).toHaveBeenCalledWith(0);
    expect(queryBuilderMock.take).toHaveBeenCalledWith(10);
    expect(result).toEqual({
      items: [studentMock],
      meta: {
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    });
  });

  it('should apply search and career filters', async () => {
    await service.findAll({
      search: 'Carlos',
      career: 'Software',
      page: 1,
      limit: 10,
      sortBy: 'id',
      order: 'ASC',
    });

    expect(queryBuilderMock.andWhere).toHaveBeenCalledTimes(2);
    expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
      expect.stringContaining('ILIKE :search'),
      { search: '%Carlos%' },
    );
    expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
      'student.career ILIKE :career',
      { career: '%Software%' },
    );
  });
});
