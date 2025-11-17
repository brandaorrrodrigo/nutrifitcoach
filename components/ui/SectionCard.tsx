import React from 'react';

interface SectionCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  noPadding?: boolean;
  className?: string;
}

export default function SectionCard({
  title,
  subtitle,
  children,
  noPadding = false,
  className = '',
}: SectionCardProps) {
  return (
    <div
      className={`bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden ${className}`}
    >
      {(title || subtitle) && (
        <div className="px-8 py-6 border-b border-gray-100">
          {title && <h3 className="text-h3 font-bold text-gray-900 mb-1">{title}</h3>}
          {subtitle && <p className="text-body text-gray-600">{subtitle}</p>}
        </div>
      )}

      <div className={noPadding ? '' : 'p-8'}>{children}</div>
    </div>
  );
}
