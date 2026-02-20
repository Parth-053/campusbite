import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { updateCartItem, clearCart } from "../../store/cartSlice";
import { placeOrder } from "../../store/orderSlice"; // Added import for placeOrder

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items, totalQuantity, totalPrice, canteenId } = useSelector(
    (state) => state.cart,
  );
  const cartItemsArray = Object.values(items);

  const handleUpdate = (item, change) => {
    dispatch(updateCartItem({ item, change, canteenId }));
  };

  // NEW: Handle Order Confirmation with Popup
  const handleConfirmOrder = () => {
    if (window.confirm("Are you sure you want to confirm this order?")) {
      const platformFee = 5;
      const orderData = {
        canteenId,
        items: cartItemsArray,
        totalAmount: totalPrice + platformFee,
      };

      // Dispatch place order, clear the cart, and navigate home
      dispatch(placeOrder(orderData)).then(() => {
        dispatch(clearCart());
        navigate("/home");
      });
    }
  };

  if (totalQuantity === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[70vh] p-4 text-center animate-in fade-in">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <ShoppingBag size={32} className="text-gray-400" />
        </div>
        <h2 className="text-xl font-black text-gray-900 mb-2">
          Your cart is empty
        </h2>
        <p className="text-sm text-gray-500 mb-8">
          Looks like you haven't added anything to your cart yet.
        </p>
        <button
          onClick={() => navigate("/home")}
          className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-red-600 transition-colors"
        >
          Browse Canteens
        </button>
      </div>
    );
  }

  // Fees calculation
  const platformFee = 5;
  const grandTotal = totalPrice + platformFee;

  return (
    <div className="p-4 space-y-6 animate-in slide-in-from-right-4 duration-300 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-xl font-black text-gray-900 flex-1">
          Order Summary
        </h1>
        <button
          onClick={() => dispatch(clearCart())}
          className="text-red-500 p-2 hover:bg-red-50 rounded-full"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Cart Items */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4">
        {cartItemsArray.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center border-b border-gray-50 pb-4 last:border-0 last:pb-0"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div
                  className={`w-3 h-3 rounded-sm border flex items-center justify-center ${item.type === "veg" ? "border-green-600" : "border-red-600"}`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${item.type === "veg" ? "bg-green-600" : "bg-red-600"}`}
                  ></div>
                </div>
                <h3 className="text-sm font-bold text-gray-900">{item.name}</h3>
              </div>
              <p className="text-xs font-bold text-gray-500">₹{item.price}</p>
            </div>

            <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200">
              <button
                onClick={() => handleUpdate(item, -1)}
                className="px-3 py-1.5 hover:bg-gray-200 text-gray-700 font-bold"
              >
                <Minus size={14} />
              </button>
              <span className="px-3 py-1.5 bg-white text-sm font-black w-8 text-center">
                {item.qty}
              </span>
              <button
                onClick={() => handleUpdate(item, 1)}
                className="px-3 py-1.5 hover:bg-gray-200 text-gray-700 font-bold"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bill Details */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
        <h3 className="text-sm font-black text-gray-900 mb-2 uppercase tracking-wider">
          Bill Details
        </h3>
        <div className="flex justify-between text-sm text-gray-600 font-medium">
          <span>Item Total</span>
          <span>₹{totalPrice}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 font-medium pb-3 border-b border-dashed border-gray-200">
          <span>Platform Fee</span>
          <span>₹{platformFee}</span>
        </div>
        <div className="flex justify-between text-base font-black text-gray-900 pt-1">
          <span>To Pay</span>
          <span>₹{grandTotal}</span>
        </div>
      </div>

      {/* Fixed Checkout Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleConfirmOrder}
            className="w-full bg-primary text-white font-black py-4 rounded-xl hover:bg-red-600 shadow-lg shadow-primary/30 active:scale-[0.98] transition-all"
          >
            Confirm Order • ₹{grandTotal}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
