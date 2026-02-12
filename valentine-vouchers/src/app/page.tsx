'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { Heart, Gift, Calendar, Camera, Search, QrCode, Image as ImageIcon } from 'lucide-react';
import HeartBackground from '../../components/HeartBackground';
import Navbar from '../../components/Navbar';
import VoucherCard from '../../components/VoucherCard';

interface UserData {
  userId: string;
  isAdmin: boolean;
}

interface Voucher {
  _id: string;
  title: string;
  description: string;
  bannerType: string;
  bannerImage: string | null;
  bannerIcon: string | null;
  barcode: string;
  expireDate: string | null;
  neverExpires: boolean;
  claimLimit: number;
  requiresImage: boolean;
}

interface ClaimedVoucher {
  _id: string;
  voucher: Voucher;
  claimedAt: string;
  evidenceImage: string | null;
  status: string;
}

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [claimedVouchers, setClaimedVouchers] = useState<ClaimedVoucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token) as UserData;
      setUser(decoded);
      fetchData(decoded.userId);
    } catch {
      router.push('/login');
    }
  }, [router]);

  const fetchData = async (userId: string) => {
    try {
      const [vouchersRes, claimedRes] = await Promise.all([
        fetch('/api/vouchers'),
        fetch(`/api/claims?userId=${userId}`)
      ]);

      const vouchersData = await vouchersRes.json();
      const claimedData = await claimedRes.json();

      setVouchers(vouchersData);
      setClaimedVouchers(claimedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVouchers = vouchers.filter(voucher =>
    voucher.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voucher.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableVouchers = filteredVouchers.filter(voucher => {
    const claimedCount = claimedVouchers.filter(c => c.voucher._id === voucher._id).length;
    return claimedCount < voucher.claimLimit;
  });

  if (loading) {
    return (
      <>
        <HeartBackground />
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto" />
            <p className="mt-4 text-gray-600">Loading your Valentine's surprises...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <HeartBackground />
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-4">
            Happy Valentine's Day! 💝
          </h1>
          <p className="text-lg text-gray-600">
            Here are your special vouchers, made with love just for you
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12 max-w-2xl mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for a special surprise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-pink-200 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Claimed Vouchers Section */}
        {claimedVouchers.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center space-x-2 mb-6">
              <Gift className="h-6 w-6 text-pink-500" />
              <h2 className="text-2xl font-semibold text-gray-800">Your Claimed Treasures</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {claimedVouchers.map((claim) => (
                <div key={claim._id} className="bg-white/90 backdrop-blur-sm rounded-xl border border-pink-200 p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-800">{claim.voucher.title}</h3>
                      <p className="text-sm text-gray-500">Claimed {new Date(claim.claimedAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      claim.status === 'approved' ? 'bg-green-100 text-green-700' :
                      claim.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {claim.status}
                    </span>
                  </div>
                  
                  {claim.evidenceImage && (
                    <div className="mt-4">
                      <img 
                        src={claim.evidenceImage} 
                        alt="Evidence" 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  {!claim.evidenceImage && claim.voucher.requiresImage && (
                    <button
                      onClick={() => {/* Open upload modal */}}
                      className="mt-4 w-full flex items-center justify-center space-x-2 px-4 py-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition"
                    >
                      <Camera className="h-4 w-4" />
                      <span>Upload Evidence</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Available Vouchers Section */}
        <section>
          <div className="flex items-center space-x-2 mb-6">
            <Heart className="h-6 w-6 text-pink-500 fill-pink-500" />
            <h2 className="text-2xl font-semibold text-gray-800">Available Surprises</h2>
          </div>

          {availableVouchers.length === 0 ? (
            <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-200">
              <Heart className="h-16 w-16 text-pink-300 mx-auto mb-4" />
              <p className="text-xl text-gray-600">No available vouchers at the moment</p>
              <p className="text-gray-500 mt-2">Check back soon for more surprises!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableVouchers.map((voucher) => (
                <VoucherCard
                  key={voucher._id}
                  voucher={voucher}
                  userId={user?.userId!}
                  onClaim={() => fetchData(user?.userId!)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}