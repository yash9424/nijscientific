import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';
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
    const name = formData.get('name') as string;
    const caption = formData.get('caption') as string;
    const file = formData.get('image') as File | null;

    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    let imageUrl = category.image;

    if (file && file instanceof File) {
      // Delete old image if exists and it's a local file
      if (category.image && category.image.startsWith('/uploads/')) {
        const oldPath = path.join(process.cwd(), 'public', category.image);
        try {
          await unlink(oldPath);
        } catch (e) {
          console.warn('Failed to delete old image:', e);
        }
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      const filepath = path.join(uploadDir, filename);

      await writeFile(filepath, buffer);
      imageUrl = `/uploads/${filename}`;
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
    if (category.image && category.image.startsWith('/uploads/')) {
        const oldPath = path.join(process.cwd(), 'public', category.image);
        try {
          await unlink(oldPath);
        } catch (e) {
          console.warn('Failed to delete image:', e);
        }
    }

    await Category.deleteOne({ _id: id });

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
