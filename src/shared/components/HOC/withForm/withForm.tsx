import React, { useRef } from 'react';
import {
  useForm,
  UseFormReturn,
  FieldValues,
  DefaultValues,
} from 'react-hook-form';
import './Form.scss';

export interface BaseFormData {
  email?: string;
  password?: string;
  username?: string;
}

export interface FormProps {
  title: string;
  defaultValues?: Record<string, string | boolean | number>;
}

// Интерфейс для компонентов с методом onFormSubmit
interface FormComponentRef<T = unknown> {
  onFormSubmit?: (data: T) => Promise<void> | void;
}

// Определение типа для компонента, который будет обернут
type WrappedComponentType<T extends FieldValues, P> =
  | React.ForwardRefExoticComponent<
      P & React.RefAttributes<FormComponentRef<T>>
    >
  | React.ComponentType<P>;

export const withForm = <
  T extends FieldValues = FieldValues,
  P extends { title: string; form?: UseFormReturn<T> } = {
    title: string;
    form?: UseFormReturn<T>;
  },
>(
  WrappedComponent: WrappedComponentType<T, P>,
  widthInVw = 29,
) => {
  type WithFormProps = Omit<P, 'form'> & FormProps;

  const WithFormComponent = (props: WithFormProps) => {
    const { title, defaultValues, ...rest } = props;

    // Приведение типа defaultValues к требуемому типу для useForm
    const form = useForm<T>({
      defaultValues: defaultValues
        ? (defaultValues as unknown as DefaultValues<T>)
        : undefined,
    });

    const handleSubmit = form.handleSubmit(async (data) => {
      const wrappedComponentInstance = wrappedRef.current;
      if (wrappedComponentInstance?.onFormSubmit) {
        await wrappedComponentInstance.onFormSubmit(data);
      }
    });

    const wrappedRef = useRef<FormComponentRef<T>>(null);

    // Создаем объект пропсов с правильной типизацией
    const componentProps = {
      ...rest,
      form,
      title,
    } as P;

    return (
      <form
        className={'base-form'}
        style={{ width: `${widthInVw}vw` }}
        onSubmit={handleSubmit}
      >
        <h2>{title}</h2>
        <WrappedComponent ref={wrappedRef} {...componentProps} />
      </form>
    );
  };

  const wrappedComponentName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WithFormComponent.displayName = `WithForm(${wrappedComponentName})`;

  return WithFormComponent;
};
