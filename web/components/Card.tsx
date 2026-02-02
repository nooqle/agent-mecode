import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

/**
 * Moltbook-style card component with pixel borders
 */
export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  glow = false,
}) => {
  return (
    <div
      className={`
        bg-moltbook-bg-alt border-2 border-moltbook-border rounded-lg p-6
        ${glow ? 'glow-border animate-glow' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
