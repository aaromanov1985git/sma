# 🐳 DOCKER - БЫСТРЫЙ СТАРТ

## ⚡ За 3 минуты запустите весь проект!

---

## 📋 ШАГИ

### 1️⃣ Установите Docker

**Windows/macOS:**
- Скачайте [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Установите и запустите

**Linux:**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

---

### 2️⃣ Настройте .env

```bash
# Скопируйте файл примера
copy env.docker.example.txt .env   # Windows
cp env.docker.example.txt .env     # Linux/macOS

# ВАЖНО: Измените JWT_SECRET в .env!
```

---

### 3️⃣ Запустите все

```bash
docker-compose up -d
```

**Готово! 🎉**

---

## 🌐 АДРЕСА

После запуска доступны:

| Сервис | URL |
|--------|-----|
| 🖥️ Frontend | http://localhost |
| 🔌 Backend API | http://localhost:3001/api |
| 🗄️ PostgreSQL | localhost:5432 |
| 🛠️ pgAdmin | http://localhost:5050 |

---

## 📝 ОСНОВНЫЕ КОМАНДЫ

```bash
# Запустить
docker-compose up -d

# Остановить
docker-compose down

# Логи
docker-compose logs -f

# Статус
docker-compose ps

# Пересобрать
docker-compose build

# Удалить с данными
docker-compose down -v
```

---

## 🔧 РЕЖИМЫ

### Production (по умолчанию)
```bash
docker-compose up -d
```
- Frontend: http://localhost
- Backend: http://localhost:3001

### Development (с hot-reload)
```bash
docker-compose -f docker-compose.dev.yml up -d
```
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

### С pgAdmin
```bash
docker-compose --profile tools up -d
```
- pgAdmin: http://localhost:5050

---

## 🆘 ПРОБЛЕМЫ?

### Порт занят
```bash
# Изменить порт в .env
PORT=3002
FRONTEND_PORT=8080
```

### Не работает БД
```bash
# Пересоздать
docker-compose down -v
docker-compose up -d
```

### Изменения не применяются
```bash
# Пересобрать образы
docker-compose up --build -d
```

---

## 📖 ПОЛНАЯ ДОКУМЕНТАЦИЯ

См. **DOCKER_GUIDE.md** для детального руководства.

---

## ✅ ЧЕКЛИСТ

- [ ] Docker установлен
- [ ] .env настроен (JWT_SECRET изменен!)
- [ ] Запущен `docker-compose up -d`
- [ ] Frontend открывается http://localhost
- [ ] Backend отвечает http://localhost:3001/api

**Все готово? Начинайте работать! 🚀**

