import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { UserRole } from '../users/user-role.enum.js';
import { DocumentsService } from './documents.service.js';
import { CreateDocumentDto } from './dto/create-document.dto.js';
import { DocumentsQueryDto } from './dto/documents-query.dto.js';
import { UpdateDocumentDto } from './dto/update-document.dto.js';
import { UpdateDocumentStatusDto } from './dto/update-document-status.dto.js';
import { ParseDocumentIdPipe } from './pipes/parse-document-id.pipe.js';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createDocumentDto: CreateDocumentDto) {
    return this.documentsService.create(createDocumentDto);
  }

  @Get()
  findAll(@Query() query: DocumentsQueryDto) {
    return this.documentsService.findAll(query);
  }

  @Get('application/:applicationId')
  findByApplication(@Param('applicationId', ParseDocumentIdPipe) applicationId: number) {
    return this.documentsService.findByApplication(applicationId);
  }

  @Get(':id')
  findOne(@Param('id', ParseDocumentIdPipe) id: number) {
    return this.documentsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.REVIEWER)
  @Patch(':id')
  update(@Param('id', ParseDocumentIdPipe) id: number, @Body() updateDocumentDto: UpdateDocumentDto) {
    return this.documentsService.update(id, updateDocumentDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.REVIEWER)
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseDocumentIdPipe) id: number,
    @Body() dto: UpdateDocumentStatusDto,
  ) {
    return this.documentsService.updateStatus(id, dto.status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.REVIEWER)
  @Delete(':id')
  remove(@Param('id', ParseDocumentIdPipe) id: number) {
    return this.documentsService.remove(id);
  }
}