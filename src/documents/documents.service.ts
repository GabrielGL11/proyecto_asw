import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto.js';
import { UpdateDocumentDto } from './dto/update-document.dto.js';

type DocumentStatus = 'pendiente' | 'cargado' | 'observado' | 'aprobado';

type Document = {
  id: number;
  applicationId: number;
  name: string;
  url?: string;
  status: DocumentStatus;
};

@Injectable()
export class DocumentsService {
  private readonly documents: Document[] = [
    {
      id: 1,
      applicationId: 1,
      name: 'Carta de recomendación',
      url: 'https://example.com/recomendacion.pdf',
      status: 'pendiente',
    },
  ];

  create(createDocumentDto: CreateDocumentDto) {
    const nextId = this.documents.length > 0 ? this.documents[this.documents.length - 1].id + 1 : 1;
    const newDocument: Document = {
      id: nextId,
      ...createDocumentDto,
      status: 'pendiente',
    };

    this.documents.push(newDocument);
    return newDocument;
  }

  findAll() {
    return this.documents;
  }

  findOne(id: number) {
    const document = this.documents.find((item) => item.id === id);

    if (!document) {
      throw new NotFoundException('Documento no encontrado');
    }

    return document;
  }

  update(id: number, updateDocumentDto: UpdateDocumentDto) {
    const document = this.findOne(id);
    Object.assign(document, updateDocumentDto);
    return document;
  }

  remove(id: number) {
    const index = this.documents.findIndex((document) => document.id === id);

    if (index === -1) {
      throw new NotFoundException('Documento no encontrado');
    }

    const [deletedDocument] = this.documents.splice(index, 1);
    return deletedDocument;
  }

  findByApplication(applicationId: number) {
    return this.documents.filter((document) => document.applicationId === applicationId);
  }

  updateStatus(id: number, status: DocumentStatus) {
    const document = this.findOne(id);
    document.status = status;
    return document;
  }
}
