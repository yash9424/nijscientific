import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const product = await Product.findById(id).populate('category');
    
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const hasTable = formData.get('hasTable') === 'true';
    const tableColumns = formData.get('tableColumns') ? JSON.parse(formData.get('tableColumns') as string) : [];
    const tableRows = formData.get('tableRows') ? JSON.parse(formData.get('tableRows') as string) : [];
    const mainImageFile = formData.get('mainImage') as File | null;
    const additionalImagesFiles = formData.getAll('images') as File[];
    // We might also need to know which existing images to keep or delete.
    // For simplicity, let's assume 'existingImages' passed as JSON string array
    // or we just append new ones. 
    // A better approach for "images" array update is tricky with simple formData.
    // Let's assume the client sends "existingImages" list to keep, and we append new uploads.
    // BUT the user prompt didn't specify complex image management (delete specific extra image).
    // Let's implement: Replace Main Image if provided. Append new additional images.
    // To support deleting specific extra images, we would need a separate API or a complex logic here.
    // I will stick to "Append" for now, or "Replace All" if that's easier.
    // Actually, "Add more image not limit" implies appending.
    
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    // Handle Main Image Update
    if (mainImageFile && mainImageFile instanceof File) {
      // Delete old main image
      if (product.mainImage && product.mainImage.startsWith('/uploads/')) {
        const oldPath = path.join(process.cwd(), 'public', product.mainImage);
        try {
          await unlink(oldPath);
        } catch (e) {
          console.warn('Failed to delete old main image:', e);
        }
      }

      const bytes = await mainImageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-main-${mainImageFile.name.replace(/\s/g, '-')}`;
      const filepath = path.join(uploadDir, filename);
      await writeFile(filepath, buffer);
      product.mainImage = `/uploads/${filename}`;
    }

    // Handle Additional Images (Append)
    for (const file of additionalImagesFiles) {
        if (file instanceof File) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const filename = `${Date.now()}-extra-${file.name.replace(/\s/g, '-')}`;
            const filepath = path.join(uploadDir, filename);
            await writeFile(filepath, buffer);
            product.images.push(`/uploads/${filename}`);
        }
    }
    
    // Handle deletion of existing images if requested
    // formData.getAll('deletedImages') could contain URLs to remove
    const deletedImages = formData.getAll('deletedImages') as string[];
    if (deletedImages.length > 0) {
        product.images = product.images.filter((img: string) => !deletedImages.includes(img));
        
        // Cleanup files
        for (const imgUrl of deletedImages) {
            if (imgUrl.startsWith('/uploads/')) {
                const oldPath = path.join(process.cwd(), 'public', imgUrl);
                try {
                    await unlink(oldPath);
                } catch (e) {
                     console.warn('Failed to delete old extra image:', e);
                }
            }
        }
    }

    if (name && name !== 'undefined') product.name = name;
    if (category && category !== 'undefined' && category !== 'null') product.category = category as any;
    if (description && description !== 'undefined') product.description = description;
    
    product.hasTable = hasTable;
    product.tableColumns = tableColumns;
    product.tableRows = tableRows;

    await product.save();

    return NextResponse.json({ success: true, data: product });
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

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    // Delete Main Image
    if (product.mainImage && product.mainImage.startsWith('/uploads/')) {
        const oldPath = path.join(process.cwd(), 'public', product.mainImage);
        try {
          await unlink(oldPath);
        } catch (e) {
          console.warn('Failed to delete main image:', e);
        }
    }

    // Delete Additional Images
    if (product.images && product.images.length > 0) {
        for (const imgUrl of product.images) {
            if (imgUrl.startsWith('/uploads/')) {
                const oldPath = path.join(process.cwd(), 'public', imgUrl);
                try {
                  await unlink(oldPath);
                } catch (e) {
                  console.warn('Failed to delete extra image:', e);
                }
            }
        }
    }

    await Product.deleteOne({ _id: id });

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
