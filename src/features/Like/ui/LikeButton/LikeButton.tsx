import { useAuth } from '@features/Auth/hooks/useAuth';
import { useLike } from '../../hooks/useLike';
import styles from './LikeButton.module.scss';

interface LikeButtonProps {
  slug: string;
  favorited: boolean;
  favoritesCount: number;
  className?: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  slug,
  favorited,
  favoritesCount,
  className = '',
}) => {
  const { isAuth } = useAuth();
  const { isLiked, likesCount, toggleLike, isLoading } = useLike({
    slug,
    favorited,
    favoritesCount,
  });

  return (
    <button
      className={`${styles.likeButton} ${isLiked ? styles.liked : ''} ${className}`}
      onClick={toggleLike}
      disabled={!isAuth || isLoading}
      title={
        !isAuth
          ? 'Авторизуйтесь, чтобы добавить в избранное'
          : isLiked
            ? 'Удалить из избранного'
            : 'Добавить в избранное'
      }
      aria-label={isLiked ? 'Удалить из избранного' : 'Добавить в избранное'}
    >
      <span className={styles.count}>{likesCount}</span>
    </button>
  );
};

export default LikeButton;
