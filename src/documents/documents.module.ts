import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsService } from './documents.service.js';
import { DocumentsController } from './documents.controller.js';
import { Document } from './entities/document.entity.js';
import { Application } from '../applications/entities/application.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Document, Application]),
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}