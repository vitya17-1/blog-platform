import { FC, useRef } from 'react';
import styles from './ArticleActions.module.scss';

interface ArticleActionsProps {
  onEdit: () => void;
  onDelete: (buttonRef: HTMLButtonElement | null) => void;
}

const ArticleActions: FC<ArticleActionsProps> = ({ onEdit, onDelete }) => {
  const deleteButtonRef = useRef<HTMLButtonElement>(null);

  const handleDelete = () => {
    onDelete(deleteButtonRef.current);
  };

  return (
    <div className={styles.actionsContainer}>
      <button
        type="button"
        className={styles.deleteButton}
        onClick={handleDelete}
        ref={deleteButtonRef}
      >
        Delete
      </button>
      <button type="button" className={styles.editButton} onClick={onEdit}>
        Edit
      </button>
    </div>
  );
};

export default ArticleActions;
