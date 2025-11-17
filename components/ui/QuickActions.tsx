'use client';

import React from 'react';

interface QuickAction {
  icon: string;
  label: string;
  description: string;
  onClick: () => void;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

export default function QuickActions({ actions }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          className="bg-white border-2 border-gray-200 rounded-2xl p-6 text-left hover:border-nutrifit-purple-500 hover:shadow-lg transition-all group"
        >
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
            {action.icon}
          </div>
          <h4 className="font-bold text-gray-900 mb-2">{action.label}</h4>
          <p className="text-sm text-gray-600">{action.description}</p>
        </button>
      ))}
    </div>
  );
}
