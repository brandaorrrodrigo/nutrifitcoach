'use client';

import React, { useState } from 'react';
import Button from './Button';

interface CardapioViewerProps {
  htmlContent: string;
  title?: string;
}

export default function CardapioViewer({ htmlContent, title = 'Seu Cardápio Personalizado' }: CardapioViewerProps) {
  const [printMode, setPrintMode] = useState(false);

  const handlePrint = () => {
    setPrintMode(true);
    setTimeout(() => {
      window.print();
      setPrintMode(false);
    }, 100);
  };

  const handleDownloadPDF = async () => {
    try {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <title>${title}</title>
              <style>
                body {
                  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                  max-width: 800px;
                  margin: 0 auto;
                  padding: 40px 20px;
                  color: #1f2937;
                  line-height: 1.6;
                }
                h1 {
                  font-size: 32px;
                  font-weight: 700;
                  color: #a855f7;
                  margin-bottom: 24px;
                  text-align: center;
                }
                h2 {
                  font-size: 24px;
                  font-weight: 600;
                  color: #22c55e;
                  margin-top: 32px;
                  margin-bottom: 16px;
                  border-bottom: 2px solid #22c55e;
                  padding-bottom: 8px;
                }
                h3 {
                  font-size: 20px;
                  font-weight: 600;
                  color: #ec4899;
                  margin-top: 24px;
                  margin-bottom: 12px;
                }
                p {
                  margin: 12px 0;
                }
                strong {
                  color: #000;
                  font-weight: 600;
                }
                ul {
                  margin: 12px 0;
                  padding-left: 24px;
                }
                li {
                  margin: 8px 0;
                }
                .header {
                  text-align: center;
                  margin-bottom: 40px;
                  padding-bottom: 20px;
                  border-bottom: 3px solid #a855f7;
                }
                .footer {
                  text-align: center;
                  margin-top: 40px;
                  padding-top: 20px;
                  border-top: 2px solid #e5e7eb;
                  color: #6b7280;
                  font-size: 14px;
                }
                @media print {
                  body { padding: 20px; }
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>🥗 NutriFitCoach</h1>
                <p style="color: #6b7280; font-size: 18px;">${title}</p>
              </div>
              ${htmlContent}
              <div class="footer">
                <p>Gerado por NutriFitCoach • Seu assistente nutricional com IA</p>
                <p>Data: ${new Date().toLocaleDateString('pt-BR')}</p>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 500);
      }
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    }
  };

  return (
    <div className={printMode ? 'print-mode' : ''}>
      {/* Ações (ocultas na impressão) */}
      {!printMode && (
        <div className="flex flex-wrap gap-3 mb-6 print:hidden">
          <Button size="md" onClick={handleDownloadPDF}>
            📄 Gerar PDF
          </Button>
          <Button variant="secondary" size="md" onClick={handlePrint}>
            🖨️ Imprimir
          </Button>
        </div>
      )}

      {/* Conteúdo do cardápio */}
      <div
        className="cardapio-content prose prose-lg max-w-none
          prose-headings:font-bold
          prose-h1:text-h2 prose-h1:text-nutrifit-purple-600 prose-h1:mb-6
          prose-h2:text-h3 prose-h2:text-nutrifit-green-600 prose-h2:border-b-2 prose-h2:border-nutrifit-green-200 prose-h2:pb-2 prose-h2:mb-4 prose-h2:mt-8
          prose-h3:text-h4 prose-h3:text-nutrifit-pink-600 prose-h3:mb-3 prose-h3:mt-6
          prose-p:text-gray-700 prose-p:my-3
          prose-strong:text-gray-900 prose-strong:font-semibold
          prose-ul:my-3 prose-li:my-2
          prose-a:text-nutrifit-purple-600 prose-a:no-underline hover:prose-a:underline
        "
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      {/* Estilos para impressão */}
      <style jsx>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          .cardapio-content {
            font-size: 12pt;
            line-height: 1.5;
          }
        }
      `}</style>
    </div>
  );
}
