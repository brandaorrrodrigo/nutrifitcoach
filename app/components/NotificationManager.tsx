'use client';

import { useEffect } from 'react';

export default function NotificationManager() {
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      registerServiceWorker();
    }
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registrado!');
      
      // Solicitar permissão
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Permissão de notificação concedida!');
      }
    } catch (error) {
      console.error('Erro ao registrar Service Worker:', error);
    }
  };

  return null;
}

export const scheduleNotification = (title: string, body: string, delayMinutes: number) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    setTimeout(() => {
      new Notification(title, {
        body,
        icon: '/icon-192.png',
        badge: '/icon-192.png'
      });
    }, delayMinutes * 60 * 1000);
  }
};

export const sendInstantNotification = (title: string, body: string) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/icon-192.png',
      badge: '/icon-192.png'
    });
  }
};
