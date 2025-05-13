import { RootState } from '@app/providers/StoreProvider';

// Селектор для получения информации о текущем пользователе
export const selectCurrentUser = (state: RootState) => state.user.currentUser;

// Селектор для проверки авторизации пользователя
export const selectIsAuth = (state: RootState) => state.user.isAuth;

// Селектор для получения токена пользователя
export const selectUserToken = (state: RootState) =>
  state.user.currentUser?.token;
