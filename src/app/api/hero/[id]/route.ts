import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Hero from '@/models/Hero';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const formData = await request.formData();
    const tag = formData.get('tag') as string;
    const headline = formData.get('headline') as string;
    const subheadline = formData.get('subheadline') as string;
    const mediaFile = formData.get('media') as File | null;
    const order = parseInt(formData.get('order') as string) || 0;

    const hero = await Hero.findById(id);

    if (!hero) {
      return NextResponse.json({ success: false, error: 'Hero slide not found' }, { status: 404 });
    }

    // Handle Media Update
    if (mediaFile && mediaFile instanceof File) {
      // Delete old media
      if (hero.mediaUrl && hero.mediaUrl.startsWith('/uploads/')) {
        const oldPath = path.join(process.cwd(), 'public', hero.mediaUrl);
        try {
          await unlink(oldPath);
        } catch (e) {
          console.warn('Failed to delete old hero media:', e);
        }
      }

      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      const bytes = await mediaFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-hero-${mediaFile.name.replace(/\s/g, '-')}`;
      const filepath = path.join(uploadDir, filename);
      await writeFile(filepath, buffer);
      
      hero.mediaUrl = `/uploads/${filename}`;
      hero.mediaType = mediaFile.type.startsWith('video/') ? 'video' : 'image';
    }

    hero.tag = tag !== undefined ? tag : hero.tag;
    hero.headline = headline || hero.headline;
    hero.subheadline = subheadline !== undefined ? subheadline : hero.subheadline;
    hero.order = order;

    await hero.save();

    return NextResponse.json({ success: true, data: hero });
  } catch (error) {
    console.error('Error in PUT /api/hero/[id]:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const hero = await Hero.findById(id);

    if (!hero) {
      return NextResponse.json({ success: false, error: 'Hero slide not found' }, { status: 404 });
    }

    // Delete media file
    if (hero.mediaUrl && hero.mediaUrl.startsWith('/uploads/')) {
      const oldPath = path.join(process.cwd(), 'public', hero.mediaUrl);
      try {
        await unlink(oldPath);
      } catch (e) {
        console.warn('Failed to delete hero media file:', e);
      }
    }

    await Hero.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Hero slide deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/hero/[id]:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
