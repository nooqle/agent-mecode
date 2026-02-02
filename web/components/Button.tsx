import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

/**
 * Moltbook-style pixel button component
 * Features neon glow effects and cyberpunk styling
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
}) => {
  const baseStyles = 'font-mono font-bold uppercase tracking-wider transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-moltbook-primary text-moltbook-bg border-2 border-moltbook-primary hover:bg-transparent hover:text-moltbook-primary glow-border',
    secondary: 'bg-transparent text-moltbook-cyan border-2 border-moltbook-cyan hover:bg-moltbook-cyan hover:text-moltbook-bg',
    danger: 'bg-moltbook-red text-white border-2 border-moltbook-red hover:bg-transparent hover:text-moltbook-red',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </button>
  );
};
