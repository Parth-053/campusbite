import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { School, MapPin, Clock } from "lucide-react";
import { fetchCanteens } from "../../store/canteenSlice";
import Skeleton from "../../components/common/Skeleton";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { canteens, isLoading } = useSelector((state) => state.canteen);

  // Fetch data when component mounts
  useEffect(() => {
    dispatch(fetchCanteens());
  }, [dispatch]);

  // Filter canteens to only show those belonging to the user's college
  const campusCanteens =
    canteens.filter((c) => c.college === user?.college) || canteens;

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-300">
      {/* --- Top Section: Selected College --- */}
      <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
          <School size={24} strokeWidth={2.5} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
            Your Campus
          </p>
          <h2 className="text-sm sm:text-base font-black text-gray-900 truncate">
            {user?.college || "Pune Institute of Technology"}
          </h2>
        </div>
      </div>

      {/* --- Canteens List --- */}
      <div>
        <h3 className="text-sm font-bold text-gray-800 mb-4 px-1">
          Campus Canteens
        </h3>

        {/* Responsive Grid: 1 column on mobile, 2 on small tablets/desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {isLoading ? (
            // Skeleton Loading State
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100"
              >
                <Skeleton className="h-36 w-full rounded-none" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))
          ) : campusCanteens.length > 0 ? (
            // Render Canteens
            campusCanteens.map((canteen) => (
              <div
                key={canteen.id}
                onClick={() => navigate(`/menu/${canteen.id}`)}
                className={`relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md active:scale-[0.98] 
                  ${!canteen.isOpen ? "grayscale opacity-75" : ""}
                `}
              >
                {/* Canteen Image Box */}
                <div className="relative h-36 w-full bg-gray-200">
                  <img
                    src={canteen.image}
                    alt={canteen.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  {/* Floating Tag (Top Right) */}
                  <div
                    className={`absolute top-3 right-3 px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg shadow-md backdrop-blur-md border border-white/20
                    ${canteen.isOpen ? "bg-green-500/90 text-white" : "bg-red-500/90 text-white"}
                  `}
                  >
                    {canteen.isOpen ? "Open Now" : "Closed"}
                  </div>
                </div>

                {/* Canteen Details Box */}
                <div className="p-4">
                  <h3 className="text-lg font-black text-gray-900 leading-tight mb-2">
                    {canteen.name}
                  </h3>

                  <div className="space-y-1.5">
                    <p className="text-xs font-bold text-gray-500 flex items-center gap-1.5 truncate">
                      <MapPin size={14} className="text-gray-400 shrink-0" />
                      <span className="truncate">{canteen.hostel}</span>
                    </p>
                    <p className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
                      <Clock size={14} className="text-gray-400 shrink-0" />
                      {canteen.openTime} - {canteen.closeTime}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Empty State
            <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
              <School className="w-10 h-10 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-bold">
                No canteens available for your college yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
