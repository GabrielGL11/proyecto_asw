import { ValidationPipe } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { NextFunction, Request, Response } from 'express';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware.js';
import { HttpErrorFilter } from './common/filters/http-error.filter.js';
import { TimingInterceptor } from './common/interceptors/timing.interceptor.js';

/**
 * Configuración transversal de la aplicación (middleware, CORS, pipes,
 * filtro e interceptor globales).
 *
 * La usan tanto `main.ts` como las pruebas E2E, de modo que las pruebas
 * ejecutan exactamente la misma configuración que la aplicación real.
 */
export function configureApp(app: INestApplication): void {
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
}
