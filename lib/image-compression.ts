import sharp from 'sharp';

/**
 * Configurações de compressão de imagem
 */
interface CompressionConfig {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'webp' | 'png';
}

/**
 * Comprime e otimiza uma imagem mantendo aspect ratio
 *
 * @param buffer - Buffer da imagem original
 * @param config - Configurações de compressão (default: 1920x1080, quality 85, formato webp)
 * @returns Buffer da imagem comprimida
 */
export async function compressImage(
  buffer: Buffer,
  config: CompressionConfig = {}
): Promise<Buffer> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 85,
    format = 'webp',
  } = config;

  try {
    let image = sharp(buffer);

    // Obter metadados da imagem
    const metadata = await image.metadata();

    // Calcular novas dimensões mantendo aspect ratio
    let newWidth = metadata.width || maxWidth;
    let newHeight = metadata.height || maxHeight;

    if (newWidth > maxWidth || newHeight > maxHeight) {
      const aspectRatio = newWidth / newHeight;

      if (newWidth > maxWidth) {
        newWidth = maxWidth;
        newHeight = Math.round(newWidth / aspectRatio);
      }

      if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = Math.round(newHeight * aspectRatio);
      }
    }

    // Aplicar transformações
    image = image.resize(newWidth, newHeight, {
      fit: 'inside',
      withoutEnlargement: true,
    });

    // Aplicar compressão baseada no formato
    switch (format) {
      case 'webp':
        image = image.webp({ quality });
        break;
      case 'jpeg':
        image = image.jpeg({ quality, progressive: true });
        break;
      case 'png':
        image = image.png({ quality, progressive: true });
        break;
      default:
        image = image.webp({ quality });
    }

    return await image.toBuffer();
  } catch (error) {
    console.error('Erro ao comprimir imagem:', error);
    throw new Error('Falha ao processar imagem');
  }
}

/**
 * Otimiza imagem para thumbnail/avatar (pequenos)
 * Configuração: 400x400, quality 80, webp
 */
export async function compressAvatar(buffer: Buffer): Promise<Buffer> {
  return compressImage(buffer, {
    maxWidth: 400,
    maxHeight: 400,
    quality: 80,
    format: 'webp',
  });
}

/**
 * Otimiza imagem para fotos de progresso (médio)
 * Configuração: 1920x1080, quality 85, webp
 */
export async function compressProgressPhoto(buffer: Buffer): Promise<Buffer> {
  return compressImage(buffer, {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 85,
    format: 'webp',
  });
}
