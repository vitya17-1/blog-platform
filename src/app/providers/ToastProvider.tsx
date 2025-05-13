import { FC, ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ToastProviderProps {
  children: ReactNode;
}

/**
 * Провайдер для интеграции react-toastify в приложение
 * Оборачивает все приложение и предоставляет доступ к тостам
 */
export const ToastProvider: FC<ToastProviderProps> = ({ children }) => {
  return (
    <>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};
