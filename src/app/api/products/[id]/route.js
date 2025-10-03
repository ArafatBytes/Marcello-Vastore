import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const products = db.collection('products');
    
    // Find the product by ID
    const product = await products.findOne({ _id: new (await import('mongodb')).ObjectId(id) });
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Convert ObjectId to string for the response
    const productWithId = {
      ...product,
      _id: product._id.toString(),
    };

    return NextResponse.json({ product: productWithId });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
