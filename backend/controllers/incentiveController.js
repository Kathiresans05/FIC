import IncentiveRule from '../models/IncentiveRule.js';
import Payout from '../models/Payout.js';

// @desc    Get all incentive rules
// @route   GET /api/incentives/rules
export const getIncentiveRules = async (req, res) => {
    try {
        const rules = await IncentiveRule.find();
        res.status(200).json(rules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new incentive rule
// @route   POST /api/incentives/rules
export const createIncentiveRule = async (req, res) => {
    try {
        const newRule = await IncentiveRule.create(req.body);
        res.status(201).json(newRule);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all payouts
// @route   GET /api/incentives/payouts
export const getPayouts = async (req, res) => {
    try {
        const payouts = await Payout.find().populate('userId', 'name role');
        res.status(200).json(payouts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update payout status
// @route   PATCH /api/incentives/payouts/:id
export const updatePayoutStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const payout = await Payout.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!payout) {
            return res.status(404).json({ message: 'Payout not found' });
        }
        res.status(200).json(payout);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a payout
// @route   DELETE /api/incentives/payouts/:id
export const deletePayout = async (req, res) => {
    try {
        const payout = await Payout.findByIdAndDelete(req.params.id);
        if (!payout) {
            return res.status(404).json({ message: 'Payout not found' });
        }
        res.status(200).json({ message: 'Payout deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update an incentive rule
// @route   PATCH /api/incentives/rules/:id
export const updateIncentiveRule = async (req, res) => {
    try {
        const updatedRule = await IncentiveRule.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedRule) {
            return res.status(404).json({ message: 'Rule not found' });
        }
        res.status(200).json(updatedRule);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete an incentive rule
// @route   DELETE /api/incentives/rules/:id
export const deleteIncentiveRule = async (req, res) => {
    try {
        const rule = await IncentiveRule.findByIdAndDelete(req.params.id);
        if (!rule) {
            return res.status(404).json({ message: 'Rule not found' });
        }
        res.status(200).json({ message: 'Incentive rule deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
