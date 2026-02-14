// valentine-apple\valentine-vouchers\components\VoucherCard.tsx
'use client';

import { useState } from 'react';
import { Calendar, Camera, Heart, QrCode, ChevronRight, Clock } from 'lucide-react';
import SuccessPopup from './SuccessPopup';

interface VoucherCardProps {
  voucher: any;
  userId: string;
  onClaim: () => void;
}

export default function VoucherCard({ voucher, userId, onClaim }: VoucherCardProps) {
  const [showBarcode, setShowBarcode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [claimedVoucherTitle, setClaimedVoucherTitle] = useState('');

  // Calculate remaining claims
  const claimsMade = voucher.totalClaims || 0;
  const remainingClaims = Math.max(0, voucher.claimLimit - claimsMade);
  const isFullyClaimed = remainingClaims === 0;

  // In VoucherCard.tsx, update handleClaim:
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

      // Update the voucher with the new totalClaims
      if (data.updatedVoucher) {
        voucher.totalClaims = data.updatedVoucher.totalClaims;
      }

      setClaimedVoucherTitle(voucher.title);
      setShowSuccessPopup(true);
      onClaim(); // Refresh parent data
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
          <div className="w-full h-40 overflow-hidden">
            <img 
              src={voucher.bannerImage} 
              alt={voucher.title} 
              className="w-full h-full object-cover"
            />
          </div>
        );
      case 'icon':
        return (
          <div className="w-full h-40 flex items-center justify-center bg-rose-50">
            <span className="text-6xl">
              {voucher.bannerIcon === 'heart' && '❤️'}
              {voucher.bannerIcon === 'gift' && '🎁'}
              {voucher.bannerIcon === 'camera' && '📸'}
              {voucher.bannerIcon === 'coffee' && '☕'}
              {voucher.bannerIcon === 'star' && '⭐'}
              {voucher.bannerIcon === 'moon' && '🌙'}
              {voucher.bannerIcon === 'sun' && '☀️'}
            </span>
          </div>
        );
      default:
        return (
          <div className="w-full h-40 flex items-center justify-center bg-rose-500">
            <Heart className="h-16 w-16 text-white fill-white" />
          </div>
        );
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-rose-100 overflow-hidden hover:shadow-md transition-shadow">
        {getBanner()}
        
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-medium text-gray-900">{voucher.title}</h3>
            
            {voucher.neverExpires ? (
              <span className="text-xs text-rose-500 bg-rose-50 px-2 py-1 rounded-full">
                Forever
              </span>
            ) : voucher.expireDate && (
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Calendar className="h-3 w-3" />
                <span>{new Date(voucher.expireDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {voucher.description}
          </p>

          {/* Claim Progress */}
          {/* {!isFullyClaimed && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-500">Available</span>
                <span className="text-rose-600 font-medium">{remainingClaims} left</span>
              </div>
              <div className="h-1.5 bg-rose-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-rose-400 rounded-full transition-all"
                  style={{ width: `${(claimsMade / voucher.claimLimit) * 100}%` }}
                />
              </div>
            </div>
          )} */}

          {/* Fully Claimed Message */}
          {isFullyClaimed && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-xs text-gray-500">All claimed</p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2">
            {/* Barcode Toggle */}
            <button
              onClick={() => setShowBarcode(!showBarcode)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              disabled={claiming}
            >
              <div className="flex items-center space-x-2">
                <QrCode className="h-4 w-4" />
                <span>{showBarcode ? 'Hide Code' : 'Show Code'}</span>
              </div>
              <ChevronRight className={`h-4 w-4 transition-transform ${showBarcode ? 'rotate-90' : ''}`} />
            </button>

            {/* Barcode Display */}
            {showBarcode && (
              <div className="p-4 bg-rose-50 rounded-lg text-center">
                <div className="font-mono text-xl tracking-wider text-rose-700">
                  {voucher.barcode}
                </div>
              </div>
            )}

            {/* Claim Button */}
            {!isFullyClaimed && (
              voucher.requiresImage ? (
                <div>
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
                    className={`block w-full px-4 py-3 text-center text-white bg-rose-500 rounded-lg hover:bg-rose-600 transition-colors cursor-pointer ${
                      (uploading || claiming) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {uploading ? 'Uploading...' : claiming ? 'Claiming...' : '📸 Claim with Photo'}
                  </label>
                </div>
              ) : (
                <button
                  onClick={() => handleClaim()}
                  disabled={claiming}
                  className={`w-full px-4 py-3 text-center text-white bg-rose-500 rounded-lg hover:bg-rose-600 transition-colors ${
                    claiming ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {claiming ? 'Claiming...' : 'Claim'}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      <SuccessPopup
        isOpen={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        voucherTitle={claimedVoucherTitle}
      />
    </>
  );
}