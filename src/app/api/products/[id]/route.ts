import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { uploadMedia, deleteMedia } from '@/lib/cloudinary';

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
    const isActive = formData.get('isActive');
    
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    // Handle Main Image Update
    if (mainImageFile && mainImageFile instanceof File) {
      // Delete old main image
      if (product.mainImage) {
        await deleteMedia(product.mainImage);
      }

      const result = await uploadMedia(mainImageFile, 'nijsci/products');
      product.mainImage = result.secure_url;
    }

    // Handle Additional Images (Append)
    for (const file of additionalImagesFiles) {
        if (file instanceof File) {
            const result = await uploadMedia(file, 'nijsci/products');
            product.images.push(result.secure_url);
        }
    }
    
    // Handle deletion of existing images if requested
    // formData.getAll('deletedImages') could contain URLs to remove
    const deletedImages = formData.getAll('deletedImages') as string[];
    if (deletedImages.length > 0) {
        product.images = product.images.filter((img: string) => !deletedImages.includes(img));
        
        // Cleanup Cloudinary files
        for (const imgUrl of deletedImages) {
            await deleteMedia(imgUrl);
        }
    }

    if (name && name !== 'undefined') product.name = name;
    if (category && category !== 'undefined' && category !== 'null') product.category = category as any;
    if (description && description !== 'undefined') product.description = description;
    
    product.hasTable = hasTable;
    product.tableColumns = tableColumns;
    product.tableRows = tableRows;
    if (isActive !== null) product.isActive = isActive === 'true';

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
    if (product.mainImage) {
        await deleteMedia(product.mainImage);
    }

    // Delete Additional Images
    if (product.images && product.images.length > 0) {
        for (const imgUrl of product.images) {
            await deleteMedia(imgUrl);
        }
    }

    await Product.deleteOne({ _id: id });

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
