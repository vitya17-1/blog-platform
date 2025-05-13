import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.scss';

export default function NotFoundPage() {
  return (
    <div className={styles.notFoundContainer}>
      <h1 className={styles.errorCode}>404</h1>
      <h2 className={styles.title}>Страница не найдена</h2>
      <p className={styles.description}>
        Извините, но страница, которую вы ищете, не существует или была
        перемещена. Возможно, вы ввели неправильный адрес или перешли по
        устаревшей ссылке.
      </p>
      <div className={styles.illustration}>
        <svg
          viewBox="120 200 250 200"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
        >
          <path
            d="M250 60c-110 0-200 90-200 200s90 200 200 200 200-90 200-200-90-200-200-200zm0 60c33 0 60 27 60 60s-27 60-60 60-60-27-60-60 27-60 60-60zm-80 220c-33 0-60-27-60-60s27-60 60-60 60 27 60 60-27 60-60 60zm160 0c-33 0-60-27-60-60s27-60 60-60 60 27 60 60-27 60-60 60z"
            fill="#f0f0f0"
          />
          <path
            d="M130 280c0-11 9-20 20-20s20 9 20 20-9 20-20 20-20-9-20-20zm200 0c0-11 9-20 20-20s20 9 20 20-9 20-20 20-20-9-20-20z"
            fill="#5f27cd"
          />
          <path
            d="M170 350c0-44 36-80 80-80s80 36 80 80"
            fill="none"
            stroke="#5f27cd"
            strokeWidth="20"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <Link to="/" className={styles.homeButton}>
        Вернуться на главную
      </Link>
    </div>
  );
}
