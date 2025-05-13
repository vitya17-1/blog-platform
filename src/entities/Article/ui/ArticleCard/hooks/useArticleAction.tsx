import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import ArticleData from '@entities/Article/model/types';
import { useToast } from '@shared/hooks/useToast';
import {
  useUpdateArticleMutation,
  useDeleteArticleMutation,
  useGetArticleBySlugQuery,
  useCreateArticleMutation,
} from '../api/articleCardApi';

interface UseArticleActionReturn {
  // Общие свойства
  articleData: ArticleData | null;
  isSubmitting: boolean;

  // Свойства для редактирования
  isEditing: boolean;
  isDeleteConfirmOpen: boolean;
  deleteButtonPosition: {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  } | null;

  // Общие методы
  handleSave: (articleData: ArticleData) => Promise<void>;
  handleCancel: () => void;

  // Методы для редактирования
  toggleEditMode: () => void;
  handleDelete: () => Promise<void>;
  openDeleteConfirm: (buttonRef: HTMLButtonElement | null) => void;
  closeDeleteConfirm: () => void;
}

interface UseArticleActionOptions {
  mode: 'create' | 'edit';
}

export const useArticleAction = (
  options: UseArticleActionOptions,
): UseArticleActionReturn => {
  const { mode } = options;
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  // Состояния
  const [articleData, setArticleData] = useState<ArticleData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteButtonPosition, setDeleteButtonPosition] = useState<{
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  } | null>(null);

  // RTK Query хуки
  const { data: articleDataFromQuery, error } = useGetArticleBySlugQuery(
    id || '',
    {
      skip: !!location.state || !id || mode === 'create',
    },
  );

  if (error) {
    throw error;
  }

  const [updateArticle, { isLoading: isUpdating }] = useUpdateArticleMutation();
  const [deleteArticle] = useDeleteArticleMutation();
  const [createArticle, { isLoading: isCreating }] = useCreateArticleMutation();

  // Определяем, выполняется ли сейчас отправка данных
  const isSubmitting = isUpdating || isCreating;

  // Эффекты
  useEffect(() => {
    if (mode !== 'create') {
      // Если данные пришли из запроса, обновляем состояние
      if (articleDataFromQuery && !articleData) {
        console.log(articleDataFromQuery);
        setArticleData(articleDataFromQuery);
      }

      // Если данные пришли из стора, обновляем состояние
      if (location.state && !articleData) {
        setArticleData(location.state);
      }

      // Проверяем, находимся ли мы в режиме редактирования по URL
      if (location.pathname.includes('/edit')) {
        setIsEditing(true);
      }
    }
  }, [
    articleDataFromQuery,
    articleData,
    location.state,
    mode,
    location.pathname,
  ]);

  // Общие методы
  const handleSave = async (articleData: ArticleData) => {
    try {
      // Подготавливаем данные для запроса
      const articleRequest = {
        article: {
          title: articleData.title,
          description: articleData.description,
          body: articleData.body,
          tagList: articleData.tagList,
        },
      };

      let result;

      if (mode === 'edit') {
        if (!id) {
          throw new Error('ID статьи не определен');
        }

        // Обновление существующей статьи
        result = await updateArticle({
          slug: id,
          data: articleRequest,
        }).unwrap();

        // После успешного сохранения обновляем локальное состояние
        setArticleData(result);

        // Выходим из режима редактирования и переходим на страницу просмотра
        navigate(`/articles/${id}`, { state: result });
        // setIsEditing(false);

        // Показываем уведомление об успешном сохранении
        showSuccess('Статья успешно обновлена');
      } else {
        // Создание новой статьи
        result = await createArticle(articleRequest).unwrap();

        // После успешного создания перенаправляем на страницу просмотра новой статьи
        navigate(`/articles/${result.slug}`, { state: result });

        // Показываем уведомление об успешном создании
        showSuccess('Статья успешно создана');
      }
    } catch (error) {
      console.error(
        `Ошибка при ${mode === 'edit' ? 'сохранении' : 'создании'} статьи:`,
        error,
      );
      // Показываем уведомление об ошибке
      showError(
        `Ошибка при ${mode === 'edit' ? 'сохранении' : 'создании'} статьи`,
      );
    }
  };

  const handleCancel = () => {
    if (mode === 'edit') {
      setIsEditing(false);
      // Отмена редактирования и возврат к просмотру
      navigate(`/articles/${id}`, {
        state: articleData,
        replace: true,
      });
    } else {
      // Отмена создания и возврат на главную страницу
      navigate('/');
    }
  };

  // Методы для редактирования
  const toggleEditMode = () => {
    // if (mode !== "edit") return;

    if (isEditing) {
      // Выход из режима редактирования
      navigate(`/articles/${id}`, { state: articleData });
      setIsEditing(false);
    } else {
      // Переход в режим редактирования
      navigate(`/articles/${id}/edit`, { state: articleData });
      setIsEditing(true);
    }
  };

  const openDeleteConfirm = (buttonRef: HTMLButtonElement | null) => {
    if (mode !== 'edit') return;

    if (buttonRef) {
      const rect = buttonRef.getBoundingClientRect();
      setDeleteButtonPosition({
        top: rect.top - 10,
        left: rect.left + 18,
      });
    }
    setIsDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    if (mode !== 'edit') return;

    setIsDeleteConfirmOpen(false);
    setDeleteButtonPosition(null);
  };

  const handleDelete = async () => {
    if (mode !== 'edit') return Promise.resolve();

    try {
      if (!id) {
        throw new Error('ID статьи не определен');
      }

      // Вызываем API для удаления статьи
      await deleteArticle(id).unwrap();

      // После успешного удаления перенаправляем на главную страницу
      navigate('/');

      // Показываем уведомление об успешном удалении
      showSuccess('Статья успешно удалена');
    } catch (error) {
      console.error('Ошибка при удалении статьи:', error);
      // Показываем уведомление об ошибке
      showError('Ошибка при удалении статьи');
    } finally {
      closeDeleteConfirm();
    }
  };

  return {
    articleData,
    isSubmitting,
    isEditing,
    isDeleteConfirmOpen,
    deleteButtonPosition,
    handleSave,
    handleCancel,
    toggleEditMode,
    handleDelete,
    openDeleteConfirm,
    closeDeleteConfirm,
  };
};
