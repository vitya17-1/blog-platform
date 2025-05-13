import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import blogApi from '@shared/lib/api';
import userReducer from '@entities/User/model/userSlice';

const store = configureStore({
  reducer: {
    // Reducers
    [blogApi.reducerPath]: blogApi.reducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(blogApi.middleware),
});

// Экспортируем типы для RootState и AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

interface StoreProviderProps {
  children: React.ReactNode;
}

const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default StoreProvider;
