import { useEffect, createContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useGetCurrentUserQuery } from '@features/Auth/api/authSliceApi';
import { useAuth } from '@features/Auth/hooks/useAuth';

// Создаем контекст авторизации
export const AuthContext = createContext({
  isAuthChecked: false,
  isUserAuthorized: false,
});

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const { logout, updateUser } = useAuth();
  const [authState, setAuthState] = useState({
    isAuthChecked: false,
    isUserAuthorized: false,
  });

  // Функция для проверки токена
  const checkToken = () => {
    const token = localStorage.getItem('token');

    if (!token) {
      return false;
    }

    // Проверка срока действия токена
    try {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = tokenData.exp * 1000; // переводим в миллисекунды

      if (Date.now() >= expirationTime) {
        // Токен истек
        localStorage.removeItem('token');
        return false;
      }

      return true;
    } catch {
      // Если токен не в формате JWT или произошла ошибка при парсинге
      return true; // Считаем токен валидным и пусть API решает
    }
  };

  // Получение данных пользователя при наличии валидного токена
  const {
    data: userData,
    error,
    isLoading,
  } = useGetCurrentUserQuery(undefined, {
    skip: !checkToken(),
  });

  useEffect(() => {
    const isTokenValid = checkToken();

    if (!isTokenValid) {
      // Если токен невалидный или отсутствует
      setAuthState({
        isAuthChecked: true,
        isUserAuthorized: false,
      });
      return;
    }

    if (!isLoading) {
      if (userData && userData.user) {
        updateUser(userData.user);
        setAuthState({
          isAuthChecked: true,
          isUserAuthorized: true,
        });
      } else if (error) {
        // Если API вернуло ошибку (например, токен недействителен)
        localStorage.removeItem('token');
        logout();
        setAuthState({
          isAuthChecked: true,
          isUserAuthorized: false,
        });
      }
    }
  }, [userData, error, isLoading, dispatch]);

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
