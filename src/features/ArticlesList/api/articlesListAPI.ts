import blogApi, { TagTypes } from '@shared/lib/api';
import { ArticlesResponse } from '../model/types';
import ArticleData from '@entities/Article/model/types';
import UserAvatar from '@assets/userAvatar.svg';

function transformArticlesData(articles: ArticleData[]): ArticleData[] {
  return articles.map(
    (article: ArticleData): ArticleData => ({
      ...article,
      title: article.title?.trim() || 'Нет заголовка',
      body: article.body?.trim() || 'Нет содержимого',
      description: article.description?.trim() || 'Нет описания',
      tagList: article.tagList || [],
      favorited: article?.favorited || false,
      favoritesCount: article?.favoritesCount || 0,
      author: {
        username: article?.author?.username || '',
        image: article?.author?.image || UserAvatar,
        bio: article?.author?.bio || '',
        following: article?.author?.following || false,
      },
    }),
  );
}

const articleAPI = blogApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getArticles: builder.query<ArticlesResponse, number | void>({
      query: (page: number = 1) => `/articles?limit=5&offset=${(page - 1) * 5}`,
      transformResponse: (response: ArticlesResponse) => ({
        ...response,
        articles: transformArticlesData(response.articles),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.articles.map(({ slug }) => ({
                type: TagTypes.Articles,
                id: slug,
              })),
              { type: TagTypes.Articles, id: 'LIST' },
            ]
          : [{ type: TagTypes.Articles, id: 'LIST' }],
    }),
  }),
});

export const { useGetArticlesQuery } = articleAPI;
