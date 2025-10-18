import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { typeOrmConfig } from './config/typeorm.config';

// Модули справочников
import { OrganizationsModule } from './modules/organizations/organizations.module';

/**
 * Главный модуль приложения
 */
@Module({
  imports: [
    // Конфигурация
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // База данных
    TypeOrmModule.forRoot(typeOrmConfig),

    // Модули приложения
    OrganizationsModule,
    // TODO: Добавить остальные модули
  ],
})
export class AppModule {}

