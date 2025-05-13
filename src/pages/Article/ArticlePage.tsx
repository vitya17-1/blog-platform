import ArticleCard from '@entities/Article/ui/ArticleCard';
import ArticleForm from '@entities/Article/ui/ArticleCard/components/ArticleForm/ArticleForm';
import styles from './ArticlePage.module.scss';

export default function ArticlePage({
  isDetailedArticle = false,
  isNewArticle = false,
  isEditing = false,
}: {
  isDetailedArticle?: boolean;
  isNewArticle?: boolean;
  isEditing?: boolean;
}) {
  return (
    <div className={styles.articlePage}>
      {isNewArticle || isEditing ? (
        <ArticleForm isEditMode={isEditing} />
      ) : (
        <ArticleCard isDetailed={isDetailedArticle} />
      )}
    </div>
  );
}
