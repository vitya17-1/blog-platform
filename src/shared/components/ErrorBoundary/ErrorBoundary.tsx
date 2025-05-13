import React, { useState } from 'react';
import styles from './ErrorBoundary.module.scss';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: undefined,
      errorInfo: undefined,
    };
  }

  static getDerivedStateFromError(): Partial<ErrorBoundaryState> {
    // Обновляем состояние, чтобы при следующем рендере показать запасной UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Обновляем состояние с информацией об ошибке
    this.setState({
      error,
      errorInfo,
    });

    // Логируем ошибку
    console.error('Uncaught error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorOverlay
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReload={this.handleReload}
          onGoHome={this.handleGoHome}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorOverlayProps {
  error?: Error;
  errorInfo?: React.ErrorInfo;
  onReload: () => void;
  onGoHome: () => void;
}

const ErrorOverlay: React.FC<ErrorOverlayProps> = ({
  error,
  errorInfo,
  onReload,
  onGoHome,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails((prev) => !prev);
  };

  const copyErrorToClipboard = () => {
    const errorText = `
Error: ${error?.message || 'Unknown error'}
Stack: ${error?.stack || ''}
Component Stack: ${errorInfo?.componentStack || ''}
    `.trim();

    navigator.clipboard
      .writeText(errorText)
      .then(() => {
        alert('Ошибка скопирована в буфер обмена');
      })
      .catch((err) => {
        console.error('Не удалось скопировать ошибку:', err);
      });
  };

  return (
    <div className={styles.errorOverlay}>
      <div className={styles.errorContainer}>
        <div className={styles.errorHeader}>
          <h2 className={styles.errorTitle}>
            <span className={styles.errorIcon}>⚠️</span>
            Произошла ошибка
          </h2>
        </div>
        <div className={styles.errorBody}>
          <div className={styles.errorMessage}>
            {error?.message || 'Произошла непредвиденная ошибка в приложении.'}
          </div>

          {error && (
            <div className={styles.errorDetails}>
              <div className={styles.errorDetailsTitle} onClick={toggleDetails}>
                <span>{showDetails ? '▼' : '▶'}</span> Технические детали
              </div>

              {showDetails && (
                <>
                  <div className={styles.errorStack}>
                    {error.stack || 'Стек ошибки недоступен'}

                    {errorInfo && (
                      <>
                        <br />
                        <br />
                        <strong>Component Stack:</strong>
                        <br />
                        {errorInfo.componentStack}
                      </>
                    )}
                  </div>
                  <button
                    className={styles.copyButton}
                    onClick={copyErrorToClipboard}
                  >
                    📋 Скопировать детали ошибки
                  </button>
                </>
              )}
            </div>
          )}

          <div className={styles.errorActions}>
            <button
              className={`${styles.button} ${styles.secondaryButton}`}
              onClick={onGoHome}
            >
              🏠 На главную
            </button>
            <button
              className={`${styles.button} ${styles.primaryButton}`}
              onClick={onReload}
            >
              🔄 Перезагрузить страницу
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
