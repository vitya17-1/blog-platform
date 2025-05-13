import ArticleCard from '@entities/Article/ui/ArticleCard/components/ArticleCard/ArticleCard';
import { ArticlesListProps } from '../model/types';
import styles from './ArticlesList.module.scss';
import { v4 as randomUUID } from 'uuid';

export default function ArticlesList({
  articles,
}: ArticlesListProps): JSX.Element {
  const articlesElements = articles.map((article) => (
    <li key={randomUUID()}>
      <ArticleCard isDetailed={false} articleData={article} />
    </li>
  ));
  return <ul className={styles.articlesList}>{articlesElements}</ul>;
}
