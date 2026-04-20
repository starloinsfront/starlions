import { ComponentPropsWithoutRef, ReactNode } from 'react';
import s from './Button.module.css';


type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'link';

type Props =  {
  variant?: ButtonVariant;
  children: ReactNode;
} & ComponentPropsWithoutRef<'button'>

export const Button = ({
                         variant = 'primary',
                         children,
                         className,
                         ...rest
                       }: Props) => {

  const classNames = `${s.button} ${s[variant]} ${className || ''}`;

  return (
    <button className={classNames} {...rest}>
      {children}
    </button>
  );
};
