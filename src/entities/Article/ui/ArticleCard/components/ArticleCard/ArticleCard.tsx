import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '@features/Auth/hooks/useAuth';
import ArticleData from '@entities/Article/model/types';
import User from '@entities/User/ui/User';
import MarkdownParser from '@shared/components/MarkdownParser';
import { useOverflowCheck } from '@shared/hooks';
import TagsContainer from './TagsContainer/TagsContainer';
import ArticleActions from '@entities/Article/ui/ArticleActions/ArticleActions';
import styles from './ArticleCard.module.scss';
import { ConfirmationDialog } from '@shared/ui/ConfirmationDialog';
import { useArticleAction } from '../../hooks';
import { LikeButton } from '@features/Like';

export interface ArticleCardProps {
  isDetailed?: boolean;
  isNewArticle?: boolean;
  articleData?: ArticleData | null;
  isEditing?: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  isDetailed = false,
  articleData: articleDataProp,
}) => {
  const {
    articleData: article,
    isDeleteConfirmOpen,
    deleteButtonPosition,
    toggleEditMode,
    handleDelete,
    openDeleteConfirm,
    closeDeleteConfirm,
  } = useArticleAction({ mode: 'edit' });
  const { isAuth, currentUser } = useAuth();

  const articleData = articleDataProp ?? article;

  const { containerRef, isOverflowing } = useOverflowCheck({
    deps: [articleData?.description],
    listenResize: true,
  });

  const [showFullDescription, setShowFullDescription] = useState(false);

  if (!articleData) return null;

  const {
    title,
    description,
    body,
    tagList,
    createdAt,
    favorited,
    favoritesCount,
    slug,
    author,
  } = articleData;

  const toggleDescription = () => {
    if (isOverflowing) {
      setShowFullDescription(!showFullDescription);
    }
  };

  return (
    <article className={isDetailed ? styles.detailed : styles.compact}>
      <div className={styles.titleContainer}>
        <Link
          to={`/articles/${slug}`}
          className={styles.title}
          state={articleDataProp}
          title={title}
        >
          {title}
        </Link>
        <LikeButton
          slug={slug}
          favorited={favorited}
          favoritesCount={favoritesCount}
          className={styles.likes}
        />
      </div>
      <p
        className={`${styles.description} ${!isDetailed ? styles['description--truncated'] : ''} 
            ${isOverflowing && !showFullDescription ? styles.showMoreDescription : ''}`}
        ref={isDetailed ? undefined : containerRef}
        onClick={toggleDescription}
        style={
          showFullDescription
            ? {
                WebkitLineClamp: 'unset',
                maxHeight: 'none',
                cursor: 'pointer',
              }
            : {}
        }
      >
        {description}
      </p>
      <TagsContainer tagList={tagList} />
      <User
        user={author}
        variant="author"
        createdAt={createdAt}
        style={{ gridArea: 'userInfo', height: 'min-content' }}
      />
      {isDetailed && isAuth && author.username === currentUser?.username && (
        <ArticleActions onEdit={toggleEditMode} onDelete={openDeleteConfirm} />
      )}
      {isDetailed && (
        <span className={styles.bodyText}>
          <MarkdownParser markdown={body} />
        </span>
      )}
      {isDeleteConfirmOpen && (
        <ConfirmationDialog
          message="Are you sure to delete this article?"
          onConfirm={handleDelete}
          onCancel={closeDeleteConfirm}
          position={deleteButtonPosition || undefined}
        />
      )}
    </article>
  );
};

export default ArticleCard;
