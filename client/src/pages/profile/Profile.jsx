import React, { useState, useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Camera, User, Mail, Phone, MapPin, 
  Bell, Clock, Trash2, LogOut, Save, ChevronRight, Loader2, Building
} from "lucide-react";
import { logoutCustomer } from "../../store/authSlice";
import { updateUserProfile, deleteAccount, clearProfileState } from "../../store/profileSlice";
import { 
  fetchStates, fetchDistricts, fetchColleges, fetchHostels, 
  clearDistricts, clearColleges, clearHostels 
} from "../../store/locationSlice";

const safeId = (item) => (item && typeof item === 'object' ? item._id || item.id : item) || '';
const safeName = (item) => (item && typeof item === 'object' ? item.name || item.state || item.district : item) || '';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { user } = useSelector((state) => state.auth);
  const { isLoading: isProfileLoading, successMessage } = useSelector((state) => state.profile || {});
  const locationData = useSelector((state) => state.location) || {};

  // 1. Initial Data (Stable reference for change comparison)
  const initialData = useMemo(() => {
    const c = user?.college || {};
    const d = c.district || {};
    const s = d.state || {};
    return {
      name: safeName(user?.name),
      phone: user?.phone || "",
      state: safeId(s),
      district: safeId(d),
      college: safeId(c),
      hostel: safeId(user?.hostel),
      roomNo: user?.roomNo || ""
    };
  }, [user]);

  // 2. Form State
  const [formData, setFormData] = useState({ ...initialData });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(user?.profileImage || null);

  // 3. Change Detection Logic 
  const isFormChanged = useMemo(() => {
    return (
      formData.name !== initialData.name ||
      formData.phone !== initialData.phone ||
      formData.state !== initialData.state ||
      formData.district !== initialData.district ||
      formData.college !== initialData.college ||
      formData.hostel !== initialData.hostel ||
      formData.roomNo !== initialData.roomNo ||
      selectedFile !== null
    );
  }, [formData, initialData, selectedFile]);

  // Fetch States on load
  useEffect(() => {
    dispatch(fetchStates()); 
    return () => { dispatch(clearProfileState()); }; 
  }, [dispatch]);

  // Handlers
  const handleStateChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, state: val, district: "", college: "", hostel: "" }));
    dispatch(clearDistricts()); dispatch(clearColleges()); dispatch(clearHostels());
    if (val) dispatch(fetchDistricts(val));
  };

  const handleDistrictChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, district: val, college: "", hostel: "" }));
    dispatch(clearColleges()); dispatch(clearHostels());
    if (val) dispatch(fetchColleges(val));
  };

  const handleCollegeChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, college: val, hostel: "" }));
    dispatch(clearHostels());
    if (val) dispatch(fetchHostels(val));
  };

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!isFormChanged) return;

    const data = new FormData();
    data.append("name", formData.name);
    data.append("phone", formData.phone);
    if (formData.college) data.append("college", formData.college);
    if (formData.hostel) data.append("hostel", formData.hostel);
    data.append("roomNo", formData.roomNo);
    if (selectedFile) data.append("image", selectedFile);

    dispatch(updateUserProfile(data)).then((res) => {
      if(!res.error) setSelectedFile(null); // Reset file selection after successful save
    });
  };

  const handleDeleteAccount = () => {
    if (window.confirm("🛑 Are you sure you want to delete your account? This cannot be undone.")) {
      dispatch(deleteAccount()).then((res) => {
        if(!res.error) {
          dispatch(logoutCustomer());
          navigate("/login");
        }
      });
    }
  };

  const handleLogout = () => {
    dispatch(logoutCustomer());
    navigate("/login");
  };

  const statesList = Array.isArray(locationData.states) ? locationData.states : [];
  const districtsList = Array.isArray(locationData.districts) ? locationData.districts : [];
  const collegesList = Array.isArray(locationData.colleges) ? locationData.colleges : [];
  const hostelsList = Array.isArray(locationData.hostels) ? locationData.hostels : [];

  if (!user) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-10 animate-in slide-in-from-right-4 duration-300">
      <header className="bg-white px-4 py-4 shadow-sm flex items-center gap-4 sticky top-0 z-40">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"><ArrowLeft size={22} /></button>
        <h1 className="text-xl font-black text-gray-900 flex-1">My Profile</h1>
      </header>

      {successMessage && (
        <div className="m-4 bg-green-50 text-green-700 p-3 rounded-xl border border-green-200 text-sm font-bold text-center animate-in fade-in">
          {successMessage}
        </div>
      )}

      <main className="flex-1 p-4 space-y-6 overflow-y-auto">
        
        {/* --- Image Upload & Name Section --- */}
        <div className="flex flex-col items-center justify-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="relative">
            <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full border-4 border-white shadow-lg overflow-hidden flex items-center justify-center text-4xl font-black">
              {imagePreview ? (
                 <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" /> 
              ) : (
                 formData.name?.charAt(0).toUpperCase() || <User size={40} />
              )}
            </div>
            <button type="button" onClick={() => fileInputRef.current.click()} className="absolute bottom-0 right-0 bg-primary text-white p-2.5 rounded-full shadow-md border-2 border-white hover:bg-indigo-700 active:scale-95 transition-all">
              <Camera size={14} />
            </button>
            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
          </div>
          
          <h2 className="text-xl font-black text-gray-800 mt-4">{formData.name || 'User'}</h2>
          <p className="text-gray-500 text-sm flex items-center gap-1 mt-1 font-medium">
            <Building size={14}/> {safeName(user?.college) || 'CampusCanteen Member'}
          </p>
        </div>

        {/* --- Edit Profile Form --- */}
        <form onSubmit={handleSave} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-sm font-black text-gray-800 border-b pb-2 mb-4">Personal & Campus Details</h2>

          <div className="relative"><User className="absolute left-3 top-3 text-gray-400" size={18} /><input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="Full Name" /></div>
          <div className="relative"><Mail className="absolute left-3 top-3 text-gray-400" size={18} /><input type="email" name="email" disabled value={user.email} className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-200 text-gray-500 rounded-lg text-sm cursor-not-allowed" placeholder="Email Address" /></div>
          <div className="relative"><Phone className="absolute left-3 top-3 text-gray-400" size={18} /><input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="Phone Number" /></div>

          <div className="pt-2">
            <label className="text-xs font-bold text-gray-500 mb-2 block">Change Location</label>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <select name="state" value={formData.state} onChange={handleStateChange} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none">
                <option value="">Select State</option>
                {statesList.map((st) => <option key={safeId(st)} value={safeId(st)}>{safeName(st)}</option>)}
              </select>

              <select name="district" disabled={!formData.state} value={formData.district} onChange={handleDistrictChange} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none disabled:opacity-50">
                <option value="">Select District</option>
                {districtsList.map((dist) => <option key={safeId(dist)} value={safeId(dist)}>{safeName(dist)}</option>)}
              </select>
            </div>

            <select name="college" required disabled={!formData.district} value={formData.college} onChange={handleCollegeChange} className="w-full px-4 py-2.5 mb-4 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none disabled:opacity-50">
              <option value="">Select College</option>
              {user?.college && !collegesList.some(col => safeId(col) === formData.college) && (
                <option value={safeId(user.college)}>{safeName(user.college)}</option>
              )}
              {collegesList.map((col) => <option key={safeId(col)} value={safeId(col)}>{safeName(col)}</option>)}
            </select>

            <div className="grid grid-cols-2 gap-3">
              <select name="hostel" required disabled={!formData.college} value={formData.hostel} onChange={handleChange} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none disabled:opacity-50">
                <option value="">Select Hostel</option>
                {user?.hostel && !hostelsList.some(hst => safeId(hst) === formData.hostel) && (
                  <option value={safeId(user.hostel)}>{safeName(user.hostel)}</option>
                )}
                {hostelsList.map((hst) => <option key={safeId(hst)} value={safeId(hst)}>{safeName(hst)}</option>)}
              </select>

              <input type="text" name="roomNo" value={formData.roomNo} onChange={handleChange} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="Room No (e.g. A-102)" />
            </div>
          </div>
 
          {isFormChanged && (
             <button type="submit" disabled={isProfileLoading} className="w-full mt-4 bg-gray-900 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-70 transition-all animate-in slide-in-from-bottom-2">
                {isProfileLoading ? <><Loader2 size={18} className="animate-spin"/> Saving...</> : <><Save size={18} /> Save Changes</>}
            </button>
          )}
        </form>

        {/* --- Action Menu --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <button onClick={() => navigate("/notifications")} className="w-full flex items-center justify-between p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors active:bg-gray-100">
            <div className="flex items-center gap-3 text-gray-700 font-bold text-sm"><div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Bell size={18} /></div> Notifications</div><ChevronRight size={18} className="text-gray-400" />
          </button>
          <button onClick={() => navigate("/order-history")} className="w-full flex items-center justify-between p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors active:bg-gray-100">
            <div className="flex items-center gap-3 text-gray-700 font-bold text-sm"><div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Clock size={18} /></div> Order History</div><ChevronRight size={18} className="text-gray-400" />
          </button>
          <button onClick={handleLogout} className="w-full flex items-center justify-between p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors active:bg-gray-100">
            <div className="flex items-center gap-3 text-gray-700 font-bold text-sm"><div className="p-2 bg-gray-100 text-gray-600 rounded-lg"><LogOut size={18} /></div> Logout</div>
          </button>
          <button onClick={handleDeleteAccount} className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors active:bg-red-100">
            <div className="flex items-center gap-3 text-red-600 font-bold text-sm"><div className="p-2 bg-red-50 text-red-600 rounded-lg"><Trash2 size={18} /></div> Delete Account</div>
          </button>
        </div>

      </main>
    </div>
  );
};

export default Profile;