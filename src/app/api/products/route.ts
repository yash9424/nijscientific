import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category'; // Import to ensure registration
import { writeFile } from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    await dbConnect();
    // Populate category to get the name
    const products = await Product.find({})
      .populate('category', 'name')
      .sort({ createdAt: -1 });
      
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const hasTable = formData.get('hasTable') === 'true';
    const tableColumns = formData.get('tableColumns') ? JSON.parse(formData.get('tableColumns') as string) : [];
    const tableRows = formData.get('tableRows') ? JSON.parse(formData.get('tableRows') as string) : [];
    const mainImageFile = formData.get('mainImage') as File;
    const additionalImagesFiles = formData.getAll('images') as File[];

    if (!mainImageFile) {
      return NextResponse.json({ success: false, error: 'Main image is required' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    // Save Main Image
    const mainImageBytes = await mainImageFile.arrayBuffer();
    const mainImageBuffer = Buffer.from(mainImageBytes);
    const mainImageFilename = `${Date.now()}-main-${mainImageFile.name.replace(/\s/g, '-')}`;
    const mainImagePath = path.join(uploadDir, mainImageFilename);
    await writeFile(mainImagePath, mainImageBuffer);
    const mainImageUrl = `/uploads/${mainImageFilename}`;

    // Save Additional Images
    const additionalImageUrls: string[] = [];
    for (const file of additionalImagesFiles) {
        if (file instanceof File) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const filename = `${Date.now()}-extra-${file.name.replace(/\s/g, '-')}`;
            const filepath = path.join(uploadDir, filename);
            await writeFile(filepath, buffer);
            additionalImageUrls.push(`/uploads/${filename}`);
        }
    }

    const product = await Product.create({
      name,
      category,
      description,
      mainImage: mainImageUrl,
      images: additionalImageUrls,
      hasTable,
      tableColumns,
      tableRows,
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/products:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
