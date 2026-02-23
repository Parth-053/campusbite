import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { School, MapPin, Clock } from "lucide-react";
import { fetchCanteens, clearCanteens } from "../../store/canteenSlice";
import Skeleton from "../../components/common/Skeleton";

const safeId = (item) => (typeof item === 'object' && item !== null ? item._id || item.id || '' : String(item || ''));
const safeName = (item) => (typeof item === 'object' && item !== null ? item.name || '' : String(item || ''));

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { canteens, isLoading } = useSelector((state) => state.canteen);

  const userCollegeId = safeId(user?.college);

  useEffect(() => {
    if (userCollegeId) {
      dispatch(fetchCanteens(userCollegeId));
    } else {
      dispatch(clearCanteens());
    }
  }, [dispatch, userCollegeId]);

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-300">
      
      <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
          <School size={24} strokeWidth={2.5} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Your Campus</p>
          <h2 className="text-sm sm:text-base font-black text-gray-900 truncate">
            {safeName(user?.college) || "Update Profile to see Canteens"}
          </h2>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-800 mb-4 px-1">Campus Canteens</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
                <Skeleton className="h-36 w-full rounded-none" />
                <div className="p-4 space-y-2"><Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-1/2" /></div>
              </div>
            ))
          ) : canteens.length > 0 ? (
            canteens.map((canteen) => (
              <div
                key={safeId(canteen)} 
                onClick={() => navigate(`/menu/${safeId(canteen)}`)}
                className={`relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md active:scale-[0.98] 
                  ${!canteen.isOpen ? "grayscale opacity-75" : ""} 
                `}
              >
                {/* 🚀 FIXED: Directly using Database isOpen flag */}
                
                <div className="relative h-36 w-full bg-gray-200">
                  {canteen.image ? (
                    <img src={canteen.image} alt={canteen.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-400 font-bold">No Image</div>
                  )}

                  {/* 🚀 FIXED: Green for Open, Red for Closed based on DB status */}
                  <div className={`absolute top-3 right-3 px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg shadow-md backdrop-blur-md border border-white/20
                    ${canteen.isOpen ? "bg-green-500/90 text-white" : "bg-red-500/90 text-white"}
                  `}>
                    {canteen.isOpen ? "Open Now" : "Closed"}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-black text-gray-900 leading-tight mb-2">{canteen.name}</h3>
                  <div className="space-y-1.5">
                    <p className="text-xs font-bold text-gray-500 flex items-center gap-1.5 truncate">
                      <MapPin size={14} className="text-gray-400 shrink-0" />
                      <span className="truncate">{safeName(canteen.hostel) || "Central Canteen"}</span>
                    </p>
                    <p className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
                      <Clock size={14} className="text-gray-400 shrink-0" />
                      {canteen.openingTime} - {canteen.closingTime}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
              <School className="w-10 h-10 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-bold">
                {userCollegeId ? "No canteens are available for your college yet." : "Please update your profile to select a college."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;