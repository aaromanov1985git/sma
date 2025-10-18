import React from 'react';
import useWaybillStore from '../store/useWaybillStore';

/**
 * Компонент информации о документе
 */
const DocumentInfo = () => {
  const { monthlyDocument, updateMonthlyDocumentField } = useWaybillStore();

  if (!monthlyDocument) return null;

  const handleChange = (field, value) => {
    updateMonthlyDocumentField(field, value);
  };

  return (
    <div className="card mb-8 animate-slide-up">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Основные данные документа</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Дата</label>
          <input
            type="text"
            value={monthlyDocument.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Организация</label>
          <input
            type="text"
            value={monthlyDocument.organization}
            onChange={(e) => handleChange('organization', e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Период</label>
          <input
            type="text"
            value={monthlyDocument.period}
            onChange={(e) => handleChange('period', e.target.value)}
            className="input-field"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Контрагент</label>
          <input
            type="text"
            value={monthlyDocument.contractor}
            onChange={(e) => handleChange('contractor', e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Договор</label>
          <input
            type="text"
            value={monthlyDocument.contract}
            onChange={(e) => handleChange('contract', e.target.value)}
            className="input-field"
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentInfo;

