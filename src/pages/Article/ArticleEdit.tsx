import ArticleForm from '@entities/Article/ui/ArticleCard/components/ArticleForm/ArticleForm';
import styles from './ArticlePage.module.scss';

export default function ArticleEdit() {
  return (
    <div className={styles.articlePage}>
      <ArticleForm />
    </div>
  );
}
