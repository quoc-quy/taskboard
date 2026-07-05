import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Set global API prefix
  app.setGlobalPrefix('api');

  // Enable API versioning (e.g. /api/v1/...)
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Enable CORS — origin is read from CORS_ORIGIN env variable.
  // Defaults to http://localhost:3001 for local development.
  // Set a specific domain in production (e.g., https://yourdomain.com).
  const corsOrigin = configService.getOrThrow<string>('CORS_ORIGIN');
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  // Apply Helmet for security headers
  app.use(helmet());

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip out properties that do not have decorators in DTO
      transform: true, // transform payload to DTO instance objects
      forbidNonWhitelisted: true, // throw error if non-whitelisted properties are present
      transformOptions: {
        enableImplicitConversion: true, // allow implicit conversion (e.g. string query params to number)
      },
    }),
  );

  // Global Filters & Interceptors
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());


  // Configure Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Task Management API')
    .setDescription('Mini Production-Ready Task Management System API documentation')
    .setVersion('1.0')
    .addTag('todos')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.getOrThrow<number>('PORT');
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api/v1`);
  console.log(`Swagger documentation is available at: http://localhost:${port}/api/docs`);
}
bootstrap();
