import React from 'react';
import { CheckCircle, AlertCircle, XCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import useWaybillStore from '../store/useWaybillStore';

/**
 * Компонент строки таблицы
 */
const TableRow = ({ item }) => {
  const { acceptedVolumes, rejectedVolumes, acceptVolume, rejectVolume, setSelectedItem } =
    useWaybillStore();

  const getStatusIcon = (status) => {
    switch (status) {
      case 'match':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'deviation':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'missing':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'match':
        return 'Сходятся';
      case 'deviation':
        return 'Отклонения';
      case 'missing':
        return 'Нет данных';
      default:
        return 'Неизвестно';
    }
  };

  const getComponentStatus = (yourVal, customerVal) => {
    if (!customerVal && customerVal !== 0) {
      return <span className="text-red-600">Нет данных</span>;
    }
    if (Math.abs(yourVal - customerVal) < 0.01) {
      return <span className="text-green-600">{yourVal}</span>;
    }
    return (
      <span className="text-yellow-600 font-medium">
        {yourVal} → {customerVal}
      </span>
    );
  };

  const getActionButtons = () => {
    if (acceptedVolumes.has(item.plNumber)) {
      return (
        <div className="flex items-center justify-center gap-2">
          <ThumbsUp className="w-4 h-4 text-green-500" />
          <span className="text-green-600 text-sm">Принято</span>
        </div>
      );
    }
    if (rejectedVolumes.has(item.plNumber)) {
      return (
        <div className="flex items-center justify-center gap-2">
          <ThumbsDown className="w-4 h-4 text-red-500" />
          <span className="text-red-600 text-sm">Отклонено</span>
        </div>
      );
    }
    return (
      <div className="flex gap-2 justify-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            acceptVolume(item.plNumber);
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs transition-colors"
        >
          Принять
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            rejectVolume(item.plNumber);
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs transition-colors"
        >
          Отклонить
        </button>
      </div>
    );
  };

  return (
    <tr
      className="border-t border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={() => setSelectedItem(item)}
    >
      <td className="p-4 font-mono text-gray-800">{item.plNumber}</td>
      <td className="p-4 text-gray-700">{item.datePL}</td>
      <td className="p-4 font-mono text-gray-800">
        {item.markModel} {item.govNumber}
      </td>
      <td className="p-4 text-gray-700">{item.garNumber}</td>
      <td className="p-4 text-gray-700">{item.timeStart}</td>
      <td className="p-4 text-gray-700">{item.timeEnd}</td>
      <td className="p-4 text-gray-700">{item.position}</td>
      <td className="p-4 text-gray-700">{item.statusPL}</td>
      <td className="p-4 text-gray-700">{item.notes}</td>
      <td className="p-4 text-gray-700">{item.acceptedBy}</td>
      <td className="p-4 text-center">
        {item.customerData ? (
          getComponentStatus(item.workHours, item.customerData.workHours)
        ) : (
          <span className="text-red-600">Нет данных</span>
        )}
      </td>
      <td className="p-4 text-center">
        {item.customerData ? (
          getComponentStatus(item.mileage, item.customerData.mileage)
        ) : (
          <span className="text-red-600">Нет данных</span>
        )}
      </td>
      <td className="p-4 text-center">
        {item.customerData ? (
          getComponentStatus(item.motoHours, item.customerData.motoHours)
        ) : (
          <span className="text-red-600">Нет данных</span>
        )}
      </td>
      <td className="p-4 text-center">
        {item.customerData ? (
          getComponentStatus(item.standbyWithDriver, item.customerData.standbyWithDriver)
        ) : (
          <span className="text-red-600">Нет данных</span>
        )}
      </td>
      <td className="p-4 text-center">
        {item.customerData ? (
          <span className="text-green-600">
            {item.customerData.totalSum.toLocaleString('ru-RU')} ₽
          </span>
        ) : (
          <span className="text-red-600">Нет данных</span>
        )}
      </td>
      <td className="p-4 text-center">
        <div className="flex items-center justify-center gap-1">
          {getStatusIcon(item.status)}
          <span className="text-sm text-gray-600">{getStatusText(item.status)}</span>
        </div>
      </td>
      <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
        {getActionButtons()}
      </td>
    </tr>
  );
};

export default TableRow;

