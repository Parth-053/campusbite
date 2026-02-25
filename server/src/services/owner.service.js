import Order from "../models/Order.js";
import Canteen from "../models/Canteen.js";

//-----------------------------------------------------------------------
//    dashboard
//-----------------------------------------------------------------------

export const getOwnerDashboardDataService = async (ownerId) => {
  const canteen = await Canteen.findOne({ owner: ownerId });
  if (!canteen) throw new Error("Canteen not found for this owner");

  const canteenId = canteen._id;

  // 1. Calculate Overall Stats
  const totalOrders = await Order.countDocuments({ canteen: canteenId });
  const pendingOrders = await Order.countDocuments({ 
    canteen: canteenId, 
    status: { $in: ['Pending', 'Preparing'] } 
  });
  const completedOrders = await Order.countDocuments({ 
    canteen: canteenId, 
    status: 'Completed' 
  });
  
  const revenueResult = await Order.aggregate([
    { $match: { canteen: canteenId, status: 'Completed' } },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } }
  ]);
  const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

  // 2. Get Top 3 Latest Orders
  const recentOrders = await Order.find({ canteen: canteenId })
    .sort({ createdAt: -1 })
    .limit(3)
    .populate('customer', 'name email'); 

  // 3. 🚀 DYNAMIC LIVE REVENUE TREND (Starts exactly when opened)
  let formattedTrend = [];

  if (canteen.isOpen && canteen.lastOpenedAt) {
    const now = new Date();
    const openedAt = new Date(canteen.lastOpenedAt);
    
    // Calculate how many hours it has been open
    const hoursSinceOpen = Math.floor((now - openedAt) / (1000 * 60 * 60));
    
    // Cap at 6 hours past (7 bars total) so UI doesn't break if left open too long
    const barsToShow = Math.min(hoursSinceOpen, 6); 
    
    const startTime = new Date(now);
    startTime.setHours(now.getHours() - barsToShow, 0, 0, 0);

    const recentCompletedOrders = await Order.find({
      canteen: canteenId,
      status: 'Completed',
      createdAt: { $gte: startTime }
    });

    const hourlyRevenue = {};
    recentCompletedOrders.forEach(order => {
      const hour = new Date(order.createdAt).getHours();
      hourlyRevenue[hour] = (hourlyRevenue[hour] || 0) + order.totalAmount;
    });

    // Build the graph array dynamically based on open duration
    for (let i = barsToShow; i >= 0; i--) {
      const d = new Date();
      d.setHours(now.getHours() - i);
      const hr = d.getHours();
      const ampm = hr >= 12 ? 'PM' : 'AM';
      const displayHour = hr % 12 || 12;

      formattedTrend.push({
        time: `${displayHour} ${ampm}`,
        value: hourlyRevenue[hr] || 0
      });
    }
  }

  return {
    isOpen: canteen.isOpen,
    stats: { totalRevenue, totalOrders, pendingOrders, completedOrders },
    recentOrders,
    revenueTrend: formattedTrend // Will be empty if closed []
  };
};

export const toggleCanteenStatusService = async (ownerId) => {
  const canteen = await Canteen.findOne({ owner: ownerId });
  if (!canteen) throw new Error("Canteen not found for this owner");

  canteen.isOpen = !canteen.isOpen;
  
  // 🚀 Record the exact time the owner opened the canteen
  if (canteen.isOpen) {
    canteen.lastOpenedAt = new Date();
  }

  await canteen.save();
  
  return { isOpen: canteen.isOpen };
};

//-----------------------------------------------------------------------
//     analytics
//-----------------------------------------------------------------------

export const getOwnerAnalyticsService = async (ownerId, query) => {
  const canteen = await Canteen.findOne({ owner: ownerId });
  if (!canteen) throw new Error("Canteen not found");
  const canteenId = canteen._id;

  const { timeframe = 'till_now' } = query;
  
  const now = new Date();
  let startDate = new Date(0);  
  let endDate = new Date(now);
  let dateFormat = "%b %Y";  
 
  switch(timeframe) {
    case 'today':
      startDate = new Date(now.setHours(0,0,0,0));
      dateFormat = "%H:00";  
      break;
    case 'yesterday':
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 1);
      startDate.setHours(0,0,0,0);
      endDate = new Date(startDate);
      endDate.setHours(23,59,59,999);
      dateFormat = "%H:00";  
      break;
    case 'last_week':
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      dateFormat = "%d %b"; 
      break;
    case 'last_month':
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      dateFormat = "%d %b";  
      break;
    case 'last_6_months':
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 6);
      dateFormat = "%b %Y";  
      break;
    case 'last_year':
      startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);
      dateFormat = "%b %Y"; 
      break;
    case 'till_now':
    default:
      startDate = new Date(0);
      dateFormat = "%b %Y";  
      break;
  }

  const matchStage = {
    canteen: canteenId,
    status: 'Completed',
    createdAt: { $gte: startDate, $lte: endDate }
  };

  // 1. Get High-Level Stats (Only Revenue & Orders)
  const statsResult = await Order.aggregate([
    { $match: matchStage },
    { $group: {
        _id: null,
        totalRevenue: { $sum: "$totalAmount" },
        totalOrders: { $sum: 1 }
    }}
  ]);
  const stats = statsResult[0] || { totalRevenue: 0, totalOrders: 0 };

  // 2. Get Dynamic Trend Data
  const trendResult = await Order.aggregate([
    { $match: matchStage },
    { $group: {
        _id: { $dateToString: { format: dateFormat, date: "$createdAt", timezone: "Asia/Kolkata" } },
        revenue: { $sum: "$totalAmount" },
        orders: { $sum: 1 },
        sortDate: { $first: "$createdAt" } 
    }},
    { $sort: { sortDate: 1 } }
  ]);

  const formattedTrend = trendResult.map(item => ({
    label: item._id,
    value: item.revenue,
    orders: item.orders
  }));

  // 3. Get Top 10 Selling Items & Calculate % 
  const totalItemsResult = await Order.aggregate([
    { $match: matchStage },
    { $unwind: "$items" },
    { $group: { _id: null, totalItemsRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } } } }
  ]);
  const totalItemsRevenue = totalItemsResult[0]?.totalItemsRevenue || 1;  

  const topItemsResult = await Order.aggregate([
    { $match: matchStage },
    { $unwind: "$items" },
    { $group: {
        _id: "$items.menuItem",
        totalQuantity: { $sum: "$items.quantity" },
        totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
    }},
    { $sort: { totalQuantity: -1 } },
    { $limit: 10 },  
    { $lookup: { from: 'menus', localField: '_id', foreignField: '_id', as: 'menuDetails' } },
    { $unwind: "$menuDetails" },
    { $project: {
        name: "$menuDetails.name",
        image: "$menuDetails.image",
        totalQuantity: 1,
        totalRevenue: 1
    }}
  ]);

  // Append Percentage
  const topItemsWithPercent = topItemsResult.map(item => ({
    ...item,
    percentage: ((item.totalRevenue / totalItemsRevenue) * 100).toFixed(1)
  }));

  return { stats, trend: formattedTrend, topItems: topItemsWithPercent };
};