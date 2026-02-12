import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import User from '../../../../../models/User';
import { hashPassword } from '../../../../../lib/auth';
import { verifyToken } from '../../../../../lib/auth';

export async function POST(request: Request) {
  try {
    // Verify admin access
    const cookieHeader = request.headers.get('cookie');
    let token = null;
    
    if (cookieHeader) {
      const cookies = cookieHeader.split(';').reduce((acc: any, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {});
      token = cookies.token;
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No token' },
        { status: 401 }
      );
    }

    const verified = verifyToken(token);
    if (!verified || !(verified as any).isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin only' },
        { status: 401 }
      );
    }

    await connectDB();
    const { username, password, isAdmin } = await request.json();

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      username,
      password: hashedPassword,
      isAdmin
    });

    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: user._id,
        username: user.username,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}