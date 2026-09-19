import { NestFactory } from '@nestjs/core'; // 1
import { AppModule } from './app.module.js'; // 2

async function bootstrap() { // 3
  const app = await NestFactory.create(AppModule); // 4
  await app.listen(process.env.PORT ?? 5500); // 5
}
bootstrap(); // 6
