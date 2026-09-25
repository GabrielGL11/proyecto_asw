import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto.js';
import { UpdateApplicationDto } from './dto/update-application.dto.js';

type ApplicationStatus = 'pendiente' | 'revision' | 'aprobada' | 'rechazada' | 'correccion';

type Application = {
  id: number;
  studentId: number;
  scholarshipId: number;
  gpa: number;
  income: number;
  comment?: string;
  status: ApplicationStatus;
};

@Injectable()
export class ApplicationsService {
  private readonly applications: Application[] = [
    {
      id: 1,
      studentId: 2,
      scholarshipId: 2,
      gpa: 8.6,
      income: 1200,
      comment: 'Solicitante con rendimiento académico bueno.',
      status: 'pendiente',
    },
  ];

  create(createApplicationDto: CreateApplicationDto) {
    const nextId = this.applications.length > 0 ? this.applications[this.applications.length - 1].id + 1 : 1;
    const newApplication: Application = {
      id: nextId,
      ...createApplicationDto,
      status: 'pendiente',
    };

    this.applications.push(newApplication);
    return newApplication;
  }

  findAll() {
    return this.applications;
  }

  findOne(id: number) {
    const application = this.applications.find((item) => item.id === id);

    if (!application) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    return application;
  }

  update(id: number, updateApplicationDto: UpdateApplicationDto) {
    const application = this.findOne(id);
    Object.assign(application, updateApplicationDto);
    return application;
  }

  remove(id: number) {
    const index = this.applications.findIndex((application) => application.id === id);

    if (index === -1) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    const [deletedApplication] = this.applications.splice(index, 1);
    return deletedApplication;
  }

  findByStudent(studentId: number) {
    return this.applications.filter((application) => application.studentId === studentId);
  }

  findByScholarship(scholarshipId: number) {
    return this.applications.filter((application) => application.scholarshipId === scholarshipId);
  }

  updateStatus(id: number, status: ApplicationStatus) {
    const application = this.findOne(id);
    application.status = status;
    return application;
  }
}
