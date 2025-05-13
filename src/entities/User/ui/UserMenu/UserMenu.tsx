import React from 'react';
import styles from './UserMenu.module.scss';
import User from '@entities/User';
import { useAuth } from '@features/Auth/hooks/useAuth';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const UserMenu: React.FC = () => {
  const { isAuth, currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    // Перенаправляем на домашнюю страницу
    navigate('/');
  };

  return (
    <div className={styles.userMenu}>
      {isAuth ? (
        <>
          <NavLink
            style={({ isActive }) => ({
              outline: isActive ? '1px solid #52C41A' : '',
            })}
            to={'/new-article'}
            className={`${styles.button} ${styles['button--create']}`}
          >
            Create article
          </NavLink>

          <Link to={'/profile'}>
            <User
              user={currentUser}
              variant="current"
              style={{
                cursor: 'pointer',
                gridTemplateAreas: '"username avatar"',
                alignItems: 'center',
              }}
            />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className={`${styles.button} ${styles['button--signOut']}`}
          >
            Log out
          </button>
        </>
      ) : (
        <>
          <NavLink
            style={({ isActive }) => ({
              outline: isActive ? '1px solid rgb(0, 0, 0, .7)' : '',
            })}
            to={'/sign-in'}
            className={`${styles.button} ${styles['button--signIn']}`}
          >
            Sign in
          </NavLink>
          <NavLink
            to={'/sign-up'}
            style={({ isActive }) => ({
              outline: isActive ? '1px solid #52C41A' : '',
            })}
            className={`${styles.button} ${styles['button--signUp']}`}
          >
            Sign up
          </NavLink>
        </>
      )}
    </div>
  );
};

export default UserMenu;
