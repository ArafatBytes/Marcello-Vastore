import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { uploadImage, deleteImage } from '@/lib/cloudinary';

// Helper function to parse form data
async function parseFormData(request) {
  const formData = await request.formData();
  const body = {};
  const imageFile = formData.get('image');
  
  // Convert FormData entries to object
  for (const [key, value] of formData.entries()) {
    if (key !== 'image') {
      body[key] = value;
    }
  }
  
  return { ...body, imageFile };
}

// PATCH: Edit a product (admin only)
export async function PATCH(request) {
  try {
    const formData = await parseFormData(request);
    const { _id, name, price, imageFile } = formData;
    
    if (!_id) {
      return NextResponse.json({ error: 'Missing product ID' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db();
    const products = db.collection('products');
    
    // Get existing product to handle image deletion if needed
    const existingProduct = await products.findOne({ _id: new (await import('mongodb')).ObjectId(_id) });
    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    const update = { updatedAt: new Date() };
    if (name) update.name = name;
    if (price) update.price = parseFloat(price);
    
    // Handle new image upload if provided
    if (imageFile && imageFile.size > 0) {
      // Convert file to base64 for Cloudinary
      const buffer = await imageFile.arrayBuffer();
      const base64Data = Buffer.from(buffer).toString('base64');
      const dataUri = `data:${imageFile.type};base64,${base64Data}`;
      
      // Upload new image to Cloudinary
      const imageUrl = await uploadImage(dataUri);
      update.image = imageUrl;
      
      // Delete old image from Cloudinary if it exists
      if (existingProduct.image) {
        try {
          const publicId = existingProduct.image.split('/').pop().split('.')[0];
          await deleteImage(publicId);
        } catch (error) {
          console.error('Error deleting old image from Cloudinary:', error);
          // Continue even if deletion fails
        }
      }
    }
    
    const result = await products.updateOne(
      { _id: new (await import('mongodb')).ObjectId(_id) },
      { $set: update }
    );
    
    if (!result.matchedCount) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
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
    
    if (!_id) {
      return NextResponse.json({ error: 'Missing product ID' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db();
    const products = db.collection('products');
    
    // Get product to delete its image from Cloudinary
    const product = await products.findOne({ _id: new (await import('mongodb')).ObjectId(_id) });
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // Delete image from Cloudinary if it exists
    if (product.image) {
      try {
        const publicId = product.image.split('/').pop().split('.')[0];
        await deleteImage(publicId);
      } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        // Continue with product deletion even if image deletion fails
      }
    }
    
    // Delete product from database
    const result = await products.deleteOne({ _id: new (await import('mongodb')).ObjectId(_id) });
    
    if (!result.deletedCount) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Product DELETE error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST: Add a new product (admin only)
export async function POST(request) {
  try {
    const formData = await parseFormData(request);
    const { name, price, collection: collectionName, category, imageFile } = formData;
    
    if (!name || !price || !collectionName || !category || !imageFile) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Convert file to base64 for Cloudinary
    const buffer = await imageFile.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString('base64');
    const dataUri = `data:${imageFile.type};base64,${base64Data}`;
    
    // Upload image to Cloudinary
    const imageUrl = await uploadImage(dataUri);
    
    const client = await clientPromise;
    const db = client.db();
    const products = db.collection('products');
    
    const productDoc = {
      name,
      price: parseFloat(price),
      image: imageUrl, // Store Cloudinary URL
      collection: collectionName,
      category,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await products.insertOne(productDoc);
    
    return NextResponse.json({
      success: true,
      product: {
        _id: result.insertedId,
        ...productDoc
      }
    });
  } catch (err) {
    console.error('Product POST error:', err);
    return NextResponse.json({ error: 'Server error: ' + err.message }, { status: 500 });
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
