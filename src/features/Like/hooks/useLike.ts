import { useState } from 'react';
import { useAuth } from '@features/Auth/hooks/useAuth';
import {
  useFavoriteArticleMutation,
  useUnfavoriteArticleMutation,
} from '../api/likeApi';
import { useToast } from '@shared/hooks/useToast';

interface UseLikeProps {
  slug: string;
  favorited: boolean;
  favoritesCount: number;
}

interface UseLikeReturn {
  isLiked: boolean;
  likesCount: number;
  toggleLike: () => Promise<void>;
  isLoading: boolean;
}

export const useLike = ({
  slug,
  favorited,
  favoritesCount,
}: UseLikeProps): UseLikeReturn => {
  const { isAuth } = useAuth();
  const { showError } = useToast();

  // Локальное состояние для оптимистичного UI
  const [isLiked, setIsLiked] = useState(favorited);
  const [likesCount, setLikesCount] = useState(favoritesCount);

  // RTK Query хуки
  const [favoriteArticle, { isLoading: isLiking }] =
    useFavoriteArticleMutation();
  const [unfavoriteArticle, { isLoading: isUnliking }] =
    useUnfavoriteArticleMutation();

  // Общий флаг загрузки
  const isLoading = isLiking || isUnliking;

  // Функция для переключения лайка
  const toggleLike = async () => {
    if (!isAuth) {
      showError('Необходимо авторизоваться для добавления в избранное');
      return;
    }

    try {
      // Оптимистичное обновление UI
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);
      setLikesCount((prev) => (newIsLiked ? prev + 1 : prev - 1));

      // Выполнение запроса к API
      if (newIsLiked) {
        const updatedArticle = await favoriteArticle(slug).unwrap();
        // Обновляем состояние на основе ответа от сервера
        setIsLiked(updatedArticle.favorited);
        setLikesCount(updatedArticle.favoritesCount);
      } else {
        const updatedArticle = await unfavoriteArticle(slug).unwrap();
        // Обновляем состояние на основе ответа от сервера
        setIsLiked(updatedArticle.favorited);
        setLikesCount(updatedArticle.favoritesCount);
      }
    } catch (error) {
      // Откат оптимистичного обновления в случае ошибки
      setIsLiked(favorited);
      setLikesCount(favoritesCount);
      showError('Не удалось обновить статус избранного');
      console.error('Ошибка при обновлении статуса избранного:', error);
    }
  };

  return {
    isLiked,
    likesCount,
    toggleLike,
    isLoading,
  };
};
