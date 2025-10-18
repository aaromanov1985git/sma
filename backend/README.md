# 🚀 Backend API - Система Сверки Путевых Листов

Backend API на NestJS + PostgreSQL + TypeORM для системы проверки объемов работ.

---

## 📋 СОДЕРЖАНИЕ

- [Технологии](#технологии)
- [Требования](#требования)
- [Установка](#установка)
- [Конфигурация](#конфигурация)
- [Запуск](#запуск)
- [API Endpoints](#api-endpoints)
- [База данных](#база-данных)
- [Структура проекта](#структура-проекта)

---

## 🛠️ ТЕХНОЛОГИИ

- **NestJS** 10.0+ - фреймворк для Node.js
- **PostgreSQL** 14+ - реляционная БД
- **TypeORM** 0.3+ - ORM для работы с БД
- **JWT** - аутентификация
- **bcrypt** - хеширование паролей
- **class-validator** - валидация DTO
- **Swagger** - автоматическая документация API

---

## 📦 ТРЕБОВАНИЯ

- Node.js 18+
- PostgreSQL 14+
- npm или yarn

---

## 🚀 УСТАНОВКА

### 1. Установите PostgreSQL

**Windows:**
```bash
# Скачайте установщик с https://www.postgresql.org/download/windows/
# Или через Chocolatey:
choco install postgresql
```

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Linux:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Создайте базу данных

```bash
# Войдите в PostgreSQL
psql -U postgres

# Создайте базу данных
CREATE DATABASE waybill_verification;

# Создайте пользователя (опционально)
CREATE USER waybill_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE waybill_verification TO waybill_user;

# Выход
\q
```

### 3. Установите зависимости

```bash
cd backend
npm install
```

---

## ⚙️ КОНФИГУРАЦИЯ

### 1. Создайте файл `.env`

Скопируйте `env.example.txt` в `.env`:

```bash
# Windows
copy env.example.txt .env

# Linux/macOS
cp env.example.txt .env
```

### 2. Настройте `.env`

```env
# База данных PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=waybill_verification

# JWT
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d

# API
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000
```

**⚠️ ВАЖНО:** Измените `JWT_SECRET` на безопасный ключ в production!

---

## 🎯 ЗАПУСК

### Режим разработки (с hot-reload)

```bash
npm run start:dev
```

### Режим production

```bash
npm run build
npm run start:prod
```

### Запуск миграций

```bash
# Создать миграцию
npm run migration:generate -- src/migrations/MigrationName

# Запустить миграции
npm run migration:run

# Откатить последнюю миграцию
npm run migration:revert
```

---

## 📡 API ENDPOINTS

### Базовый URL
```
http://localhost:3001/api
```

### 🏢 Организации (Organizations)

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/organizations` | Получить все организации |
| GET | `/organizations/:id` | Получить организацию по ID |
| POST | `/organizations` | Создать организацию |
| PATCH | `/organizations/:id` | Обновить организацию |
| DELETE | `/organizations/:id` | Удалить организацию |

**Пример создания организации:**
```json
POST /api/organizations
{
  "name": "ООО «Газпромнефть-Хантос»",
  "inn": "8601025645",
  "kpp": "860101001",
  "address": "г. Ханты-Мансийск, ул. Ленина, д. 1",
  "isActive": true
}
```

### 🤝 Контрагенты (Counterparties)

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/counterparties` | Получить всех контрагентов |
| GET | `/counterparties/:id` | Получить контрагента по ID |
| POST | `/counterparties` | Создать контрагента |
| PATCH | `/counterparties/:id` | Обновить контрагента |
| DELETE | `/counterparties/:id` | Удалить контрагента |

### 🚗 Транспортные средства (Vehicles)

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/vehicles` | Получить все ТС |
| GET | `/vehicles/:id` | Получить ТС по ID |
| POST | `/vehicles` | Создать ТС |
| PATCH | `/vehicles/:id` | Обновить ТС |
| DELETE | `/vehicles/:id` | Удалить ТС |

**Пример создания ТС:**
```json
POST /api/vehicles
{
  "markModel": "Toyota Hilux",
  "govNumber": "В793КУ186",
  "garNumber": "3139",
  "isActive": true
}
```

### 📋 Позиции (Positions)

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/positions` | Получить все позиции |
| GET | `/positions/:id` | Получить позицию по ID |
| POST | `/positions` | Создать позицию |
| PATCH | `/positions/:id` | Обновить позицию |
| DELETE | `/positions/:id` | Удалить позицию |

### 📄 Статусы ПЛ (StatusPL)

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/status-pl` | Получить все статусы |
| GET | `/status-pl/:id` | Получить статус по ID |
| POST | `/status-pl` | Создать статус |
| PATCH | `/status-pl/:id` | Обновить статус |
| DELETE | `/status-pl/:id` | Удалить статус |

### 👥 Пользователи (Users)

| Метод | Endpoint | Описание |
|-------|----------|----------|
| POST | `/auth/register` | Регистрация пользователя |
| POST | `/auth/login` | Вход (получить JWT токен) |
| GET | `/users/me` | Получить текущего пользователя |
| GET | `/users` | Получить всех пользователей (admin) |

### 📝 Документы проверки объемов (Verification Documents)

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/verification-documents` | Получить все документы |
| GET | `/verification-documents/:id` | Получить документ по ID |
| POST | `/verification-documents` | Создать документ |
| PATCH | `/verification-documents/:id` | Обновить документ |
| DELETE | `/verification-documents/:id` | Удалить документ |
| POST | `/verification-documents/:id/upload-customer-data` | Загрузить данные заказчика |
| GET | `/verification-documents/:id/statistics` | Получить статистику |

**Пример создания документа:**
```json
POST /api/verification-documents
{
  "docNumber": "ПО-001-2025",
  "docDate": "2025-10-18",
  "period": "Октябрь 2025",
  "organizationId": "uuid",
  "counterpartyId": "uuid",
  "contractNumber": "ХНТ-22/10000/01292/Р/63",
  "status": "draft",
  "items": [
    {
      "plNumber": "ЕРУТ0018792",
      "datePL": "2025-10-01",
      "timeStart": "2025-10-01T07:00:00",
      "timeEnd": "2025-10-01T19:00:00",
      "positionId": "uuid",
      "vehicleId": "uuid",
      "statusPLId": "uuid",
      "workHours": 12,
      "mileage": 130,
      "motoHours": 0,
      "standbyWithDriver": 0,
      "totalSum": 16500
    }
  ]
}
```

---

## 🗄️ БАЗА ДАННЫХ

### Схема БД

Подробная схема в файле `DATABASE_SCHEMA.md`

### Таблицы

1. **organizations** - Организации
2. **counterparties** - Контрагенты
3. **vehicles** - Транспортные средства
4. **positions** - Позиции работ
5. **status_pl** - Статусы ПЛ
6. **users** - Пользователи
7. **verification_documents** - Документы проверки
8. **waybill_items** - Строки путевых листов

### Миграции

Миграции находятся в `src/migrations/`

```bash
# Создать новую миграцию
npm run migration:generate -- src/migrations/AddNewField

# Применить миграции
npm run migration:run

# Откатить миграцию
npm run migration:revert
```

---

## 📁 СТРУКТУРА ПРОЕКТА

```
backend/
├── src/
│   ├── config/
│   │   └── typeorm.config.ts      # Конфигурация TypeORM
│   ├── entities/                  # Сущности БД
│   │   ├── organization.entity.ts
│   │   ├── counterparty.entity.ts
│   │   ├── vehicle.entity.ts
│   │   ├── position.entity.ts
│   │   ├── status-pl.entity.ts
│   │   ├── user.entity.ts
│   │   ├── verification-document.entity.ts
│   │   └── waybill-item.entity.ts
│   ├── modules/                   # Модули приложения
│   │   ├── organizations/
│   │   │   ├── dto/
│   │   │   ├── organizations.controller.ts
│   │   │   ├── organizations.service.ts
│   │   │   └── organizations.module.ts
│   │   ├── verification-documents/
│   │   │   ├── dto/
│   │   │   ├── verification-documents.controller.ts
│   │   │   ├── verification-documents.service.ts
│   │   │   └── verification-documents.module.ts
│   │   └── ... (остальные модули)
│   ├── migrations/                # Миграции БД
│   ├── app.module.ts              # Главный модуль
│   └── main.ts                    # Точка входа
├── test/                          # Тесты
├── package.json
├── tsconfig.json
├── nest-cli.json
├── .env                           # Переменные окружения
└── README.md
```

---

## 🧪 ТЕСТИРОВАНИЕ

```bash
# Unit тесты
npm run test

# e2e тесты
npm run test:e2e

# Покрытие кода
npm run test:cov
```

---

## 🔐 БЕЗОПАСНОСТЬ

### Аутентификация

API использует JWT токены для аутентификации.

**Регистрация:**
```json
POST /api/auth/register
{
  "username": "manager1",
  "email": "manager1@example.com",
  "password": "SecurePassword123",
  "fullName": "Иванов Иван Иванович",
  "role": "manager"
}
```

**Вход:**
```json
POST /api/auth/login
{
  "username": "manager1",
  "password": "SecurePassword123"
}

# Ответ:
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "username": "manager1",
    "role": "manager"
  }
}
```

**Использование токена:**
```bash
# Добавьте токен в заголовок Authorization
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Роли

- **admin** - Полный доступ ко всем функциям
- **manager** - Создание и редактирование документов
- **viewer** - Только просмотр

---

## 🚀 ДЕПЛОЙ

### Production сборка

```bash
npm run build
```

### Запуск в production

```bash
NODE_ENV=production npm run start:prod
```

### Docker (планируется)

```bash
docker-compose up -d
```

---

## 📝 ЛИЦЕНЗИЯ

MIT

---

## 🤝 ПОДДЕРЖКА

По вопросам обращайтесь через Issues на GitHub.

---

## ✅ ЧЕКЛИСТ ЗАПУСКА

- [ ] PostgreSQL установлен и запущен
- [ ] База данных создана
- [ ] Файл `.env` настроен
- [ ] Зависимости установлены (`npm install`)
- [ ] Миграции применены (`npm run migration:run`)
- [ ] Сервер запущен (`npm run start:dev`)
- [ ] API доступен по адресу `http://localhost:3001/api`

---

**🎉 Готово! Backend API запущен и готов к работе!**

