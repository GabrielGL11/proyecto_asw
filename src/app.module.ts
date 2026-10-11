import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import Joi from 'joi';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ScholarshipsModule } from './scholarships/scholarships.module.js';
import { StudentsModule } from './students/students.module.js';
import { ApplicationsModule } from './applications/applications.module.js';
import { DocumentsModule } from './documents/documents.module.js';
import { TrackingModule } from './tracking/tracking.module.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'test', 'production')
          .default('development'),
        PORT: Joi.number().port().default(5500),

        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.number().port().default(5432),
        DATABASE_NAME: Joi.string().required(),
        DATABASE_USER: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),

        JWT_SECRET: Joi.string().min(32).required(),
        JWT_EXPIRES_IN: Joi.string().default('3600'),
      }),
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        host: config.getOrThrow<string>('DATABASE_HOST'),
        port: config.getOrThrow<number>('DATABASE_PORT'),
        username: config.getOrThrow<string>('DATABASE_USER'),
        password: config.getOrThrow<string>('DATABASE_PASSWORD'),
        database: config.getOrThrow<string>('DATABASE_NAME'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),

    ScholarshipsModule,
    StudentsModule,
    ApplicationsModule,
    DocumentsModule,
    TrackingModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
