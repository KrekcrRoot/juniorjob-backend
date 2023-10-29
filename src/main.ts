import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import logger from './logger';
import * as process from 'process';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // App constants

  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.APP_PORT) || 3000;

  // Swagger UI

  const config = new DocumentBuilder()
    .setTitle(`JuniorJob Backend`)
    .setDescription(`JJ back Rest API description`)
    .setVersion(`0.0`)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`docs`, app, document);

  // Validator

  app.useGlobalPipes(new ValidationPipe());

  // Running app

  await app.listen(port).then(() => {
    logger.log({ level: `info`, message: `App started on port ${port}` });
  });
}

bootstrap().then(() => {
  logger.log({ level: `info`, message: `Bootstrap running` });
});
