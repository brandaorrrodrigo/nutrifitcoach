import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { checkRateLimit } from "@/lib/security/rate-limit";
import { validateUploadFile, sanitizeFilename } from "@/lib/security/validation";
import { compressProgressPhoto } from "@/lib/image-compression";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // 🔒 RATE LIMITING
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email || undefined;

    const rateLimitResponse = checkRateLimit(request, 'upload-foto', userEmail);
    if (rateLimitResponse) {
      return rateLimitResponse; // 429 Too Many Requests
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    // 🔒 VALIDAÇÃO DE INPUT
    const validation = validateUploadFile(file, 5, ['jpg', 'jpeg', 'png', 'webp']);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 🖼️ COMPRIMIR IMAGEM
    // Reduz para max 1920x1080, quality 85, formato webp
    const compressedBuffer = await compressProgressPhoto(buffer);

    // Salvar no public/uploads com nome sanitizado (sempre .webp)
    const baseFilename = (validation.sanitizedName || 'upload').replace(/\.[^.]+$/, '');
    const safeFilename = `${Date.now()}-${baseFilename}.webp`;
    const filepath = path.join(process.cwd(), 'public/uploads', safeFilename);

    await writeFile(filepath, compressedBuffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${safeFilename}`
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
