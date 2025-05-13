import React from 'react';
import styles from './ConfirmationDialog.module.scss';

interface ConfirmationDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  position?: { top?: number; left?: number; right?: number; bottom?: number };
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  message,
  onConfirm,
  onCancel,
  confirmText = 'Yes',
  cancelText = 'No',
  position,
}) => {
  return (
    <div className={styles.popover}>
      <div
        className={styles.dialog}
        style={position ? { position: 'absolute', ...position } : {}}
      >
        <div className={styles.content}>
          <p className={styles.message}>{message}</p>
          <div className={styles.actions}>
            <button
              className={`${styles.button} ${styles.cancelButton}`}
              onClick={onCancel}
            >
              {cancelText}
            </button>
            <button
              className={`${styles.button} ${styles.confirmButton}`}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
