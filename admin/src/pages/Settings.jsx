import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Settings as SettingsIcon, Save, LogOut, Percent, IndianRupee } from 'lucide-react';
import { fetchSettings, updateSettings } from '../store/settingsSlice';
import { logout } from '../store/authSlice';
import Skeleton from '../components/common/Skeleton';

// --- Sub-component: Manages form state cleanly without useEffect ---
const SettingsForm = ({ commissions, isUpdating }) => {
  const dispatch = useDispatch();
  
  // State is initialized directly from props
  const [ownerComm, setOwnerComm] = useState(commissions.owner);
  const [userComm, setUserComm] = useState(commissions.user);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    dispatch(updateSettings({
      owner: { ...ownerComm, value: Number(ownerComm.value) },
      user: { ...userComm, value: Number(userComm.value) }
    })).then(() => {
      setSuccessMsg('Commission settings updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000); // Hide message after 3 seconds
    });
  };

  return (
    <>
      {/* Success Alert */}
      {successMsg && (
        <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-200 text-sm font-bold flex items-center justify-between animate-in slide-in-from-top-2">
          {successMsg}
        </div>
      )}

      {/* --- REVENUE CONFIGURATION FORM --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">Revenue & Commission Rules</h2>
          <p className="text-xs text-gray-500 mt-1">Set how the platform makes money from canteens and students.</p>
        </div>
        
        <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-8">
          
          {/* Owner Commission Block */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <label className="text-sm font-bold text-gray-800">Canteen Owner Commission</label>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 w-fit">
                Deducted from owner payouts
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Type Selector */}
              <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden sm:w-1/3 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
                <select 
                  value={ownerComm.type}
                  onChange={(e) => setOwnerComm({ ...ownerComm, type: e.target.value })}
                  className="w-full p-2.5 text-sm bg-gray-50 border-r border-gray-300 outline-none text-gray-700 font-bold cursor-pointer"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed (₹)</option>
                </select>
                <div className="px-3 text-gray-400 bg-gray-50 h-full flex items-center">
                  {ownerComm.type === 'percentage' ? <Percent size={16} /> : <IndianRupee size={16} />}
                </div>
              </div>
              
              {/* Value Input */}
              <input 
                type="number"
                min="0"
                step="0.01"
                value={ownerComm.value}
                onChange={(e) => setOwnerComm({ ...ownerComm, value: e.target.value })}
                className="flex-1 p-2.5 border border-gray-300 rounded-lg text-sm font-bold text-gray-900 focus:ring-2 focus:ring-primary outline-none"
                placeholder="Enter value"
                required
              />
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* User Commission Block */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <label className="text-sm font-bold text-gray-800">Student Convenience Fee</label>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100 w-fit">
                Added to cart total at checkout
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Type Selector */}
              <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden sm:w-1/3 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
                <select 
                  value={userComm.type}
                  onChange={(e) => setUserComm({ ...userComm, type: e.target.value })}
                  className="w-full p-2.5 text-sm bg-gray-50 border-r border-gray-300 outline-none text-gray-700 font-bold cursor-pointer"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed (₹)</option>
                </select>
                <div className="px-3 text-gray-400 bg-gray-50 h-full flex items-center">
                  {userComm.type === 'percentage' ? <Percent size={16} /> : <IndianRupee size={16} />}
                </div>
              </div>
              
              {/* Value Input */}
              <input 
                type="number"
                min="0"
                step="0.01"
                value={userComm.value}
                onChange={(e) => setUserComm({ ...userComm, value: e.target.value })}
                className="flex-1 p-2.5 border border-gray-300 rounded-lg text-sm font-bold text-gray-900 focus:ring-2 focus:ring-primary outline-none"
                placeholder="Enter value"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex justify-end border-t border-gray-100">
            <button 
              type="submit" 
              disabled={isUpdating}
              className="flex items-center gap-2 bg-primary text-white px-8 py-2.5 rounded-lg font-bold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-70 shadow-sm w-full sm:w-auto justify-center"
            >
              {isUpdating ? 'Saving Changes...' : <><Save size={18} /> Save Settings</>}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

// --- Main Page Component ---
const Settings = () => {
  const dispatch = useDispatch();
  const { commissions, isLoading, isUpdating } = useSelector((state) => state.settings);

  // Fetch settings on mount
  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  if (isLoading || !commissions) {
    return (
      <div className="max-w-3xl space-y-6 p-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-3xl pb-10">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
          <SettingsIcon className="text-gray-600" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Platform Settings</h1>
          <p className="text-sm text-gray-500">Configure global platform rules and fees.</p>
        </div>
      </div>

      {/* Render the extracted Form Component */}
      <SettingsForm commissions={commissions} isUpdating={isUpdating} />

      {/* --- DANGER ZONE --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-red-50 bg-red-50/50">
          <h2 className="text-lg font-bold text-red-700">Danger Zone</h2>
        </div>
        <div className="p-5 sm:p-6">
          <p className="text-sm text-gray-600 mb-4">Securely sign out of your active admin session.</p>
          <button 
            onClick={() => dispatch(logout())}
            className="flex items-center justify-center gap-2 bg-white text-red-600 border border-red-200 px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-red-50 transition-colors w-full sm:w-auto"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </div>

    </div>
  );
};

export default Settings;