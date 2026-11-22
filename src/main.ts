import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module.js';
import { configureApp } from './app.setup.js';
import { setupSwagger } from './swagger.setup.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // Middleware, CORS, pipes, filtro e interceptor globales (src/app.setup.ts).
  configureApp(app);

  // Documentación OpenAPI: /api/docs y /api/docs-json.
  setupSwagger(app);

  const port = config.getOrThrow<number>('PORT');
  await app.listen(port);
}

bootstrap();
