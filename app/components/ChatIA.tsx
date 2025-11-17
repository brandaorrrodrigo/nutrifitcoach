'use client';

import { useState } from 'react';

interface ChatProps {
  plano: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatIA({ plano, isOpen, onClose }: ChatProps) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Olá! Como posso ajudar?' }
  ]);
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full h-[500px] flex flex-col">
        <div className="bg-blue-500 text-white p-6 rounded-t-3xl flex justify-between items-center">
          <h2 className="text-2xl font-bold">Chat IA</h2>
          <button onClick={onClose} className="text-white text-3xl">&times;</button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className="bg-gray-100 p-4 rounded-xl">
              <p className="text-gray-900">{msg.content}</p>
            </div>
          ))}
        </div>

        <div className="p-6 border-t">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="w-full px-4 py-3 border-2 rounded-xl text-gray-900"
          />
        </div>
      </div>
    </div>
  );
}
