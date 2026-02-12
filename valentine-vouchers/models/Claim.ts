import mongoose from 'mongoose';

const ClaimSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  voucher: { type: mongoose.Schema.Types.ObjectId, ref: 'Voucher', required: true },
  claimedAt: { type: Date, default: Date.now },
  evidenceImage: { type: String, default: null },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
});

export default mongoose.models.Claim || mongoose.model('Claim', ClaimSchema);