import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';
import { uploadMedia } from '@/lib/cloudinary';

export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const caption = formData.get('caption') as string;
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No image uploaded' }, { status: 400 });
    }

    // Upload to Cloudinary
    const result = await uploadMedia(file, 'nijsci/categories');
    const imageUrl = result.secure_url;

    const category = await Category.create({
      name,
      caption,
      image: imageUrl,
    });

    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/categories:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
