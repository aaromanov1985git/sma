import React, { useMemo } from 'react';
import {
  Filter,
  CheckSquare,
  XCircle,
  Calendar,
  Car,
  User,
  RotateCcw,
} from 'lucide-react';
import useWaybillStore from '../store/useWaybillStore';
import { useDebounce } from '../utils/hooks';
import { compareDataArrays, calculateStatistics } from '../utils/dataComparison';

/**
 * Компонент панели фильтров
 */
const FilterPanel = () => {
  const {
    filter,
    setFilter,
    searchDate,
    setSearchDate,
    searchTS,
    setSearchTS,
    searchDriver,
    setSearchDriver,
    monthlyDocument,
    customerData,
    acceptAllFiltered,
    rejectAllFiltered,
    resetFilters,
  } = useWaybillStore();

  // Debounce для поисковых полей
  const debouncedSearchDate = useDebounce(searchDate, 300);
  const debouncedSearchTS = useDebounce(searchTS, 300);
  const debouncedSearchDriver = useDebounce(searchDriver, 300);

  // Мемоизированные данные сравнения
  const comparedData = useMemo(() => {
    if (!monthlyDocument?.tablePart) return [];
    return compareDataArrays(monthlyDocument.tablePart, customerData);
  }, [monthlyDocument, customerData]);

  // Статистика
  const stats = useMemo(() => calculateStatistics(comparedData), [comparedData]);

  const handleAcceptAll = () => {
    const plNumbers = comparedData
      .filter((item) => item.customerData)
      .map((item) => item.plNumber);
    acceptAllFiltered(plNumbers);
  };

  const handleRejectAll = () => {
    const plNumbers = comparedData
      .filter((item) => item.customerData)
      .map((item) => item.plNumber);
    rejectAllFiltered(plNumbers);
  };

  if (customerData.length === 0) return null;

  return (
    <div className="card mb-8 animate-slide-up">
      {/* Основные фильтры */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="text-gray-700 font-medium">Фильтр:</span>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Все ({stats.total})
          </button>
          <button
            onClick={() => setFilter('matches')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              filter === 'matches'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Сходятся ({stats.matches})
          </button>
          <button
            onClick={() => setFilter('deviations')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              filter === 'deviations'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Отклонения ({stats.deviations + stats.missing})
          </button>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button onClick={resetFilters} className="btn-primary text-sm">
            <RotateCcw className="w-4 h-4" />
            Сбросить
          </button>
          <button onClick={handleAcceptAll} className="btn-success text-sm">
            <CheckSquare className="w-4 h-4" />
            Принять все
          </button>
          <button onClick={handleRejectAll} className="btn-danger text-sm">
            <XCircle className="w-4 h-4" />
            Отклонить все
          </button>
        </div>
      </div>

      {/* Поисковые фильтры */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-600 flex-shrink-0" />
          <input
            type="text"
            placeholder="Фильтр по дате"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="flex items-center gap-2">
          <Car className="w-5 h-5 text-gray-600 flex-shrink-0" />
          <input
            type="text"
            placeholder="Фильтр по ТС (Гос.№ / Гар.№)"
            value={searchTS}
            onChange={(e) => setSearchTS(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-gray-600 flex-shrink-0" />
          <input
            type="text"
            placeholder="Фильтр по водителю"
            value={searchDriver}
            onChange={(e) => setSearchDriver(e.target.value)}
            className="input-field"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;

