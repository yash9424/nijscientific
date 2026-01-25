import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';
import { uploadMedia, deleteMedia } from '@/lib/cloudinary';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const caption = formData.get('caption') as string;
    const file = formData.get('image') as File | null;

    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    let imageUrl = category.image;

    if (file && file instanceof File) {
      // Delete old image if exists
      if (category.image) {
        await deleteMedia(category.image);
      }

      const result = await uploadMedia(file, 'nijsci/categories');
      imageUrl = result.secure_url;
    }

    category.name = name || category.name;
    category.caption = caption || category.caption;
    category.image = imageUrl;

    await category.save();

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
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

    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    // Delete image file
    if (category.image) {
        await deleteMedia(category.image);
    }

    await Category.deleteOne({ _id: id });

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
