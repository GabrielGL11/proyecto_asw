import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { DocumentsService } from './documents.service.js';
import { CreateDocumentDto } from './dto/create-document.dto.js';
import { UpdateDocumentDto } from './dto/update-document.dto.js';
import { ParseDocumentIdPipe } from './pipes/parse-document-id.pipe.js';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  create(@Body() createDocumentDto: CreateDocumentDto) {
    return this.documentsService.create(createDocumentDto);
  }

  @Get()
  findAll() {
    return this.documentsService.findAll();
  }

  @Get('application/:applicationId')
  findByApplication(@Param('applicationId', ParseDocumentIdPipe) applicationId: number) {
    return this.documentsService.findByApplication(applicationId);
  }

  @Get(':id')
  findOne(@Param('id', ParseDocumentIdPipe) id: number) {
    return this.documentsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseDocumentIdPipe) id: number, @Body() updateDocumentDto: UpdateDocumentDto) {
    return this.documentsService.update(id, updateDocumentDto);
  }

  @Patch(':id/status')
  updateStatus(@Param('id', ParseDocumentIdPipe) id: number, @Body('status') status: string) {
    return this.documentsService.updateStatus(id, status as any);
  }

  @Delete(':id')
  remove(@Param('id', ParseDocumentIdPipe) id: number) {
    return this.documentsService.remove(id);
  }
}
