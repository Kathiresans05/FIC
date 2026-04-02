// Helper to get date filter
const getDateFilter = (range) => {
    const now = new Date();
    let startDate;

    switch (range) {
        case 'Today':
            startDate = new Date(now.setHours(0, 0, 0, 0));
            break;
        case 'This Week':
            const day = now.getDay();
            startDate = new Date(now.setDate(now.getDate() - day));
            startDate.setHours(0, 0, 0, 0);
            break;
        case 'This Month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
        case 'This Year':
            startDate = new Date(now.getFullYear(), 0, 1);
            break;
        case 'All Time':
        default:
            return {};
    }
    return { createdAt: { $gte: startDate } };
};

// @desc    Get aggregated stats for Admin Reports
export const getReportStats = async (req, res) => {
    try {
        const { range = 'This Month' } = req.query;
        const dateFilter = getDateFilter(range);

        // 1. Summary Stats
        const totalJoins = await Candidate.countDocuments({ status: 'Joined', ...dateFilter });
        const activeJobs = await Job.countDocuments({ status: 'Active' });
        
        const pendingPayouts = await Payout.find({ status: { $in: ['Pending', 'Approved'] }, ...dateFilter });
        const incentiveLiability = pendingPayouts.reduce((acc, curr) => acc + curr.amount, 0);

        // Calculate Avg Time to Hire (Created to Joined)
        const joinedCandidates = await Candidate.find({ status: 'Joined', ...dateFilter });
        let totalDays = 0;
        joinedCandidates.forEach(c => {
            const diffTime = Math.abs(new Date(c.updatedAt) - new Date(c.createdAt));
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            totalDays += diffDays;
        });
        const avgTimeToHire = joinedCandidates.length > 0 ? Math.round(totalDays / joinedCandidates.length) : 0;

        // 2. Hiring Funnel
        const funnelStages = ['Lead Created', 'Interview Scheduled', 'Selected', 'Joined'];
        const funnelData = await Promise.all(funnelStages.map(async (stage, index) => {
            const count = await Candidate.countDocuments({ status: stage, ...dateFilter });
            const colors = ['#F59E0B', '#D97706', '#B45309', '#92400E'];
            return { name: stage, value: count, color: colors[index] };
        }));

        // 3. Sourcing Channels
        const sources = ['Direct', 'Agent', 'Referral'];
        const sourceData = await Promise.all(sources.map(async (source) => {
            const count = await Candidate.countDocuments({ source: source, ...dateFilter });
            return { name: source, value: count };
        }));

        // 4. Monthly Trend (Keep as is, showing past 6 months regardless of current filter)
        const monthlyTrend = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthName = date.toLocaleString('default', { month: 'short' });
            const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
            const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            const count = await Candidate.countDocuments({
                status: 'Joined',
                updatedAt: { $gte: startOfMonth, $lte: endOfMonth }
            });
            monthlyTrend.push({ month: monthName, target: 50, achieved: count });
        }

        // 5. Team Performance
        const teamPerf = await Candidate.aggregate([
            { $match: { status: 'Joined', ...dateFilter } },
            { $group: { _id: '$assignedTo', joins: { $sum: 1 } } },
            { $sort: { joins: -1 } },
            { $limit: 5 }
        ]);

        const detailedTeamPerf = await Promise.all(teamPerf.map(async (item) => {
            const user = await User.findById(item._id);
            return {
                name: user ? user.name : 'Unknown',
                joins: item.joins,
                performance: Math.min(100, (item.joins / 10) * 100)
            };
        }));

        res.status(200).json({
            summary: { totalJoins, activeJobs, incentiveLiability, avgTimeToHire },
            funnelData,
            sourceData,
            monthlyTrend,
            teamPerf: detailedTeamPerf
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Export Report Data as CSV
export const exportReportData = async (req, res) => {
    try {
        const candidates = await Candidate.find().populate('assignedTo', 'name');
        
        let csv = 'Candidate Name,Job Role,Status,Source,Assigned To,Created Date\n';
        candidates.forEach(c => {
            csv += `"${c.name}","${c.job}","${c.status}","${c.source}","${c.assignedTo?.name || 'Unassigned'}","${new Date(c.createdAt).toLocaleDateString()}"\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=recruitment_report.csv');
        res.status(200).send(csv);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
