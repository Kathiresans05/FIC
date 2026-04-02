import mongoose from 'mongoose';

const payoutSchema = new mongoose.Schema({
    payoutId: { type: String, unique: true, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Paid', 'Rejected'], default: 'Pending' },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

const Payout = mongoose.model('Payout', payoutSchema);
export default Payout;
