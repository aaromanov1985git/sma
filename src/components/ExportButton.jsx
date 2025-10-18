import React, { useMemo } from 'react';
import { Download } from 'lucide-react';
import toast from 'react-hot-toast';
import useWaybillStore from '../store/useWaybillStore';
import { compareDataArrays } from '../utils/dataComparison';
import { exportToExcel } from '../utils/excelParser';

/**
 * Компонент кнопки экспорта данных
 */
const ExportButton = () => {
  const { monthlyDocument, customerData, acceptedVolumes, rejectedVolumes } = useWaybillStore();

  const exportData = useMemo(() => {
    if (!monthlyDocument?.tablePart) return [];

    const compared = compareDataArrays(monthlyDocument.tablePart, customerData);

    return compared.map((item) => ({
      'Путевой лист': item.plNumber,
      Дата: item.datePL,
      'Время начала': item.timeStart,
      'Время окончания': item.timeEnd,
      '№ позиции': item.position,
      'Статус ПЛ': item.statusPL,
      'Марка/Модель': item.markModel,
      'Гос. №': item.govNumber,
      'Гар. №': item.garNumber,
      Заметки: item.notes,
      Принявший: item.acceptedBy,
      'Работа (наши)': item.workHours,
      'Работа (заказчик)': item.customerData?.workHours || '',
      'Пробег (наши)': item.mileage,
      'Пробег (заказчик)': item.customerData?.mileage || '',
      'ВНО (наши)': item.motoHours,
      'ВНО (заказчик)': item.customerData?.motoHours || '',
      'Дежурство (наши)': item.standbyWithDriver,
      'Дежурство (заказчик)': item.customerData?.standbyWithDriver || '',
      'Стоимость (заказчик)': item.customerData?.totalSum || '',
      Статус: acceptedVolumes.has(item.plNumber)
        ? 'Принято'
        : rejectedVolumes.has(item.plNumber)
        ? 'Отклонено'
        : 'Ожидает решения',
      'Статус сверки':
        item.status === 'match'
          ? 'Сходятся'
          : item.status === 'deviation'
          ? 'Отклонения'
          : 'Нет данных',
    }));
  }, [monthlyDocument, customerData, acceptedVolumes, rejectedVolumes]);

  const handleExport = () => {
    try {
      if (exportData.length === 0) {
        toast.error('Нет данных для экспорта');
        return;
      }

      const filename = `Сверка_${monthlyDocument?.period || 'документ'}_${new Date().toLocaleDateString('ru-RU')}.xlsx`;
      exportToExcel(exportData, filename);
      toast.success('Данные успешно экспортированы');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Ошибка при экспорте данных');
    }
  };

  if (customerData.length === 0) return null;

  return (
    <button onClick={handleExport} className="btn-primary">
      <Download className="w-4 h-4" />
      Экспорт в Excel
    </button>
  );
};

export default ExportButton;

