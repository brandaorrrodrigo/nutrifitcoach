import type { Metadata, Viewport } from "next";
import "./globals.css";
import InstallPWA from "@/components/InstallPWA";
import SessionProvider from "@/components/auth/SessionProvider";
import { ClientComponents } from "@/components/ClientComponents";

export const metadata: Metadata = {
  title: "NutriFitCoach - Nutrição com IA",
  description: "Seu nutricionista pessoal com Inteligência Artificial",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "NutriFitCoach",
  },
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    siteName: "NutriFitCoach",
    title: "NutriFitCoach - Nutrição com IA",
    description: "Seu nutricionista pessoal com Inteligência Artificial",
  },
  twitter: {
    card: "summary_large_image",
    title: "NutriFitCoach",
    description: "Nutrição com Inteligência Artificial",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#0d9488",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/icon-192.png" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="NutriFitCoach" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-screen">
        <SessionProvider>
          {children}
          <InstallPWA />
          <ClientComponents />
        </SessionProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then(reg => console.log('SW registrado:', reg.scope))
                    .catch(err => console.error('Erro SW:', err));
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
