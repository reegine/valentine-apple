import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Voucher from '../../../../models/Voucher';
import { verifyToken } from '../../../../lib/auth';

export async function GET() {
  try {
    await connectDB();
    const vouchers = await Voucher.find().sort({ createdAt: -1 });
    return NextResponse.json(vouchers);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch vouchers' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // ✅ Better cookie parsing
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
      console.log('No token found in cookies');
      return NextResponse.json(
        { error: 'Unauthorized - No token' },
        { status: 401 }
      );
    }

    const verified = verifyToken(token);
    if (!verified) {
      console.log('Token verification failed');
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    if (!(verified as any).isAdmin) {
      console.log('User is not admin');
      return NextResponse.json(
        { error: 'Unauthorized - Admin only' },
        { status: 401 }
      );
    }

    await connectDB();
    const data = await request.json();
    
    const voucher = await Voucher.create({
      ...data,
      createdBy: (verified as any).userId
    });

    return NextResponse.json(voucher);
  } catch (error) {
    console.error('Error creating voucher:', error);
    return NextResponse.json(
      { error: 'Failed to create voucher' },
      { status: 500 }
    );
  }
}