import { Outlet, Link } from 'react-router-dom';
import styles from './MainLayout.module.scss';
import UserMenu from '@entities/User/ui/UserMenu/UserMenu';
import { useKeyboardNavigation } from '@shared/hooks/useKeyboardNavigation';
import ErrorBoundary from '@shared/components/ErrorBoundary/ErrorBoundary';

export default function MainLayout() {
  useKeyboardNavigation();

  return (
    <>
      <header>
        <Link to="/" className={styles.title}>
          Realworld Blog
        </Link>
        <UserMenu />
      </header>
      <main className={styles.mainLayout}>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
    </>
  );
}
