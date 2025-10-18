import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import useWaybillStore from './store/useWaybillStore';
import { generateMonthlyDocument } from './data/mockData';
import Header from './components/Header';
import DocumentInfo from './components/DocumentInfo';
import FileUploader from './components/FileUploader';
import FilterPanel from './components/FilterPanel';
import DataTable from './components/DataTable';
import EmptyState from './components/EmptyState';
import DetailModal from './components/DetailModal';
import ExportButton from './components/ExportButton';

/**
 * Главный компонент приложения
 */
export default function App() {
  const { monthlyDocument, setMonthlyDocument, customerData, selectedItem, setSelectedItem } =
    useWaybillStore();

  // Инициализация демо-документа при первой загрузке
  useEffect(() => {
    if (!monthlyDocument) {
      setMonthlyDocument(generateMonthlyDocument());
    }
  }, [monthlyDocument, setMonthlyDocument]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Header />

        {/* Document Info */}
        <DocumentInfo />

        {/* File Uploader */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1">
            <FileUploader />
          </div>
          <ExportButton />
        </div>

        {/* Filter Panel */}
        <FilterPanel />

        {/* Data Table or Empty State */}
        {customerData.length > 0 ? <DataTable /> : <EmptyState />}

        {/* Detail Modal */}
        {selectedItem && (
          <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </div>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}

