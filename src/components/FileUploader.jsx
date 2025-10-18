import React, { useState, useCallback, useRef } from 'react';
import { Upload, FileText, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useWaybillStore from '../store/useWaybillStore';
import { parseExcelFile } from '../utils/excelParser';

/**
 * Компонент загрузки Excel файлов
 */
const FileUploader = () => {
  const { uploadedFile, setUploadedFile, setCustomerData } = useWaybillStore();
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef(null);

  const handleFileUpload = useCallback(
    async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Отменяем предыдущую загрузку, если она есть
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }

      setLoading(true);
      setUploadedFile(file);

      // Создаем AbortController для возможности отмены
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        const data = await parseExcelFile(file, abortController.signal);
        
        // Проверяем, не была ли операция отменена
        if (abortController.signal.aborted) {
          return;
        }

        setCustomerData(data);
        toast.success(`Успешно загружено ${data.length} записей`);
      } catch (error) {
        // Игнорируем ошибки отмены
        if (error.name === 'AbortError') {
          return;
        }
        
        console.error('Error parsing file:', error);
        toast.error(error.message || 'Ошибка при обработке файла');
        setUploadedFile(null);
      } finally {
        setLoading(false);
        abortControllerRef.current = null;
      }

      // Сброс input для возможности загрузки того же файла
      event.target.value = '';
    },
    [setUploadedFile, setCustomerData]
  );

  return (
    <div className="card mb-8 animate-slide-up">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Upload className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="font-semibold text-gray-800">Загрузка данных заказчика</h3>
            <p className="text-sm text-gray-600">Excel-файл с подтверждёнными объёмами</p>
          </div>
        </div>

        <div className="flex gap-3">
          <label
            className={`btn-primary cursor-pointer ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Обработка...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                Выбрать файл
              </>
            )}
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
              disabled={loading}
            />
          </label>
        </div>
      </div>

      {uploadedFile && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200 animate-fade-in">
          <p className="text-green-800 font-medium">
            Загружен файл: <span className="font-mono">{uploadedFile.name}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUploader;

