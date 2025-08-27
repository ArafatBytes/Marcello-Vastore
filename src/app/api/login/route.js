import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const JWT_EXPIRES = '15d';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }
    // Don't include password in token
    const { password: _, ...userPayload } = user;
    const token = jwt.sign(
      { ...userPayload, _id: user._id.toString() },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );
    return NextResponse.json({ token, user: userPayload });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
