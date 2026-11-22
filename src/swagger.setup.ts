import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const SWAGGER_PATH = 'api/docs';

/**
 * Publica el contrato OpenAPI:
 *  - Swagger UI:        /api/docs
 *  - Contrato (JSON):   /api/docs-json
 */
export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('API Sistema de Gestión de Becas ULEAM')
    .setDescription(
      'API REST para administrar estudiantes, becas, solicitudes, documentos ' +
        'y seguimiento. La autenticación es JWT (Bearer) y la autorización ' +
        'se basa en los roles student, reviewer y admin.',
    )
    .setVersion('1.0.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description:
        'Pega el accessToken devuelto por POST /auth/login (sin la palabra Bearer).',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_PATH, app, document, {
    jsonDocumentUrl: `${SWAGGER_PATH}-json`,
    swaggerOptions: { persistAuthorization: true },
  });
}
