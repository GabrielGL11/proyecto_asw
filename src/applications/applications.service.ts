import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application, ApplicationStatus } from './entities/application.entity.js';
import { CreateApplicationDto } from './dto/create-application.dto.js';
import { UpdateApplicationDto } from './dto/update-application.dto.js';
import { Student } from '../students/entities/students.entity.js';
import { Scholarship } from '../scholarships/entities/scholarship.entity.js';

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

    async create(createApplicationDto: CreateApplicationDto) {
      // 1. Verificar que el estudiante exista
      const student = await this.studentsRepository.findOneBy({
        id: createApplicationDto.studentId,
      });

      if (!student) {
        throw new NotFoundException(
          'Estudiante no encontrado',
        );
      }

      // 2. Verificar que el estudiante esté activo
      if (!student.isActive) {
        throw new BadRequestException(
          'El estudiante está inactivo y no puede solicitar una beca',
        );
      }

      // 3. Verificar que la beca exista
      const scholarship =
        await this.scholarshipsRepository.findOneBy({
          id: createApplicationDto.scholarshipId,
        });

      if (!scholarship) {
        throw new NotFoundException(
          'Beca no encontrada',
        );
      }

      // 4. Verificar que no exista una solicitud
      // del mismo estudiante para la misma beca
      const existingApplication =
        await this.applicationsRepository.findOne({
          where: {
            studentId: createApplicationDto.studentId,
            scholarshipId: createApplicationDto.scholarshipId,
          },
        });

      if (existingApplication) {
        throw new ConflictException(
          'El estudiante ya tiene una solicitud para esta beca',
        );
      }

      // 5. Crear la solicitud con sus relaciones
      const application =
        this.applicationsRepository.create({
          ...createApplicationDto,
          student,
          scholarship,
          status: 'pendiente',
        });

      try {
        return await this.applicationsRepository.save(
          application,
        );
      } catch (error) {
        // Protección adicional por la restricción UNIQUE
        if (
          error instanceof Error &&
          error.message.includes('unique')
        ) {
          throw new ConflictException(
            'El estudiante ya tiene una solicitud para esta beca',
          );
        }

        throw error;
      }
    }

    // Obtener todas las solicitudes
    // incluyendo estudiante, beca, documentos y seguimiento
    findAll() {
      return this.applicationsRepository.find({
        relations: {
          student: true,
          scholarship: true,
          documents: true,
          trackings: true,
        },
      });
    }

    // Obtener una solicitud por ID
    async findOne(id: number) {
      const application =
        await this.applicationsRepository.findOne({
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
          'Solicitud no encontrada',
        );
      }

      return application;
    }

    // Actualizar una solicitud
    async update(
      id: number,
      updateApplicationDto: UpdateApplicationDto,
    ) {
      const application = await this.findOne(id);

      Object.assign(
        application,
        updateApplicationDto,
      );

      return this.applicationsRepository.save(
        application,
      );
    }

    // Eliminar una solicitud
    async remove(id: number) {
      const application = await this.findOne(id);

      return this.applicationsRepository.remove(
        application,
      );
    }

    // Buscar solicitudes por estudiante
    findByStudent(studentId: number) {
      return this.applicationsRepository.find({
        where: {
          studentId,
        },
        relations: {
          student: true,
          scholarship: true,
        },
      });
    }

    // Buscar solicitudes por beca
    findByScholarship(scholarshipId: number) {
      return this.applicationsRepository.find({
        where: {
          scholarshipId,
        },
        relations: {
          student: true,
          scholarship: true,
        },
      });
    }

    // Actualizar estado de una solicitud
    async updateStatus(
      id: number,
      status: ApplicationStatus,
    ) {
      const application = await this.findOne(id);

      application.status = status;

      return this.applicationsRepository.save(
        application,
      );
    }
}