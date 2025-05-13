import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './Pagination.module.scss';

interface PaginationProps {
  totalPages: number;
}

const PAGINATION_STEP = 5;

function getInterval(page: number, totalPages: number) {
  const start = Math.floor((page - 1) / PAGINATION_STEP) * PAGINATION_STEP + 1;
  const end = Math.min(start + PAGINATION_STEP - 1, totalPages);
  return [start, end];
}

const Pagination: React.FC<PaginationProps> = ({ totalPages }) => {
  const navigate = useNavigate();
  const page = Number(useParams()?.page) || 1;
  const [startOfInterval, endOfInterval] = getInterval(page, totalPages);
  const [pageInterval, setPageInterval] = useState({
    start: startOfInterval,
    end: endOfInterval,
  });

  useEffect(() => {
    const [newStart, newEnd] = getInterval(page, totalPages);
    setPageInterval({ start: newStart, end: newEnd });
  }, [page]);

  const handlePageChange = (pageParam: number) => {
    if (pageParam === page) {
      return;
    }
    if (pageParam > 0 && pageParam <= totalPages) {
      navigate(`/articles/page/${pageParam}`);
    }
  };

  const goToNextInterval = () => {
    setPageInterval((prevInterval) => ({
      start: Math.min(
        prevInterval.start + PAGINATION_STEP,
        totalPages - PAGINATION_STEP + 1,
      ),
      end: Math.min(prevInterval.end + PAGINATION_STEP, totalPages),
    }));
  };

  const goToPreviousInterval = () => {
    setPageInterval((prevInterval) => ({
      start: Math.max(prevInterval.start - PAGINATION_STEP, 1),
      end: Math.max(prevInterval.end - PAGINATION_STEP, PAGINATION_STEP),
    }));
  };

  const renderPageNumbers = () => {
    const pages: React.ReactNode[] = [];
    if (totalPages === 0) {
      return null;
    }
    for (let i = pageInterval.start; i <= pageInterval.end; i++) {
      pages.push(
        <button
          type="button"
          key={i}
          className={`${styles.button} ${i === page ? styles['button--active'] : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>,
      );
    }
    return pages;
  };

  return (
    <div className={styles.pagination}>
      <button
        className={`${styles.button} ${styles['button--previous']}`}
        title="Go to previous page"
        type="button"
        disabled={pageInterval.start === 1 || totalPages === 0}
        onClick={goToPreviousInterval}
      ></button>

      {renderPageNumbers()}

      <button
        className={`${styles.button} ${styles['button--next']}`}
        title="Go to next page"
        type="button"
        disabled={pageInterval.end === totalPages || totalPages === 0}
        onClick={goToNextInterval}
      ></button>
    </div>
  );
};
export default Pagination;
