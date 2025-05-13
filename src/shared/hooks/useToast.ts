import { useCallback } from 'react';
import { Id } from 'react-toastify';
import { toastService, ToastParams } from '../lib/toast/toastService';

/**
 * Хук для удобного использования тостов в компонентах
 * @returns Объект с методами для работы с тостами
 */
export const useToast = () => {
  const showSuccess = useCallback((message: string, options = {}): Id => {
    return toastService.success({ message, options });
  }, []);

  const showError = useCallback((message: string, options = {}): Id => {
    return toastService.error({ message, options });
  }, []);

  const showInfo = useCallback((message: string, options = {}): Id => {
    return toastService.info({ message, options });
  }, []);

  const showWarning = useCallback((message: string, options = {}): Id => {
    return toastService.warning({ message, options });
  }, []);

  const showDefault = useCallback((message: string, options = {}): Id => {
    return toastService.default({ message, options });
  }, []);

  const updateToast = useCallback((toastId: Id, params: ToastParams): void => {
    toastService.update(toastId, params);
  }, []);

  const dismissToast = useCallback((toastId?: Id): void => {
    toastService.dismiss(toastId);
  }, []);

  const dismissAllToasts = useCallback((): void => {
    toastService.dismissAll();
  }, []);

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showDefault,
    updateToast,
    dismissToast,
    dismissAllToasts,
  };
};
