import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swaggerConfig';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cors());

  // app.use(
  //   cors({
  //     origin: true,
  //     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //     allowedHeaders: 'Content-Type, Authorization',
  //   }),
  // );

  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000);

  console.log('APP INICIADA CORRECTAMENTE');
}

bootstrap();
