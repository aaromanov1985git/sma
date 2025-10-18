/**
 * Сравнение двух чисел с учётом погрешности
 * @param {number} val1 - Первое значение
 * @param {number} val2 - Второе значение
 * @param {number} tolerance - Допустимая погрешность
 * @returns {boolean}
 */
export const numbersAreEqual = (val1, val2, tolerance = 0.01) => {
  return Math.abs(val1 - val2) < tolerance;
};

/**
 * Сравнение данных путевого листа
 * @param {Object} yourItem - Ваши данные
 * @param {Object} customerItem - Данные заказчика
 * @returns {Object} - Результат сравнения
 */
export const compareWaybillItem = (yourItem, customerItem) => {
  if (!customerItem) {
    return {
      ...yourItem,
      customerData: null,
      hasDeviations: true,
      deviations: {
        workHours: true,
        mileage: true,
        motoHours: true,
        standbyWithDriver: true,
      },
      status: 'missing',
    };
  }

  const deviations = {
    workHours: !numbersAreEqual(yourItem.workHours, customerItem.workHours),
    mileage: !numbersAreEqual(yourItem.mileage, customerItem.mileage),
    motoHours: !numbersAreEqual(yourItem.motoHours, customerItem.motoHours),
    standbyWithDriver: !numbersAreEqual(
      yourItem.standbyWithDriver,
      customerItem.standbyWithDriver
    ),
  };

  const hasDeviations = Object.values(deviations).some(Boolean);

  return {
    ...yourItem,
    customerData: customerItem,
    hasDeviations,
    deviations,
    status: hasDeviations ? 'deviation' : 'match',
  };
};

/**
 * Сравнение массива данных
 * @param {Array} yourData - Ваши данные
 * @param {Array} customerData - Данные заказчика
 * @returns {Array} - Массив сравнений
 */
export const compareDataArrays = (yourData, customerData) => {
  return yourData.map((yourItem) => {
    const customerItem = customerData.find(
      (c) => c.plNumber === yourItem.plNumber
    );
    return compareWaybillItem(yourItem, customerItem);
  });
};

/**
 * Фильтрация данных по критериям
 * @param {Array} data - Данные для фильтрации
 * @param {Object} filters - Объект с фильтрами
 * @returns {Array} - Отфильтрованные данные
 */
export const filterData = (data, filters) => {
  let filtered = [...data];

  // Фильтр по статусу
  if (filters.status === 'matches') {
    filtered = filtered.filter((item) => item.status === 'match');
  } else if (filters.status === 'deviations') {
    filtered = filtered.filter((item) => item.status !== 'match');
  }

  // Фильтр по дате
  if (filters.searchDate) {
    filtered = filtered.filter((item) =>
      item.datePL.toLowerCase().includes(filters.searchDate.toLowerCase())
    );
  }

  // Фильтр по ТС
  if (filters.searchTS) {
    const searchTerm = filters.searchTS.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.govNumber.toLowerCase().includes(searchTerm) ||
        item.garNumber.toLowerCase().includes(searchTerm) ||
        item.markModel.toLowerCase().includes(searchTerm)
    );
  }

  // Фильтр по водителю
  if (filters.searchDriver) {
    const searchTerm = filters.searchDriver.toLowerCase();
    filtered = filtered.filter((item) =>
      item.acceptedBy.toLowerCase().includes(searchTerm)
    );
  }

  return filtered;
};

/**
 * Сортировка данных
 * @param {Array} data - Данные для сортировки
 * @param {string} key - Ключ для сортировки
 * @param {string} direction - Направление ('asc' | 'desc')
 * @returns {Array} - Отсортированные данные
 */
export const sortData = (data, key, direction = 'asc') => {
  if (!key) return data;

  return [...data].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal === bVal) return 0;

    const comparison = aVal > bVal ? 1 : -1;
    return direction === 'asc' ? comparison : -comparison;
  });
};

/**
 * Пагинация данных
 * @param {Array} data - Данные
 * @param {number} page - Номер страницы
 * @param {number} itemsPerPage - Элементов на странице
 * @returns {Object} - Объект с данными страницы и метаинформацией
 */
export const paginateData = (data, page, itemsPerPage) => {
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentPage = Math.min(Math.max(1, page), totalPages || 1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageData = data.slice(startIndex, endIndex);

  return {
    data: pageData,
    currentPage,
    totalPages,
    totalItems,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};

/**
 * Подсчёт статистики по данным
 * @param {Array} data - Данные
 * @returns {Object} - Статистика
 */
export const calculateStatistics = (data) => {
  const total = data.length;
  const matches = data.filter((d) => d.status === 'match').length;
  const deviations = data.filter((d) => d.status === 'deviation').length;
  const missing = data.filter((d) => d.status === 'missing').length;

  return {
    total,
    matches,
    deviations,
    missing,
    matchPercentage: total > 0 ? ((matches / total) * 100).toFixed(1) : 0,
  };
};

