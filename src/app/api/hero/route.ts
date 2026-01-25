import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Hero from '@/models/Hero';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    await dbConnect();
    const heroes = await Hero.find({}).sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: heroes });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const formData = await request.formData();
    const tag = formData.get('tag') as string;
    const headline = formData.get('headline') as string;
    const subheadline = formData.get('subheadline') as string;
    const mediaFile = formData.get('media') as File;
    const order = parseInt(formData.get('order') as string) || 0;

    if (!headline) {
      return NextResponse.json({ success: false, error: 'Headline is required' }, { status: 400 });
    }

    if (!mediaFile) {
      return NextResponse.json({ success: false, error: 'Media file is required' }, { status: 400 });
    }

    // Determine media type
    const mediaType = mediaFile.type.startsWith('video/') ? 'video' : 'image';

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    // Save Media File
    const bytes = await mediaFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-hero-${mediaFile.name.replace(/\s/g, '-')}`;
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);
    const mediaUrl = `/uploads/${filename}`;

    const hero = await Hero.create({
      tag,
      headline,
      subheadline,
      mediaUrl,
      mediaType,
      order,
    });

    return NextResponse.json({ success: true, data: hero }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/hero:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
