import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
  gradient?: 'pink' | 'green' | 'purple' | 'cyan' | 'nutrifit';
  align?: 'left' | 'center';
}

const gradientClasses = {
  pink: 'from-nutrifit-pink-500 to-nutrifit-pink-700',
  green: 'from-nutrifit-green-500 to-nutrifit-green-700',
  purple: 'from-nutrifit-purple-500 to-nutrifit-purple-700',
  cyan: 'from-nutrifit-cyan-500 to-nutrifit-cyan-700',
  nutrifit: 'from-nutrifit-pink-500 via-nutrifit-green-500 to-nutrifit-purple-600',
};

export default function PageHeader({
  title,
  subtitle,
  icon,
  gradient = 'nutrifit',
  align = 'center',
}: PageHeaderProps) {
  const alignClass = align === 'center' ? 'text-center' : 'text-left';

  return (
    <div className={`mb-8 ${alignClass}`}>
      {icon && (
        <div className={`text-6xl mb-4 ${align === 'center' ? 'flex justify-center' : ''}`}>
          {icon}
        </div>
      )}
      <h1
        className={`text-h1 md:text-display bg-gradient-to-r ${gradientClasses[gradient]} bg-clip-text text-transparent mb-3`}
      >
        {title}
      </h1>
      {subtitle && (
        <p className="text-body-lg text-gray-600 max-w-3xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
