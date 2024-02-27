/* eslint-disable @typescript-eslint/no-var-requires */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
const cors = require('cors');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Validar los arreglos vacios
      //Para que valide bien los espacios vacíos o nulos
      //skipMissingProperties: false,
      // elimina los campos que no esten definidos en el dto
      //whitelist: true,
      // marca como error los campos que no esten definidos en el dto
      // forbidNonWhitelisted: true,
    }),
  );
  app.use(cors());

  const config = new DocumentBuilder()
    .setTitle('Diseño y Desarrollo de Sistemas')
    .setDescription('Sistema para la gestión de hojas de eventos.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get('PORT');
  await app.listen(port);
}
bootstrap();
