import React from 'react';
import { customTheme } from '../../theme';

interface BadgeProps {
  label: string;
}

export const Badge: React.FC<BadgeProps> = ({ label }) => {
  return (
    <span style={{
      backgroundColor: customTheme.colors.buttonBackground,
      borderRadius: '12px',
      padding: '4px 12px',
      fontSize: '14px',
      display: 'inline-block'
    }}>
      {label}
    </span>
  );
};
