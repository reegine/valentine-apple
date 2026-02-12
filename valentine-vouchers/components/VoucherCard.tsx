'use client';

import { useState } from 'react';
import { Calendar, Camera, Heart, QrCode } from 'lucide-react';

interface VoucherCardProps {
  voucher: any;
  userId: string;
  onClaim: () => void;
}

export default function VoucherCard({ voucher, userId, onClaim }: VoucherCardProps) {
  const [showBarcode, setShowBarcode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [claiming, setClaiming] = useState(false);

  const handleClaim = async (evidenceImage?: string) => {
    setClaiming(true);
    try {
      const res = await fetch('/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voucherId: voucher._id,
          userId,
          evidenceImage
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to claim voucher');
      }

      onClaim();
      alert('✨ Voucher claimed successfully!');
    } catch (error: any) {
      console.error('Error claiming voucher:', error);
      alert(error.message || 'Failed to claim voucher. Please try again.');
    } finally {
      setClaiming(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    // Convert to base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: reader.result }),
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        
        await handleClaim(data.imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image. Please try again.');
      } finally {
        setUploading(false);
      }
    };
  };

  const getBanner = () => {
    switch (voucher.bannerType) {
      case 'image':
        return (
          <div className="w-full h-48 relative">
            <img 
              src={voucher.bannerImage} 
              alt={voucher.title} 
              className="w-full h-full object-cover"
            />
          </div>
        );
      case 'icon':
        return (
          <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-pink-100 to-rose-100">
            <div className="text-7xl animate-pulse">❤️</div>
          </div>
        );
      default:
        return (
          <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-pink-500 to-rose-500">
            <Heart className="h-20 w-20 text-white fill-white animate-pulse" />
          </div>
        );
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-pink-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:border-pink-300">
      {getBanner()}
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-semibold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            {voucher.title}
          </h3>
          {voucher.neverExpires ? (
            <span className="px-3 py-1 bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 rounded-full text-xs font-medium border border-pink-200">
              Forever ❤️
            </span>
          ) : voucher.expireDate && (
            <div className="flex items-center space-x-1 text-sm text-pink-500">
              <Calendar className="h-4 w-4" />
              <span>{new Date(voucher.expireDate).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}</span>
            </div>
          )}
        </div>

        <p className="text-gray-600 mb-4 italic">&ldquo;{voucher.description}&rdquo;</p>

        <div className="space-y-4">
          <button
            onClick={() => setShowBarcode(!showBarcode)}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-pink-50 text-pink-700 rounded-lg hover:bg-pink-100 transition-all duration-300 border border-pink-200"
            disabled={claiming}
          >
            <QrCode className="h-4 w-4" />
            <span>{showBarcode ? 'Hide' : 'Show'} Secret Code</span>
          </button>

          {showBarcode && (
            <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg border-2 border-pink-200 animate-fadeIn">
              <div className="text-center font-mono text-2xl tracking-widest text-pink-700">
                {voucher.barcode}
              </div>
              <p className="text-xs text-pink-500 text-center mt-2">
                ✨ Show this when you want to redeem your surprise ✨
              </p>
            </div>
          )}

          {voucher.requiresImage ? (
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id={`upload-${voucher._id}`}
                disabled={uploading || claiming}
                capture="environment"
              />
              <label
                htmlFor={`upload-${voucher._id}`}
                className={`w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-lg hover:shadow-pink-500/25 ${
                  (uploading || claiming) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : claiming ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Claiming...</span>
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4" />
                    <span>📸 Capture This Moment</span>
                  </>
                )}
              </label>
            </div>
          ) : (
            <button
              onClick={() => handleClaim()}
              disabled={claiming}
              className={`w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-pink-500/25 ${
                claiming ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {claiming ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Claiming...</span>
                </>
              ) : (
                <>
                  <Heart className="h-4 w-4 fill-white" />
                  <span>Claim This Surprise</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}