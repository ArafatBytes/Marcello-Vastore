import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// PATCH: Edit a product (admin only)
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { _id, name, price, image } = body;
    if (!_id || (!name && !price && !image)) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    const client = await clientPromise;
    const db = client.db();
    const products = db.collection('products');
    const update = { updatedAt: new Date() };
    if (name) update.name = name;
    if (price) update.price = price;
    if (image) update.image = image;
    const result = await products.updateOne({ _id: new (await import('mongodb')).ObjectId(_id) }, { $set: update });
    if (!result.matchedCount) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Product PATCH error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE: Remove a product (admin only)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const _id = searchParams.get('id');
    const body = await request.json();
    if (!_id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const client = await clientPromise;
    const db = client.db();
    const products = db.collection('products');
    const result = await products.deleteOne({ _id: new (await import('mongodb')).ObjectId(_id) });
    if (!result.deletedCount) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Product DELETE error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST: Add a new product (admin only)
export async function POST(request) {
  try {
    const body = await request.json();

    const { name, price, image, collection, category } = body;
    if (!name || !price || !image || !collection || !category) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    // Store image as base64url string
    const client = await clientPromise;
    const db = client.db();
    const products = db.collection('products');
    const productDoc = {
      name,
      price,
      image, // base64url string
      collection,
      category,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await products.insertOne(productDoc);
    return NextResponse.json({ success: true, product: productDoc });
  } catch (err) {
    console.error('Product POST error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// GET: List all products (optionally by collection/category)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const collection = searchParams.get('collection');
    const category = searchParams.get('category');
    const client = await clientPromise;
    const db = client.db();
    const products = db.collection('products');
    const filter = {};
    if (collection) filter.collection = collection;
    if (category) filter.category = category;
    const docs = await products.find(filter).toArray();
    return NextResponse.json({ products: docs });
  } catch (err) {
    console.error('Product GET error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
