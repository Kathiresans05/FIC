import mongoose from 'mongoose';

const incentiveRuleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    triggerStage: { type: String, required: true },
    applicableRole: { type: String, required: true },
    payoutType: { type: String, enum: ['Fixed', 'Percentage'], required: true },
    value: { type: Number, required: true },
    conditions: { type: String },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

const IncentiveRule = mongoose.model('IncentiveRule', incentiveRuleSchema);
export default IncentiveRule;
