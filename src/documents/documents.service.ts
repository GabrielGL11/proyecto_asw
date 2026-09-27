import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document, DocumentStatus } from './entities/document.entity.js';
import { CreateDocumentDto } from './dto/create-document.dto.js';
import { UpdateDocumentDto } from './dto/update-document.dto.js';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentsRepository: Repository<Document>,
  ) {}

  create(createDocumentDto: CreateDocumentDto) {
    const document = this.documentsRepository.create({
      ...createDocumentDto,
      status: 'pendiente',
    });
    return this.documentsRepository.save(document);
  }

  findAll() {
    return this.documentsRepository.find();
  }

  async findOne(id: number) {
    const document = await this.documentsRepository.findOneBy({ id });

    if (!document) {
      throw new NotFoundException('Documento no encontrado');
    }

    return document;
  }

  async update(id: number, updateDocumentDto: UpdateDocumentDto) {
    const document = await this.findOne(id);
    Object.assign(document, updateDocumentDto);
    return this.documentsRepository.save(document);
  }

  async remove(id: number) {
    const document = await this.findOne(id);
    return this.documentsRepository.remove(document);
  }

  findByApplication(applicationId: number) {
    return this.documentsRepository.findBy({ applicationId });
  }

  async updateStatus(id: number, status: DocumentStatus) {
    const document = await this.findOne(id);
    document.status = status;
    return this.documentsRepository.save(document);
  }
}