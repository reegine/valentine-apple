import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Claim from '../../../../models/Claim';
import Voucher from '../../../../models/Voucher';
import { verifyToken } from '../../../../lib/auth';

export async function GET(request: Request) {
  try {
    // Verify user access
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
    if (!verified) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Make sure users can only see their own claims
    if ((verified as any).userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Cannot access other users claims' },
        { status: 403 }
      );
    }

    await connectDB();
    const claims = await Claim.find({ user: userId })
      .populate('voucher')
      .sort({ claimedAt: -1 });

    return NextResponse.json(claims);
  } catch (error) {
    console.error('Error fetching claims:', error);
    return NextResponse.json(
      { error: 'Failed to fetch claims' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Verify user access
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

    await connectDB();
    const { voucherId, userId, evidenceImage } = await request.json();

    // Verify that the user is claiming for themselves
    if ((verified as any).userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Cannot claim for another user' },
        { status: 403 }
      );
    }

    // Check if voucher exists
    const voucher = await Voucher.findById(voucherId);
    if (!voucher) {
      return NextResponse.json(
        { error: 'Voucher not found' },
        { status: 404 }
      );
    }

    // Check if voucher is expired
    if (!voucher.neverExpires && voucher.expireDate && new Date(voucher.expireDate) < new Date()) {
      return NextResponse.json(
        { error: 'Voucher has expired' },
        { status: 400 }
      );
    }

    // Check if user has already claimed and if claim limit is reached
    const claimsCount = await Claim.countDocuments({ 
      voucher: voucherId, 
      user: userId 
    });

    if (claimsCount >= voucher.claimLimit) {
      return NextResponse.json(
        { error: 'Claim limit reached' },
        { status: 400 }
      );
    }

    const claim = await Claim.create({
      voucher: voucherId,
      user: userId,
      evidenceImage,
      status: evidenceImage ? 'pending' : 'approved'
    });

    // Populate the voucher data before returning
    const populatedClaim = await Claim.findById(claim._id).populate('voucher');

    return NextResponse.json(populatedClaim);
  } catch (error) {
    console.error('Error claiming voucher:', error);
    return NextResponse.json(
      { error: 'Failed to claim voucher' },
      { status: 500 }
    );
  }
}