import React from 'react';

interface NoticeCardProps {
  type: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  children: React.ReactNode;
}

const typeConfig = {
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-900',
    icon: 'ℹ️',
    iconBg: 'bg-blue-100',
  },
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-900',
    icon: '✅',
    iconBg: 'bg-green-100',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-900',
    icon: '⚠️',
    iconBg: 'bg-yellow-100',
  },
  danger: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-900',
    icon: '🚨',
    iconBg: 'bg-red-100',
  },
};

export default function NoticeCard({ type, title, children }: NoticeCardProps) {
  const config = typeConfig[type];

  return (
    <div
      className={`${config.bg} ${config.border} ${config.text} border-2 rounded-xl p-6 flex gap-4`}
    >
      <div className={`${config.iconBg} w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-2xl`}>
        {config.icon}
      </div>
      <div className="flex-1">
        {title && <h4 className="font-bold text-lg mb-2">{title}</h4>}
        <div className="text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
