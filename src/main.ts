import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swaggerConfig';
import cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cors());
  
  setupSwagger(app);
  
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
