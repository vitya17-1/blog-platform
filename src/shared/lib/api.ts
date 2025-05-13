import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '@shared/config';

// Определяем типы тегов для инвалидации кэша
export enum TagTypes {
  Articles = 'Articles',
}

const blogApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      // Получаем токен из localStorage
      const token = localStorage.getItem('token');

      // Если токен есть, добавляем его в заголовки
      if (token) {
        headers.set('Authorization', `Token ${token}`);
      }

      return headers;
    },
  }),
  // Указываем типы тегов, которые будут использоваться для инвалидации кэша
  tagTypes: [TagTypes.Articles],
  endpoints: () => ({}),
});

export default blogApi;
