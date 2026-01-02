import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Middleware to log each request
  app.use((req, res, next) => {
    Logger.log(`Incoming Request: ${req.method} ${req.url}`);
    next();
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();