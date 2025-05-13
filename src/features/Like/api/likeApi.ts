import ArticleData from '@entities/Article/model/types';
import { TagTypes } from '@shared/lib/api';
import blogApi from '@shared/lib/api';

export const likeApi = blogApi.injectEndpoints({
  endpoints: (builder) => ({
    favoriteArticle: builder.mutation({
      query: (slug: string) => ({
        url: `/articles/${slug}/favorite`,
        method: 'POST',
      }),
      transformResponse: (response: { article: ArticleData }) =>
        response.article,
      invalidatesTags: (_, __, slug) => [{ type: TagTypes.Articles, id: slug }],
    }),
    unfavoriteArticle: builder.mutation({
      query: (slug: string) => ({
        url: `/articles/${slug}/favorite`,
        method: 'DELETE',
      }),
      transformResponse: (response: { article: ArticleData }) =>
        response.article,
      invalidatesTags: (_, __, slug) => [{ type: TagTypes.Articles, id: slug }],
    }),
  }),
});

export const { useFavoriteArticleMutation, useUnfavoriteArticleMutation } =
  likeApi;
