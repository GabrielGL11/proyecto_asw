import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import type { NextFunction, Request, Response } from 'express';
import { AppModule } from './app.module.js';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware.js';
import { HttpErrorFilter } from './common/filters/http-error.filter.js';
import { TimingInterceptor } from './common/interceptors/timing.interceptor.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // Registro de solicitudes (sin cuerpos, encabezados ni tokens).
  const requestLogger = new RequestLoggerMiddleware();
  app.use((req: Request, res: Response, next: NextFunction) =>
    requestLogger.use(req, res, next),
  );

  // CORS: solo los orígenes documentados en CORS_ORIGINS (separados por coma).
  // CORS no es autorización: JWT y roles se siguen aplicando en el servidor.
  const origins = config
    .getOrThrow<string>('CORS_ORIGINS')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  app.enableCors({
    origin: origins,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new HttpErrorFilter());
  app.useGlobalInterceptors(new TimingInterceptor());

  const port = config.getOrThrow<number>('PORT');
  await app.listen(port);
}

bootstrap();
