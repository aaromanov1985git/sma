import React, { useMemo } from 'react';
import { ArrowUpDown } from 'lucide-react';
import useWaybillStore from '../store/useWaybillStore';
import {
  compareDataArrays,
  filterData,
  sortData,
  paginateData,
} from '../utils/dataComparison';
import TableRow from './TableRow';
import Pagination from './Pagination';
import Statistics from './Statistics';

/**
 * Компонент таблицы данных
 */
const DataTable = () => {
  const {
    monthlyDocument,
    customerData,
    filter,
    searchDate,
    searchTS,
    searchDriver,
    currentPage,
    itemsPerPage,
    sortConfig,
    setSortConfig,
  } = useWaybillStore();

  // Мемоизированные вычисления
  const processedData = useMemo(() => {
    if (!monthlyDocument?.tablePart) return { data: [], totalPages: 0, totalItems: 0 };

    // Сравнение
    const compared = compareDataArrays(monthlyDocument.tablePart, customerData);

    // Фильтрация
    const filtered = filterData(compared, {
      status: filter,
      searchDate,
      searchTS,
      searchDriver,
    });

    // Сортировка
    const sorted = sortData(filtered, sortConfig.key, sortConfig.direction);

    // Пагинация
    return paginateData(sorted, currentPage, itemsPerPage);
  }, [
    monthlyDocument,
    customerData,
    filter,
    searchDate,
    searchTS,
    searchDriver,
    currentPage,
    itemsPerPage,
    sortConfig,
  ]);

  const handleSort = (key) => {
    setSortConfig(key);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return (
      <ArrowUpDown
        className={`w-4 h-4 text-blue-600 ${
          sortConfig.direction === 'desc' ? 'rotate-180' : ''
        }`}
      />
    );
  };

  if (customerData.length === 0) return null;

  return (
    <div className="card overflow-hidden animate-slide-up">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="text-left p-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('plNumber')}
              >
                <div className="flex items-center gap-2">
                  Путевой лист
                  {getSortIcon('plNumber')}
                </div>
              </th>
              <th
                className="text-left p-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('datePL')}
              >
                <div className="flex items-center gap-2">
                  Дата
                  {getSortIcon('datePL')}
                </div>
              </th>
              <th className="text-left p-4 font-semibold text-gray-700">ТС</th>
              <th className="text-left p-4 font-semibold text-gray-700">Гар. №</th>
              <th className="text-left p-4 font-semibold text-gray-700">Время начала</th>
              <th className="text-left p-4 font-semibold text-gray-700">Время окончания</th>
              <th className="text-left p-4 font-semibold text-gray-700">№ позиции</th>
              <th className="text-left p-4 font-semibold text-gray-700">Статус ПЛ</th>
              <th className="text-left p-4 font-semibold text-gray-700">Заметки</th>
              <th className="text-left p-4 font-semibold text-gray-700">Принявший</th>
              <th
                className="text-center p-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('workHours')}
              >
                <div className="flex items-center justify-center gap-2">
                  Работа (ч)
                  {getSortIcon('workHours')}
                </div>
              </th>
              <th
                className="text-center p-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('mileage')}
              >
                <div className="flex items-center justify-center gap-2">
                  Пробег (км)
                  {getSortIcon('mileage')}
                </div>
              </th>
              <th className="text-center p-4 font-semibold text-gray-700">ВНО (ч)</th>
              <th className="text-center p-4 font-semibold text-gray-700">Дежурство (ч)</th>
              <th className="text-center p-4 font-semibold text-gray-700">Стоимость (руб.)</th>
              <th className="text-center p-4 font-semibold text-gray-700">Статус</th>
              <th className="text-center p-4 font-semibold text-gray-700">Действия</th>
            </tr>
          </thead>
          <tbody>
            {processedData.data.map((item, index) => (
              <TableRow key={item.plNumber || index} item={item} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-6 bg-gray-50 border-t border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <Statistics />
          <Pagination paginationData={processedData} />
        </div>
      </div>
    </div>
  );
};

export default DataTable;

