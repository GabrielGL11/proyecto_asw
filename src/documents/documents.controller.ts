import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { DocumentsService } from './documents.service.js';
import { CreateDocumentDto } from './dto/create-document.dto.js';
import { UpdateDocumentDto } from './dto/update-document.dto.js';
import { DocumentsQueryDto } from './dto/documents-query.dto.js';

@Controller('documents')
  export class DocumentsController {
    constructor(
      private readonly documentsService: DocumentsService,
    ) {}
    @Post()
    create(@Body() dto: CreateDocumentDto) {
      return this.documentsService.create(dto);
    }
    @Get()
    findAll(@Query() query: DocumentsQueryDto) {
      return this.documentsService.findAll(query);
    }
    @Get('application/:applicationId')
    findByApplication(
      @Param('applicationId', ParseIntPipe) applicationId: number,
    ) {
      return this.documentsService.findByApplication(applicationId);
    }
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
      return this.documentsService.findOne(id);
    }
    @Patch(':id')
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() dto: UpdateDocumentDto,
    ) {
      return this.documentsService.update(id, dto);
    }
    @Patch(':id/status')
    updateStatus(
      @Param('id', ParseIntPipe) id: number,
      @Body() body: { status: string },
    ) {
      return this.documentsService.updateStatus(id, body.status);
    }
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.documentsService.remove(id);
    }
}
