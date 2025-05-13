import ArticleData from '@entities/Article/model/types';

export interface ArticlesResponse {
  articles: ArticleData[];
  articlesCount: number;
}

export interface ArticlesListProps {
  articles: ArticleData[] | [];
}
