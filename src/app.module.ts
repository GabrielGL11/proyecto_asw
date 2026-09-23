import { Module } from '@nestjs/common'; // 1
import { AppController } from './app.controller.js'; // 2
import { AppService } from './app.service.js'; // 3
import { ScholarshipsModule } from './scholarships/scholarships.module.js';

@Module({ // 6
  imports: [ScholarshipsModule], // 7
  controllers: [AppController], // 8
  providers: [AppService], // 9
})
export class AppModule {} // 10