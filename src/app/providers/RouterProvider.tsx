import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import MainLayout from '@app/layouts/MainLayout/MainLayout';
import NotFoundPage from '@pages/NotFound/NotFoundPage';
import ArticlesListPage from '@pages/ArticlesList/ArticlesListPage';
import ArticlePage from '@pages/Article/ArticlePage';
import SignInPage from '@pages/SignIn/SignInPage';
import SignUpPage from '@pages/SignUp/SignUpPage';
import ProfilePage from '@pages/Profile/ProfilePage';
import PrivateRoute from '@app/providers/PrivateRoute';

const RouterProvider = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<ArticlesListPage />} />
          <Route path="articles">
            <Route index element={<Navigate to="/" replace />} />
            <Route path="page/:page" element={<ArticlesListPage />} />
            <Route path=":id/*">
              <Route index element={<ArticlePage isDetailedArticle={true} />} />
              <Route path="edit" element={<ArticlePage isEditing={true} />} />
            </Route>
          </Route>
          <Route path="sign-in" element={<SignInPage />} />
          <Route path="sign-up" element={<SignUpPage />} />

          {/* Приватные маршруты */}
          <Route element={<PrivateRoute />}>
            <Route path="profile" element={<ProfilePage />} />
            <Route
              path="new-article"
              element={<ArticlePage isNewArticle={true} />}
            />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default RouterProvider;
