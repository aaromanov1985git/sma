import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

/**
 * Точка входа в приложение
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Включаем валидацию
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Включаем CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  // Глобальный префикс API
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 Backend API запущен на http://localhost:${port}/api`);
  console.log(`📊 База данных: ${process.env.DB_DATABASE || 'waybill_verification'}`);
}

bootstrap();

