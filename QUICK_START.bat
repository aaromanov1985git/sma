@echo off
chcp 65001 >nul
echo ====================================
echo Быстрый старт проекта SMA
echo ====================================
echo.

REM Проверка наличия Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ОШИБКА] Node.js не установлен!
    echo Скачайте и установите Node.js с https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js найден
node --version
npm --version
echo.

REM Определение текущей директории
set "CURRENT_DIR=%~dp0"
echo Текущая директория: %CURRENT_DIR%
echo.

REM Проверка наличия кириллицы в пути
echo %CURRENT_DIR% | findstr /R "[А-Яа-я]" >nul
if %errorlevel% equ 0 (
    echo [ПРЕДУПРЕЖДЕНИЕ] Путь содержит кириллицу!
    echo Рекомендуется скопировать проект в папку без кириллицы.
    echo.
    echo Например: C:\projects\sma
    echo.
    choice /C YN /M "Продолжить установку несмотря на это?"
    if errorlevel 2 exit /b 0
)

REM Проверка наличия node_modules
if exist node_modules (
    echo [INFO] Папка node_modules уже существует
    choice /C YN /M "Переустановить зависимости?"
    if errorlevel 2 goto :skip_install
    
    echo Удаление node_modules...
    rmdir /s /q node_modules
    if exist package-lock.json del package-lock.json
)

:install
echo.
echo ====================================
echo Установка зависимостей...
echo ====================================
echo.
echo Это может занять несколько минут...
echo.

REM Попытка 1: Обычная установка
npm install
if %errorlevel% equ 0 goto :success

echo.
echo [ВНИМАНИЕ] Ошибка при установке. Пробуем альтернативный метод...
echo.

REM Попытка 2: С очисткой кеша
npm cache clean --force
npm install --no-optional --legacy-peer-deps
if %errorlevel% equ 0 goto :success

echo.
echo [ОШИБКА] Не удалось установить зависимости
echo.
echo Попробуйте:
echo 1. Скопировать проект в папку без кириллицы (C:\projects\sma)
echo 2. Запустить от имени администратора
echo 3. Временно отключить антивирус
echo 4. См. подробности в INSTALLATION.md
echo.
pause
exit /b 1

:success
echo.
echo ====================================
echo ✓ Установка завершена успешно!
echo ====================================
echo.

:skip_install
echo.
choice /C YN /M "Запустить dev-сервер?"
if errorlevel 2 (
    echo.
    echo Для запуска сервера вручную используйте: npm run dev
    pause
    exit /b 0
)

echo.
echo ====================================
echo Запуск dev-сервера...
echo ====================================
echo.
echo Сервер будет доступен по адресу: http://localhost:3000
echo.
echo Для остановки нажмите Ctrl+C
echo.

npm run dev

pause

