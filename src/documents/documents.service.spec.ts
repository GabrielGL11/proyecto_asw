import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from './documents.service.js';

describe('DocumentsService', () => {
  let service: DocumentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocumentsService],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
  });

  it('should create a document with default pending status and filter by application', () => {
    const document = service.create({
      applicationId: 10,
      name: 'Acta de matrícula',
      url: 'https://example.com/acta.pdf',
    });

    expect(document.status).toBe('pendiente');
    expect(service.findByApplication(10)).toHaveLength(1);
    expect(service.findByApplication(10)[0].id).toBe(document.id);
  });

  it('should update only the document status', () => {
    const document = service.create({
      applicationId: 10,
      name: 'Certificado',
    });

    const updated = service.updateStatus(document.id, 'observado');

    expect(updated.status).toBe('observado');
    expect(updated.name).toBe('Certificado');
  });
});
