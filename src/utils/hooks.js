import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

/**
 * Hook для debounce значения
 * @param {any} value - Значение для debounce
 * @param {number} delay - Задержка в мс
 * @returns {any} - Debounced значение
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook для обработки нажатий клавиш
 * @param {string} key - Клавиша
 * @param {Function} callback - Колбэк при нажатии
 */
export const useKeyPress = (key, callback) => {
  useEffect(() => {
    const handler = (event) => {
      if (event.key === key) {
        callback(event);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [key, callback]);
};

/**
 * Hook для блокировки скролла body
 * @param {boolean} isLocked - Флаг блокировки
 */
export const useLockBodyScroll = (isLocked) => {
  useEffect(() => {
    if (isLocked) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isLocked]);
};

/**
 * Hook для клика вне элемента
 * @param {Function} callback - Колбэк при клике вне
 * @returns {React.RefObject} - Ref для элемента
 */
export const useClickOutside = (callback) => {
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [callback]);

  return ref;
};

/**
 * Hook для мемоизации данных с зависимостями
 * @deprecated Используйте React.useMemo напрямую
 * @param {Function} computeFn - Функция вычисления
 * @param {Array} deps - Зависимости
 * @returns {any} - Мемоизированное значение
 */
export const useMemoizedValue = (computeFn, deps) => {
  // Это просто обертка над useMemo для обратной совместимости
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(computeFn, deps);
};

/**
 * Hook для работы с localStorage
 * @param {string} key - Ключ в localStorage
 * @param {any} initialValue - Начальное значение
 * @returns {[any, Function]} - Значение и setter
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
};

/**
 * Hook для отслеживания предыдущего значения
 * @param {any} value - Текущее значение
 * @returns {any} - Предыдущее значение
 */
export const usePrevious = (value) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

