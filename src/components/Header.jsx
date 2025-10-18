import React from 'react';

/**
 * Компонент шапки приложения
 */
const Header = () => {
  return (
    <div className="text-center mb-8 animate-fade-in">
      <h1 className="text-4xl font-bold text-gray-800 mb-3">
        Ежемесячный документ: Проверка выполнения объёмов работ
      </h1>
      <p className="text-gray-600 text-lg">
        Загрузите Excel-файл с данными заказчика для сравнения с вашими данными из 1С
      </p>
    </div>
  );
};

export default Header;

