/**
 * Biblioteca de marca d'água para fotos de evolução
 * Usa Sharp para processar imagens e adicionar branding do NutriFitCoach
 */

import sharp from 'sharp';
import path from 'path';
import { promises as fs } from 'fs';

export interface WatermarkOptions {
  logoText: string;
  websiteUrl: string;
  opacity?: number;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
  fontSize?: number;
  textColor?: string;
}

export interface ProcessImageResult {
  originalPath: string;
  watermarkedPath: string;
  thumbPath: string;
  width: number;
  height: number;
  fileSize: number;
  sha256: string;
}

const DEFAULT_OPTIONS: Partial<WatermarkOptions> = {
  opacity: 0.3,
  position: 'bottom-right',
  fontSize: 24,
  textColor: '#FFFFFF'
};

/**
 * Cria um SVG com o texto da marca d'água
 */
function createWatermarkSVG(options: WatermarkOptions, imageWidth: number, imageHeight: number): string {
  const { logoText, websiteUrl, opacity, position, fontSize, textColor } = {
    ...DEFAULT_OPTIONS,
    ...options
  };

  // Calcular posição
  let x = 20;
  let y = 20;
  let textAnchor = 'start';

  switch (position) {
    case 'bottom-right':
      x = imageWidth - 20;
      y = imageHeight - 40;
      textAnchor = 'end';
      break;
    case 'bottom-left':
      x = 20;
      y = imageHeight - 40;
      textAnchor = 'start';
      break;
    case 'top-right':
      x = imageWidth - 20;
      y = 40;
      textAnchor = 'end';
      break;
    case 'top-left':
      x = 20;
      y = 40;
      textAnchor = 'start';
      break;
    case 'center':
      x = imageWidth / 2;
      y = imageHeight / 2;
      textAnchor = 'middle';
      break;
  }

  return `
    <svg width="${imageWidth}" height="${imageHeight}">
      <defs>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@700&amp;display=swap');
          .watermark-text {
            font-family: 'Inter', sans-serif;
            font-weight: 700;
            font-size: ${fontSize}px;
          }
        </style>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#10b981;stop-opacity:${opacity}" />
          <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:${opacity}" />
        </linearGradient>
      </defs>

      <!-- Sombra para contraste -->
      <text
        x="${x + 2}"
        y="${y + 2}"
        text-anchor="${textAnchor}"
        class="watermark-text"
        fill="rgba(0,0,0,0.6)"
      >
        ${logoText}
      </text>

      <!-- Texto principal com gradiente -->
      <text
        x="${x}"
        y="${y}"
        text-anchor="${textAnchor}"
        class="watermark-text"
        fill="url(#gradient)"
      >
        ${logoText}
      </text>

      <!-- URL do site -->
      <text
        x="${x}"
        y="${y + fontSize + 5}"
        text-anchor="${textAnchor}"
        class="watermark-text"
        font-size="${fontSize * 0.5}px"
        fill="${textColor}"
        opacity="${opacity}"
      >
        ${websiteUrl}
      </text>
    </svg>
  `;
}

/**
 * Calcula SHA-256 de um arquivo
 */
async function calculateSHA256(filePath: string): Promise<string> {
  const crypto = await import('crypto');
  const fileBuffer = await fs.readFile(filePath);
  const hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

/**
 * Processa uma imagem: redimensiona, adiciona marca d'água e cria thumbnail
 */
export async function processProgressPhoto(
  inputPath: string,
  outputDir: string,
  fileName: string,
  watermarkOptions?: Partial<WatermarkOptions>
): Promise<ProcessImageResult> {
  // Garantir que o diretório de saída existe
  await fs.mkdir(outputDir, { recursive: true });

  // Paths de saída
  const originalPath = path.join(outputDir, `original_${fileName}`);
  const watermarkedPath = path.join(outputDir, `watermarked_${fileName}`);
  const thumbPath = path.join(outputDir, `thumb_${fileName}`);

  // Opções padrão de marca d'água
  const options: WatermarkOptions = {
    logoText: 'NutriFitCoach',
    websiteUrl: 'NutriFitCoach.com.br',
    ...watermarkOptions
  };

  // 1. Salvar original (redimensionado para max 1200px)
  const image = sharp(inputPath);
  const metadata = await image.metadata();

  await image
    .resize(1200, 1200, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .jpeg({ quality: 90 })
    .toFile(originalPath);

  // 2. Criar versão com marca d'água
  const originalImage = sharp(originalPath);
  const originalMetadata = await originalImage.metadata();
  const { width = 1200, height = 1200 } = originalMetadata;

  const watermarkSVG = createWatermarkSVG(options, width, height);
  const watermarkBuffer = Buffer.from(watermarkSVG);

  await originalImage
    .composite([
      {
        input: watermarkBuffer,
        blend: 'over'
      }
    ])
    .jpeg({ quality: 85 })
    .toFile(watermarkedPath);

  // 3. Criar thumbnail (300px)
  await sharp(watermarkedPath)
    .resize(300, 300, {
      fit: 'cover',
      position: 'center'
    })
    .jpeg({ quality: 80 })
    .toFile(thumbPath);

  // 4. Calcular hash e tamanho
  const sha256 = await calculateSHA256(originalPath);
  const stats = await fs.stat(watermarkedPath);

  return {
    originalPath,
    watermarkedPath,
    thumbPath,
    width,
    height,
    fileSize: stats.size,
    sha256
  };
}

/**
 * Remove arquivos temporários
 */
export async function cleanupTempFiles(filePaths: string[]): Promise<void> {
  await Promise.all(
    filePaths.map(async (filePath) => {
      try {
        await fs.unlink(filePath);
      } catch (error) {
        console.warn(`Failed to delete temp file: ${filePath}`, error);
      }
    })
  );
}

/**
 * Valida se o arquivo é uma imagem válida
 */
export async function validateImage(filePath: string): Promise<boolean> {
  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();

    // Validações básicas
    if (!metadata.width || !metadata.height) {
      return false;
    }

    // Verificar formato
    const validFormats = ['jpeg', 'jpg', 'png', 'webp'];
    if (!metadata.format || !validFormats.includes(metadata.format)) {
      return false;
    }

    // Verificar dimensões mínimas (200x200)
    if (metadata.width < 200 || metadata.height < 200) {
      return false;
    }

    // Verificar dimensões máximas (8000x8000)
    if (metadata.width > 8000 || metadata.height > 8000) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Image validation error:', error);
    return false;
  }
}
