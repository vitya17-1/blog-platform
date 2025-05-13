import styles from './ArticleForm.module.scss';
import ArticleData from '@entities/Article/model/types';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useEffect, useRef } from 'react';
import { useArticleAction } from '../../hooks';
import { useLocation } from 'react-router-dom';

interface ArticleFormProps {
  autoSaveInterval?: number; // Интервал автосохранения в миллисекундах
  isCreateMode?: boolean;
  isEditMode?: boolean;
}

// Тип для формы статьи
type ArticleFormValues = {
  title: string;
  description: string;
  body: string;
  tagList: { value: string }[];
};

// Компонент формы для редактирования статьи
const ArticleForm: React.FC<ArticleFormProps> = ({
  isEditMode,
  autoSaveInterval = 60000, // По умолчанию сохраняем каждые 30 секунд
}) => {
  const location = useLocation();
  const {
    // articleData: data,
    handleCancel: onCancel,
    handleSave: onSubmit,
  } = useArticleAction({
    mode: isEditMode ? 'edit' : 'create',
  });

  const initialData = location.state;

  const autoSaveKey = `article_form_draft_${initialData?.slug || 'new'}`;

  // Инициализация react-hook-form
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    watch,
    getValues,
  } = useForm<ArticleFormValues>({
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      body: initialData?.body || '',
      tagList: initialData?.tagList?.map((tag) => ({ value: tag })) || [],
    },
    mode: 'onChange',
  });

  // Интервал для автосохранения
  const autoSaveIntervalRef = useRef<number | null>(null);

  // Использование useFieldArray для управления массивом тегов
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tagList',
    rules: {
      validate: {
        noDuplicates: (fieldArray) => {
          const values = fieldArray.map((field) =>
            field.value.trim().toLowerCase(),
          );
          const uniqueValues = new Set(values);
          return (
            values.length === uniqueValues.size || 'Теги не должны повторяться'
          );
        },
        noEmptyTags: (fieldArray) => {
          return (
            !fieldArray.some((field) => field.value.trim() === '') ||
            'Пустые теги не допускаются'
          );
        },
      },
    },
  });

  // Наблюдаем за изменениями формы для автосохранения
  const formValues = watch();

  // Функция для сохранения данных формы в localStorage
  const saveFormToLocalStorage = () => {
    try {
      const currentValues = getValues();
      localStorage.setItem(autoSaveKey, JSON.stringify(currentValues));
      console.log(
        'Форма автоматически сохранена в localStorage',
        new Date().toLocaleTimeString(),
      );
    } catch (error) {
      console.error('Ошибка при сохранении формы в localStorage:', error);
    }
  };

  // Загрузка данных из localStorage при инициализации
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(autoSaveKey);

      if (savedData) {
        const parsedData = JSON.parse(savedData) as ArticleFormValues;

        // Проверяем, есть ли начальные данные и приоритизируем их
        if (!initialData) {
          reset(parsedData);
          console.log('Загружены сохраненные данные формы из localStorage');
        }
      }
    } catch (error) {
      console.error('Ошибка при загрузке данных из localStorage:', error);
    }

    // Настраиваем интервал автосохранения
    autoSaveIntervalRef.current = window.setInterval(
      saveFormToLocalStorage,
      autoSaveInterval,
    );

    // Очистка интервала при размонтировании компонента
    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [autoSaveInterval, autoSaveKey, reset, initialData]);

  // Автосохранение при изменении данных формы
  useEffect(() => {
    // Используем debounce для предотвращения слишком частых сохранений
    const debounceTimeout = setTimeout(() => {
      saveFormToLocalStorage();
    }, 1000); // Задержка в 1 секунду после последнего изменения

    return () => clearTimeout(debounceTimeout);
  }, [formValues]);

  // Сброс формы при изменении initialData
  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || '',
        description: initialData.description || '',
        body: initialData.body || '',
        tagList: initialData.tagList?.map((tag) => ({ value: tag })) || [],
      });

      // Также обновляем localStorage при изменении initialData
      saveFormToLocalStorage();
    }
  }, [initialData, reset]);

  // Обработчик отправки формы
  const onFormSubmit = async (data: ArticleFormValues) => {
    try {
      // Преобразуем данные формы в формат ArticleData
      const updatedArticle = {
        ...initialData,
        title: data.title,
        description: data.description,
        body: data.body,
        tagList: data.tagList
          .map((tag) => tag.value.trim())
          .filter((tag) => tag !== ''),
      } as ArticleData; // Используем приведение типов

      await onSubmit(updatedArticle);

      // После успешной отправки очищаем черновик
      localStorage.removeItem(autoSaveKey);
    } catch (error) {
      console.error('Ошибка при отправке формы:', error);
    }
  };

  // Обработчик добавления нового тега
  const handleAddTag = () => {
    append({ value: '' });
  };

  // Обработчик отмены редактирования
  const handleCancel = () => {
    if (onCancel) {
      // Спрашиваем пользователя, хочет ли он сохранить черновик перед отменой
      if (
        localStorage.getItem(autoSaveKey) &&
        window.confirm(
          'У вас есть несохраненные изменения. Сохранить черновик?',
        )
      ) {
        saveFormToLocalStorage();
      } else {
        // Если пользователь не хочет сохранять черновик, удаляем его
        localStorage.removeItem(autoSaveKey);
      }
      onCancel();
    }
  };

  const renderAddTagButton = () => (
    <button
      type="button"
      className={styles.addTagButton}
      onClick={handleAddTag}
    >
      Add tag
    </button>
  );

  return (
    <form className={styles.articleForm} onSubmit={handleSubmit(onFormSubmit)}>
      <h2>{initialData ? 'Edit article' : 'Create new article'}</h2>

      <div className={styles.formGroup}>
        <label>Title</label>
        <input
          title="Заголовок статьи"
          placeholder="Title"
          type="text"
          {...register('title', {
            required: 'Заголовок обязателен',
            minLength: {
              value: 3,
              message: 'Минимальная длина заголовка - 3 символа',
            },
            maxLength: {
              value: 100,
              message: 'Максимальная длина заголовка - 100 символов',
            },
          })}
        />
        {errors.title && (
          <p className={styles.errorText}>{errors.title.message}</p>
        )}
      </div>

      <div className={styles.formGroup}>
        <label>Short description</label>
        <input
          title="Краткое описание статьи"
          placeholder="Short description"
          type="text"
          {...register('description', {
            required: 'Описание обязательно',
            minLength: {
              value: 5,
              message: 'Минимальная длина описания - 5 символов',
            },
            maxLength: {
              value: 200,
              message: 'Максимальная длина описания - 200 символов',
            },
          })}
        />
        {errors.description && (
          <p className={styles.errorText}>{errors.description.message}</p>
        )}
      </div>

      <div className={styles.formGroup}>
        <label>Text</label>
        <textarea
          title="Текст статьи"
          placeholder="Text"
          rows={10}
          {...register('body', {
            required: 'Текст статьи обязателен',
            minLength: {
              value: 10,
              message: 'Минимальная длина текста - 10 символов',
            },
          })}
        />
        {errors.body && (
          <p className={styles.errorText}>{errors.body.message}</p>
        )}
      </div>

      <div className={styles.formGroup}>
        <label>Tags</label>
        {errors.tagList?.root && (
          <p className={styles.errorText}>{errors.tagList.root.message}</p>
        )}

        <div className={styles.tagsList}>
          {fields.map((field, index) => (
            <div key={field.id} className={styles.tagItem}>
              <Controller
                name={`tagList.${index}.value`}
                control={control}
                rules={{
                  validate: {
                    notDuplicate: (value) => {
                      const values = watch('tagList').map((tag) =>
                        tag.value.trim().toLowerCase(),
                      );
                      const currentValue = value.trim().toLowerCase();
                      const occurrences = values.filter(
                        (v) => v === currentValue,
                      ).length;
                      return occurrences <= 1 || 'Этот тег уже добавлен';
                    },
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    placeholder="Tag"
                  />
                )}
              />
              {errors.tagList?.[index]?.value && (
                <p className={styles.errorText}>
                  {errors.tagList[index]?.value?.message}
                </p>
              )}
              <button
                type="button"
                className={styles.deleteTagButton}
                onClick={() => remove(index)}
              >
                Delete
              </button>
              {index === fields.length - 1 && renderAddTagButton()}
            </div>
          ))}
        </div>

        {fields.length === 0 && (
          <div className={styles.tagActions}>{renderAddTagButton()}</div>
        )}
      </div>

      <div className={styles.formActions}>
        <button
          type="submit"
          className={styles.sendButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Отправка...' : 'Send'}
        </button>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={handleCancel}
        >
          Отмена
        </button>
        {localStorage.getItem(autoSaveKey) && (
          <span className={styles.autosaveInfo}>Есть сохраненный черновик</span>
        )}
      </div>
    </form>
  );
};

export default ArticleForm;
