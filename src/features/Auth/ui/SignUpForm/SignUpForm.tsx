import React, { useImperativeHandle } from 'react';
import { Link } from 'react-router-dom';
import { UseFormReturn } from 'react-hook-form';
import {
  withForm,
  BaseFormData,
} from '@shared/components/HOC/withForm/withForm';
import { useRegisterMutation } from '../../api/authSliceApi';

interface SignUpFormData extends BaseFormData {
  username: string;
  email: string;
  password: string;
  repeatPassword: string;
  agreeToTerms: boolean;
}

interface SignUpFormProps {
  form: UseFormReturn<SignUpFormData>;
  title: string;
}

const SignUpFormContent = React.forwardRef<
  { onFormSubmit: (data: SignUpFormData) => Promise<void> },
  SignUpFormProps
>(({ form }, ref) => {
  const [registerMutationTrigger, { isLoading }] = useRegisterMutation();
  const {
    register,
    formState: { errors },
    setError,
  } = form;

  useImperativeHandle(ref, () => ({
    onFormSubmit: async (data: SignUpFormData) => {
      try {
        const response = await registerMutationTrigger({
          user: {
            username: data.username,
            email: data.email,
            password: data.password,
          },
        }).unwrap();
        localStorage.setItem('token', response.user.token);
        window.location.href = '/';
        console.log(`success. token: ${response.user.token}`);
      } catch (err) {
        // Определяем тип ошибки от API
        interface ApiError {
          data?: {
            errors?: Record<string, string>;
            message?: string;
          };
        }

        // Проверяем, соответствует ли err ожидаемой структуре
        const apiError = err as ApiError;

        if (apiError.data?.errors) {
          Object.keys(apiError.data.errors).forEach((key) => {
            setError(key as keyof SignUpFormData, {
              type: 'server',
              message: apiError.data!.errors![key],
            });
          });
        } else {
          setError('root', {
            type: 'server',
            message: apiError.data!.message,
          });
        }
      }
    },
  }));

  return (
    <fieldset disabled={isLoading}>
      <div className="form-group">
        <label>Username</label>
        <input
          placeholder="Username"
          autoComplete="username"
          {...register('username', {
            required: 'Username is required',
            minLength: {
              value: 3,
              message: 'Username must be at least 3 characters',
            },
          })}
        />
        {errors.username && (
          <span className="error-message">{errors.username.message}</span>
        )}
      </div>

      <div className="form-group">
        <label>Email address</label>
        <input
          placeholder="Email address"
          type="email"
          autoComplete="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
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
          autoComplete="new-password"
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
        />
        {errors.password && (
          <span className="error-message">{errors.password.message}</span>
        )}
      </div>

      <div className="form-group">
        <label>Repeat Password</label>
        <input
          placeholder="Repeat Password"
          type="password"
          autoComplete="new-password"
          {...register('repeatPassword', {
            required: 'Please repeat your password',
            validate: (value, formValues) =>
              value === formValues.password || 'Passwords do not match',
          })}
        />
        {errors.repeatPassword && (
          <span className="error-message">{errors.repeatPassword.message}</span>
        )}
      </div>

      <div className="form-group checkbox-group">
        <div className="input-container">
          <input
            id="agreeToTerms"
            placeholder="I agree to the processing of my personal information"
            title="You must agree to the terms"
            type="checkbox"
            {...register('agreeToTerms', {
              required: 'You must agree to the terms',
            })}
          />
          <label htmlFor="agreeToTerms">
            I agree to the processing of my personal information
          </label>
        </div>
        {errors.agreeToTerms && (
          <span className="error-message">{errors.agreeToTerms.message}</span>
        )}
      </div>

      <button type="submit" className="form-button">
        Create
      </button>

      <p className="form-link">
        Already have an account? <Link to="/sign-in">Sign In</Link>
      </p>
    </fieldset>
  );
});

SignUpFormContent.displayName = 'SignUpFormContent';

export const SignUpForm = withForm<SignUpFormData, SignUpFormProps>(
  SignUpFormContent,
);
