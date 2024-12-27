import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swaggerConfig';
import * as cors from 'cors';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cors());

  // app.use(express.json());
  // app.use(express.urlencoded({ extended: true }));

  app.useGlobalPipes(new ValidationPipe());

  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000);

  console.log('APP INICIADA CORRECTAMENTE');
}

bootstrap();
