'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    newUsersToday: 0
  });

  useEffect(() => {
    // Simular dados (você vai conectar com API real)
    setStats({
      totalUsers: 127,
      activeSubscriptions: 89,
      totalRevenue: 8900,
      newUsersToday: 12
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <Link href="/" className="px-6 py-2 bg-purple-600 text-white rounded-xl font-bold">
            Ver Site
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-gray-600 mb-2">Total de Usuários</div>
            <div className="text-4xl font-bold text-gray-900">{stats.totalUsers}</div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-gray-600 mb-2">Assinaturas Ativas</div>
            <div className="text-4xl font-bold text-green-600">{stats.activeSubscriptions}</div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-gray-600 mb-2">Receita Total</div>
            <div className="text-4xl font-bold text-purple-600">R$ {stats.totalRevenue}</div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-gray-600 mb-2">Novos Hoje</div>
            <div className="text-4xl font-bold text-blue-600">{stats.newUsersToday}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Últimos Usuários</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Nome</th>
                  <th className="text-left p-4">Email</th>
                  <th className="text-left p-4">Plano</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Data</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4">João Silva</td>
                  <td className="p-4">joao@email.com</td>
                  <td className="p-4">Mensal</td>
                  <td className="p-4"><span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Ativo</span></td>
                  <td className="p-4">08/11/2025</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
