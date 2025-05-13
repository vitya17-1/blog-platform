import {
  selectCurrentUser,
  selectIsAuth,
  selectUserToken,
  setCurrentUser,
  logoutUser,
  CurrentUser,
} from '@entities/User';
import { createSelector } from '@reduxjs/toolkit';
import { useAppSelector, useAppDispatch } from '@shared/hooks/redux';
import { shallowEqual } from 'react-redux';
import { useMemo } from 'react';

// Создаем мемоизированный селектор
const selectAuthData = createSelector(
  [selectCurrentUser, selectIsAuth, selectUserToken],
  (currentUser, isAuth, token) => ({
    currentUser,
    isAuth,
    token,
  }),
);

export const useAuth = () => {
  const authData = useAppSelector(selectAuthData, shallowEqual);
  const dispatch = useAppDispatch();

  const actions = useMemo(
    () => ({
      updateUser: (userData: CurrentUser) => dispatch(setCurrentUser(userData)),
      logout: () => {
        localStorage.removeItem('token');
        dispatch(logoutUser());
      },
    }),
    [dispatch],
  );

  // Возвращаем объединенные данные
  return { ...authData, ...actions };
};
