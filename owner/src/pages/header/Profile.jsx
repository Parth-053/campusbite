import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Camera, Save, LogOut, Trash2, 
  User, CreditCard, Mail, Phone, Building 
} from 'lucide-react';

// Import Actions from Profile Slice
import { 
  toggleEdit, 
  setActiveTab, 
  updateProfileData, 
  updateStoreImage, 
  deleteAccount,
  logoutUser 
} from '../../store/profileSlice';

import Skeleton from '../../components/common/Skeleton';

// --- Sub-component: Handles Form State Separately ---
const ProfileForm = ({ user, canteen, isEditing, activeTab, updateLoading }) => {
  const dispatch = useDispatch();
  
  // Initialize state directly from props (No useEffect needed!)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    canteenName: canteen?.canteenName || '',
    upi: user?.bank?.upi || '',
    accountNumber: user?.bank?.accountNumber || '',
  });

  const handleSave = () => {
    dispatch(updateProfileData(formData));
  };

  return (
    <>
      <div className="flex justify-end mb-4 -mt-16 relative z-10">
        <button 
          onClick={() => isEditing ? handleSave() : dispatch(toggleEdit())}
          disabled={updateLoading}
          className={`px-6 py-2 rounded-xl font-semibold transition-all shadow-sm flex items-center gap-2
            ${isEditing ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}
          `}
        >
          {updateLoading ? 'Saving...' : isEditing ? <><Save size={18} /> Save Changes</> : 'Edit Profile'}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        {activeTab === 'personal' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input 
                    disabled={!isEditing} 
                    className={`input-field pl-10 ${!isEditing && 'bg-slate-50 text-slate-500 border-transparent'}`}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input 
                    disabled={true} 
                    className="input-field pl-10 bg-slate-50 text-slate-500 cursor-not-allowed"
                    value={formData.email}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input 
                    disabled={!isEditing} 
                    className={`input-field pl-10 ${!isEditing && 'bg-slate-50 text-slate-500 border-transparent'}`}
                    value={formData.mobile}
                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'canteen' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4">Canteen Details</h3>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Canteen Name</label>
              <div className="relative">
                <Building className="absolute left-3 top-3 text-slate-400" size={18} />
                <input 
                  disabled={!isEditing} 
                  className={`input-field pl-10 ${!isEditing && 'bg-slate-50 text-slate-500 border-transparent'}`}
                  value={formData.canteenName}
                  onChange={(e) => setFormData({...formData, canteenName: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">State</label>
                <input disabled value="Maharashtra" className="input-field bg-slate-50 text-slate-500 cursor-not-allowed" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">District</label>
                <input disabled value="Pune" className="input-field bg-slate-50 text-slate-500 cursor-not-allowed" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Institute/College</label>
              <input disabled value="Pune Institute of Computer Technology" className="input-field bg-slate-50 text-slate-500 cursor-not-allowed" />
            </div>
          </div>
        )}

        {activeTab === 'bank' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4">Bank & Payment</h3>
            <div className="p-4 bg-blue-50 text-blue-800 rounded-lg text-sm mb-4">
              Sensitive details are hidden. Contact support to change critical bank info.
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">UPI ID</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 text-slate-400" size={18} />
                <input 
                  disabled={!isEditing} 
                  className={`input-field pl-10 ${!isEditing && 'bg-slate-50 text-slate-500 border-transparent'}`}
                  value={formData.upi}
                  onChange={(e) => setFormData({...formData, upi: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Account Number</label>
              <input disabled value={formData.accountNumber} className="input-field bg-slate-50 text-slate-500 cursor-not-allowed" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">IFSC Code</label>
              <input disabled value={user.bank?.ifsc || 'HDFC0001234'} className="input-field bg-slate-50 text-slate-500 cursor-not-allowed" />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// --- Main Container Component ---
const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Selectors
  const { user } = useSelector(state => state.auth);
  const { canteen } = useSelector(state => state.canteen);
  const { isEditing, activeTab, updateLoading } = useSelector(state => state.profile);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      dispatch(updateStoreImage(imageUrl));
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutUser()).unwrap();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to permanently delete your account? This action cannot be undone.')) {
      await dispatch(deleteAccount()).unwrap();
      navigate('/login');
    }
  };

  if (!user) return <div className="p-8"><Skeleton className="h-96 w-full" /></div>;

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Header */}
      <div className="bg-white px-4 h-16 flex items-center shadow-sm sticky top-0 z-30">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-slate-800 pr-8">
          Profile
        </h1>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-6 pb-24">
        
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-primary/80 to-blue-600"></div>
          <div className="px-6 pb-6 relative">
            <div className="flex justify-between items-end -mt-12 mb-4">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-md flex items-center justify-center">
                  {user.image ? (
                    <img src={user.image} alt="Store" className="w-full h-full object-cover" />
                  ) : (
                    <User size={40} className="text-slate-300" />
                  )}
                </div>
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-slate-200 text-slate-600 hover:text-primary transition-colors"
                >
                  <Camera size={16} />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-800">{user.name}</h1>
              <p className="text-slate-500">{canteen.canteenName} • Owner</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Navigation Tabs */}
          <div className="space-y-2">
            {['personal', 'canteen', 'bank'].map(tab => (
              <button
                key={tab}
                onClick={() => dispatch(setActiveTab(tab))}
                className={`w-full text-left px-4 py-3 rounded-xl font-medium flex items-center gap-3 transition-all
                  ${activeTab === tab 
                    ? 'bg-primary text-white shadow-md' 
                    : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-100'}
                `}
              >
                {tab === 'personal' && <User size={18} />}
                {tab === 'canteen' && <Building size={18} />}
                {tab === 'bank' && <CreditCard size={18} />}
                <span className="capitalize">{tab} Details</span>
              </button>
            ))}
            
            <div className="pt-6 border-t border-slate-200 mt-6 space-y-2">
              <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-xl font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 flex items-center gap-3 transition-colors">
                <LogOut size={18} /> Log Out
              </button>
              <button onClick={handleDeleteAccount} className="w-full text-left px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-50 hover:text-red-700 flex items-center gap-3 transition-colors">
                <Trash2 size={18} /> Delete Account
              </button>
            </div>
          </div>

          {/* Form Content Wrapper */}
          <div className="md:col-span-2">
            {/* The KEY prop forces a fresh instance when user data changes */}
            <ProfileForm 
              key={user.id + user.name + activeTab} 
              user={user} 
              canteen={canteen} 
              isEditing={isEditing} 
              activeTab={activeTab}
              updateLoading={updateLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;