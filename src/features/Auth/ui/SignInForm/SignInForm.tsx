import React, { useImperativeHandle } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UseFormReturn } from 'react-hook-form';
import {
  withForm,
  BaseFormData,
} from '@shared/components/HOC/withForm/withForm';
import { useLoginMutation } from '../../api/authSliceApi';
import { useAppDispatch } from '@shared/hooks/redux';
import { setCurrentUser, CurrentUser } from '@entities/User';

export interface SignInFormData extends BaseFormData {
  email: string;
  password: string;
}

interface SignInFormProps {
  form: UseFormReturn<SignInFormData>;
  title: string;
}

const SignInFormContent = React.forwardRef<
  { onFormSubmit: (data: SignInFormData) => Promise<void> },
  SignInFormProps
>(({ form }, ref) => {
  const [loginMutationTrigger, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    setError,
    clearErrors,
  } = form;

  // Сброс общей ошибки при начале ввода
  const clearRootError = () => {
    if (errors.root) {
      clearErrors('root');
    }
  };

  useImperativeHandle(ref, () => ({
    onFormSubmit: async (data: SignInFormData) => {
      try {
        const response = await loginMutationTrigger({
          user: {
            email: data.email,
            password: data.password,
          },
        }).unwrap();

        // Сохраняем токен в localStorage
        localStorage.setItem('token', response.user.token);

        // Сохраняем данные пользователя в Redux store
        const userData: CurrentUser = {
          email: response.user.email,
          username: response.user.username,
          token: response.user.token,
          image: response.user.image,
          bio: response.user.bio,
        };

        dispatch(setCurrentUser(userData));

        // Перенаправляем пользователя на домашнюю страницу
        navigate('/');
      } catch (err: unknown) {
        //TODO: Сообщение об ошибке. Tostify
        // Определяем тип ошибки от API
        interface ApiError {
          data?: {
            errors?: Record<string, string>;
            message?: string;
          };
        }

        // Проверяем, соответствует ли err ожидаемой структуре
        const apiError = err as ApiError;

        const errors = apiError.data?.errors;
        if (errors) {
          let msg = '';
          Object.entries(errors).forEach(([key, value]) => {
            msg += `${key} ${value}\n`;
          });
          setError('root', {
            type: 'server',
            message: msg,
          });
        }
      }
    },
  }));

  return (
    <fieldset disabled={isLoading}>
      <div className="form-group">
        <label>Email address</label>
        <input
          placeholder="Email"
          type="email"
          autoComplete="email"
          disabled={isLoading}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
            onChange: clearRootError,
          })}
        />
        {errors.email && (
          <span className="error-message">{errors.email.message}</span>
        )}
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          placeholder="Password"
          type="password"
          autoComplete="current-password"
          disabled={isLoading}
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
            onChange: clearRootError,
          })}
        />
        {errors.password && (
          <span className="error-message">{errors.password.message}</span>
        )}
      </div>

      {errors.root?.message && (
        <span className="error-message">{errors.root?.message}</span>
      )}

      <button disabled={isLoading} type="submit" className="form-button">
        Login
      </button>

      <p className="form-link">
        Don&apos;t have an account?<Link to="/sign-up">Sign Up</Link>
      </p>
    </fieldset>
  );
});

SignInFormContent.displayName = 'SignInFormContent';

export const SignInForm = withForm<SignInFormData, SignInFormProps>(
  SignInFormContent,
);
