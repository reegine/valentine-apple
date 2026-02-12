import mongoose from 'mongoose';

const VoucherSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  bannerType: { type: String, enum: ['image', 'icon', 'default'], default: 'default' },
  bannerImage: { type: String, default: null },
  bannerIcon: { type: String, default: null },
  barcode: { type: String, required: true, unique: true },
  expireDate: { type: Date, default: null },
  neverExpires: { type: Boolean, default: false },
  claimLimit: { type: Number, default: 1 },
  requiresImage: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Voucher || mongoose.model('Voucher', VoucherSchema);