import Job from '../models/Job.js';
import Candidate from '../models/Candidate.js';
import User from '../models/User.js';
import Payout from '../models/Payout.js';

// @desc    Get dashboard statistics
// @route   GET /api/stats
export const getStats = async (req, res) => {
  try {
    // Current user context (would come from auth middleware)
    const currentUserId = req.query.userId; 
    let queryFilter = {};
    let userName = 'Rahul Sharma'; // Default for demo if no user found

    if (currentUserId) {
      const currentUser = await User.findById(currentUserId);
      if (currentUser) {
        userName = currentUser.name;
        queryFilter = { referredBy: userName };
      }
    }

    // Today's boundaries
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // 1. KPI Counts
    const activeJobs = await Job.countDocuments({ status: 'Open' });
    const totalCandidates = await Candidate.countDocuments();
    const todayNewJobs = await Job.countDocuments({ createdAt: { $gte: startOfToday } });
    const todayInterviews = await Candidate.countDocuments({
      status: 'Interviewing',
      updatedAt: { $gte: startOfToday, $lte: endOfToday }
    });

    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const joinedThisMonthCount = await Candidate.countDocuments({
      status: 'Joined',
      updatedAt: { $gte: startOfMonth }
    });

    // Today activities for Team Dashboard
    const todayCalls = await Candidate.countDocuments({
      status: { $in: ['Called', 'Connected', 'Interested'] },
      updatedAt: { $gte: startOfToday, $lte: endOfToday }
    });

    const connectedCount = await Candidate.countDocuments({
      status: { $in: ['Connected', 'Interested'] },
      updatedAt: { $gte: startOfToday, $lte: endOfToday }
    });

    const interestedCount = await Candidate.countDocuments({
      status: 'Interested'
    });

    const followupsDueCount = await Candidate.countDocuments({
      status: { $ne: 'Joined' },
      followupDate: { $lte: endOfToday }
    });

    // 2. Hourly Activity (Last 24 Hours)
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 23);

    const hourlyAggregation = await Candidate.aggregate([
      {
        $match: {
          ...queryFilter,
          updatedAt: { $gte: twentyFourHoursAgo }
        }
      },
      {
        $group: {
          _id: { $hour: "$updatedAt" },
          total: { $sum: 1 },
          connected: {
            $sum: {
              $cond: [{ $in: ["$status", ["Connected", "Interested", "Interviewing", "Joined"]] }, 1, 0]
            }
          }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const hourlyActivityData = [];
    for (let i = 0; i < 24; i++) {
      const checkDate = new Date();
      checkDate.setHours(checkDate.getHours() - (23 - i));
      const h = checkDate.getHours();
      const match = hourlyAggregation.find(a => a._id === h);
      
      const ampm = h >= 12 ? 'PM' : 'AM';
      const hour12 = h % 12 || 12;
      
      hourlyActivityData.push({
        name: `${hour12}${ampm}`,
        calls: match ? match.total : 0,
        connected: match ? match.connected : 0
      });
    }

    // 3. Hiring Funnel Metrics
    const funnelStages = ['Applied', 'Screening', 'Interviewing', 'Selected', 'Joined'];
    const funnelData = await Promise.all(funnelStages.map(async (stage) => {
      const count = await Candidate.countDocuments({ ...queryFilter, status: stage });
      return { 
        name: stage === 'Selected' ? 'Offered' : stage, 
        value: count, 
        fill: stage === 'Applied' ? '#F59E0B' : 
               stage === 'Screening' ? '#D97706' : 
               stage === 'Interviewing' ? '#B45309' : 
               stage === 'Selected' ? '#92400E' : '#10B981' 
      };
    }));

    // 4. Monthly Joining Trend (Last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const trendAggregation = await Candidate.aggregate([
      { $match: { ...queryFilter, status: 'Joined', updatedAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { month: { $month: "$updatedAt" }, year: { $year: "$updatedAt" } }, count: { $sum: 1 } } },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const joiningTrend = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      const m = d.getMonth() + 1;
      const y = d.getFullYear();
      const match = trendAggregation.find(t => t._id.month === m && t._id.year === y);
      joiningTrend.push({ name: monthNames[m - 1], value: match ? match.count : 0 });
    }

    // Weekly Activity (Last 7 days)
    const weekAgo = new Date(startOfToday);
    weekAgo.setDate(weekAgo.getDate() - 6);

    const weeklyAggregation = await Candidate.aggregate([
      { $match: { ...queryFilter, updatedAt: { $gte: weekAgo } } },
      { $group: { 
          _id: { $dayOfWeek: "$updatedAt" }, 
          joins: { $sum: { $cond: [{ $eq: ["$status", "Joined"] }, 1, 0] } }, 
          calls: { $sum: 1 } 
        } 
      }
    ]);
    
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(startOfToday);
      d.setDate(d.getDate() - i);
      const dayIndex = d.getDay() + 1; // Mongo $dayOfWeek returns 1 (Sun) to 7 (Sat)
      const match = weeklyAggregation.find(w => w._id === dayIndex);
      weeklyData.push({
        day: dayNames[dayIndex - 1],
        joins: match ? match.joins : 0,
        calls: match ? match.calls : 0
      });
    }

    // 5. Recent Activity
    const recentCandidates = await Candidate.find(queryFilter)
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate('jobId', 'title')
      .lean();

    const recentActivity = recentCandidates.map(act => ({
      name: act.name,
      action: act.status,
      time: act.updatedAt,
      status: act.status === 'Joined' ? 'green' : (['Interviewing', 'Selected'].includes(act.status) ? 'orange' : 'gray')
    }));

    // 6. Global Leaderboard (By Joins)
    const leaderboardAggregation = await Candidate.aggregate([
      { $match: { status: 'Joined' } },
      { $group: { _id: "$referredBy", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const colors = ['#F59E0B', '#94A3B8', '#B45309', '#64748B', '#475569'];
    const leaderboard = leaderboardAggregation.map((p, i) => ({
      rank: i + 1,
      name: p._id || 'Organic',
      joins: p.count,
      location: 'Ahmedabad', // Placeholder until User model location is joined
      color: colors[i] || '#CBD5E1'
    }));

    // Data for Admin (Top 4 performance)
    const performanceData = leaderboardAggregation.slice(0, 4).map(p => ({
      name: p._id || 'Organic',
      joins: p.count,
      revenue: p.count * 5000 
    }));

    // 7. Upcoming Payouts
    const pendingPayouts = await Payout.find({ status: 'Pending' })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name')
      .lean();
    
    const upcomingPayouts = pendingPayouts.map(p => ({
      id: p.payoutId || `PAY-${p._id?.slice(-6).toUpperCase()}`,
      user: p.userId?.name || 'Recruiter',
      amount: `₹${p.amount.toLocaleString()}`,
      date: 'Pending Review'
    }));

    // 8. Pending Incentives (Simple calc for now)
    const pendingIncentivesVal = joinedThisMonthCount * 5000;
    const totalEarningsVal = joinedCount * 5000;

    // 9. Urgent items for Team Dashboard
    const urgentFollowups = await Candidate.find({
      ...queryFilter,
      status: { $in: ['Called', 'Connected', 'Interested'] },
      followupDate: { $lte: endOfToday }
    }).limit(4).lean();

    const scheduledInterviewsList = await Candidate.find({
      ...queryFilter,
      status: 'Interviewing',
      updatedAt: { $gte: startOfToday, $lte: endOfToday }
    }).limit(3).lean();

    res.status(200).json({
      // KPI basics
      activeJobs,
      totalCandidates,
      todayNewJobs,
      todayInterviews,
      joinedThisMonth: joinedThisMonthCount,
      
      // Referral Specific
      totalReferrals,
      validReferrals,
      interviewedCount,
      selectedCount,
      joinedCount,
      totalEarnings: `₹${totalEarningsVal.toLocaleString()}`,
      pendingIncentives: `₹${pendingIncentivesVal.toLocaleString()}`,
      
      // Detailed metrics
      todayCalls,
      connected: connectedCount,
      interested: interestedCount,
      followupsDue: followupsDueCount,
      
      // Charts & Lists
      funnelData,
      joiningTrend,
      hourlyActivity: hourlyActivityData,
      weeklyActivity: weeklyData,
      recentActivity,
      leaderboard,
      performanceData,
      upcomingPayouts,
      urgentFollowups,
      scheduledInterviews: scheduledInterviewsList,
      
      // Target (Placeholder/Default)
      monthlyTarget: {
        current: joinedThisMonthCount,
        goal: 20
      }
    });
  } catch (error) {
    console.error('Stats Error:', error);
    res.status(500).json({ message: error.message });
  }
};
