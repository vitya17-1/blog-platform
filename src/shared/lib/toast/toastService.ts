import { toast, ToastOptions, Id } from 'react-toastify';

/**
 * Типы уведомлений
 */
export enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning',
}

/**
 * Интерфейс для параметров уведомления
 */
export interface ToastParams {
  message: string;
  options?: ToastOptions;
}

/**
 * Сервис для работы с уведомлениями
 * Предоставляет методы для вызова различных типов уведомлений
 */
export const toastService = {
  /**
   * Показать успешное уведомление
   */
  success: ({ message, options = {} }: ToastParams): Id => {
    return toast.success(message, options);
  },

  /**
   * Показать уведомление об ошибке
   */
  error: ({ message, options = {} }: ToastParams): Id => {
    return toast.error(message, options);
  },

  /**
   * Показать информационное уведомление
   */
  info: ({ message, options = {} }: ToastParams): Id => {
    return toast.info(message, options);
  },

  /**
   * Показать предупреждающее уведомление
   */
  warning: ({ message, options = {} }: ToastParams): Id => {
    return toast.warning(message, options);
  },

  /**
   * Показать обычное уведомление
   */
  default: ({ message, options = {} }: ToastParams): Id => {
    return toast(message, options);
  },

  /**
   * Обновить существующее уведомление
   */
  update: (toastId: Id, { message, options = {} }: ToastParams): void => {
    toast.update(toastId, { render: message, ...options });
  },

  /**
   * Закрыть уведомление по ID
   */
  dismiss: (toastId?: Id): void => {
    toast.dismiss(toastId);
  },

  /**
   * Закрыть все уведомления
   */
  dismissAll: (): void => {
    toast.dismiss();
  },
};
