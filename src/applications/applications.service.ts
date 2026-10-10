import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './entities/application.entity.js';
import { Student } from '../students/entities/students.entity.js';
import { Scholarship } from '../scholarships/entities/scholarship.entity.js';
import { CreateApplicationDto } from './dto/create-application.dto.js';
import { UpdateApplicationDto } from './dto/update-application.dto.js';
import { ApplicationsQueryDto } from './dto/applications-query.dto.js';

@Injectable()
  export class ApplicationsService {
    constructor(
      @InjectRepository(Application)
      private readonly applicationsRepository: Repository<Application>,
      @InjectRepository(Student)
      private readonly studentsRepository: Repository<Student>,
      @InjectRepository(Scholarship)
      private readonly scholarshipsRepository: Repository<Scholarship>,
    ) {}
    async create(dto: CreateApplicationDto) {
      const student = await this.studentsRepository.findOne({
        where: { id: dto.studentId },
      });
      if (!student) {
        throw new NotFoundException('El estudiante no existe');
      }
      if (!student.isActive) {
        throw new BadRequestException(
          'No se puede crear una solicitud para un estudiante inactivo',
        );
      }
      const scholarship = await this.scholarshipsRepository.findOne({
        where: { id: dto.scholarshipId },
      });
      if (!scholarship) {
        throw new NotFoundException('La beca no existe');
      }
      const existing = await this.applicationsRepository.findOne({
        where: {
          student: { id: dto.studentId },
          scholarship: { id: dto.scholarshipId },
        },
      });
      if (existing) {
        throw new ConflictException(
          'El estudiante ya tiene una solicitud para esta beca',
        );
      }
      const application = this.applicationsRepository.create({
        ...dto,
        student,
        scholarship,
        status: 'pendiente',
      });
      return this.applicationsRepository.save(application);
    }
    async findAll(query: ApplicationsQueryDto) {
      const {
        search,
        studentId,
        scholarshipId,
        status,
        page = 1,
        limit = 10,
        sortBy = 'id',
        order = 'ASC',
      } = query;
      const allowedSortFields = [
        'id',
        'gpa',
        'income',
        'status',
      ];
      const safeSortBy = allowedSortFields.includes(sortBy)
        ? sortBy
        : 'id';
      const qb = this.applicationsRepository
        .createQueryBuilder('application')
        .leftJoinAndSelect('application.student', 'student')
        .leftJoinAndSelect('application.scholarship', 'scholarship')
        .leftJoinAndSelect('application.documents', 'documents')
        .leftJoinAndSelect('application.trackings', 'trackings');
      if (search?.trim()) {
        qb.andWhere(
          `(
            student.firstName ILIKE :search
            OR student.lastName ILIKE :search
            OR student.email ILIKE :search
            OR scholarship.name ILIKE :search
            OR application.comment ILIKE :search
          )`,
          { search: `%${search.trim()}%` },
        );
      }
      if (studentId !== undefined) {
        qb.andWhere('student.id = :studentId', { studentId });
      }
      if (scholarshipId !== undefined) {
        qb.andWhere('scholarship.id = :scholarshipId', {
          scholarshipId,
        });
      }
      if (status) {
        qb.andWhere('application.status = :status', { status });
      }
      qb.orderBy(`application.${safeSortBy}`, order);
      qb.addOrderBy('application.id', 'ASC');
      qb.skip((page - 1) * limit);
      qb.take(limit);
      const [items, total] = await qb.getManyAndCount();
      return {
        items,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    }
    async findOne(id: number) {
      const application = await this.applicationsRepository.findOne({
        where: { id },
        relations: {
          student: true,
          scholarship: true,
          documents: true,
          trackings: true,
        },
      });
      if (!application) {
        throw new NotFoundException(
          `No se encontró la solicitud con ID ${id}`,
        );
      }
      return application;
    }
    async findByStudent(studentId: number) {
      return this.applicationsRepository.find({
        where: { student: { id: studentId } },
        relations: {
          student: true,
          scholarship: true,
        },
      });
    }
    async findByScholarship(scholarshipId: number) {
      return this.applicationsRepository.find({
        where: { scholarship: { id: scholarshipId } },
        relations: {
          student: true,
          scholarship: true,
        },
      });
    }
    async update(id: number, dto: UpdateApplicationDto) {
      const application = await this.findOne(id);
      Object.assign(application, dto);
      return this.applicationsRepository.save(application);
    }
    async updateStatus(id: number, status: string) {
      const validStatuses = [
        'pendiente',
        'revision',
        'aprobada',
        'rechazada',
        'correccion',
      ];
      if (!validStatuses.includes(status)) {
        throw new BadRequestException(
          'El estado de la solicitud no es válido',
        );
      }
      const application = await this.findOne(id);
      application.status = status as Application['status'];
      return this.applicationsRepository.save(application);
    }
    async remove(id: number) {
      const application = await this.findOne(id);
      await this.applicationsRepository.remove(application);
      return {
        message: 'Solicitud eliminada correctamente',
      };
    }
}