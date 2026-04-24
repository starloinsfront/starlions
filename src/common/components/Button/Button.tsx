import clsx from 'clsx';
import { ComponentPropsWithoutRef, ReactNode } from 'react';
import s from './Button.module.css';


type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'link';

type Props =  {
  variant?: ButtonVariant;
  children: ReactNode;
  fullWidth?: boolean;
} & ComponentPropsWithoutRef<'button'>

export const Button = ({
                         variant = 'primary',
                         children,
                         className,
                         fullWidth,
                         ...rest
                       }: Props) => {

  const classNames = clsx(s.button, s[variant], { [s.fullWidth]: fullWidth }, className);

  return (
    <button className={classNames} {...rest}>
      {children}
    </button>
  );
};
