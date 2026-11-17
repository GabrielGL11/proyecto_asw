import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

/**
 * Registra método, ruta (sin query string), estado y duración.
 * NO registra encabezados (Authorization), cuerpos ni tokens.
 */
@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const startedAt = Date.now();
    res.on('finish', () => {
      const path = req.originalUrl.split('?')[0];
      this.logger.log(
        `${req.method} ${path} ${res.statusCode} ${Date.now() - startedAt}ms`,
      );
    });
    next();
  }
}
