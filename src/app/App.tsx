import RouterProvider from './providers/RouterProvider';
import StoreProvider from './providers/StoreProvider';
import AuthProvider from './providers/AuthProvider';
import { ToastProvider } from './providers/ToastProvider';

function App() {
  return (
    <StoreProvider>
      <AuthProvider>
        <ToastProvider>
          <RouterProvider />
        </ToastProvider>
      </AuthProvider>
    </StoreProvider>
  );
}

export default App;
