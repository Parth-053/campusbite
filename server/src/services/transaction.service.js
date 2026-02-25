import Order from "../models/Order.js";
import Canteen from "../models/Canteen.js";
import Withdrawal from "../models/Withdrawal.js";

// Industry Standard: 10% Owner Commission Rate (You can move this to DB settings later)
const OWNER_COMMISSION_RATE = 0.10; 

export const getOwnerWalletService = async (ownerId) => {
  const canteen = await Canteen.findOne({ owner: ownerId });
  if (!canteen) throw new Error("Canteen not found");

  // 1. Fetch all completed orders for this canteen
  const completedOrders = await Order.find({ canteen: canteen._id, status: 'Completed' })
    .populate('items.menuItem', 'name')
    .sort({ createdAt: -1 });

  // 2. Calculate Gross Earnings (STRICTLY ITEM PRICE ONLY, ignoring customer fees/gst)
  let grossEarnings = 0;
  const orderHistory = completedOrders.map(order => {
    // Calculate just the base price of items
    const orderItemTotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    grossEarnings += orderItemTotal;
    
    return {
      orderId: order._id,
      date: order.createdAt,
      itemsCount: order.items.length,
      earnedAmount: orderItemTotal // Owner only sees this!
    };
  });

  // 3. Fetch all withdrawals (Pending + Processing + Completed)
  const withdrawals = await Withdrawal.find({ canteen: canteen._id, status: { $ne: 'Rejected' } })
    .sort({ createdAt: -1 });

  // Total amount that has been withdrawn or is currently locked in pending requests
  const totalWithdrawn = withdrawals.reduce((sum, w) => sum + w.amountRequested, 0);

  // 4. Calculate Available Balance
  const availableBalance = grossEarnings - totalWithdrawn;

  return {
    wallet: {
      grossEarnings,
      totalWithdrawn,
      availableBalance,
      minWithdrawalLimit: 500,
      commissionRatePercent: OWNER_COMMISSION_RATE * 100
    },
    orderHistory,
    withdrawalHistory: withdrawals
  };
};

export const requestWithdrawalService = async (ownerId, amount) => {
  const canteen = await Canteen.findOne({ owner: ownerId });
  if (!canteen) throw new Error("Canteen not found");

  // Verify balance mathematically to prevent fraud
  const walletData = await getOwnerWalletService(ownerId);
  const { availableBalance } = walletData.wallet;

  if (amount < 500) throw new Error("Minimum withdrawal amount is ₹500");
  if (amount > availableBalance) throw new Error("Insufficient wallet balance");

  // Calculate the Owner's cut
  const ownerCommissionDeducted = amount * OWNER_COMMISSION_RATE;
  const netPayable = amount - ownerCommissionDeducted;

  const withdrawal = new Withdrawal({
    owner: ownerId,
    canteen: canteen._id,
    amountRequested: amount,
    ownerCommissionDeducted,
    netPayable,
    status: 'Pending'
  });

  await withdrawal.save();
  return withdrawal;
};