import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { processProgressPhoto, validateImage, cleanupTempFiles } from '@/lib/image/watermark';

/**
 * POST /api/progress-photos/upload
 *
 * Upload de foto de evolução com marca d'água
 *
 * Body (multipart/form-data):
 * - photo: File (imagem)
 * - photoType: 'frontal' | 'posterior' | 'lado_direito' | 'lado_esquerdo'
 * - sessionId: string (opcional - se não informado, cria nova sessão)
 * - weight: number
 * - height: number
 * - age: number
 * - bodyFat: number (opcional)
 * - notes: string (opcional)
 */
export async function POST(request: Request) {
  try {
    // 1. Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    // 2. Criar cliente Supabase
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        error: 'Configuração do servidor incorreta'
      }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // 3. Buscar usuário
    const { data: user } = await supabase
      .from('AppUser')
      .select('id')
      .eq('email', session.user.email)
      .maybeSingle();

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // 4. Parse do FormData
    const formData = await request.formData();
    const photo = formData.get('photo') as File;
    const photoType = formData.get('photoType') as string;
    let sessionId = formData.get('sessionId') as string | null;
    const weight = parseFloat(formData.get('weight') as string);
    const height = parseFloat(formData.get('height') as string);
    const age = parseInt(formData.get('age') as string);
    const bodyFat = formData.get('bodyFat') ? parseFloat(formData.get('bodyFat') as string) : null;
    const notes = formData.get('notes') as string | null;

    // 5. Validações de campos obrigatórios
    if (!photo || !photoType || !weight || !height || !age) {
      return NextResponse.json({
        error: 'Campos obrigatórios: photo, photoType, weight, height, age'
      }, { status: 400 });
    }

    // 5a. Validação de tipo de foto
    const validPhotoTypes = ['frontal', 'posterior', 'lado_direito', 'lado_esquerdo'] as const;
    if (!validPhotoTypes.includes(photoType as any)) {
      return NextResponse.json({
        error: 'photoType inválido. Use: frontal, posterior, lado_direito, lado_esquerdo'
      }, { status: 400 });
    }

    // 5b. Validações numéricas com ranges
    const VALIDATION_RULES = {
      weight: { min: 30, max: 300 },
      height: { min: 100, max: 250 },
      age: { min: 10, max: 100 },
      bodyFat: { min: 3, max: 70 }
    } as const;

    // Validar peso
    if (isNaN(weight)) {
      return NextResponse.json({
        error: 'Peso deve ser um número válido'
      }, { status: 400 });
    }
    if (weight < VALIDATION_RULES.weight.min || weight > VALIDATION_RULES.weight.max) {
      return NextResponse.json({
        error: `Peso deve estar entre ${VALIDATION_RULES.weight.min} e ${VALIDATION_RULES.weight.max} kg`
      }, { status: 400 });
    }

    // Validar altura
    if (isNaN(height)) {
      return NextResponse.json({
        error: 'Altura deve ser um número válido'
      }, { status: 400 });
    }
    if (height < VALIDATION_RULES.height.min || height > VALIDATION_RULES.height.max) {
      return NextResponse.json({
        error: `Altura deve estar entre ${VALIDATION_RULES.height.min} e ${VALIDATION_RULES.height.max} cm`
      }, { status: 400 });
    }

    // Validar idade
    if (isNaN(age)) {
      return NextResponse.json({
        error: 'Idade deve ser um número válido'
      }, { status: 400 });
    }
    if (age < VALIDATION_RULES.age.min || age > VALIDATION_RULES.age.max) {
      return NextResponse.json({
        error: `Idade deve estar entre ${VALIDATION_RULES.age.min} e ${VALIDATION_RULES.age.max} anos`
      }, { status: 400 });
    }

    // Validar % gordura (se fornecido)
    if (bodyFat !== null) {
      if (isNaN(bodyFat)) {
        return NextResponse.json({
          error: 'Percentual de gordura deve ser um número válido'
        }, { status: 400 });
      }
      if (bodyFat < VALIDATION_RULES.bodyFat.min || bodyFat > VALIDATION_RULES.bodyFat.max) {
        return NextResponse.json({
          error: `Percentual de gordura deve estar entre ${VALIDATION_RULES.bodyFat.min} e ${VALIDATION_RULES.bodyFat.max}%`
        }, { status: 400 });
      }
    }

    // Validar tamanho de observações
    if (notes && notes.length > 500) {
      return NextResponse.json({
        error: 'Observações não podem ter mais de 500 caracteres'
      }, { status: 400 });
    }

    // 6. Salvar arquivo temporário
    const tempDir = path.join(process.cwd(), 'tmp', 'uploads');
    await mkdir(tempDir, { recursive: true });

    const bytes = await photo.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const tempFileName = `${uuidv4()}_${photo.name}`;
    const tempFilePath = path.join(tempDir, tempFileName);
    await writeFile(tempFilePath, buffer);

    // 7. Validar imagem
    const isValidImage = await validateImage(tempFilePath);
    if (!isValidImage) {
      await cleanupTempFiles([tempFilePath]);
      return NextResponse.json({
        error: 'Imagem inválida. Use JPEG, PNG ou WebP com dimensões entre 200x200 e 8000x8000'
      }, { status: 400 });
    }

    // 8. Criar ou buscar sessão
    const sessionDate = new Date();

    if (!sessionId) {
      // Criar nova sessão
      sessionId = uuidv4();

      const { error: sessionError } = await supabase
        .from('ProgressSession')
        .insert({
          id: sessionId,
          user_id: user.id,
          session_date: sessionDate.toISOString(),
          weight_kg: weight,
          height_cm: height,
          age_years: age,
          body_fat_percent: bodyFat,
          bmi: calculateBMI(weight, height),
          lean_mass_kg: bodyFat ? calculateLeanMass(weight, bodyFat) : null,
          fat_mass_kg: bodyFat ? calculateFatMass(weight, bodyFat) : null,
          notes: notes,
          photos_count: 0,
          is_complete: false,
          created_at: sessionDate.toISOString(),
          updated_at: sessionDate.toISOString()
        });

      if (sessionError) {
        console.error('Erro ao criar sessão:', sessionError);
        await cleanupTempFiles([tempFilePath]);
        return NextResponse.json({
          error: 'Erro ao criar sessão de fotos'
        }, { status: 500 });
      }
    } else {
      // Verificar se a sessão existe e pertence ao usuário
      const { data: existingSession, error: sessionError } = await supabase
        .from('ProgressSession')
        .select('id, user_id, photos_count')
        .eq('id', sessionId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (sessionError || !existingSession) {
        await cleanupTempFiles([tempFilePath]);
        return NextResponse.json({
          error: 'Sessão não encontrada ou não pertence ao usuário'
        }, { status: 404 });
      }

      // Verificar se já tem foto deste tipo nesta sessão
      const { data: existingPhoto } = await supabase
        .from('ProgressPhoto')
        .select('id')
        .eq('session_id', sessionId)
        .eq('photo_type', photoType)
        .maybeSingle();

      if (existingPhoto) {
        await cleanupTempFiles([tempFilePath]);
        return NextResponse.json({
          error: `Já existe uma foto do tipo "${photoType}" nesta sessão`
        }, { status: 409 });
      }
    }

    // 9. Processar imagem com marca d'água
    const outputDir = path.join(process.cwd(), 'public', 'uploads', 'progress', user.id, sessionId);
    const outputFileName = `${photoType}_${Date.now()}.jpg`;

    const processResult = await processProgressPhoto(
      tempFilePath,
      outputDir,
      outputFileName,
      {
        logoText: 'NutriFitCoach',
        websiteUrl: 'NutriFitCoach.com.br',
        position: 'bottom-right',
        opacity: 0.4
      }
    );

    // 10. Gerar URLs públicas
    const baseUrl = `/uploads/progress/${user.id}/${sessionId}`;
    const originalUrl = `${baseUrl}/original_${outputFileName}`;
    const watermarkedUrl = `${baseUrl}/watermarked_${outputFileName}`;
    const thumbUrl = `${baseUrl}/thumb_${outputFileName}`;

    // 11. Salvar no banco
    const photoId = uuidv4();
    const { error: photoError } = await supabase
      .from('ProgressPhoto')
      .insert({
        id: photoId,
        user_id: user.id,
        session_id: sessionId,
        photo_type: photoType,
        original_url: originalUrl,
        watermarked_url: watermarkedUrl,
        thumb_url: thumbUrl,
        taken_at: sessionDate.toISOString(),
        weight_kg: weight,
        height_cm: height,
        age_years: age,
        body_fat_percent: bodyFat,
        width: processResult.width,
        height: processResult.height,
        file_size_bytes: processResult.fileSize,
        sha256: processResult.sha256,
        visibility: 'private',
        shared_to: [],
        likes_count: 0,
        comments_count: 0,
        shares_count: 0,
        created_at: sessionDate.toISOString(),
        updated_at: sessionDate.toISOString()
      });

    if (photoError) {
      console.error('Erro ao salvar foto:', photoError);
      await cleanupTempFiles([tempFilePath]);
      return NextResponse.json({
        error: 'Erro ao salvar foto no banco de dados'
      }, { status: 500 });
    }

    // 12. Atualizar contador de fotos na sessão
    const { data: sessionPhotos } = await supabase
      .from('ProgressPhoto')
      .select('id')
      .eq('session_id', sessionId);

    const photosCount = sessionPhotos?.length || 0;
    const isComplete = photosCount >= 4;

    await supabase
      .from('ProgressSession')
      .update({
        photos_count: photosCount,
        is_complete: isComplete,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    // 13. Limpar arquivo temporário
    await cleanupTempFiles([tempFilePath]);

    // 14. Retornar sucesso
    return NextResponse.json({
      success: true,
      photo: {
        id: photoId,
        sessionId,
        photoType,
        watermarkedUrl,
        thumbUrl,
        width: processResult.width,
        height: processResult.height
      },
      session: {
        id: sessionId,
        photosCount,
        isComplete
      }
    });

  } catch (error) {
    console.error('❌ Erro ao fazer upload:', error);
    const message = error instanceof Error ? error.message : 'Erro ao processar upload. Tente novamente.';
    return NextResponse.json({
      error: message
    }, { status: 500 });
  }
}

// Funções auxiliares de cálculo
function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return parseFloat((weightKg / (heightM * heightM)).toFixed(2));
}

function calculateLeanMass(weightKg: number, bodyFatPercent: number): number {
  return parseFloat((weightKg * (1 - bodyFatPercent / 100)).toFixed(2));
}

function calculateFatMass(weightKg: number, bodyFatPercent: number): number {
  return parseFloat((weightKg * (bodyFatPercent / 100)).toFixed(2));
}
