import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import Voucher from '../../../../../models/Voucher';
import { verifyToken } from '../../../../../lib/auth';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    const data = await request.json();
    
    const voucher = await Voucher.findByIdAndUpdate(
      params.id,
      data,
      { new: true }
    );

    return NextResponse.json(voucher);
  } catch (error) {
    console.error('Error updating voucher:', error);
    return NextResponse.json(
      { error: 'Failed to update voucher' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    await Voucher.findByIdAndDelete(params.id);
    
    return NextResponse.json({ message: 'Voucher deleted successfully' });
  } catch (error) {
    console.error('Error deleting voucher:', error);
    return NextResponse.json(
      { error: 'Failed to delete voucher' },
      { status: 500 }
    );
  }
}