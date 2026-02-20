import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  ChefHat,
  CheckCircle,
  CreditCard,
  Check,
  X,
} from "lucide-react";
import {
  processPayment,
  simulateStatusUpdate,
  clearActiveOrder,
} from "../../store/orderSlice";

const OrderTracking = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { activeOrder, isPaying } = useSelector((state) => state.order);

  if (!activeOrder) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[70vh] p-4 text-center">
        <CheckCircle size={48} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-black text-gray-900">No Active Orders</h2>
        <button
          onClick={() => navigate("/")}
          className="mt-6 text-primary font-bold"
        >
          Go Home
        </button>
      </div>
    );
  }

  const handleOnlinePayment = () => {
    dispatch(processPayment());
  };

  const handleDone = () => {
    dispatch(clearActiveOrder());
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-24 animate-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <header className="bg-white px-4 py-4 shadow-sm flex items-center gap-4 sticky top-0 z-40">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-xl font-black text-gray-900 flex-1">Track Order</h1>
        <button
          onClick={handleDone}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
        >
          <X size={20} />
        </button>
      </header>

      <main className="flex-1 p-4 space-y-6">
        {/* --- Order Timeline UI --- */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative">
          <div className="absolute left-9 top-8 bottom-8 w-0.5 bg-gray-100"></div>

          {/* Step 1: Pending */}
          <div className="flex gap-4 relative z-10 mb-8">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors ${["Pending", "Preparing", "Ready", "Completed"].includes(activeOrder.status) ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-400"}`}
            >
              <Clock size={18} />
            </div>
            <div className="pt-2">
              <h3 className="font-bold text-gray-900 text-sm">
                Order Received
              </h3>
              <p className="text-[11px] text-gray-500">
                Waiting for canteen to accept.
              </p>
            </div>
          </div>

          {/* Step 2: Preparing */}
          <div className="flex gap-4 relative z-10 mb-8">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors ${["Preparing", "Ready", "Completed"].includes(activeOrder.status) ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-400"}`}
            >
              <ChefHat size={18} />
            </div>
            <div className="pt-2">
              <h3 className="font-bold text-gray-900 text-sm">
                Preparing Food
              </h3>
              <p className="text-[11px] text-gray-500">
                Your meal is being prepared.
              </p>
            </div>
          </div>

          {/* Step 3: Ready */}
          <div className="flex gap-4 relative z-10">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors ${["Ready", "Completed"].includes(activeOrder.status) ? "bg-green-500 text-white" : "bg-gray-200 text-gray-400"}`}
            >
              <CheckCircle size={18} />
            </div>
            <div className="pt-2">
              <h3 className="font-bold text-gray-900 text-sm">
                Ready for Pickup
              </h3>
              <p className="text-[11px] text-gray-500">
                Pick up your order from the counter.
              </p>
            </div>
          </div>
        </div>

        {/* --- Payment Action (ONLY SHOWS WHEN READY) --- */}
        {activeOrder.status === "Ready" && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 text-center animate-in zoom-in-95 duration-500 shadow-sm">
            <h3 className="font-black text-indigo-900 mb-1">
              Pay to Collect Food
            </h3>
            <p className="text-xs text-indigo-700/80 mb-4 font-bold">
              Total Amount: ₹{activeOrder.totalAmount}
            </p>

            <button
              onClick={handleOnlinePayment}
              disabled={isPaying}
              className="w-full bg-indigo-600 text-white font-black py-3.5 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg shadow-indigo-200"
            >
              {isPaying ? (
                "Processing..."
              ) : (
                <>
                  <CreditCard size={18} /> Pay Online Now
                </>
              )}
            </button>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-4">
              Note: Only Online Payment Accepted here.
            </p>
          </div>
        )}

        {/* --- Success Screen --- */}
        {activeOrder.status === "Completed" && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center animate-in zoom-in-95 shadow-sm">
            <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-green-200">
              <Check size={32} strokeWidth={3} />
            </div>
            <h3 className="font-black text-green-900 text-lg mb-1">
              Order Completed!
            </h3>
            <p className="text-sm text-green-700 mb-6 font-medium">
              Enjoy your meal! Your receipt is saved in history.
            </p>
            <button
              onClick={handleDone}
              className="w-full bg-white text-green-700 border border-green-200 font-black py-3.5 rounded-xl hover:bg-green-100 active:scale-95 transition-all"
            >
              Done
            </button>
          </div>
        )}

        {/* --- DEV TOOLS (To simulate the canteen owner updating status) --- */}
        {activeOrder.status !== "Completed" && (
          <div className="mt-10 border border-dashed border-red-300 p-4 rounded-xl text-center bg-red-50/30">
            <p className="text-[10px] text-red-500 font-black uppercase tracking-widest mb-3">
              Owner Simulation Tools
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => dispatch(simulateStatusUpdate("Preparing"))}
                className="text-[11px] bg-white border border-gray-200 px-3 py-1.5 rounded-lg font-bold shadow-sm active:bg-gray-50"
              >
                Set Preparing
              </button>
              <button
                onClick={() => dispatch(simulateStatusUpdate("Ready"))}
                className="text-[11px] bg-white border border-gray-200 px-3 py-1.5 rounded-lg font-bold shadow-sm active:bg-gray-50"
              >
                Set Ready
              </button>
              <button
                onClick={() => dispatch(simulateStatusUpdate("Completed"))}
                className="text-[11px] bg-white border border-gray-200 px-3 py-1.5 rounded-lg font-bold shadow-sm active:bg-gray-50"
              >
                Set Complete (Offline Pay)
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default OrderTracking;
