import React, { useImperativeHandle } from 'react';
import {
  withForm,
  BaseFormData,
} from '@shared/components/HOC/withForm/withForm';
import { useUpdateUserMutation } from '../../api/authSliceApi';
import { useAuth } from '@features/Auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface ProfileFormData extends BaseFormData {
  username: string;
  email: string;
  password?: string;
  avatarUrl?: string;
  image?: string;
}

const ProfileEditFormContent = React.forwardRef<
  { onFormSubmit: (data: ProfileFormData) => Promise<void> },
  { form? }
>(({ form: { register, formState, setError } }, ref) => {
  const [updateUserMutationTrigger, { isLoading }] = useUpdateUserMutation();
  const { currentUser, updateUser, logout } = useAuth();
  const { errors } = formState;
  const navigate = useNavigate();

  useImperativeHandle(ref, () => ({
    onFormSubmit: async (data: ProfileFormData) => {
      try {
        const userUpdate: {
          email: string;
          username: string;
          image?: string;
          bio?: string;
          password?: string;
        } = {
          username: data.username,
          email: data.email,
          image: data.avatarUrl,
        };

        if (data.password && data.password.trim() !== '') {
          userUpdate.password = data.password;
        }

        const response = await updateUserMutationTrigger({
          user: userUpdate,
        }).unwrap();

        if (data.password) {
          logout();
          navigate('/sign-in');
        } else {
          updateUser(response.user);
        }
      } catch (err: unknown) {
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
            setError(key as keyof ProfileFormData, {
              type: 'server',
              message: apiError.data!.errors![key],
            });
          });
        } else {
          setError('root', {
            type: 'server',
            message: apiError.data?.message || 'Произошла неизвестная ошибка',
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
          defaultValue={currentUser?.username}
          autoComplete="username"
          placeholder="Username"
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
          defaultValue={currentUser?.email}
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
        <label>New password</label>
        <input
          placeholder="New password"
          type="password"
          autoComplete="new-password"
          {...register('password', {
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
        <label>Avatar image (url)</label>
        <input
          defaultValue={currentUser?.image}
          placeholder="Avatar image"
          autoComplete="url"
          {...register('avatarUrl', {
            pattern: {
              value:
                /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
              message: 'Please enter a valid URL',
            },
          })}
        />
        {errors.avatarUrl && (
          <span className="error-message">{errors.avatarUrl.message}</span>
        )}
      </div>

      <button type="submit" className="form-button">
        Save
      </button>
    </fieldset>
  );
});

ProfileEditFormContent.displayName = 'ProfileEditFormContent';

export const ProfileEditForm = withForm(ProfileEditFormContent);
