import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { SESSION_COOKIE, createSessionToken, sessionCookieOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { username, password } = await request.json();

    // Initial setup: if no users exist, the default credential creates the first admin
    const userCount = await User.countDocuments();
    if (userCount === 0 && username === 'admin' && password === 'admin123') {
      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = await User.create({
        name: 'System Admin',
        email: 'admin',
        mobile: '0000000000',
        password: hashedPassword,
      });

      const response = NextResponse.json({ success: true, message: 'Login successful (Initial Admin Created)' });
      response.cookies.set(SESSION_COOKIE, await createSessionToken(String(admin._id)), sessionCookieOptions);
      return response;
    }

    const user = await User.findOne({ email: String(username || '').toLowerCase().trim() });
    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    if (!user.isActive) {
      return NextResponse.json({ success: false, error: 'Your account is inactive. Please contact administrator.' }, { status: 403 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true, user: { name: user.name, email: user.email } });
    response.cookies.set(SESSION_COOKIE, await createSessionToken(String(user._id)), sessionCookieOptions);
    return response;
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
