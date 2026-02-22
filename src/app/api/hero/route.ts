import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Hero from '@/models/Hero';
import { uploadMedia, deleteMedia } from '@/lib/cloudinary';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';
    
    const query = activeOnly ? { isActive: true } : {};
    
    const heroes = await Hero.find(query).sort({ order: 1, createdAt: -1 });
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
    const isActive = formData.get('isActive');

    if (!headline) {
      return NextResponse.json({ success: false, error: 'Headline is required' }, { status: 400 });
    }

    if (!mediaFile) {
      return NextResponse.json({ success: false, error: 'Media file is required' }, { status: 400 });
    }

    // Determine media type
    const mediaType = mediaFile.type.startsWith('video/') ? 'video' : 'image';

    // Save Media File to Cloudinary
    const result = await uploadMedia(mediaFile, 'nijsci/hero');
    const mediaUrl = result.secure_url;

    const hero = await Hero.create({
      tag,
      headline,
      subheadline,
      mediaUrl,
      mediaType,
      order,
      isActive: isActive !== null ? isActive === 'true' : true,
    });

    return NextResponse.json({ success: true, data: hero }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/hero:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: false, error: 'No IDs provided' }, { status: 400 });
    }

    // Find items to get media URLs
    const heroes = await Hero.find({ _id: { $in: ids } });

    // Delete media for each hero
    for (const hero of heroes) {
      if (hero.mediaUrl) {
        await deleteMedia(hero.mediaUrl);
      }
    }

    // Delete from DB
    await Hero.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({ success: true, message: 'Hero slides deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/hero:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
