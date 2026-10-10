import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity.js';
import { Application } from '../applications/entities/application.entity.js';
import { CreateDocumentDto } from './dto/create-document.dto.js';
import { UpdateDocumentDto } from './dto/update-document.dto.js';
import { DocumentsQueryDto } from './dto/documents-query.dto.js';

@Injectable()
  export class DocumentsService {
    constructor(
      @InjectRepository(Document)
      private readonly documentsRepository: Repository<Document>,
      @InjectRepository(Application)
      private readonly applicationsRepository: Repository<Application>,
    ) {}
    async create(dto: CreateDocumentDto) {
      const application = await this.applicationsRepository.findOne({
        where: { id: dto.applicationId },
      });
      if (!application) {
        throw new NotFoundException('La solicitud no existe');
      }
      const document = this.documentsRepository.create({
        ...dto,
        application,
        status: 'pendiente',
      });
      return this.documentsRepository.save(document);
    }
    async findAll(query: DocumentsQueryDto) {
      const {
        search,
        applicationId,
        status,
        page = 1,
        limit = 10,
        sortBy = 'id',
        order = 'ASC',
      } = query;
      const allowedSortFields = [
        'id',
        'name',
        'status',
        'applicationId',
      ] as const;
      const safeSortBy = allowedSortFields.includes(
        sortBy as (typeof allowedSortFields)[number],
      )
        ? sortBy
        : 'id';
      const safeOrder = order === 'DESC' ? 'DESC' : 'ASC';
      const safePage = Math.max(1, Number(page) || 1);
      const safeLimit = Math.min(50, Math.max(1, Number(limit) || 10));
      const qb = this.documentsRepository
        .createQueryBuilder('document')
        .leftJoinAndSelect('document.application', 'application');
      if (search?.trim()) {
        qb.andWhere(
          `(
            document.name ILIKE :search
            OR document.status ILIKE :search
            OR CAST(document.id AS TEXT) ILIKE :search
          )`,
          { search: `%${search.trim()}%` },
        );
      }
      if (applicationId !== undefined) {
        qb.andWhere('document.applicationId = :applicationId', {
          applicationId,
        });
      }
      if (status) {
        qb.andWhere('document.status = :status', { status });
      }
      qb.orderBy(`document.${safeSortBy}`, safeOrder);
      if (safeSortBy !== 'id') {
        qb.addOrderBy('document.id', 'ASC');
      }
      qb.skip((safePage - 1) * safeLimit);
      qb.take(safeLimit);
      const [items, total] = await qb.getManyAndCount();
      return {
        items,
        meta: {
          total,
          page: safePage,
          limit: safeLimit,
          totalPages: Math.ceil(total / safeLimit),
        },
      };
    }
    async findOne(id: number) {
      const document = await this.documentsRepository.findOne({
        where: { id },
        relations: { application: true },
      });
      if (!document) {
        throw new NotFoundException(
          `No se encontró el documento con ID ${id}`,
        );
      }
      return document;
    }
    async findByApplication(applicationId: number) {
      return this.documentsRepository.find({
        where: { applicationId },
        relations: { application: true },
      });
    }
    async update(id: number, dto: UpdateDocumentDto) {
      const document = await this.findOne(id);
      if (dto.applicationId !== undefined) {
        const application = await this.applicationsRepository.findOne({
          where: { id: dto.applicationId },
        });
        if (!application) {
          throw new NotFoundException('La solicitud no existe');
        }
        document.application = application;
        document.applicationId = application.id;
      }
      Object.assign(document, dto);
      return this.documentsRepository.save(document);
    }
    async updateStatus(id: number, status: string) {
      const validStatuses = [
        'pendiente',
        'cargado',
        'observado',
        'aprobado',
      ];
      if (!validStatuses.includes(status)) {
        throw new BadRequestException(
          'El estado del documento no es válido',
        );
      }
      const document = await this.findOne(id);
      document.status = status as Document['status'];
      return this.documentsRepository.save(document);
    }
    async remove(id: number) {
      const document = await this.findOne(id);
      await this.documentsRepository.remove(document);
      return {
        message: 'Documento eliminado correctamente',
      };
    }
}