import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Hero from '@/models/Hero';
import { uploadMedia, deleteMedia } from '@/lib/cloudinary';

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
      // Delete old media from Cloudinary if applicable
      if (hero.mediaUrl) {
        await deleteMedia(hero.mediaUrl);
      }

      const result = await uploadMedia(mediaFile, 'nijsci/hero');
      hero.mediaUrl = result.secure_url;
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

    // Delete media file from Cloudinary
    if (hero.mediaUrl) {
      await deleteMedia(hero.mediaUrl);
    }

    await Hero.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Hero slide deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/hero/[id]:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
