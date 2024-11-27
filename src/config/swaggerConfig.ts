import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication) => {
  const SwaggerConfig = new DocumentBuilder()
    .setTitle('Proyecto Valkirias')
    .setDescription('Proyecto Valirias')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, SwaggerConfig);
  SwaggerModule.setup('api', app, document);
};
