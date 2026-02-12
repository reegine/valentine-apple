'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { 
  Plus, Edit, Trash2, Image as ImageIcon, 
  QrCode, Calendar, X, Upload, Heart, 
  Camera, Coffee, Gift, Star, Moon, Sun 
} from 'lucide-react';
import HeartBackground from '../../../components/HeartBackground';
import Navbar from '../../../components/Navbar';

// Available icons for banner
const AVAILABLE_ICONS = [
  { name: 'Heart', icon: Heart },
  { name: 'Gift', icon: Gift },
  { name: 'Camera', icon: Camera },
  { name: 'Coffee', icon: Coffee },
  { name: 'Star', icon: Star },
  { name: 'Moon', icon: Moon },
  { name: 'Sun', icon: Sun },
];

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

export default function AdminPage() {
  const router = useRouter();
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    bannerType: 'default',
    bannerImage: '',
    bannerIcon: '',
    barcode: Math.random().toString(36).substring(2, 10).toUpperCase(),
    expireDate: '',
    neverExpires: false,
    claimLimit: 1,
    requiresImage: false
  });

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token) as any;
      if (!decoded.isAdmin) {
        router.push('/');
        return;
      }
      fetchVouchers();
    } catch {
      router.push('/login');
    }
  }, [router]);

  const fetchVouchers = async () => {
    try {
      const res = await fetch('/api/vouchers');
      const data = await res.json();
      setVouchers(data);
    } catch (error) {
      console.error('Error fetching vouchers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    
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
        setFormData({ ...formData, bannerImage: data.imageUrl });
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image. Please try again.');
      } finally {
        setUploadingImage(false);
      }
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const url = editingVoucher 
      ? `/api/vouchers/${editingVoucher._id}`
      : '/api/vouchers';
    
    const method = editingVoucher ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowModal(false);
        setEditingVoucher(null);
        resetForm();
        fetchVouchers();
      }
    } catch (error) {
      console.error('Error saving voucher:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this voucher?')) return;

    try {
      const res = await fetch(`/api/vouchers/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchVouchers();
      }
    } catch (error) {
      console.error('Error deleting voucher:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      bannerType: 'default',
      bannerImage: '',
      bannerIcon: '',
      barcode: Math.random().toString(36).substring(2, 10).toUpperCase(),
      expireDate: '',
      neverExpires: false,
      claimLimit: 1,
      requiresImage: false
    });
  };

  const openEditModal = (voucher: Voucher) => {
    setEditingVoucher(voucher);
    setFormData({
      title: voucher.title,
      description: voucher.description,
      bannerType: voucher.bannerType,
      bannerImage: voucher.bannerImage || '',
      bannerIcon: voucher.bannerIcon || '',
      barcode: voucher.barcode,
      expireDate: voucher.expireDate ? new Date(voucher.expireDate).toISOString().split('T')[0] : '',
      neverExpires: voucher.neverExpires,
      claimLimit: voucher.claimLimit,
      requiresImage: voucher.requiresImage
    });
    setShowModal(true);
  };

  if (loading) {
    return (
      <>
        <HeartBackground />
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto" />
            <p className="mt-4 text-gray-600">Loading admin panel...</p>
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          
          <button
            onClick={() => {
              setEditingVoucher(null);
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition"
          >
            <Plus className="h-5 w-5" />
            <span>Create Voucher</span>
          </button>
        </div>

        {/* Vouchers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vouchers.map((voucher) => (
            <div key={voucher._id} className="bg-white/90 backdrop-blur-sm rounded-xl border border-pink-200 p-6 hover:shadow-lg transition-all duration-300">
              {/* Banner Preview */}
              {voucher.bannerType === 'image' && voucher.bannerImage && (
                <div className="mb-4 rounded-lg overflow-hidden h-32">
                  <img 
                    src={voucher.bannerImage} 
                    alt={voucher.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold text-gray-800">{voucher.title}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(voucher)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(voucher._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">{voucher.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-500">
                  <QrCode className="h-4 w-4 mr-2" />
                  <span className="font-mono">{voucher.barcode}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{voucher.neverExpires ? 'Never expires' : `Expires ${new Date(voucher.expireDate!).toLocaleDateString()}`}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  <span className="capitalize">{voucher.bannerType} banner</span>
                </div>
                <div className="text-gray-500">
                  Claim limit: {voucher.claimLimit}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-pink-100 p-6 flex justify-between items-center">
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  {editingVoucher ? 'Edit Voucher' : 'Create New Voucher'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-pink-50 rounded-lg transition"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="E.g., Romantic Dinner"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Describe this special voucher..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Banner Type
                  </label>
                  <select
                    value={formData.bannerType}
                    onChange={(e) => setFormData({ ...formData, bannerType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="default">Default (Heart)</option>
                    <option value="icon">Icon</option>
                    <option value="image">Upload Image</option>
                  </select>
                </div>

                {formData.bannerType === 'image' && (
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Banner Image
                    </label>
                    
                    {/* Image Upload Area */}
                    <div className="border-2 border-dashed border-pink-200 rounded-lg p-6 text-center hover:border-pink-500 transition">
                      {formData.bannerImage ? (
                        <div className="space-y-4">
                          <div className="relative inline-block">
                            <img 
                              src={formData.bannerImage} 
                              alt="Banner preview" 
                              className="max-h-48 rounded-lg mx-auto"
                            />
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, bannerImage: '' })}
                              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-500">Image uploaded successfully!</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex justify-center">
                            <Upload className="h-12 w-12 text-pink-400" />
                          </div>
                          <div>
                            <p className="text-gray-600">Drag and drop or click to upload</p>
                            <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="banner-upload"
                            disabled={uploadingImage}
                          />
                          <label
                            htmlFor="banner-upload"
                            className="inline-block px-4 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition cursor-pointer"
                          >
                            {uploadingImage ? (
                              <span className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-pink-600 border-t-transparent rounded-full animate-spin" />
                                <span>Uploading...</span>
                              </span>
                            ) : (
                              'Choose Image'
                            )}
                          </label>
                        </div>
                      )}
                    </div>
                    
                    {/* URL Fallback */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or use URL</span>
                      </div>
                    </div>
                    
                    <input
                      type="url"
                      value={formData.bannerImage}
                      onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                )}

                {formData.bannerType === 'icon' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Choose Icon
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {AVAILABLE_ICONS.map((IconComponent) => (
                        <button
                          key={IconComponent.name}
                          type="button"
                          onClick={() => setFormData({ ...formData, bannerIcon: IconComponent.name.toLowerCase() })}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            formData.bannerIcon === IconComponent.name.toLowerCase()
                              ? 'border-pink-500 bg-pink-50'
                              : 'border-gray-200 hover:border-pink-300'
                          }`}
                        >
                          <IconComponent.icon className={`h-6 w-6 mx-auto ${
                            formData.bannerIcon === IconComponent.name.toLowerCase()
                              ? 'text-pink-600'
                              : 'text-gray-600'
                          }`} />
                          <span className="text-xs mt-1 block text-gray-600">
                            {IconComponent.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Barcode
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      required
                      value={formData.barcode}
                      onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, barcode: Math.random().toString(36).substring(2, 10).toUpperCase() })}
                      className="px-4 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition"
                    >
                      Random
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expire Date
                    </label>
                    <input
                      type="date"
                      disabled={formData.neverExpires}
                      value={formData.expireDate}
                      onChange={(e) => setFormData({ ...formData, expireDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  </div>
                  <div className="flex items-center h-full pt-6">
                    <label className="flex items-center space-x-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={formData.neverExpires}
                        onChange={(e) => setFormData({ ...formData, neverExpires: e.target.checked })}
                        className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                      />
                      <span>Never expires</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Claim Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.claimLimit}
                    onChange={(e) => setFormData({ ...formData, claimLimit: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Set to 1 for single use, higher for multiple claims
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="requiresImage"
                    checked={formData.requiresImage}
                    onChange={(e) => setFormData({ ...formData, requiresImage: e.target.checked })}
                    className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                  />
                  <label htmlFor="requiresImage" className="text-sm text-gray-700">
                    Require image evidence when claiming
                  </label>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploadingImage}
                    className="px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition disabled:opacity-50"
                  >
                    {editingVoucher ? 'Update' : 'Create'} Voucher
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  );
}