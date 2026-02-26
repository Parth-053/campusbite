import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFullProfile, updateProfileData, toggleEdit, resetProfileStatus, deleteAccount } from '../../store/profileSlice';
import { logoutOwner } from '../../store/authSlice'; 

import Skeleton from '../../components/common/Skeleton';
import { User, Store, IndianRupee, Image as ImageIcon, Camera, Loader2, Save, X, LogOut, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchFullProfile());
  }, [dispatch]);

  const { profileData, isEditing, activeTab, isLoading } = useSelector(state => state.profile);
  
  const fileInputRef = useRef(null);
  
  // Initial Form Setup
  const [formData, setFormData] = useState(() => ({
    name: profileData?.name || '',
    phone: profileData?.phone || '',
    email: profileData?.email || '',
    upiId: profileData?.upiId || '',
    canteenName: profileData?.canteen?.name || '',
    openingTime: profileData?.canteen?.openingTime || '',
    closingTime: profileData?.canteen?.closingTime || '',
    image: null
  }));
  
  const [preview, setPreview] = useState(() => profileData?.canteen?.image || null);

  // Sync state cleanly when backend fetch finishes
  const [prevProfile, setPrevProfile] = useState(profileData);
  if (profileData !== prevProfile) {
    setPrevProfile(profileData);
    setFormData({
      name: profileData?.name || '',
      phone: profileData?.phone || '',
      email: profileData?.email || '',
      upiId: profileData?.upiId || '',
      canteenName: profileData?.canteen?.name || '',
      openingTime: profileData?.canteen?.openingTime || '',
      closingTime: profileData?.canteen?.closingTime || '',
      image: null
    });
    setPreview(profileData?.canteen?.image || null);
  }

  const handleSave = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('phone', formData.phone);
    data.append('upiId', formData.upiId);
    data.append('canteenName', formData.canteenName);
    data.append('openingTime', formData.openingTime);
    data.append('closingTime', formData.closingTime);
    if (formData.image) data.append('image', formData.image);

    try {
      await dispatch(updateProfileData(data)).unwrap();
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    // Reset inputs gracefully
    if (profileData) {
      setFormData({
        name: profileData.name || '',
        phone: profileData.phone || '',
        email: profileData.email || '',
        upiId: profileData.upiId || '',
        canteenName: profileData.canteen?.name || '',
        openingTime: profileData.canteen?.openingTime || '',
        closingTime: profileData.canteen?.closingTime || '',
        image: null
      });
      setPreview(profileData.canteen?.image || null);
    }
    dispatch(toggleEdit());
    dispatch(resetProfileStatus());
  };

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      try {
        await dispatch(logoutOwner()).unwrap();
        window.location.href = '/login';
      } catch {
        toast.error("Failed to log out");
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("CRITICAL WARNING: Are you absolutely sure you want to permanently delete your account and store? This action cannot be undone.")) {
      try {
        await dispatch(deleteAccount()).unwrap();
        window.location.href = '/login';
      } catch (error) {
        toast.error(error || "Failed to delete account");
      }
    }
  };

  // Graceful loading state
  if (isLoading && !profileData) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="w-full h-48 rounded-3xl" />
        <Skeleton className="w-full h-12 rounded-xl" />
        <Skeleton className="w-full h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20 md:pb-0 max-w-4xl mx-auto">
      
      {/* 1. Header Hero */}
      <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-borderCol shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center gap-6 md:gap-10">
        <div className="relative shrink-0">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-background border-4 border-surface shadow-lg overflow-hidden flex items-center justify-center">
            {preview ? (
              <img src={preview} alt="Store" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon size={40} className="text-textLight opacity-30" />
            )}
          </div>
          {isEditing && (
            <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute -bottom-2 -right-2 p-3 bg-primary text-white rounded-xl shadow-md hover:bg-primary-dark transition-all">
              <Camera size={18} />
            </button>
          )}
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
              const file = e.target.files[0];
              if(file) { setFormData({...formData, image: file}); setPreview(URL.createObjectURL(file)); }
          }}/>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-black text-textDark tracking-tight mb-1">{formData.canteenName || 'Your Store Name'}</h1>
          <p className="text-sm font-bold text-textLight">{formData.name} • {formData.email}</p>
          
          <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
            {!isEditing ? (
               <button onClick={() => dispatch(toggleEdit())} className="px-6 py-2.5 bg-background border border-borderCol rounded-xl text-sm font-bold text-textDark hover:bg-primary/5 hover:text-primary transition-colors shadow-sm">
                 Edit Profile Details
               </button>
            ) : (
              <>
                <button onClick={handleCancel} className="px-6 py-2.5 bg-background border border-borderCol rounded-xl text-sm font-bold text-textLight hover:text-error transition-colors flex gap-2 items-center">
                 <X size={16}/> Cancel
                </button>
                <button onClick={handleSave} disabled={isLoading} className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark shadow-md transition-colors flex gap-2 items-center disabled:opacity-70">
                 {isLoading ? <Loader2 size={16} className="animate-spin"/> : <Save size={16}/>} Save Changes
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. Tabs Row */}
      <div className="flex bg-surface border border-borderCol rounded-xl p-1 w-full shadow-sm overflow-x-auto custom-scrollbar">
        {['personal', 'canteen', 'payment'].map(tab => (
          <button 
            key={tab} 
            onClick={() => dispatch({ type: 'profile/setActiveTab', payload: tab })} 
            className={`flex-1 min-w-[120px] py-3 text-sm font-bold rounded-lg transition-all capitalize flex items-center justify-center gap-2
              ${activeTab === tab ? 'bg-background text-primary shadow-sm border border-borderCol' : 'text-textLight hover:text-textDark'}`}
          >
            {tab === 'personal' && <User size={16}/>}
            {tab === 'canteen' && <Store size={16}/>}
            {tab === 'payment' && <IndianRupee size={16}/>}
            {tab} Info
          </button>
        ))}
      </div>

      {/* 3. Forms Container */}
      <div className="bg-surface rounded-2xl border border-borderCol shadow-sm p-6 sm:p-8">
        <form className="space-y-6">
          
          {/* PERSONAL TAB */}
          {activeTab === 'personal' && (
            <div className="animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-xs font-bold text-textLight uppercase tracking-wider mb-2">Full Name</label>
                  <input type="text" disabled={!isEditing} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-background border border-borderCol rounded-xl focus:ring-2 focus:ring-primary outline-none font-bold text-textDark disabled:opacity-60" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-textLight uppercase tracking-wider mb-2">Phone Number</label>
                  <input type="tel" disabled={!isEditing} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-background border border-borderCol rounded-xl focus:ring-2 focus:ring-primary outline-none font-bold text-textDark disabled:opacity-60" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-textLight uppercase tracking-wider mb-2">Registered Email (Read Only)</label>
                  <input type="email" disabled value={formData.email} className="w-full px-4 py-3 bg-background border border-borderCol rounded-xl outline-none font-bold text-textLight opacity-60 cursor-not-allowed" />
                </div>
              </div>

              {/* DANGER ZONE */}
              <div className="pt-8 border-t border-borderCol mt-4">
                <h3 className="text-sm font-black text-error uppercase tracking-widest mb-4">Danger Zone</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button type="button" onClick={handleLogout} className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-background border border-borderCol rounded-xl text-sm font-bold text-textDark hover:bg-surface hover:border-textLight transition-all">
                    <LogOut size={18} /> Secure Logout
                  </button>
                  <button type="button" onClick={handleDeleteAccount} className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-error/10 text-error rounded-xl text-sm font-bold hover:bg-error hover:text-white transition-all">
                    <Trash2 size={18} /> Delete My Account
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CANTEEN TAB */}
          {activeTab === 'canteen' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-textLight uppercase tracking-wider mb-2">Store / Canteen Name</label>
                <input type="text" disabled={!isEditing} value={formData.canteenName} onChange={e => setFormData({...formData, canteenName: e.target.value})} className="w-full px-4 py-3 bg-background border border-borderCol rounded-xl focus:ring-2 focus:ring-primary outline-none font-bold text-textDark disabled:opacity-60" />
              </div>
              <div>
                <label className="block text-xs font-bold text-textLight uppercase tracking-wider mb-2">Opening Time</label>
                <input type="time" disabled={!isEditing} value={formData.openingTime} onChange={e => setFormData({...formData, openingTime: e.target.value})} className="w-full px-4 py-3 bg-background border border-borderCol rounded-xl focus:ring-2 focus:ring-primary outline-none font-bold text-textDark disabled:opacity-60" />
              </div>
              <div>
                <label className="block text-xs font-bold text-textLight uppercase tracking-wider mb-2">Closing Time</label>
                <input type="time" disabled={!isEditing} value={formData.closingTime} onChange={e => setFormData({...formData, closingTime: e.target.value})} className="w-full px-4 py-3 bg-background border border-borderCol rounded-xl focus:ring-2 focus:ring-primary outline-none font-bold text-textDark disabled:opacity-60" />
              </div>
            </div>
          )}

          {/* PAYMENT TAB */}
          {activeTab === 'payment' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex gap-3">
                <IndianRupee className="text-primary shrink-0" size={20}/>
                <p className="text-xs sm:text-sm font-medium text-textDark">This UPI ID will be used by the Admin to transfer your wallet payouts. Please ensure it is accurate.</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-textLight uppercase tracking-wider mb-2">UPI ID</label>
                <input type="text" placeholder="e.g. 9876543210@ybl" disabled={!isEditing} value={formData.upiId} onChange={e => setFormData({...formData, upiId: e.target.value})} className="w-full px-4 py-3 bg-background border border-borderCol rounded-xl focus:ring-2 focus:ring-primary outline-none font-bold text-textDark disabled:opacity-60" />
              </div>
            </div>
          )}

        </form>
      </div>
    </div>
  );
};

export default Profile;