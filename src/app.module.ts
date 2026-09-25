import { Module } from '@nestjs/common'; // 1
import { AppController } from './app.controller.js'; // 2
import { AppService } from './app.service.js'; // 3
import { ScholarshipsModule } from './scholarships/scholarships.module.js';
import { StudentsModule } from './students/students.module.js';
import { ApplicationsModule } from './applications/applications.module.js';
import { DocumentsModule } from './documents/documents.module.js';

@Module({ // 6
  imports: [ScholarshipsModule, StudentsModule, ApplicationsModule, DocumentsModule], // 7
  controllers: [AppController], // 8
  providers: [AppService], // 9
})
export class AppModule {} // 10