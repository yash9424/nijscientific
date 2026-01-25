import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category'; // Import to ensure registration
import { uploadMedia, deleteMedia } from '@/lib/cloudinary';

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

    // Save Main Image to Cloudinary
    const mainImageResult = await uploadMedia(mainImageFile, 'nijsci/products');
    const mainImageUrl = mainImageResult.secure_url;

    // Save Additional Images to Cloudinary
    const additionalImageUrls: string[] = [];
    for (const file of additionalImagesFiles) {
        if (file instanceof File) {
            const result = await uploadMedia(file, 'nijsci/products');
            additionalImageUrls.push(result.secure_url);
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

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: false, error: 'No IDs provided' }, { status: 400 });
    }

    // Find items to get media URLs
    const products = await Product.find({ _id: { $in: ids } });

    // Delete media for each product
    for (const product of products) {
      // Delete main image
      if (product.mainImage) {
        await deleteMedia(product.mainImage);
      }
      
      // Delete additional images
      if (product.images && product.images.length > 0) {
        for (const imageUrl of product.images) {
          await deleteMedia(imageUrl);
        }
      }
    }

    // Delete from DB
    await Product.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({ success: true, message: 'Products deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/products:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
