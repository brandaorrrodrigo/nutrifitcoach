"use client";

import dynamic from "next/dynamic";

// ⚡ LAZY LOAD - ChatBot carregado apenas quando necessário (não vai no bundle inicial)
const ChatBot = dynamic(() => import("@/components/shared/ChatBot"), {
  ssr: false,
  loading: () => null, // Sem skeleton, apenas carrega silenciosamente
});

const MobileNav = dynamic(() => import("@/components/ui/MobileNav"), {
  ssr: false,
});

export function ClientComponents() {
  return (
    <>
      <MobileNav />
      <ChatBot />
    </>
  );
}
