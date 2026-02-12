import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import User from '../../../../../models/User';
import { comparePassword, generateToken } from '../../../../../lib/auth';

export async function POST(request: Request) {
  try {
    await connectDB();
    const { username, password } = await request.json();

    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = generateToken(user._id, user.isAdmin);

    return NextResponse.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}