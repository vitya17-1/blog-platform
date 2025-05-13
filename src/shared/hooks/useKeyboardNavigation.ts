// src/shared/hooks/useKeyboardNavigation.ts
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useKeyboardNavigation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const isInputField =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      if (
        (event.key === 'Backspace' && !isInputField) ||
        event.key === 'Escape'
      ) {
        event.preventDefault();
        navigate(-1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);
};
