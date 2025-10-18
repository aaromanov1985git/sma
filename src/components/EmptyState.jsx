import React from 'react';
import { FileText } from 'lucide-react';

/**
 * Компонент пустого состояния
 */
const EmptyState = () => {
  return (
    <div className="card text-center animate-slide-up">
      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Нет данных для сравнения</h3>
      <p className="text-gray-600 mb-6">
        Загрузите Excel-файл с данными заказчика для сравнения с вашими данными из 1С
      </p>
      <div className="bg-blue-50 rounded-lg p-6 text-left max-w-2xl mx-auto">
        <h4 className="font-semibold text-blue-800 mb-3">Как это работает:</h4>
        <ul className="text-sm text-blue-700 space-y-2">
          <li className="flex items-start gap-2">
            <span className="font-bold">•</span>
            <span>Создан ежемесячный документ с основными полями</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">•</span>
            <span>Организация = ваша компания, Контрагент = подрядчик</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">•</span>
            <span>Загрузите Excel-файл с данными заказчика</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">•</span>
            <span>Система автоматически сравнит объёмы по 4 компонентам</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">•</span>
            <span>Вы можете кликнуть на ПЛ для детального просмотра</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">•</span>
            <span>В деталях можно принять или отклонить ПЛ</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">•</span>
            <span>Есть фильтры: по дате, ТС (Гос.№ и Гар.№), водителю</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">•</span>
            <span>Поддерживается сортировка, пагинация и экспорт данных</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">•</span>
            <span>Данные автоматически сохраняются в localStorage</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default EmptyState;

