import './utils/augmentations';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ApplicationExceptionFilter } from './utils/exception/ApplicationExceptionFilter';
import { AllExceptionsFilter } from './utils/exception/catchallExceptionFilter';
import { MongoExceptionFilter } from './utils/exception/MongoExceptionFilter';
import { ValidationExceptionFilter } from './utils/exception/ValidationExceptionFilter';
import { HttpExceptionFilter } from './utils/exception/httpExceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new ApplicationExceptionFilter(),
    new HttpExceptionFilter(),
    new MongoExceptionFilter(),
    new ValidationExceptionFilter(),
  );

  const config = new DocumentBuilder()
    // .addBasicAuth()
    .setTitle('Service Title')
    .setDescription('Service description')
    .setVersion('1.0')
    .addTag('tags')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // app.setGlobalPrefix('api/<entity name>');

  SwaggerModule.setup('api/swagger', app, document);

  await app.listen(4000); // HTTP PORT
  console.log('starting in port 4000');
}
bootstrap();
