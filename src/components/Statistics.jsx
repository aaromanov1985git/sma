import React, { useMemo } from 'react';
import useWaybillStore from '../store/useWaybillStore';
import { compareDataArrays, calculateStatistics } from '../utils/dataComparison';

/**
 * Компонент статистики
 */
const Statistics = () => {
  const { monthlyDocument, customerData, acceptedVolumes, rejectedVolumes } = useWaybillStore();

  const stats = useMemo(() => {
    if (!monthlyDocument?.tablePart) {
      return {
        total: 0,
        matches: 0,
        deviations: 0,
        missing: 0,
        matchPercentage: 0,
      };
    }

    const compared = compareDataArrays(monthlyDocument.tablePart, customerData);
    return calculateStatistics(compared);
  }, [monthlyDocument, customerData]);

  return (
    <div className="text-sm text-gray-600 flex flex-wrap gap-x-4 gap-y-2">
      <div>
        Всего: <span className="font-semibold text-gray-800">{stats.total}</span>
      </div>
      <div>
        Сходятся:{' '}
        <span className="font-semibold text-green-600">
          {stats.matches} ({stats.matchPercentage}%)
        </span>
      </div>
      <div>
        Отклонения: <span className="font-semibold text-yellow-600">{stats.deviations}</span>
      </div>
      <div>
        Нет данных: <span className="font-semibold text-red-600">{stats.missing}</span>
      </div>
      <div>
        Принято: <span className="font-semibold text-green-600">{acceptedVolumes.size}</span>
      </div>
      <div>
        Отклонено: <span className="font-semibold text-red-600">{rejectedVolumes.size}</span>
      </div>
    </div>
  );
};

export default Statistics;

