import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../Badge/Badge';

interface BreadcrumbProps {
  items: {
    label: string;
    path?: string;
  }[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const navigate = useNavigate();

  return (
    <div className="flex align-items-center gap-2 mb-4">
      {items.map((item, index) => (
        <React.Fragment key={item.label}>
          <div
            onClick={() => item.path && navigate(item.path)}
            className={item.path ? 'cursor-pointer' : undefined}
          >
            <Badge label={item.label} />
          </div>
          {index < items.length - 1 && (
            <i 
              className="pi pi-angle-right" 
              style={{ 
                color: '#666',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}; 