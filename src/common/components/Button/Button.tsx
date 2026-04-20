import { ComponentPropsWithoutRef, ReactNode } from 'react';
import s from './Button.module.css';

// Обновляем список вариантов под макет
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'link';

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: ButtonVariant;
  children: ReactNode;
  fullWidth?: boolean;
}

export const Button = ({
                         variant = 'primary',
                         fullWidth,
                         children,
                         className,
                         ...rest
                       }: ButtonProps) => {

  const classNames = `${s.button} ${s[variant]} ${fullWidth ? s.fullWidth : ''} ${className || ''}`;

  return (
    <button className={classNames} {...rest}>
      {children}
    </button>
  );
};
