import React from 'react';
import styles from './Loader.module.scss';

const Loader: React.FC<{ isSmall?: boolean }> = ({ isSmall = false }) => {
  return (
    <div
      className={`${styles.loaderContainer} ${isSmall ? styles['loaderContainer--small'] : ''}`}
    >
      <div
        className={`${styles.spinner} ${isSmall ? styles['spinner--small'] : ''}`}
      ></div>
      <span className={styles.loaderText}>Загрузка...</span>
    </div>
  );
};

export default Loader;
