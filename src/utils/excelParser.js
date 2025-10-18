import * as XLSX from 'xlsx';

/**
 * Константы для ограничений
 */
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_ROWS = 10000; // Максимум 10000 строк

/**
 * Конвертация Excel Serial Date в обычную дату
 * @param {number|string} excelDate - Excel serial date или строка даты
 * @returns {string} - Форматированная дата
 */
export const convertExcelDate = (excelDate) => {
  if (!excelDate) return '';
  
  // Если уже строка в правильном формате, возвращаем как есть
  if (typeof excelDate === 'string') {
    return excelDate;
  }
  
  // Если число - это Excel Serial Date
  if (typeof excelDate === 'number') {
    // Excel считает даты с 1 января 1900 (с учетом бага в 1900 году)
    const date = new Date((excelDate - 25569) * 86400 * 1000);
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}.${month}.${year}`;
  }
  
  return String(excelDate);
};

/**
 * Валидация российского гос. номера
 * @param {string} govNumber - Гос. номер
 * @returns {boolean} - Валиден ли номер
 */
export const validateGovNumber = (govNumber) => {
  if (!govNumber) return false;
  
  // Упрощенная проверка российских номеров
  // Формат: А123БВ777 или A123BV777
  const pattern = /^[АВЕКМНОРСТУХ]\d{3}[АВЕКМНОРСТУХ]{2}\d{2,3}$/i;
  
  return pattern.test(govNumber.replace(/\s/g, ''));
};

/**
 * Валидация структуры Excel файла
 * @param {Array} headers - Заголовки из Excel
 * @returns {Object} - Результат валидации
 */
export const validateExcelStructure = (headers) => {
  const requiredHeaders = [
    '№ ПЛ',
    'Дата ПЛ',
    'Марка, модель',
    'Гос. №',
    'Часы, мч',
    'Пробег, км',
    'Моточасы, мтч',
    'Простой с водителем, мч',
  ];

  const missingHeaders = requiredHeaders.filter(
    (header) => !headers.includes(header)
  );

  return {
    isValid: missingHeaders.length === 0,
    missingHeaders,
  };
};

/**
 * Парсинг Excel файла с путевыми листами
 * @param {File} file - Загруженный Excel файл
 * @param {AbortSignal} signal - Сигнал для отмены операции
 * @returns {Promise<Array>} - Массив распарсенных данных
 */
export const parseExcelFile = (file, signal = null) => {
  return new Promise((resolve, reject) => {
    // Проверка размера файла
    if (file.size > MAX_FILE_SIZE) {
      reject(new Error(`Файл слишком большой. Максимальный размер: ${MAX_FILE_SIZE / 1024 / 1024} МБ`));
      return;
    }

    // Проверка формата файла
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      reject(new Error('Неверный формат файла. Поддерживаются только .xlsx и .xls'));
      return;
    }

    const reader = new FileReader();

    // Обработка отмены через AbortSignal
    const handleAbort = () => {
      reader.abort();
      reject(new DOMException('Загрузка файла отменена', 'AbortError'));
    };

    if (signal) {
      if (signal.aborted) {
        reject(new DOMException('Загрузка файла отменена', 'AbortError'));
        return;
      }
      signal.addEventListener('abort', handleAbort);
    }

    reader.onload = (e) => {
      // Удаляем обработчик отмены после завершения
      if (signal) {
        signal.removeEventListener('abort', handleAbort);
      }

      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          reject(new Error('Excel файл не содержит листов'));
          return;
        }

        const mainSheetName = workbook.SheetNames[0];
        const mainWorksheet = workbook.Sheets[mainSheetName];
        const mainJsonData = XLSX.utils.sheet_to_json(mainWorksheet, { header: 1 });

        if (mainJsonData.length < 2) {
          reject(new Error('Файл пустой или содержит только заголовки'));
          return;
        }

        // Проверка количества строк
        if (mainJsonData.length - 1 > MAX_ROWS) {
          reject(new Error(`Слишком много строк в файле. Максимум: ${MAX_ROWS} строк`));
          return;
        }

        const mainHeaders = mainJsonData[0].map((h) => h?.toString().trim());
        
        // Валидация структуры
        const validation = validateExcelStructure(mainHeaders);
        if (!validation.isValid) {
          reject(
            new Error(
              `Отсутствуют обязательные колонки: ${validation.missingHeaders.join(', ')}`
            )
          );
          return;
        }

        const mainRows = mainJsonData.slice(1);

        // Маппинг колонок
        const mainColMap = {
          do: mainHeaders.findIndex((h) => h === 'ДО'),
          planWork: mainHeaders.findIndex((h) => h === 'План. работы'),
          factWork: mainHeaders.findIndex((h) => h === 'Факт. работы'),
          datePL: mainHeaders.findIndex((h) => h === 'Дата ПЛ'),
          timeStart: mainHeaders.findIndex((h) => h === 'Время начала работы'),
          timeEnd: mainHeaders.findIndex((h) => h === 'Время окончания работы'),
          position: mainHeaders.findIndex((h) => h === '№ позиции*'),
          contractor: mainHeaders.findIndex((h) => h === 'Подрядчик'),
          contractNumber: mainHeaders.findIndex((h) => h === '№ Договора'),
          plNumber: mainHeaders.findIndex((h) => h === '№ ПЛ'),
          coreNumber: mainHeaders.findIndex((h) => h === '№ корешка'),
          statusPL: mainHeaders.findIndex((h) => h === 'Статус ПЛ'),
          markModel: mainHeaders.findIndex((h) => h === 'Марка, модель'),
          govNumber: mainHeaders.findIndex((h) => h === 'Гос. №'),
          garNumber: mainHeaders.findIndex((h) => h === 'Гар. №'),
          shifts: mainHeaders.findIndex((h) => h === 'Кол-во смен по ПЛ'),
          workHours: mainHeaders.findIndex((h) => h === 'Часы, мч'),
          mileage: mainHeaders.findIndex((h) => h === 'Пробег, км'),
          motoHours: mainHeaders.findIndex((h) => h === 'Моточасы, мтч'),
          standbyWithDriver: mainHeaders.findIndex((h) => h === 'Простой с водителем, мч'),
          totalSum: mainHeaders.findIndex((h) => h === 'Всего сумма, руб.'),
          notes: mainHeaders.findIndex((h) => h === 'Заметки'),
          acceptedBy: mainHeaders.findIndex((h) => h === 'Принявший пользователь'),
        };

        // Парсинг данных с улучшенной валидацией
        const processedData = mainRows
          .map((row, index) => {
            if (!row || row.length === 0) return null;

            const getVal = (colIndex) => {
              if (colIndex === -1) return '';
              const val = row[colIndex];
              return val !== undefined && val !== null ? val.toString().trim() : '';
            };

            const getNum = (colIndex) => {
              if (colIndex === -1) return 0;
              const val = row[colIndex];
              
              // Строгая валидация числа
              if (typeof val === 'number') {
                if (!isFinite(val)) {
                  console.warn(`Строка ${index + 2}: недопустимое число в колонке ${colIndex}`);
                  return 0;
                }
                return val;
              }
              
              if (typeof val === 'string') {
                const parsed = parseFloat(val.replace(/,/g, '.').replace(/\s/g, ''));
                if (isNaN(parsed) || !isFinite(parsed)) {
                  return 0;
                }
                return parsed;
              }
              
              return 0;
            };

            const plNumber = getVal(mainColMap.plNumber);
            if (!plNumber) {
              console.warn(`Строка ${index + 2}: отсутствует номер ПЛ, пропускаем`);
              return null;
            }

            // Конвертация дат
            const datePL = convertExcelDate(row[mainColMap.datePL] || '');
            
            // Получаем гос. номер и проверяем его (с предупреждением, но не блокируем)
            const govNumber = getVal(mainColMap.govNumber);
            if (govNumber && !validateGovNumber(govNumber)) {
              console.warn(`Строка ${index + 2}: гос. номер "${govNumber}" не соответствует формату`);
            }

            return {
              do: getVal(mainColMap.do),
              planWork: getVal(mainColMap.planWork),
              factWork: getVal(mainColMap.factWork),
              datePL,
              timeStart: getVal(mainColMap.timeStart),
              timeEnd: getVal(mainColMap.timeEnd),
              position: getVal(mainColMap.position),
              contractor: getVal(mainColMap.contractor),
              contractNumber: getVal(mainColMap.contractNumber),
              plNumber,
              coreNumber: getVal(mainColMap.coreNumber),
              statusPL: getVal(mainColMap.statusPL),
              markModel: getVal(mainColMap.markModel),
              govNumber,
              garNumber: getVal(mainColMap.garNumber),
              shifts: getNum(mainColMap.shifts),
              workHours: getNum(mainColMap.workHours),
              mileage: getNum(mainColMap.mileage),
              motoHours: getNum(mainColMap.motoHours),
              standbyWithDriver: getNum(mainColMap.standbyWithDriver),
              totalSum: getNum(mainColMap.totalSum),
              notes: getVal(mainColMap.notes),
              acceptedBy: getVal(mainColMap.acceptedBy),
            };
          })
          .filter(Boolean);

        if (processedData.length === 0) {
          reject(new Error('Не удалось извлечь данные из файла'));
          return;
        }

        // Проверка на дубликаты путевых листов
        const plNumbersSet = new Set();
        const duplicates = [];
        
        processedData.forEach((item) => {
          if (plNumbersSet.has(item.plNumber)) {
            duplicates.push(item.plNumber);
          } else {
            plNumbersSet.add(item.plNumber);
          }
        });

        if (duplicates.length > 0) {
          console.warn(`Обнаружены дубликаты путевых листов: ${duplicates.join(', ')}`);
          console.warn('Будет использована первая запись для каждого дубликата');
        }

        // Удаляем дубликаты, оставляя первое вхождение
        const uniqueData = processedData.filter((item, index, self) => {
          return index === self.findIndex((t) => t.plNumber === item.plNumber);
        });

        resolve(uniqueData);
      } catch (err) {
        reject(new Error(`Ошибка при обработке файла: ${err.message}`));
      }
    };

    reader.onerror = () => {
      // Удаляем обработчик отмены в случае ошибки
      if (signal) {
        signal.removeEventListener('abort', handleAbort);
      }
      reject(new Error('Ошибка при чтении файла'));
    };

    reader.readAsArrayBuffer(file);
  });
};

/**
 * Экспорт данных в Excel
 * @param {Array} data - Данные для экспорта
 * @param {string} filename - Имя файла
 */
export const exportToExcel = (data, filename = 'export.xlsx') => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Сверка');
  XLSX.writeFile(workbook, filename);
};

