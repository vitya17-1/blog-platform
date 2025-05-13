import { useMemo } from 'react';
import ArticlesList from '@features/ArticlesList/ui/ArticlesList';
import Pagination from './components/Pagination/Pagination';
import styles from './ArticlesListPage.module.scss';
import { useGetArticlesQuery } from '@features/ArticlesList/api/articlesListAPI';
import Loader from '@shared/ui/Loader/Loader';
import { toastService } from '@shared/lib/toast/toastService';
import { useParams } from 'react-router-dom';

export default function ArticlesListPage() {
  const { page } = useParams();
  const currentPage = Number(page) || 1;

  const {
    isLoading,
    isError,
    isFetching,
    error,
    data = { articles: [], articlesCount: 0 },
  } = useGetArticlesQuery(currentPage);

  const pagesCount = useMemo(
    () => Math.ceil(data.articlesCount / 5),
    [data.articlesCount],
  );

  if (isError) {
    toastService.error({
      message: `Oops! Something went wrong. ${error}`,
      options: {
        autoClose: 5000,
      },
    });
    return null;
  }

  return (
    <div className={styles.articlesListPage}>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {(isFetching && <Loader />) || (
            <ArticlesList articles={data.articles} />
          )}
          <Pagination totalPages={pagesCount} />
        </>
      )}
    </div>
  );
}
