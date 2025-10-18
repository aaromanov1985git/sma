# 🐳 DOCKER GUIDE - Полное руководство

Полное руководство по запуску проекта через Docker и Docker Compose.

---

## 📋 СОДЕРЖАНИЕ

- [Что включено](#что-включено)
- [Требования](#требования)
- [Быстрый старт](#быстрый-старт)
- [Режимы запуска](#режимы-запуска)
- [Команды Docker](#команды-docker)
- [Переменные окружения](#переменные-окружения)
- [Архитектура](#архитектура)
- [Troubleshooting](#troubleshooting)

---

## 🎯 ЧТО ВКЛЮЧЕНО

Docker Compose запускает **полный стек приложения**:

1. **PostgreSQL** - база данных
2. **Backend API** (NestJS) - сервер
3. **Frontend** (React + Nginx) - веб-приложение
4. **pgAdmin** (опционально) - управление БД

**Все сервисы связаны и работают вместе!**

---

## 📦 ТРЕБОВАНИЯ

### Установите Docker и Docker Compose

#### Windows:
```bash
# Скачайте и установите Docker Desktop
https://www.docker.com/products/docker-desktop/

# Docker Desktop включает Docker Compose
```

#### macOS:
```bash
# Установите Docker Desktop
brew install --cask docker

# Или скачайте с официального сайта
https://www.docker.com/products/docker-desktop/
```

#### Linux:
```bash
# Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Проверка установки:
```bash
docker --version
# Docker version 24.0.0 или выше

docker-compose --version
# Docker Compose version v2.20.0 или выше
```

---

## 🚀 БЫСТРЫЙ СТАРТ

### 1. Клонируйте проект (если еще не сделали)
```bash
git clone <repository-url>
cd sma
```

### 2. Настройте переменные окружения
```bash
# Скопируйте файл с примером
copy env.docker.example.txt .env   # Windows
cp env.docker.example.txt .env     # Linux/macOS

# Отредактируйте .env файл
# ОБЯЗАТЕЛЬНО измените JWT_SECRET в production!
```

### 3. Запустите все сервисы
```bash
docker-compose up -d
```

**Готово! 🎉**

### 4. Проверьте что все работает

- **Frontend:** http://localhost (порт 80)
- **Backend API:** http://localhost:3001/api
- **PostgreSQL:** localhost:5432
- **pgAdmin:** http://localhost:5050 (если запустили с `--profile tools`)

---

## 🔧 РЕЖИМЫ ЗАПУСКА

### 1️⃣ Production режим (рекомендуется)

Оптимизированные Docker образы, готовые к production:

```bash
# Запустить все сервисы
docker-compose up -d

# Посмотреть логи
docker-compose logs -f

# Остановить
docker-compose down
```

**Что запускается:**
- PostgreSQL
- Backend (оптимизированный build)
- Frontend (статика через Nginx)

---

### 2️⃣ Development режим (с hot-reload)

Для разработки с автоматической перезагрузкой:

```bash
# Запустить в режиме разработки
docker-compose -f docker-compose.dev.yml up -d

# Посмотреть логи
docker-compose -f docker-compose.dev.yml logs -f

# Остановить
docker-compose -f docker-compose.dev.yml down
```

**Что запускается:**
- PostgreSQL
- Backend с hot-reload (nodemon)
- Frontend с hot-reload (Vite HMR)

**Порты в dev режиме:**
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- PostgreSQL: localhost:5432

---

### 3️⃣ С pgAdmin (для управления БД)

```bash
# Запустить с pgAdmin
docker-compose --profile tools up -d

# Зайти в pgAdmin
# URL: http://localhost:5050
# Email: admin@admin.com (из .env)
# Password: admin (из .env)
```

**Подключение к PostgreSQL в pgAdmin:**
```
Host: postgres
Port: 5432
Username: postgres
Password: postgres
Database: waybill_verification
```

---

## 📜 КОМАНДЫ DOCKER

### Основные команды

```bash
# Запустить все сервисы в фоне
docker-compose up -d

# Запустить с выводом логов
docker-compose up

# Остановить все сервисы
docker-compose down

# Остановить И удалить volumes (БД будет очищена!)
docker-compose down -v

# Пересобрать образы
docker-compose build

# Пересобрать и запустить
docker-compose up --build -d
```

### Логи

```bash
# Все логи
docker-compose logs

# Логи конкретного сервиса
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres

# Следить за логами в реальном времени
docker-compose logs -f backend

# Последние 100 строк
docker-compose logs --tail=100 backend
```

### Управление сервисами

```bash
# Список запущенных контейнеров
docker-compose ps

# Остановить конкретный сервис
docker-compose stop backend

# Запустить конкретный сервис
docker-compose start backend

# Перезапустить сервис
docker-compose restart backend

# Удалить контейнер сервиса
docker-compose rm backend
```

### Подключение к контейнеру

```bash
# Зайти внутрь backend контейнера
docker-compose exec backend sh

# Зайти в PostgreSQL
docker-compose exec postgres psql -U postgres -d waybill_verification

# Выполнить команду в контейнере
docker-compose exec backend npm run migration:run
```

### Volumes (данные)

```bash
# Посмотреть volumes
docker volume ls

# Информация о volume
docker volume inspect sma_postgres_data

# Удалить неиспользуемые volumes
docker volume prune

# Бэкап БД
docker-compose exec postgres pg_dump -U postgres waybill_verification > backup.sql

# Восстановление БД
docker-compose exec -T postgres psql -U postgres waybill_verification < backup.sql
```

---

## ⚙️ ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ

### Файл `.env`

Создайте файл `.env` в корне проекта:

```env
# Database
DB_USERNAME=postgres
DB_PASSWORD=SuperSecurePassword123
DB_DATABASE=waybill_verification
DB_PORT=5432

# Backend
NODE_ENV=production
PORT=3001
JWT_SECRET=your-very-long-and-secure-random-string-change-this
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://yourdomain.com

# Frontend
FRONTEND_PORT=80
VITE_API_URL=http://yourdomain.com/api

# pgAdmin (опционально)
PGADMIN_EMAIL=admin@yourdomain.com
PGADMIN_PASSWORD=AdminPassword123
PGADMIN_PORT=5050
```

### ⚠️ ВАЖНО для Production:

1. **Измените `JWT_SECRET`** на длинную случайную строку
2. **Измените пароли** БД и pgAdmin
3. **Настройте `CORS_ORIGIN`** на ваш домен
4. **Не коммитьте `.env`** в Git!

---

## 🏗️ АРХИТЕКТУРА

### Структура Docker

```
sma/
├── Dockerfile                    # Frontend image
├── nginx.conf                    # Nginx конфигурация
├── .dockerignore                 # Игнор файлы для frontend
├── docker-compose.yml            # Production конфигурация
├── docker-compose.dev.yml        # Development конфигурация
├── env.docker.example.txt        # Пример .env файла
└── backend/
    ├── Dockerfile                # Backend production image
    ├── Dockerfile.dev            # Backend development image
    └── .dockerignore             # Игнор файлы для backend
```

### Сетевая архитектура

```
┌─────────────────────────────────────────────────┐
│              Docker Network                      │
│          (waybill-network)                       │
│                                                  │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐ │
│  │ Frontend │    │ Backend  │    │PostgreSQL│ │
│  │  Nginx   │◄──►│  NestJS  │◄──►│    DB    │ │
│  │ :80      │    │ :3001    │    │ :5432    │ │
│  └────┬─────┘    └──────────┘    └──────────┘ │
│       │                                         │
└───────┼─────────────────────────────────────────┘
        │
   ┌────▼────┐
   │  User   │
   │ Browser │
   └─────────┘
```

### Multi-stage builds

#### Backend Dockerfile
```dockerfile
# Stage 1: Builder (компиляция TypeScript)
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production (только dist + dependencies)
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/main"]
```

**Результат:** Образ без исходников, только скомпилированный код

#### Frontend Dockerfile
```dockerfile
# Stage 1: Builder (сборка React)
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Nginx (только статика)
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

**Результат:** Легковесный образ с Nginx + статика

---

## 🔍 TROUBLESHOOTING

### Проблема: Порт уже занят

**Ошибка:**
```
Error: bind: address already in use
```

**Решение:**
```bash
# Найти процесс на порту 3001
netstat -ano | findstr :3001  # Windows
lsof -i :3001                 # Linux/macOS

# Остановить Docker сервисы на этом порту
docker-compose down

# Изменить порт в .env
PORT=3002
```

---

### Проблема: База данных не инициализируется

**Решение:**
```bash
# Удалить volumes и пересоздать
docker-compose down -v
docker-compose up -d

# Проверить логи PostgreSQL
docker-compose logs postgres
```

---

### Проблема: Backend не может подключиться к БД

**Проверка:**
```bash
# Проверить что PostgreSQL работает
docker-compose ps

# Проверить логи backend
docker-compose logs backend

# Зайти в backend контейнер и проверить подключение
docker-compose exec backend sh
ping postgres
```

**Решение:**
- Убедитесь что `DB_HOST=postgres` (имя сервиса)
- Проверьте что PostgreSQL запущен

---

### Проблема: Frontend показывает 404

**Решение:**
```bash
# Пересобрать frontend
docker-compose build frontend
docker-compose up -d frontend

# Проверить что файлы скопировались
docker-compose exec frontend ls -la /usr/share/nginx/html
```

---

### Проблема: Изменения в коде не применяются

**Production mode:**
```bash
# Нужно пересобрать образ
docker-compose build
docker-compose up -d
```

**Development mode:**
```bash
# Volumes монтируются - изменения должны применяться автоматически
# Если не работает, перезапустите сервис
docker-compose -f docker-compose.dev.yml restart backend
```

---

### Проблема: Нет места на диске

**Очистка Docker:**
```bash
# Удалить неиспользуемые образы
docker image prune -a

# Удалить неиспользуемые volumes
docker volume prune

# Удалить все неиспользуемое (ОСТОРОЖНО!)
docker system prune -a --volumes
```

---

## 📊 МОНИТОРИНГ

### Использование ресурсов

```bash
# Статистика контейнеров
docker stats

# Статистика конкретного контейнера
docker stats waybill-backend
```

### Health checks

Все сервисы имеют health checks:

```bash
# Проверить здоровье сервисов
docker-compose ps

# healthy - работает нормально
# unhealthy - есть проблемы
# starting - еще запускается
```

---

## 🚀 ДЕПЛОЙ В PRODUCTION

### 1. Подготовка сервера

```bash
# Установить Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Установить Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Настройка .env

```bash
# Создать .env с production настройками
nano .env

# ОБЯЗАТЕЛЬНО изменить:
JWT_SECRET=<случайная строка 64+ символов>
DB_PASSWORD=<надежный пароль>
CORS_ORIGIN=https://yourdomain.com
```

### 3. Запуск

```bash
# Клонировать проект
git clone <repository-url>
cd sma

# Запустить
docker-compose up -d

# Проверить
docker-compose ps
docker-compose logs -f
```

### 4. Настройка Nginx (на хосте)

Если используете обратный прокси:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 5. SSL сертификат (Let's Encrypt)

```bash
# Установить certbot
sudo apt install certbot python3-certbot-nginx

# Получить сертификат
sudo certbot --nginx -d yourdomain.com
```

---

## 📝 ЧЕКЛИСТ ЗАПУСКА

### Development:
- [ ] Docker установлен
- [ ] Docker Compose установлен
- [ ] Скопирован `.env` из примера
- [ ] Запущен `docker-compose -f docker-compose.dev.yml up -d`
- [ ] Frontend доступен на http://localhost:3000
- [ ] Backend API доступен на http://localhost:3001/api

### Production:
- [ ] Изменен `JWT_SECRET`
- [ ] Изменены пароли БД
- [ ] Настроен `CORS_ORIGIN`
- [ ] Запущен `docker-compose up -d`
- [ ] Настроен SSL
- [ ] Настроен backup БД

---

## 🎉 ГОТОВО!

Docker-конфигурация полностью готова к использованию!

**Для запуска просто выполните:**
```bash
docker-compose up -d
```

**Для остановки:**
```bash
docker-compose down
```

---

## 📞 ПОДДЕРЖКА

Если возникли проблемы:
1. Проверьте раздел [Troubleshooting](#troubleshooting)
2. Посмотрите логи: `docker-compose logs -f`
3. Создайте Issue на GitHub

---

**Приятного использования Docker! 🐳**

