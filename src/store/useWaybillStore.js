import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Глобальное хранилище для управления данными путевых листов
 */
const useWaybillStore = create(
  persist(
    (set, get) => ({
      // Данные
      uploadedFile: null,
      customerData: [],
      monthlyDocument: null,
      acceptedVolumes: new Set(),
      rejectedVolumes: new Set(),
      
      // Фильтры
      filter: 'all',
      searchDate: '',
      searchTS: '',
      searchDriver: '',
      
      // UI состояние
      selectedItem: null,
      currentPage: 1,
      itemsPerPage: 10,
      sortConfig: { key: null, direction: 'asc' },
      
      // Действия
      setUploadedFile: (file) => set({ uploadedFile: file }),
      
      setCustomerData: (data) => set({ customerData: data }),
      
      setMonthlyDocument: (doc) => set({ monthlyDocument: doc }),
      
      updateMonthlyDocumentField: (field, value) => 
        set((state) => ({
          monthlyDocument: { ...state.monthlyDocument, [field]: value }
        })),
      
      setFilter: (filter) => set({ filter, currentPage: 1 }),
      
      setSearchDate: (date) => set({ searchDate: date, currentPage: 1 }),
      
      setSearchTS: (ts) => set({ searchTS: ts, currentPage: 1 }),
      
      setSearchDriver: (driver) => set({ searchDriver: driver, currentPage: 1 }),
      
      setSelectedItem: (item) => set({ selectedItem: item }),
      
      setCurrentPage: (page) => set({ currentPage: page }),
      
      setItemsPerPage: (items) => set({ itemsPerPage: items, currentPage: 1 }),
      
      setSortConfig: (key) => {
        const { sortConfig } = get();
        const direction = 
          sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
        set({ sortConfig: { key, direction } });
      },
      
      acceptVolume: (plNumber) => 
        set((state) => {
          const newAccepted = new Set(state.acceptedVolumes);
          newAccepted.add(plNumber);
          const newRejected = new Set(state.rejectedVolumes);
          newRejected.delete(plNumber);
          return { acceptedVolumes: newAccepted, rejectedVolumes: newRejected };
        }),
      
      rejectVolume: (plNumber) => 
        set((state) => {
          const newRejected = new Set(state.rejectedVolumes);
          newRejected.add(plNumber);
          const newAccepted = new Set(state.acceptedVolumes);
          newAccepted.delete(plNumber);
          return { acceptedVolumes: newAccepted, rejectedVolumes: newRejected };
        }),
      
      acceptAllFiltered: (plNumbers) =>
        set((state) => ({
          acceptedVolumes: new Set([...state.acceptedVolumes, ...plNumbers]),
          rejectedVolumes: new Set(
            [...state.rejectedVolumes].filter(pl => !plNumbers.includes(pl))
          ),
        })),
      
      rejectAllFiltered: (plNumbers) =>
        set((state) => ({
          rejectedVolumes: new Set([...state.rejectedVolumes, ...plNumbers]),
          acceptedVolumes: new Set(
            [...state.acceptedVolumes].filter(pl => !plNumbers.includes(pl))
          ),
        })),
      
      resetFilters: () => 
        set({
          filter: 'all',
          searchDate: '',
          searchTS: '',
          searchDriver: '',
          currentPage: 1,
        }),
      
      clearAll: () =>
        set({
          uploadedFile: null,
          customerData: [],
          acceptedVolumes: new Set(),
          rejectedVolumes: new Set(),
          selectedItem: null,
          currentPage: 1,
        }),
    }),
    {
      name: 'waybill-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        ...state,
        acceptedVolumes: [...state.acceptedVolumes],
        rejectedVolumes: [...state.rejectedVolumes],
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.acceptedVolumes = new Set(state.acceptedVolumes || []);
          state.rejectedVolumes = new Set(state.rejectedVolumes || []);
        }
      },
    }
  )
);

export default useWaybillStore;

