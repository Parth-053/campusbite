import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, Plus, Minus } from "lucide-react";
import { fetchMenu } from "../../store/menuSlice";
import { updateCartItem } from "../../store/cartSlice";
import Skeleton from "../../components/common/Skeleton";
import FloatingCart from "../../components/floating/FloatingCart";

const Menu = () => {
  const { canteenId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { canteenName, categories, isLoading } = useSelector(
    (state) => state.menu,
  );
  const { items: cartItems } = useSelector((state) => state.cart); // Global Cart state

  useEffect(() => {
    dispatch(fetchMenu(canteenId));
  }, [dispatch, canteenId]);

  const handleCartChange = (item, change) => {
    dispatch(updateCartItem({ item, change, canteenId }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 flex flex-col sm:max-w-md mx-auto shadow-2xl animate-in slide-in-from-right-4 duration-300 pb-20">
      <header className="bg-white px-4 py-4 shadow-sm flex items-center gap-4 shrink-0 relative z-10">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={22} />
        </button>
        {isLoading ? (
          <Skeleton className="h-6 w-40" />
        ) : (
          <h1 className="text-lg font-black text-gray-900 truncate flex-1">
            {canteenName}
          </h1>
        )}
      </header>

      <main className="flex-1 overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <div className="p-4 space-y-8">
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
        ) : (
          <div className="p-4 space-y-8">
            {categories.map((categoryObj, idx) => (
              <div
                key={idx}
                className="animate-in fade-in duration-500 delay-100"
              >
                <h2 className="text-base font-black text-gray-800 mb-4 border-b pb-2 flex justify-between">
                  {categoryObj.category}{" "}
                  <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {categoryObj.items.length}
                  </span>
                </h2>

                <div className="space-y-3">
                  {categoryObj.items.map((item) => {
                    const quantity = cartItems[item.id]?.qty || 0; // Get qty from Redux

                    return (
                      <div
                        key={item.id}
                        className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center transition-all hover:border-primary/20"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <div
                              className={`w-3 h-3 rounded-sm border flex items-center justify-center ${item.type === "veg" ? "border-green-600" : "border-red-600"}`}
                            >
                              <div
                                className={`w-1.5 h-1.5 rounded-full ${item.type === "veg" ? "bg-green-600" : "bg-red-600"}`}
                              ></div>
                            </div>
                            <h3 className="text-sm font-bold text-gray-900">
                              {item.name}
                            </h3>
                          </div>
                          <p className="text-sm font-black text-gray-700">
                            ₹{item.price}
                          </p>
                        </div>

                        <div className="shrink-0 ml-4">
                          {quantity === 0 ? (
                            <button
                              onClick={() => handleCartChange(item, 1)}
                              className="w-20 py-1.5 border-2 border-primary text-primary font-black text-sm rounded-lg hover:bg-primary/5 active:scale-95"
                            >
                              ADD
                            </button>
                          ) : (
                            <div className="flex items-center bg-primary text-white rounded-lg shadow-sm w-20 justify-between overflow-hidden">
                              <button
                                onClick={() => handleCartChange(item, -1)}
                                className="w-1/3 py-2 flex items-center justify-center hover:bg-black/10 active:bg-black/20"
                              >
                                <Minus size={14} strokeWidth={3} />
                              </button>
                              <span className="w-1/3 text-center text-sm font-black bg-white text-primary py-1.5">
                                {quantity}
                              </span>
                              <button
                                onClick={() => handleCartChange(item, 1)}
                                className="w-1/3 py-2 flex items-center justify-center hover:bg-black/10 active:bg-black/20"
                              >
                                <Plus size={14} strokeWidth={3} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Show Floating Cart directly on Menu page overlay */}
      <FloatingCart />
    </div>
  );
};

export default Menu;
