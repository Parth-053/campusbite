import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Camera, Save, LogOut, ShieldAlert,
  User, CreditCard, Building, MapPin, CheckSquare, Loader2
} from 'lucide-react';
import { updateProfileData, deleteAccount, logoutUser } from '../../store/profileSlice';
import { 
  fetchStates, fetchDistricts, fetchColleges, fetchHostels, 
  clearDistricts, clearColleges, clearHostels 
} from '../../store/locationSlice';

// Helper: Securely grab ID
const extractId = (item) => {
  if (!item) return '';
  if (typeof item === 'object') return item._id || item.id || '';
  return String(item);
};

// Helper: Securely grab Name
const extractName = (item) => {
  if (!item) return '';
  if (typeof item === 'object') return item.name || item.state || item.district || '';
  return ''; 
};

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const bannerInputRef = useRef(null);

  const { ownerData } = useSelector(state => state.auth);
  const locationData = useSelector(state => state.location);
  const { updateLoading } = useSelector(state => state.profile);

  // 🚀 FIXED: Explicitly map out the nested relationship
  const initialCollege = ownerData?.canteen?.college || {};
  const initialDistrict = initialCollege?.district || {};
  const initialStateObj = initialDistrict?.state || {};

  const initStateId = extractId(initialStateObj);
  const initDistId = extractId(initialDistrict);
  const initCollId = extractId(initialCollege);
  const initHostelId = extractId(ownerData?.canteen?.hostel);

  const [formData, setFormData] = useState(() => ({
    name: ownerData?.name || '',
    mobile: ownerData?.phone || '',
    upi: ownerData?.upiId || '',
    canteenName: ownerData?.canteen?.name || '',
    openingTime: ownerData?.canteen?.openingTime || '',
    closingTime: ownerData?.canteen?.closingTime || '',
    state: initStateId, 
    district: initDistId, 
    collegeId: initCollId, 
    hostelId: initHostelId,
    allowedHostels: ownerData?.canteen?.allowedHostels?.map(h => extractId(h)) || [] 
  }));

  const [selectedImage, setSelectedImage] = useState(null); 
  const [imagePreview, setImagePreview] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [prevOwner, setPrevOwner] = useState(ownerData);

  // Fetch location lists
  useEffect(() => {
    dispatch(fetchStates());
    if (initStateId) dispatch(fetchDistricts(initStateId));
    if (initDistId) dispatch(fetchColleges(initDistId));
    if (initCollId) dispatch(fetchHostels(initCollId));
  }, [dispatch, initStateId, initDistId, initCollId]);

  // Sync state if DB sends new data
  if (ownerData && ownerData !== prevOwner) {
    setPrevOwner(ownerData);

    const newColl = ownerData.canteen?.college || {};
    const newDist = newColl.district || {};
    const newStateObj = newDist.state || {};

    setFormData({
      name: ownerData?.name || '', mobile: ownerData?.phone || '', upi: ownerData?.upiId || '',
      canteenName: ownerData?.canteen?.name || '', openingTime: ownerData?.canteen?.openingTime || '', closingTime: ownerData?.canteen?.closingTime || '',
      state: extractId(newStateObj), district: extractId(newDist), collegeId: extractId(newColl),
      hostelId: extractId(ownerData.canteen?.hostel), allowedHostels: ownerData.canteen?.allowedHostels?.map(h => extractId(h)) || []
    });
    setSelectedImage(null); setImagePreview(null); setIsDirty(false); 
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleStateChange = (e) => {
    const val = e.target.value;
    setFormData(prev => ({ ...prev, state: val, district: '', collegeId: '', hostelId: '', allowedHostels: [] }));
    dispatch(clearDistricts()); dispatch(clearColleges()); dispatch(clearHostels());
    if (val) dispatch(fetchDistricts(val));
    setIsDirty(true);
  };

  const handleDistrictChange = (e) => {
    const val = e.target.value;
    setFormData(prev => ({ ...prev, district: val, collegeId: '', hostelId: '', allowedHostels: [] }));
    dispatch(clearColleges()); dispatch(clearHostels());
    if (val) dispatch(fetchColleges(val));
    setIsDirty(true);
  };

  const handleCollegeChange = (e) => {
    const val = e.target.value;
    setFormData(prev => ({ ...prev, collegeId: val, hostelId: '', allowedHostels: [] }));
    dispatch(clearHostels());
    if (val) dispatch(fetchHostels(val));
    setIsDirty(true);
  };

  const handleHostelToggle = (hostelId) => {
    setFormData(prev => {
      const isSelected = prev.allowedHostels.includes(hostelId);
      return { ...prev, allowedHostels: isSelected ? prev.allowedHostels.filter(id => id !== hostelId) : [...prev.allowedHostels, hostelId] };
    });
    setIsDirty(true);
  };

  const handleBannerSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file); setImagePreview(URL.createObjectURL(file)); setIsDirty(true);
    }
  };

  const handleSave = () => {
    const data = new FormData();
    data.append('name', formData.name); data.append('phone', formData.mobile); data.append('upiId', formData.upi);
    data.append('canteenName', formData.canteenName); data.append('openingTime', formData.openingTime); data.append('closingTime', formData.closingTime);
    data.append('collegeId', formData.collegeId); data.append('hostelId', formData.hostelId);
    data.append('allowedHostels', JSON.stringify(formData.allowedHostels));
    if (selectedImage) data.append('image', selectedImage);
    dispatch(updateProfileData(data));
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("🛑 WARNING: Are you sure you want to delete your account? \n\nThis action cannot be undone.")) {
      await dispatch(deleteAccount()).unwrap(); navigate('/login');
    }
  };

  if (!ownerData) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-primary w-8 h-8"/></div>;

  const canteen = ownerData.canteen || {};
  const userInitial = ownerData.name ? ownerData.name.charAt(0).toUpperCase() : 'O';
  const displayImage = imagePreview || canteen.image; 

  const isStateInList = locationData.states?.some(s => extractId(s) === formData.state);
  const isDistrictInList = locationData.districts?.some(d => extractId(d) === formData.district);
  const isCollegeInList = locationData.colleges?.some(col => extractId(col) === formData.collegeId);
  const isHostelInList = locationData.hostels?.some(h => extractId(h) === formData.hostelId);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white px-4 h-16 flex items-center shadow-sm sticky top-0 z-30">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"><ArrowLeft size={22} /></button>
        <h1 className="flex-1 text-center text-lg font-bold text-slate-800 pr-8">Profile Settings</h1>
      </div>

      <div className="max-w-5xl mx-auto p-4 md:p-6">
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative mb-6">
          <div onClick={() => bannerInputRef.current.click()} className="h-40 relative cursor-pointer group bg-slate-200 flex items-center justify-center overflow-hidden">
            {displayImage ? (
              <img src={displayImage} alt="Canteen Banner" className="w-full h-full object-cover group-hover:blur-sm transition-all" />
            ) : (<div className="w-full h-full bg-gradient-to-r from-blue-500 to-indigo-600"></div>)}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
              <Camera size={32} className="mb-2" />
              <span className="font-semibold text-sm">Click to change banner</span>
            </div>
            <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={handleBannerSelect} />
          </div>

          <div className="px-6 pb-6 relative">
            <div className="flex justify-between items-end mb-4">
              <div className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-md flex items-center justify-center -mt-12 relative z-10 overflow-hidden">
                 <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 text-4xl font-black">{userInitial}</div>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{ownerData.name}</h1>
              <p className="text-slate-500 font-medium">{canteen.name || 'Canteen'} <span className="mx-1">•</span> <span className={`text-xs px-2 py-0.5 rounded-full ${ownerData.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{ownerData.status || 'Pending'}</span></p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-sm font-bold text-slate-400 uppercase mb-4 flex items-center gap-2"><User size={16}/> Identity</h3>
              <div className="space-y-4">
                <div><label className="text-xs font-semibold text-slate-500 mb-1 block">Full Name</label><input className="input-field bg-slate-50 focus:bg-white" value={formData.name} onChange={e => handleChange('name', e.target.value)} /></div>
                <div><label className="text-xs font-semibold text-slate-500 mb-1 block">Email Address (Read-Only)</label><input className="input-field bg-slate-100 text-slate-500 cursor-not-allowed" value={ownerData.email} disabled /></div>
                <div><label className="text-xs font-semibold text-slate-500 mb-1 block">Phone Number</label><input className="input-field bg-slate-50 focus:bg-white" value={formData.mobile} onChange={e => handleChange('mobile', e.target.value)} /></div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-sm font-bold text-slate-400 uppercase mb-4 flex items-center gap-2"><CreditCard size={16}/> Payment & Bank</h3>
              <div><label className="text-xs font-semibold text-slate-500 mb-1 block">Registered UPI ID</label><input className="input-field bg-slate-50 focus:bg-white font-medium text-slate-700" value={formData.upi} onChange={e => handleChange('upi', e.target.value)} placeholder="e.g. name@upi" /></div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-sm font-bold text-slate-400 uppercase mb-4 flex items-center gap-2"><Building size={16}/> Canteen & Location Details</h3>
              <div className="space-y-4">
                
                <div><label className="text-xs font-semibold text-slate-500 mb-1 block">Canteen Name</label><input className="input-field bg-slate-50 focus:bg-white" value={formData.canteenName} onChange={e => handleChange('canteenName', e.target.value)} /></div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs font-semibold text-slate-500 mb-1 block">Opening Time</label><input type="time" className="input-field bg-slate-50 focus:bg-white" value={formData.openingTime} onChange={e => handleChange('openingTime', e.target.value)} /></div>
                  <div><label className="text-xs font-semibold text-slate-500 mb-1 block">Closing Time</label><input type="time" className="input-field bg-slate-50 focus:bg-white" value={formData.closingTime} onChange={e => handleChange('closingTime', e.target.value)} /></div>
                </div>

                <div className="border-t border-slate-100 pt-4 mt-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-3"><MapPin size={12} className="inline mr-1 -mt-0.5"/> Address & Geography</h4>
                  <div className="grid grid-cols-1 gap-4 mb-4">
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-500 mb-1 block">State</label>
                        <select className="input-field bg-slate-50 focus:bg-white" value={formData.state} onChange={handleStateChange}>
                          <option value="">Select State</option>
                          {formData.state && !isStateInList && (
                            <option value={formData.state}>{extractName(initialStateObj) || 'Loading...'}</option>
                          )}
                          {locationData.states?.map((s, i) => (
                            <option key={i} value={extractId(s)}>{extractName(s) || extractId(s)}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500 mb-1 block">District</label>
                        <select className="input-field bg-slate-50 focus:bg-white" value={formData.district} onChange={handleDistrictChange} disabled={!formData.state}>
                          <option value="">Select District</option>
                          {formData.district && !isDistrictInList && (
                            <option value={formData.district}>{extractName(initialDistrict) || 'Loading...'}</option>
                          )}
                          {locationData.districts?.map((d, i) => (
                            <option key={i} value={extractId(d)}>{extractName(d) || extractId(d)}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">Base College</label>
                      <select className="input-field bg-slate-50 focus:bg-white" value={formData.collegeId} onChange={handleCollegeChange} disabled={!formData.district}>
                        <option value="">Select College</option>
                        {formData.collegeId && !isCollegeInList && (
                          <option value={formData.collegeId}>{extractName(initialCollege) || 'Loading...'}</option>
                        )}
                        {locationData.colleges?.map((col, i) => (
                          <option key={i} value={extractId(col)}>{extractName(col) || extractId(col)}</option>
                        ))}
                      </select>
                    </div>

                    {canteen.canteenType === 'hostel' && (
                      <div>
                        <label className="text-xs font-semibold text-purple-600 mb-1 block">Physical Base Hostel Location</label>
                        <select className="input-field border-purple-200 bg-purple-50 focus:bg-white" value={formData.hostelId} onChange={e => handleChange('hostelId', e.target.value)} disabled={!formData.collegeId}>
                          <option value="">Select Base Hostel</option>
                          {formData.hostelId && !isHostelInList && (
                            <option value={formData.hostelId}>{extractName(canteen?.hostel) || 'Loading...'}</option>
                          )}
                          {locationData.hostels?.map((h, i) => (
                            <option key={i} value={extractId(h)}>{extractName(h) || extractId(h)}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mt-4">
                  <label className="text-xs font-bold text-slate-600 mb-3 block flex items-center gap-1"><CheckSquare size={14}/> Delivers Orders To</label>
                  <div className="flex flex-wrap gap-2">
                    {locationData.hostels?.map(h => {
                      const val = extractId(h);
                      const isSelected = formData.allowedHostels.includes(val);
                      return (
                        <button key={val} type="button" onClick={() => handleHostelToggle(val)} className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${isSelected ? 'bg-blue-100 text-blue-700 border-blue-200 shadow-sm' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'}`}>
                          {extractName(h) || val}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {isDirty && (
          <div className="flex justify-end mt-8 mb-4">
            <button onClick={handleSave} disabled={updateLoading} className="bg-blue-600 text-white px-10 py-3.5 rounded-xl font-bold shadow-lg hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-2">
              {updateLoading ? <><Loader2 className="animate-spin" size={18}/> Saving...</> : <><Save size={20} /> Save Changes</>}
            </button>
          </div>
        )}

        <div className={`pt-6 border-t border-slate-200 ${!isDirty ? 'mt-8' : ''}`}>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div><h4 className="font-bold text-slate-800">Account Security</h4><p className="text-sm text-slate-500 mt-1">Manage your session or permanently delete your account.</p></div>
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
              <button onClick={() => { dispatch(logoutUser()); navigate('/login'); }} className="px-6 py-2.5 rounded-xl font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center justify-center gap-2 transition-colors"><LogOut size={18} /> Log Out</button>
              <button onClick={handleDeleteAccount} className="px-6 py-2.5 rounded-xl font-semibold text-red-600 bg-red-50 hover:bg-red-100 flex items-center justify-center gap-2 transition-all"><ShieldAlert size={18} /> Delete Account</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;