import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  User,
  Mail,
  Phone,
  MapPin,
  Bell,
  Clock,
  Trash2,
  LogOut,
  Save,
  ChevronRight,
} from "lucide-react";
import {
  fetchLocationData,
  updateUserProfile,
  logout,
  deleteAccount,
} from "../../store/authSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { user, locationData, isLoading } = useSelector((state) => state.auth);

  // 1. Initialize local state directly from the Redux user object
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    state: user?.state || "Maharashtra", // Defaulting to trigger cascading for mock data
    district: user?.district || "Pune",
    college: user?.college || "",
    hostel: user?.hostel || "",
    roomNo: user?.roomNo || "",
    profileImage: user?.profileImage || null,
  });

  const [imagePreview, setImagePreview] = useState(user?.profileImage || null);
  const [successMsg, setSuccessMsg] = useState("");

  // 2. useEffect is now ONLY used to fetch the dropdown data from the backend
  useEffect(() => {
    if (!locationData) {
      dispatch(fetchLocationData());
    }
  }, [locationData, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      // Cascading Reset Logic
      if (name === "state") {
        newData.district = "";
        newData.college = "";
        newData.hostel = "";
      }
      if (name === "district") {
        newData.college = "";
        newData.hostel = "";
      }
      if (name === "college") {
        newData.hostel = "";
      }
      return newData;
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setFormData((prev) => ({ ...prev, profileImage: imageUrl }));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    dispatch(updateUserProfile(formData)).then(() => {
      setSuccessMsg("Profile updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    });
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This cannot be undone.",
      )
    ) {
      dispatch(deleteAccount()).then(() => navigate("/login"));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-10 animate-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <header className="bg-white px-4 py-4 shadow-sm flex items-center gap-4 sticky top-0 z-40">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-xl font-black text-gray-900 flex-1">My Profile</h1>
      </header>

      {successMsg && (
        <div className="m-4 bg-green-50 text-green-700 p-3 rounded-xl border border-green-200 text-sm font-bold text-center">
          {successMsg}
        </div>
      )}

      <main className="flex-1 p-4 space-y-6 overflow-y-auto">
        {/* --- Image Upload Section --- */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-28 h-28 bg-gray-200 rounded-full border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={48} className="text-gray-400" />
              )}
            </div>
            <button
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-0 right-0 bg-primary text-white p-2.5 rounded-full shadow-md border-2 border-white hover:bg-red-600 active:scale-95 transition-all"
            >
              <Camera size={16} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          <p className="text-xs text-gray-500 font-bold mt-3">
            Tap camera to change
          </p>
        </div>

        {/* --- Edit Profile Form --- */}
        <form
          onSubmit={handleSave}
          className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4"
        >
          <h2 className="text-sm font-black text-gray-800 border-b pb-2 mb-4">
            Personal & College Details
          </h2>

          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
              placeholder="Full Name"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="email"
              name="email"
              required
              disabled
              value={formData.email}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-200 text-gray-500 rounded-lg text-sm cursor-not-allowed"
              placeholder="Email Address"
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
              placeholder="Phone Number"
            />
          </div>

          <div className="pt-2">
            <div className="relative mb-4">
              <MapPin
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />
              <input
                type="text"
                value="India"
                disabled
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 bg-gray-100 text-gray-500 rounded-lg text-sm cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <select
                name="state"
                required
                value={formData.state}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="">Select State</option>
                {locationData?.states?.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <select
                name="district"
                required
                disabled={!formData.state}
                value={formData.district}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none disabled:opacity-50"
              >
                <option value="">Select District</option>
                {formData.state &&
                  locationData?.districts[formData.state]?.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
              </select>
            </div>

            <select
              name="college"
              required
              disabled={!formData.district}
              value={formData.college}
              onChange={handleChange}
              className="w-full px-4 py-2.5 mb-4 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none disabled:opacity-50"
            >
              <option value="">Select College</option>
              {formData.district &&
                locationData?.colleges[formData.district]?.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
            </select>

            <div className="grid grid-cols-2 gap-3">
              <select
                name="hostel"
                required
                disabled={!formData.college}
                value={formData.hostel}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none disabled:opacity-50"
              >
                <option value="">Select Hostel</option>
                {formData.college &&
                  locationData?.hostels[formData.college]?.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
              </select>

              <input
                type="text"
                name="roomNo"
                required
                value={formData.roomNo}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                placeholder="Room No (e.g. A-102)"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 bg-gray-900 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-70 transition-colors"
          >
            {isLoading ? (
              "Saving..."
            ) : (
              <>
                <Save size={18} /> Save Changes
              </>
            )}
          </button>
        </form>

        {/* --- Action Menu --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <button
            onClick={() => navigate("/notifications")}
            className="w-full flex items-center justify-between p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors active:bg-gray-100"
          >
            <div className="flex items-center gap-3 text-gray-700 font-bold text-sm">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Bell size={18} />
              </div>
              Notifications
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>

          <button
            onClick={() => navigate("/order-history")}
            className="w-full flex items-center justify-between p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors active:bg-gray-100"
          >
            <div className="flex items-center gap-3 text-gray-700 font-bold text-sm">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Clock size={18} />
              </div>
              Order History
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors active:bg-gray-100"
          >
            <div className="flex items-center gap-3 text-gray-700 font-bold text-sm">
              <div className="p-2 bg-gray-100 text-gray-600 rounded-lg">
                <LogOut size={18} />
              </div>
              Logout
            </div>
          </button>

          <button
            onClick={handleDeleteAccount}
            className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors active:bg-red-100"
          >
            <div className="flex items-center gap-3 text-red-600 font-bold text-sm">
              <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                <Trash2 size={18} />
              </div>
              Delete Account
            </div>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Profile;
