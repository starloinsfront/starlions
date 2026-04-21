import {ComponentPropsWithoutRef, ReactNode, useId, useState} from 'react';
import s from './TextField.module.css';

export type Props = {
  label?: string;
  errorMessage?: string;
  iconStart?: ReactNode; // Для лупы в поиске
  iconEnd?: ReactNode;   // Для иконки "глазика"
} & ComponentPropsWithoutRef<'input'>;

export const TextField = ({
                            label,
                            errorMessage,
                            iconStart,
                            iconEnd,
                            className,
                            type,
                            id,
                            ...rest
                          }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const generatedId = useId();
  const finalId = id || generatedId;

  // Логика для переключения видимости пароля
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  const containerClasses = `${s.inputContainer} ${errorMessage ? s.error : ''} ${className || ''}`;

  return (
    <div className={containerClasses}>
      {label && <label htmlFor={finalId} className={s.label}>{label}</label>}

      <div className={s.inputWrapper}>
        {iconStart && <span className={s.iconStart}>{iconStart}</span>}

        <input
          id={finalId}
          type={inputType}
          className={`${s.input} ${iconStart ? s.withIconStart : ''} ${iconEnd || isPassword ? s.withIconEnd : ''}`}
          {...rest}
        />

        {isPassword ? (
          <button
            type="button"
            className={s.iconEnd}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '👁️' : '🕶️'}
          </button>
        ) : (
          iconEnd && <span className={s.iconEnd}>{iconEnd}</span>
        )}
      </div>

      {errorMessage && <span className={s.errorText}>{errorMessage}</span>}
    </div>
  );
};
