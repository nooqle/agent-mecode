'use client';

import React from 'react';

interface AgentCardProps {
  svgContent: string;
  className?: string;
}

/**
 * Component to display the ACP SVG identity card
 */
export const AgentCard: React.FC<AgentCardProps> = ({ svgContent, className = '' }) => {
  return (
    <div
      className={`w-full max-w-md mx-auto ${className}`}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};
