import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { DocumentsService } from './documents.service.js';
import { CreateDocumentDto } from './dto/create-document.dto.js';
import { UpdateDocumentDto } from './dto/update-document.dto.js';
import { ParseDocumentIdPipe } from './pipes/parse-document-id.pipe.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id', ParseDocumentIdPipe) id: number, @Body() updateDocumentDto: UpdateDocumentDto) {
    return this.documentsService.update(id, updateDocumentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateStatus(@Param('id', ParseDocumentIdPipe) id: number, @Body('status') status: string) {
    return this.documentsService.updateStatus(id, status as any);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseDocumentIdPipe) id: number) {
    return this.documentsService.remove(id);
  }
}
