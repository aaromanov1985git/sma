# Инструкция по установке

## Проблема с путем, содержащим кириллицу

При установке зависимостей npm может возникать ошибка `TAR_ENTRY_ERROR UNKNOWN` из-за пути с кириллическими символами.

## Решения (выберите одно)

### ✅ Решение 1: Перенести проект в путь без кириллицы (РЕКОМЕНДУЕТСЯ)

```cmd
REM Откройте обычную командную строку (cmd.exe, не PowerShell)
REM Создайте папку без кириллицы:
mkdir C:\projects
xcopy "G:\Мой диск\sma" "C:\projects\sma" /E /I /H /Y

REM Перейдите в новую папку:
cd C:\projects\sma

REM Установите зависимости:
npm install

REM Запустите проект:
npm run dev
```

### 🔧 Решение 2: Использовать короткий путь (8.3 формат)

```cmd
REM Откройте cmd.exe
cd /d G:\

REM Посмотрите короткое имя папки:
dir /x

REM Вы увидите что-то вроде:
REM MOYDIS~1    Мой диск

REM Используйте короткое имя:
cd MOYDIS~1\sma
npm install
```

### 🛠️ Решение 3: Очистить кеш и установить заново

```cmd
REM В cmd.exe (НЕ в PowerShell):
cd /d "G:\Мой диск\sma"
npm cache clean --force
npm install --no-optional --legacy-peer-deps
```

### 🔄 Решение 4: Установка через Yarn (альтернатива)

```cmd
REM Установите Yarn глобально:
npm install -g yarn

REM Установите зависимости через Yarn:
cd /d "G:\Мой диск\sma"
yarn install
yarn dev
```

### 🚫 Решение 5: Использовать Git Bash

```bash
# Откройте Git Bash
cd "/g/Мой диск/sma"
npm install
```

## После успешной установки

```bash
# Запустите dev-сервер:
npm run dev

# Откройте браузер:
http://localhost:3000
```

## Если ошибки продолжаются

1. **Проверьте версию Node.js:**
   ```bash
   node --version
   npm --version
   ```
   Требуется Node.js 18+ и npm 9+

2. **Обновите npm:**
   ```bash
   npm install -g npm@latest
   ```

3. **Временно отключите антивирус** (может блокировать запись)

4. **Запустите cmd.exe от имени администратора**

5. **Проверьте свободное место на диске** (требуется минимум 500 МБ)

## Ручная установка зависимостей (крайний случай)

Если ничего не помогает, создайте проект заново:

```bash
# В папке без кириллицы (например, C:\sma):
npm create vite@latest sma -- --template react
cd sma

# Замените src/ на наш src/
# Скопируйте файлы: package.json, tailwind.config.js, postcss.config.js и т.д.

npm install
npm run dev
```

## Структура после установки

После успешной установки должна быть такая структура:

```
sma/
├── node_modules/      ← Эта папка появится после npm install
├── src/
│   ├── components/
│   ├── store/
│   ├── utils/
│   ├── data/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Контакты для поддержки

Если проблемы продолжаются, опишите:
1. Версию Node.js (`node --version`)
2. Версию npm (`npm --version`)
3. Полный текст ошибки
4. Операционную систему

