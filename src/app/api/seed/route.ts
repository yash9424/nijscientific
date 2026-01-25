import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';

const PRODUCTS_TO_ADD = [
  { name: "Digital Balance Pro", category: "Lab Equipment" },
  { name: "Magnetic Stirrer X1", category: "Lab Equipment" },
  { name: "Glass Beaker 500ml", category: "Glassware" },
  { name: "Test Tube Set", category: "Glassware" },
  { name: "PH Meter Digital", category: "Tester" },
  { name: "Safety Goggles", category: "Safety Equipment" },
  { name: "Lab Coat White", category: "Safety Equipment" },
  { name: "Microscope 1000x", category: "Lab Equipment" },
  { name: "Centrifuge machine", category: "Lab Equipment" },
  { name: "Pipette Set", category: "Lab Equipment" },
  { name: "Bunsen Burner", category: "Lab Equipment" },
  { name: "Filter Paper Pack", category: "Filtration" },
  { name: "Funnel Glass", category: "Glassware" },
  { name: "Thermometer Digital", category: "Tester" },
  { name: "Graduated Cylinder", category: "Glassware" },
  { name: "Petri Dish Set", category: "Glassware" },
  { name: "Crucible Porcelain", category: "Lab Equipment" },
  { name: "Mortar and Pestle", category: "Lab Equipment" },
  { name: "Wash Bottle", category: "Lab Equipment" },
  { name: "Spatula Steel", category: "Lab Equipment" },
];

export async function GET() {
  try {
    await dbConnect();

    // Check existing count
    const count = await Product.countDocuments();
    if (count >= 15) {
      return NextResponse.json({ message: `Already have ${count} products` });
    }

    // Get categories or create them
    const categories = await Category.find({});
    const categoryMap = new Map();
    
    // Ensure we have categories for our products
    const requiredCategories = Array.from(new Set(PRODUCTS_TO_ADD.map(p => p.category)));
    
    for (const catName of requiredCategories) {
      let cat = categories.find(c => c.name === catName);
      if (!cat) {
        cat = await Category.create({ 
          name: catName, 
          caption: `${catName} category`,
          image: `https://placehold.co/600x400/png?text=${catName.replace(/ /g, '+')}`
        });
      }
      categoryMap.set(catName, cat._id);
    }

    // Add missing products
    const productsToAdd = PRODUCTS_TO_ADD.slice(0, 15 - count + 5); // Add enough to exceed 15
    const createdProducts = [];

    for (const p of productsToAdd) {
        const product = await Product.create({
            name: p.name,
            description: `High quality ${p.name} for professional laboratory use.`,
            category: categoryMap.get(p.category),
            mainImage: `https://placehold.co/600x400/png?text=${p.name.replace(/ /g, '+')}`,
            images: [
                `https://placehold.co/600x400/png?text=${p.name.replace(/ /g, '+')}_1`,
                `https://placehold.co/600x400/png?text=${p.name.replace(/ /g, '+')}_2`
            ]
        });
        createdProducts.push(product);
    }

    return NextResponse.json({ 
      success: true, 
      message: `Added ${createdProducts.length} products`,
      count: count + createdProducts.length
    });

  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
