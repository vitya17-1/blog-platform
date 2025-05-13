import blogApi, { TagTypes } from '@shared/lib/api';
import ArticleData from '@entities/Article/model/types';

// Тип для запроса создания/обновления статьи
interface ArticleRequest {
  article: {
    title: string;
    description: string;
    body: string;
    tagList?: string[];
  };
}

// Тип для ответа от сервера
interface ArticleResponse {
  article: ArticleData;
}

// Инъекция эндпоинтов в основной API
const modifyArticleApi = blogApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    // Эндпоинт для создания новой статьи
    createArticle: builder.mutation<ArticleData, ArticleRequest>({
      query: (data) => ({
        url: '/articles',
        method: 'POST',
        body: data,
      }),
      // Трансформация ответа для получения только данных статьи
      transformResponse: (response: ArticleResponse) => response.article,
      invalidatesTags: [{ type: TagTypes.Articles, id: 'LIST' }],
    }),

    // Эндпоинт для обновления существующей статьи
    updateArticle: builder.mutation<
      ArticleData,
      { slug: string; data: ArticleRequest }
    >({
      query: ({ slug, data }) => ({
        url: `/articles/${slug}`,
        method: 'PUT',
        body: data,
      }),
      // Трансформация ответа для получения только данных статьи
      transformResponse: (response: ArticleResponse) => response.article,
      invalidatesTags: (_, __, { slug }) => [
        { type: TagTypes.Articles, id: slug },
        { type: TagTypes.Articles, id: 'LIST' },
      ],
    }),

    // Эндпоинт для получения статьи по slug
    getArticleBySlug: builder.query<ArticleData, string>({
      query: (slug) => `/articles/${slug}`,
      transformResponse: (response: ArticleResponse) => response.article,
      providesTags: (result, _, slug) =>
        result ? [{ type: TagTypes.Articles, id: slug }] : [],
    }),

    // Эндпоинт для удаления статьи
    deleteArticle: builder.mutation<void, string>({
      query: (slug) => ({
        url: `/articles/${slug}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, slug) => [
        { type: TagTypes.Articles, id: slug },
        { type: TagTypes.Articles, id: 'LIST' },
      ],
    }),
  }),
});

// Экспорт хуков для использования в компонентах
export const {
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useGetArticleBySlugQuery,
  useDeleteArticleMutation,
} = modifyArticleApi;
