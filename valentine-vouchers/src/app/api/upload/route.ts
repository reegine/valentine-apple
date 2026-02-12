import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const { image } = await request.json();
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(image, {
      folder: 'valentine-vouchers/banners',
      transformation: [
        { width: 800, height: 400, crop: 'fill' },
        { quality: 'auto' }
      ]
    });

    return NextResponse.json({ 
      imageUrl: result.secure_url,
      publicId: result.public_id 
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}