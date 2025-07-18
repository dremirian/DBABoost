import React from 'react';

interface MetricsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'gray';
  icon?: React.ReactNode;
}

export const MetricsCard: React.FC<MetricsCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  color = 'blue',
  icon 
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    gray: 'bg-gray-50 text-gray-700 border-gray-200'
  };

  return (
    <div className={`p-6 rounded-lg border-2 ${colorClasses[color]}`}>
      <div className="flex items-center gap-3">
        {icon && <div className="text-2xl">{icon}</div>}
        <div className="flex-1">
          <h3 className="text-sm font-medium opacity-75">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
          {subtitle && <p className="text-sm opacity-75 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};