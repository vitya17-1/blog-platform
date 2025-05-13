// import React, { useContext } from "react";
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import { useContext } from 'react';
import { Loader } from '@shared/ui';

interface PrivateRouteProps {
  children?: React.ReactNode;
}

/**
 * Компонент для защиты приватных маршрутов
 * Перенаправляет неавторизованных пользователей на страницу входа
 */
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthChecked, isUserAuthorized } = useContext(AuthContext);

  // Если проверка авторизации еще не завершена, показываем загрузку
  if (!isAuthChecked) {
    return <Loader />; // Можно заменить на компонент Loader
  }

  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!isUserAuthorized) {
    return <Navigate to="/sign-in" />;
  }

  // Если пользователь авторизован, показываем защищенный контент
  return children ? <>{children}</> : <Outlet />;
};

export default PrivateRoute;
