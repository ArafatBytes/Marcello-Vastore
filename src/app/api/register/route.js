import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      newsletter,
      billingAddress,
      shippingAddress,
      ...rest
    } = body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare user object
    const user = {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      newsletter: !!newsletter,
      billingAddress: billingAddress || {},
      shippingAddress: shippingAddress || {},
      createdAt: new Date(),
      ...rest
    };

    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');

    // Server-side validation (backup)
    if (!email || !password || !firstName || !lastName || !phone || !shippingAddress || (!billingAddress && !user.billingSame)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }
    // Phone validation: allow only E.164 format
    if (!/^\+\d{10,15}$/.test(phone)) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    }

    // Check for existing user by email or phone
    const existing = await usersCollection.findOne({ $or: [ { email }, { phone } ] });
    if (existing) {
      if (existing.email === email) {
        return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
      } else {
        return NextResponse.json({ error: 'Phone number already registered' }, { status: 409 });
      }
    }

    // Insert user
    await usersCollection.insertOne(user);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
