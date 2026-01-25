import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { username, password } = await request.json();

    // Fallback for initial setup if no users exist
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      if (username === 'admin' && password === 'admin123') {
         // Auto-create the first admin user
         const hashedPassword = await bcrypt.hash(password, 10);
         await User.create({
           name: 'System Admin',
           email: 'admin', // Using 'admin' as email for backward compatibility with the hardcoded check, or I should force email format. 
           // The user prompt said "user email and password for admin login". 
           // So I should probably expect an email.
           // But the hardcoded one was 'admin'.
           // Let's create a proper admin user if it's the hardcoded credential.
           mobile: '0000000000',
           password: hashedPassword
         });
         
         const response = NextResponse.json({ success: true, message: 'Login successful (Initial Admin Created)' });
         response.cookies.set('admin_session', 'true', {
            path: '/',
            maxAge: 86400, // 1 day
            sameSite: 'strict',
         });
         return response;
      }
    }

    // Normal login flow
    // The user input might be username or email. The prompt said "user email and password".
    // I'll check against email.
    const user = await User.findOne({ email: username });

    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true, user: { name: user.name, email: user.email } });
    
    // Set cookie
    response.cookies.set('admin_session', 'true', {
      path: '/',
      maxAge: 86400, // 1 day
      sameSite: 'strict',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
