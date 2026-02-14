// valentine-apple\valentine-vouchers\models\Voucher.ts
import mongoose from 'mongoose';

const VoucherSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  bannerType: { type: String, default: 'default' },
  bannerImage: { type: String, default: null },
  bannerIcon: { type: String, default: null },
  barcode: { type: String, required: true, unique: true },
  expireDate: { type: Date, default: null },
  neverExpires: { type: Boolean, default: false },
  claimLimit: { type: Number, default: 1 },
  requiresImage: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  
  // Track total claims made
  totalClaims: { type: Number, default: 0 },
  
  // Track users who claimed (to prevent duplicate claims if needed)
  claimedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

// Add index for better query performance
VoucherSchema.index({ expireDate: 1 });
VoucherSchema.index({ neverExpires: 1 });
VoucherSchema.index({ claimLimit: 1, totalClaims: 1 });

export default mongoose.models.Voucher || mongoose.model('Voucher', VoucherSchema);