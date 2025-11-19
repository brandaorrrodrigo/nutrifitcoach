'use client';

import React from 'react';
import type { HormonalProfileClassification } from '@/lib/hormonal/types';

interface HormonalProfileCardProps {
  profile: HormonalProfileClassification;
}

/**
 * Card para exibir resumo do perfil hormonal no dashboard
 */
export function HormonalProfileCard({ profile }: HormonalProfileCardProps) {
  const profileIcons: Record<string, string> = {
    SOP: '🌸',
    ciclo_regular: '🌙',
    ciclo_irregular: '🌊',
    menopausa: '🦋',
    climaterio: '🌺',
    THM: '💊',
    endometriose: '🌷',
    resistencia_insulina: '⚡',
    hipotireoidismo: '🦴',
    anticoncepcional: '💜',
  };

  return (
    <div className="bg-gradient-to-br from-pink-50 via-lavender-50 to-peach-50 rounded-3xl p-6 shadow-lg border border-pink-100">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="text-3xl">
          {profileIcons[profile.perfil_hormonal] || '🌸'}
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-800">Seu Perfil Hormonal</h3>
          <p className="text-sm text-gray-600">
            {profile.perfil_hormonal.toUpperCase()}
            {profile.subperfil && ` • ${profile.subperfil.replace(/_/g, ' ')}`}
          </p>
        </div>
      </div>

      {/* Key Adjustments */}
      {profile.ajustes_nutricionais.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-sm text-gray-700 mb-2">
            Ajustes Nutricionais Principais:
          </h4>
          <ul className="space-y-2">
            {profile.ajustes_nutricionais.slice(0, 3).map((ajuste, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-pink-500 mt-0.5">→</span>
                <span>{ajuste}</span>
              </li>
            ))}
          </ul>
          {profile.ajustes_nutricionais.length > 3 && (
            <button className="text-xs text-pink-600 font-medium mt-2 hover:text-pink-700">
              Ver todos os {profile.ajustes_nutricionais.length} ajustes →
            </button>
          )}
        </div>
      )}

      {/* Alerts */}
      {profile.alertas.length > 0 && (
        <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-200">
          <h4 className="font-semibold text-sm text-yellow-800 mb-1 flex items-center gap-1">
            <span>⚠️</span>
            <span>Alertas Importantes</span>
          </h4>
          <ul className="space-y-1">
            {profile.alertas.slice(0, 2).map((alerta, index) => (
              <li key={index} className="text-xs text-yellow-700">
                • {alerta}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Edit Button */}
      <button className="w-full mt-4 py-2 px-4 bg-white hover:bg-pink-50 border border-pink-200 rounded-full text-sm font-medium text-pink-600 transition-all">
        Atualizar perfil hormonal
      </button>
    </div>
  );
}
