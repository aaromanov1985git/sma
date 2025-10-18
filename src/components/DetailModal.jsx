import React from 'react';
import { X, ThumbsUp, ThumbsDown, MapPin, RefreshCw } from 'lucide-react';
import useWaybillStore from '../store/useWaybillStore';
import { useLockBodyScroll, useKeyPress } from '../utils/hooks';

/**
 * Компонент модального окна с деталями путевого листа
 */
const DetailModal = ({ item, onClose }) => {
  const { acceptVolume, rejectVolume } = useWaybillStore();

  // Блокируем прокрутку body при открытии модального окна
  useLockBodyScroll(true);

  // Закрытие на Escape
  useKeyPress('Escape', onClose);

  if (!item) return null;

  const handleAccept = () => {
    acceptVolume(item.plNumber);
    onClose();
  };

  const handleReject = () => {
    rejectVolume(item.plNumber);
    onClose();
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

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 modal-backdrop"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-800">
              Детали путевого листа: {item.plNumber}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Основные данные */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Ваши данные */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
                Ваши данные (из 1С)
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Дата:</span> {item.datePL}
                </div>
                <div>
                  <span className="font-medium">Время начала:</span> {item.timeStart}
                </div>
                <div>
                  <span className="font-medium">Время окончания:</span> {item.timeEnd}
                </div>
                <div>
                  <span className="font-medium">№ позиции:</span> {item.position}
                </div>
                <div>
                  <span className="font-medium">Статус ПЛ:</span> {item.statusPL}
                </div>
                <div>
                  <span className="font-medium">ТС:</span> {item.markModel} {item.govNumber}
                </div>
                <div>
                  <span className="font-medium">Гар. №:</span> {item.garNumber}
                </div>
                <div>
                  <span className="font-medium">Заметки:</span> {item.notes || 'Нет'}
                </div>
                <div>
                  <span className="font-medium">Принявший:</span> {item.acceptedBy}
                </div>
                <div className="pt-2 border-t border-blue-200 mt-2">
                  <div>
                    <span className="font-medium">Время в работе:</span> {item.workHours} ч
                  </div>
                  <div>
                    <span className="font-medium">Пробег:</span> {item.mileage} км
                  </div>
                  <div>
                    <span className="font-medium">ВНО:</span> {item.motoHours} ч
                  </div>
                  <div>
                    <span className="font-medium">Дежурство:</span> {item.standbyWithDriver} ч
                  </div>
                  <div>
                    <span className="font-medium">Стоимость:</span>{' '}
                    {item.totalSum.toLocaleString('ru-RU')} ₽
                  </div>
                </div>
              </div>
            </div>

            {/* Данные заказчика */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-3 h-3 bg-green-600 rounded-full"></span>
                Данные заказчика
              </h4>
              {item.customerData ? (
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Дата:</span>{' '}
                    {item.customerData.datePL || item.datePL}
                  </div>
                  <div>
                    <span className="font-medium">Время начала:</span>{' '}
                    {item.customerData.timeStart || item.timeStart}
                  </div>
                  <div>
                    <span className="font-medium">Время окончания:</span>{' '}
                    {item.customerData.timeEnd || item.timeEnd}
                  </div>
                  <div>
                    <span className="font-medium">№ позиции:</span>{' '}
                    {item.customerData.position || item.position}
                  </div>
                  <div>
                    <span className="font-medium">Статус ПЛ:</span>{' '}
                    {item.customerData.statusPL || item.statusPL}
                  </div>
                  <div>
                    <span className="font-medium">ТС:</span>{' '}
                    {item.customerData.markModel || item.markModel}{' '}
                    {item.customerData.govNumber || item.govNumber}
                  </div>
                  <div>
                    <span className="font-medium">Гар. №:</span>{' '}
                    {item.customerData.garNumber || item.garNumber}
                  </div>
                  <div>
                    <span className="font-medium">Заметки:</span>{' '}
                    {item.customerData.notes || item.notes || 'Нет'}
                  </div>
                  <div>
                    <span className="font-medium">Принявший:</span>{' '}
                    {item.customerData.acceptedBy || item.acceptedBy}
                  </div>
                  <div className="pt-2 border-t border-green-200 mt-2">
                    <div>
                      <span className="font-medium">Время в работе:</span>{' '}
                      {item.customerData.workHours} ч
                    </div>
                    <div>
                      <span className="font-medium">Пробег:</span> {item.customerData.mileage} км
                    </div>
                    <div>
                      <span className="font-medium">ВНО:</span> {item.customerData.motoHours} ч
                    </div>
                    <div>
                      <span className="font-medium">Дежурство:</span>{' '}
                      {item.customerData.standbyWithDriver} ч
                    </div>
                    <div>
                      <span className="font-medium">Стоимость:</span>{' '}
                      {item.customerData.totalSum.toLocaleString('ru-RU')} ₽
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-red-600 text-center py-8">
                  Нет данных от заказчика для этого путевого листа
                </div>
              )}
            </div>
          </div>

          {/* Сравнение компонентов */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3">Сравнение компонентов</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-medium text-gray-700 mb-1">Время в работе:</div>
                <div className="text-lg">
                  {item.customerData ? (
                    getComponentStatus(item.workHours, item.customerData.workHours)
                  ) : (
                    <span className="text-red-600">Нет данных</span>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-medium text-gray-700 mb-1">Пробег:</div>
                <div className="text-lg">
                  {item.customerData ? (
                    getComponentStatus(item.mileage, item.customerData.mileage)
                  ) : (
                    <span className="text-red-600">Нет данных</span>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-medium text-gray-700 mb-1">ВНО:</div>
                <div className="text-lg">
                  {item.customerData ? (
                    getComponentStatus(item.motoHours, item.customerData.motoHours)
                  ) : (
                    <span className="text-red-600">Нет данных</span>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-medium text-gray-700 mb-1">Дежурство:</div>
                <div className="text-lg">
                  {item.customerData ? (
                    getComponentStatus(item.standbyWithDriver, item.customerData.standbyWithDriver)
                  ) : (
                    <span className="text-red-600">Нет данных</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Мини карта */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-800">Мини карта с треком</h4>
              <button
                onClick={() => alert('Получение данных о треке...')}
                className="btn-primary text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Получить данные
              </button>
            </div>
            <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Карта с треком будет здесь</p>
                <p className="text-sm text-gray-500">Для получения данных нажмите "Получить данные"</p>
              </div>
            </div>
          </div>

          {/* Действия */}
          <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
            <button onClick={handleReject} className="btn-danger">
              <ThumbsDown className="w-4 h-4" />
              Отклонить ПЛ
            </button>
            <button onClick={handleAccept} className="btn-success">
              <ThumbsUp className="w-4 h-4" />
              Принять ПЛ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;

