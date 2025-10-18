# 🗄️ СХЕМА БАЗЫ ДАННЫХ

## 📊 ER-Диаграмма

```
┌─────────────────────┐       ┌──────────────────────┐
│    organizations    │       │    counterparties    │
├─────────────────────┤       ├──────────────────────┤
│ id (UUID, PK)       │       │ id (UUID, PK)        │
│ name (VARCHAR)      │       │ name (VARCHAR)       │
│ inn (VARCHAR)       │       │ inn (VARCHAR)        │
│ kpp (VARCHAR)       │       │ kpp (VARCHAR)        │
│ address (TEXT)      │       │ address (TEXT)       │
│ is_active (BOOLEAN) │       │ is_active (BOOLEAN)  │
│ created_at          │       │ created_at           │
│ updated_at          │       │ updated_at           │
└─────────────────────┘       └──────────────────────┘
         │                              │
         │                              │
         └──────────┬───────────────────┘
                    │
                    │
         ┌──────────▼──────────────┐
         │ verification_documents  │
         ├─────────────────────────┤
         │ id (UUID, PK)           │
         │ doc_number (VARCHAR)    │
         │ doc_date (DATE)         │
         │ period (VARCHAR)        │
         │ organization_id (FK)    │
         │ counterparty_id (FK)    │
         │ contract_number (VARCHAR│
         │ status (ENUM)           │
         │ created_by_id (FK)      │
         │ created_at              │
         │ updated_at              │
         └─────────────────────────┘
                    │
                    │ 1:N
                    │
         ┌──────────▼──────────────┐
         │     waybill_items       │
         ├─────────────────────────┤
         │ id (UUID, PK)           │
         │ document_id (FK)        │
         │ pl_number (VARCHAR)     │
         │ date_pl (DATE)          │
         │ time_start (TIMESTAMP)  │
         │ time_end (TIMESTAMP)    │
         │ position_id (FK)        │
         │ vehicle_id (FK)         │
         │ status_pl_id (FK)       │
         │ work_hours (DECIMAL)    │
         │ mileage (DECIMAL)       │
         │ moto_hours (DECIMAL)    │
         │ standby_with_driver     │
         │ total_sum (DECIMAL)     │
         │ notes (TEXT)            │
         │ accepted_by_id (FK)     │
         │ customer_work_hours     │
         │ customer_mileage        │
         │ customer_moto_hours     │
         │ customer_standby        │
         │ customer_total_sum      │
         │ decision (ENUM)         │
         │ created_at              │
         │ updated_at              │
         └─────────────────────────┘
                    │
                    ├────────────┐
                    │            │
         ┌──────────▼────┐  ┌────▼─────────┐
         │   vehicles    │  │  positions   │
         ├───────────────┤  ├──────────────┤
         │ id (UUID, PK) │  │ id (UUID, PK)│
         │ mark_model    │  │ code (VARCHAR│
         │ gov_number    │  │ name (VARCHAR│
         │ gar_number    │  │ is_active    │
         │ is_active     │  │ created_at   │
         │ created_at    │  │ updated_at   │
         │ updated_at    │  └──────────────┘
         └───────────────┘         
                    
         ┌─────────────────┐       ┌──────────────────┐
         │  status_pl      │       │      users       │
         ├─────────────────┤       ├──────────────────┤
         │ id (UUID, PK)   │       │ id (UUID, PK)    │
         │ code (VARCHAR)  │       │ username (VARCHAR│
         │ name (VARCHAR)  │       │ email (VARCHAR)  │
         │ is_active       │       │ password (VARCHAR│
         │ created_at      │       │ full_name        │
         │ updated_at      │       │ role (ENUM)      │
         └─────────────────┘       │ is_active        │
                                   │ created_at       │
                                   │ updated_at       │
                                   └──────────────────┘
```

---

## 📋 ОПИСАНИЕ ТАБЛИЦ

### 1. **organizations** (Организации)
Справочник организаций (ваша компания)

| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID | Уникальный идентификатор |
| name | VARCHAR(255) | Наименование организации |
| inn | VARCHAR(12) | ИНН |
| kpp | VARCHAR(9) | КПП |
| address | TEXT | Юридический адрес |
| is_active | BOOLEAN | Активна ли запись |
| created_at | TIMESTAMP | Дата создания |
| updated_at | TIMESTAMP | Дата обновления |

---

### 2. **counterparties** (Контрагенты)
Справочник контрагентов (подрядчики)

| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID | Уникальный идентификатор |
| name | VARCHAR(255) | Наименование контрагента |
| inn | VARCHAR(12) | ИНН |
| kpp | VARCHAR(9) | КПП |
| address | TEXT | Юридический адрес |
| is_active | BOOLEAN | Активен ли |
| created_at | TIMESTAMP | Дата создания |
| updated_at | TIMESTAMP | Дата обновления |

---

### 3. **vehicles** (Транспортные средства)
Справочник ТС

| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID | Уникальный идентификатор |
| mark_model | VARCHAR(255) | Марка и модель |
| gov_number | VARCHAR(20) | Государственный номер |
| gar_number | VARCHAR(20) | Гаражный номер |
| is_active | BOOLEAN | Активно ли |
| created_at | TIMESTAMP | Дата создания |
| updated_at | TIMESTAMP | Дата обновления |

**Индексы:**
- UNIQUE(gov_number)
- INDEX(gar_number)

---

### 4. **positions** (Позиции)
Справочник позиций работ

| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID | Уникальный идентификатор |
| code | VARCHAR(50) | Код позиции |
| name | VARCHAR(255) | Наименование |
| is_active | BOOLEAN | Активна ли |
| created_at | TIMESTAMP | Дата создания |
| updated_at | TIMESTAMP | Дата обновления |

**Индексы:**
- UNIQUE(code)

---

### 5. **status_pl** (Статусы путевых листов)
Справочник статусов ПЛ

| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID | Уникальный идентификатор |
| code | VARCHAR(50) | Код статуса |
| name | VARCHAR(100) | Наименование |
| is_active | BOOLEAN | Активен ли |
| created_at | TIMESTAMP | Дата создания |
| updated_at | TIMESTAMP | Дата обновления |

**Индексы:**
- UNIQUE(code)

**Предустановленные значения:**
- `WORKED` - Отработал
- `NOT_WORKED` - Не отработал
- `PARTIAL` - Частично отработал

---

### 6. **users** (Пользователи)
Пользователи системы

| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID | Уникальный идентификатор |
| username | VARCHAR(50) | Логин |
| email | VARCHAR(255) | Email |
| password | VARCHAR(255) | Хешированный пароль |
| full_name | VARCHAR(255) | Полное имя |
| role | ENUM | Роль (admin, manager, viewer) |
| is_active | BOOLEAN | Активен ли |
| created_at | TIMESTAMP | Дата создания |
| updated_at | TIMESTAMP | Дата обновления |

**Индексы:**
- UNIQUE(username)
- UNIQUE(email)

**Роли:**
- `admin` - Администратор (все права)
- `manager` - Менеджер (создание документов, сверка)
- `viewer` - Просмотр (только чтение)

---

### 7. **verification_documents** (Документы проверки объемов)
Основной документ для сверки

| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID | Уникальный идентификатор |
| doc_number | VARCHAR(50) | Номер документа |
| doc_date | DATE | Дата документа |
| period | VARCHAR(50) | Период (например "Сентябрь 2025") |
| organization_id | UUID | FK → organizations |
| counterparty_id | UUID | FK → counterparties |
| contract_number | VARCHAR(100) | Номер договора |
| status | ENUM | Статус документа |
| created_by_id | UUID | FK → users (кто создал) |
| created_at | TIMESTAMP | Дата создания |
| updated_at | TIMESTAMP | Дата обновления |

**Индексы:**
- UNIQUE(doc_number)
- INDEX(organization_id)
- INDEX(counterparty_id)
- INDEX(status)
- INDEX(period)

**Статусы документа:**
- `DRAFT` - Черновик
- `IN_PROGRESS` - В работе
- `COMPLETED` - Завершен
- `CANCELLED` - Отменен

---

### 8. **waybill_items** (Строки путевых листов)
Табличная часть документа проверки

| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID | Уникальный идентификатор |
| document_id | UUID | FK → verification_documents |
| pl_number | VARCHAR(50) | Номер путевого листа |
| date_pl | DATE | Дата ПЛ |
| time_start | TIMESTAMP | Время начала работы |
| time_end | TIMESTAMP | Время окончания работы |
| position_id | UUID | FK → positions |
| vehicle_id | UUID | FK → vehicles |
| status_pl_id | UUID | FK → status_pl |
| **Наши данные (из 1С):** |
| work_hours | DECIMAL(10,2) | Время в работе, ч |
| mileage | DECIMAL(10,2) | Пробег, км |
| moto_hours | DECIMAL(10,2) | Моточасы, ч |
| standby_with_driver | DECIMAL(10,2) | Простой с водителем, ч |
| total_sum | DECIMAL(12,2) | Сумма, руб |
| **Данные заказчика (из Excel):** |
| customer_work_hours | DECIMAL(10,2) | Время в работе, ч |
| customer_mileage | DECIMAL(10,2) | Пробег, км |
| customer_moto_hours | DECIMAL(10,2) | Моточасы, ч |
| customer_standby | DECIMAL(10,2) | Простой с водителем, ч |
| customer_total_sum | DECIMAL(12,2) | Сумма, руб |
| **Общие поля:** |
| notes | TEXT | Заметки |
| accepted_by_id | UUID | FK → users (принявший) |
| decision | ENUM | Решение (accepted, rejected, pending) |
| created_at | TIMESTAMP | Дата создания |
| updated_at | TIMESTAMP | Дата обновления |

**Индексы:**
- INDEX(document_id)
- INDEX(pl_number)
- INDEX(vehicle_id)
- INDEX(position_id)

**Решения:**
- `PENDING` - Ожидает решения
- `ACCEPTED` - Принято
- `REJECTED` - Отклонено

---

## 🔗 СВЯЗИ

1. **verification_documents** → **organizations** (Many-to-One)
2. **verification_documents** → **counterparties** (Many-to-One)
3. **verification_documents** → **users** (Many-to-One, created_by)
4. **waybill_items** → **verification_documents** (Many-to-One)
5. **waybill_items** → **vehicles** (Many-to-One)
6. **waybill_items** → **positions** (Many-to-One)
7. **waybill_items** → **status_pl** (Many-to-One)
8. **waybill_items** → **users** (Many-to-One, accepted_by)

---

## 📊 СТАТИСТИКА

| Таблица | Ожидаемый объем |
|---------|-----------------|
| organizations | ~10-100 |
| counterparties | ~100-1000 |
| vehicles | ~1000-10000 |
| positions | ~100-500 |
| status_pl | ~5-10 |
| users | ~10-100 |
| verification_documents | ~1000+ |
| waybill_items | ~100000+ |

---

## 🔐 БЕЗОПАСНОСТЬ

1. **Пароли** хешируются через bcrypt
2. **UUID** вместо auto-increment для безопасности
3. **JWT токены** для аутентификации
4. **Роли** для разграничения доступа
5. **Индексы** для производительности

---

## 🚀 МИГРАЦИИ

Миграции будут созданы в директории `src/migrations/`:
1. `001_create_base_tables.ts` - Базовые справочники
2. `002_create_documents.ts` - Документы
3. `003_create_indexes.ts` - Индексы
4. `004_seed_initial_data.ts` - Начальные данные

