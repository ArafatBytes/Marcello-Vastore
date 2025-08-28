import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export async function POST(request) {
  try {
    const auth = request.headers.get('authorization');
    if (!auth || !auth.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = auth.split(' ')[1];
    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');
    const updateData = await request.json();
    // Only allow updating safe fields
    const allowedFields = ['firstName', 'lastName', 'email', 'phone', 'billingAddress', 'shippingAddress', 'newsletter'];
    const safeUpdate = {};
    for (const key of allowedFields) {
      if (key in updateData) safeUpdate[key] = updateData[key];
    }

    // Handle password update
    if (updateData.currentPassword && updateData.newPassword) {
      // Find user
      const user = await usersCollection.findOne({ email: payload.email });
      if (!user || !user.password) {
        return NextResponse.json({ error: 'User or password not found' }, { status: 404 });
      }
      const isMatch = await bcrypt.compare(updateData.currentPassword, user.password);
      if (!isMatch) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
      }
      // Hash new password
      const newHash = await bcrypt.hash(updateData.newPassword, 10);
      safeUpdate.password = newHash;
    }

    const result = await usersCollection.updateOne(
      { email: payload.email },
      { $set: safeUpdate }
    );
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Account Update API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
