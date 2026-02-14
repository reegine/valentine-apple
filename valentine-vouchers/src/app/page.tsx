// valentine-apple\valentine-vouchers\src\app\page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { 
  Heart, Gift, Search, Sparkles, Clock, 
  Camera, Star, Coffee, Moon, Sun, Feather,
  CalendarX
} from 'lucide-react';
import HeartBackground from '../../components/HeartBackground';
import Navbar from '../../components/Navbar';
import VoucherCard from '../../components/VoucherCard';

interface UserData {
  userId: string;
  username: string;
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
  totalClaims?: number;
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
  const [activeTab, setActiveTab] = useState<'available' | 'claimed' | 'expired'>('available');
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token) as UserData;
      console.log('Decoded user:', decoded);
      setUser(decoded);
      
      // Set greeting based on time
      const hour = new Date().getHours();
      if (hour < 12) setGreeting('Good morning Rago');
      else if (hour < 18) setGreeting('Good afternoon Rago');
      else setGreeting('Good evening Rago');
      
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

  // Check if voucher is expired
  const isVoucherExpired = (voucher: Voucher) => {
    if (voucher.neverExpires) return false;
    if (!voucher.expireDate) return false;
    return new Date(voucher.expireDate) < new Date();
  };

  // Check if voucher is fully claimed
  const isVoucherFullyClaimed = (voucher: Voucher) => {
    const claimsForVoucher = claimedVouchers.filter(c => c.voucher._id === voucher._id).length;
    const totalClaims = voucher.totalClaims || claimsForVoucher;
    return totalClaims >= voucher.claimLimit;
  };

  // Separate vouchers into categories
  const expiredVouchers = filteredVouchers.filter(voucher => 
    isVoucherExpired(voucher)
  );

  const availableVouchers = filteredVouchers.filter(voucher => 
    !isVoucherExpired(voucher) && 
    !isVoucherFullyClaimed(voucher)
  );

  const fullyClaimedVouchers = filteredVouchers.filter(voucher => 
    !isVoucherExpired(voucher) && 
    isVoucherFullyClaimed(voucher)
  );

  // Get time-appropriate icon
  const getTimeIcon = () => {
    const hour = new Date().getHours();
    if (hour < 12) return <Coffee className="h-4 w-4 text-amber-400" />;
    if (hour < 18) return <Sun className="h-4 w-4 text-amber-400" />;
    return <Moon className="h-4 w-4 text-indigo-400" />;
  };

  if (loading) {
    return (
      <>
        <HeartBackground />
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 border border-rose-200 rounded-full mx-auto animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 bg-rose-100 rounded-full animate-pulse" />
              </div>
              <Heart className="absolute inset-0 m-auto h-5 w-5 text-rose-400 animate-pulse" />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-rose-400 font-light tracking-wide">Loading your Valentine's surprises...</p>
              <div className="flex justify-center space-x-1">
                <span className="w-1 h-1 bg-rose-300 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <span className="w-1 h-1 bg-rose-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <span className="w-1 h-1 bg-rose-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <HeartBackground />
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Elegant Header Section */}
        <div className="text-center mb-10">
          <div className="flex justify-center items-center space-x-3 mb-8">
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent" />
            <div className="flex space-x-2">
              <Feather className="h-4 w-4 text-rose-300" />
              <Sparkles className="h-4 w-4 text-rose-300" />
              <Feather className="h-4 w-4 text-rose-300" />
            </div>
            <div className="w-12 h-px bg-gradient-to-l from-transparent via-rose-200 to-transparent" />
          </div>

          <div className="inline-flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-5 py-2 rounded-full border border-rose-100 shadow-sm mb-6">
            {getTimeIcon()}
            <span className="text-sm text-rose-600 font-light">
              {greeting}
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light text-gray-800 mb-4">
            {user?.username ? (
              <>
                <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  {user.username}
                </span>
                <span className="text-gray-600">'s Love Notes</span>
              </>
            ) : (
              "Happy Valentine's Day!"
            )}
          </h1>
          
          <p className="text-gray-400 max-w-lg mx-auto font-light italic text-sm sm:text-base">
            {availableVouchers.length} special moment{availableVouchers.length !== 1 ? 's' : ''} waiting to be cherished
          </p>

          <div className="flex justify-center space-x-2 mt-6">
            {[...Array(3)].map((_, i) => (
              <Heart 
                key={i} 
                className={`h-3 w-3 text-rose-200 fill-rose-200`}
                style={{ opacity: 0.3 + i * 0.2 }}
              />
            ))}
          </div>
        </div>

        {/* Elegant Search */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-100 to-pink-100 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300" />
            <div className="relative flex items-center">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-rose-300" />
              <input
                type="text"
                placeholder="Search for a memory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white/80 backdrop-blur-sm border border-rose-100 rounded-xl text-sm text-gray-600 placeholder-gray-300 focus:outline-none focus:border-rose-200 focus:ring-1 focus:ring-rose-100 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-rose-50 rounded-full transition-colors"
                >
                  <span className="text-xs text-rose-300">✕</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Tabs with more categories */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/70 backdrop-blur-sm p-1.5 rounded-2xl border border-rose-100 shadow-sm flex flex-wrap justify-center">
            <button
              onClick={() => setActiveTab('available')}
              className={`relative px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                activeTab === 'available'
                  ? 'text-white'
                  : 'text-gray-500 hover:text-rose-500'
              }`}
            >
              {activeTab === 'available' && (
                <span className="absolute inset-0 bg-gradient-to-r from-rose-400 to-pink-400 rounded-xl shadow-md animate-fade-in" />
              )}
              <span className="relative flex items-center space-x-2">
                <Gift className={`h-4 w-4 ${activeTab === 'available' ? 'text-white' : ''}`} />
                <span>Available</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === 'available' 
                    ? 'bg-white/20 text-white' 
                    : 'bg-rose-50 text-rose-400'
                }`}>
                  {availableVouchers.length}
                </span>
              </span>
            </button>
            
            <button
              onClick={() => setActiveTab('claimed')}
              className={`relative px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                activeTab === 'claimed'
                  ? 'text-white'
                  : 'text-gray-500 hover:text-rose-500'
              }`}
            >
              {activeTab === 'claimed' && (
                <span className="absolute inset-0 bg-gradient-to-r from-rose-400 to-pink-400 rounded-xl shadow-md animate-fade-in" />
              )}
              <span className="relative flex items-center space-x-2">
                <Star className={`h-4 w-4 ${activeTab === 'claimed' ? 'text-white' : ''}`} />
                <span>Claimed</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === 'claimed' 
                    ? 'bg-white/20 text-white' 
                    : 'bg-rose-50 text-rose-400'
                }`}>
                  {claimedVouchers.length}
                </span>
              </span>
            </button>

            {(expiredVouchers.length > 0 || fullyClaimedVouchers.length > 0) && (
              <button
                onClick={() => setActiveTab('expired')}
                className={`relative px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                  activeTab === 'expired'
                    ? 'text-white'
                    : 'text-gray-500 hover:text-rose-500'
                }`}
              >
                {activeTab === 'expired' && (
                  <span className="absolute inset-0 bg-gradient-to-r from-gray-400 to-rose-400 rounded-xl shadow-md animate-fade-in" />
                )}
                <span className="relative flex items-center space-x-2">
                  <CalendarX className={`h-4 w-4 ${activeTab === 'expired' ? 'text-white' : ''}`} />
                  <span>Past</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === 'expired' 
                      ? 'bg-white/20 text-white' 
                      : 'bg-gray-50 text-gray-400'
                  }`}>
                    {expiredVouchers.length + fullyClaimedVouchers.length}
                  </span>
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'available' && (
          availableVouchers.length === 0 ? (
            <div className="text-center py-20 bg-white/40 backdrop-blur-sm rounded-3xl border border-rose-100">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-rose-50/80 rounded-full mb-6">
                <Gift className="h-8 w-8 text-rose-300" />
              </div>
              <p className="text-gray-600 mb-2 font-light">No treasures at the moment</p>
              <p className="text-sm text-gray-400 font-light">New surprises are being prepared with love</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {availableVouchers.map((voucher) => (
                <VoucherCard
                  key={voucher._id}
                  voucher={voucher}
                  userId={user?.userId!}
                  onClaim={() => fetchData(user?.userId!)}
                />
              ))}
            </div>
          )
        )}

        {activeTab === 'claimed' && (
          claimedVouchers.length === 0 ? (
            <div className="text-center py-20 bg-white/40 backdrop-blur-sm rounded-3xl border border-rose-100">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-rose-50/80 rounded-full mb-6">
                <Camera className="h-8 w-8 text-rose-300" />
              </div>
              <p className="text-gray-600 mb-2 font-light">No memories captured yet</p>
              <p className="text-sm text-gray-400 font-light">Start claiming to create beautiful moments</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {claimedVouchers.map((claim) => (
                <div 
                  key={claim._id} 
                  className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-rose-100 overflow-hidden hover:shadow-lg transition-all duration-500 hover:-translate-y-1"
                >
                  {claim.evidenceImage && (
                    <div className="relative h-44 overflow-hidden">
                      <img 
                        src={claim.evidenceImage} 
                        alt="" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-serif text-lg text-gray-800 mb-1">{claim.voucher.title}</h3>
                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                          <Clock className="h-3 w-3" />
                          <span>
                            {new Date(claim.claimedAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                      
                      <span className={`px-3 py-1 rounded-full text-xs font-light tracking-wide ${
                        claim.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        claim.status === 'rejected' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                        'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}>
                        {claim.status}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-500 font-light italic border-l-2 border-rose-100 pl-3">
                      "{claim.voucher.description}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {activeTab === 'expired' && (
          <div className="space-y-8">
            {fullyClaimedVouchers.length > 0 && (
              <div>
                <h3 className="text-lg font-serif text-gray-500 mb-4 flex items-center space-x-2">
                  <Gift className="h-4 w-4" />
                  <span>Fully Claimed Treasures</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {fullyClaimedVouchers.map((voucher) => (
                    <div 
                      key={voucher._id} 
                      className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 opacity-75"
                    >
                      <h4 className="font-serif text-lg text-gray-600 mb-2">{voucher.title}</h4>
                      <p className="text-sm text-gray-400 italic mb-3">"{voucher.description}"</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">All claimed</span>
                        <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                          {voucher.claimLimit}/{voucher.claimLimit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {expiredVouchers.length > 0 && (
              <div>
                <h3 className="text-lg font-serif text-gray-500 mb-4 flex items-center space-x-2">
                  <CalendarX className="h-4 w-4" />
                  <span>Expired Treasures</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {expiredVouchers.map((voucher) => (
                    <div 
                      key={voucher._id} 
                      className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 opacity-75"
                    >
                      <h4 className="font-serif text-lg text-gray-600 mb-2">{voucher.title}</h4>
                      <p className="text-sm text-gray-400 italic mb-3">"{voucher.description}"</p>
                      <div className="text-xs text-gray-400">
                        Expired on {new Date(voucher.expireDate!).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {expiredVouchers.length === 0 && fullyClaimedVouchers.length === 0 && (
              <div className="text-center py-20 bg-white/40 backdrop-blur-sm rounded-3xl border border-rose-100">
                <p className="text-gray-400">No past treasures to show</p>
              </div>
            )}
          </div>
        )}

        {/* Elegant Footer */}
        <div className="text-center mt-24">
          <div className="inline-flex items-center space-x-4 text-xs text-gray-300">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-rose-200" />
            <div className="flex items-center space-x-2">
              <Feather className="h-3 w-3" />
              <span>crafted with hardwork</span>
              <Heart className="h-3 w-3 fill-rose-200 text-rose-200" />
            </div>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-rose-200" />
          </div>
        </div>
      </main>
    </>
  );
}