import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UploadCloud, Clock, CheckSquare } from 'lucide-react'; 
import { fetchStates, fetchDistricts, fetchColleges, fetchHostels, clearDistricts, clearColleges, clearHostels } from '../../store/locationSlice';

const RegisterStep2 = ({ data, updateData, onNext, onBack }) => {
  const dispatch = useDispatch();
  const { states = [], districts = [], colleges = [], hostels = [] } = useSelector(state => state.location || {});

  useEffect(() => { dispatch(fetchStates()); }, [dispatch]);
  
  useEffect(() => { 
    if (data.state) dispatch(fetchDistricts(data.state)); 
    else dispatch(clearDistricts()); 
  }, [data.state, dispatch]);
  
  useEffect(() => { 
    if (data.district) dispatch(fetchColleges(data.district)); 
    else dispatch(clearColleges()); 
  }, [data.district, dispatch]);
   
  useEffect(() => { 
    if (data.college) { 
      dispatch(fetchHostels(data.college)); 
    } else { 
      dispatch(clearHostels()); 
      updateData('canteen', 'allowedHostels', []); 
    } 
  }, [data.college, dispatch, updateData]);

  const handleSubmit = (e) => { e.preventDefault(); onNext(); };

  const handleHostelToggle = (hostelId) => {
    const currentList = data.allowedHostels || [];
    const newList = currentList.includes(hostelId) 
      ? currentList.filter(id => id !== hostelId) 
      : [...currentList, hostelId];
    updateData('canteen', 'allowedHostels', newList);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4">Step 2: Canteen & Location</h3>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Canteen Name</label>
        <input type="text" required className="input-field" placeholder="e.g. Tech Bites" value={data.canteenName} onChange={e => updateData('canteen', 'canteenName', e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1"><Clock size={14}/> Open Time</label>
          <input type="time" required className="input-field bg-white" value={data.openingTime} onChange={e => updateData('canteen', 'openingTime', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1"><Clock size={14}/> Close Time</label>
          <input type="time" required className="input-field bg-white" value={data.closingTime} onChange={e => updateData('canteen', 'closingTime', e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
          <select required className="input-field bg-white" value={data.state} onChange={e => { updateData('canteen', 'state', e.target.value); updateData('canteen', 'district', ''); updateData('canteen', 'college', ''); updateData('canteen', 'hostelId', ''); updateData('canteen', 'allowedHostels', []); }}>
            <option value="">Select State</option>
            {states?.map(st => <option key={st._id} value={st._id}>{st.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">District</label>
          <select required className="input-field bg-white disabled:bg-slate-50" value={data.district} onChange={e => { updateData('canteen', 'district', e.target.value); updateData('canteen', 'college', ''); updateData('canteen', 'hostelId', ''); updateData('canteen', 'allowedHostels', []); }} disabled={!data.state}>
            <option value="">Select District</option>
            {districts?.map(dt => <option key={dt._id} value={dt._id}>{dt.name}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">College/Institute</label>
        <select required className="input-field bg-white disabled:bg-slate-50" value={data.college} onChange={e => { updateData('canteen', 'college', e.target.value); updateData('canteen', 'hostelId', ''); updateData('canteen', 'allowedHostels', []); }} disabled={!data.district}>
          <option value="">Select College</option>
          {colleges?.map(col => <option key={col._id} value={col._id}>{col.name}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Canteen Type</label>
        <div className="flex gap-4">
          <label className={`flex-1 border p-3 rounded-lg cursor-pointer transition-colors ${data.type === 'central' ? 'border-primary bg-blue-50' : 'border-slate-200'}`}>
            <input type="radio" name="ctype" value="central" checked={data.type === 'central'} onChange={e => { updateData('canteen', 'type', e.target.value); updateData('canteen', 'hostelId', ''); }} className="mr-2 accent-primary"/>
            <span className="font-medium text-sm">Central</span>
          </label>
          <label className={`flex-1 border p-3 rounded-lg cursor-pointer transition-colors ${data.type === 'hostel' ? 'border-primary bg-blue-50' : 'border-slate-200'}`}>
            <input type="radio" name="ctype" value="hostel" checked={data.type === 'hostel'} onChange={e => updateData('canteen', 'type', e.target.value)} className="mr-2 accent-primary"/>
            <span className="font-medium text-sm">Hostel</span>
          </label>
        </div>
      </div>

      {data.type === 'hostel' && (
        <div className="animate-in fade-in slide-in-from-top-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Select Base Hostel (Physical Location)</label>
          <select required className="input-field bg-white disabled:bg-slate-50" value={data.hostelId} onChange={e => updateData('canteen', 'hostelId', e.target.value)} disabled={!data.college}>
            <option value="">Select Base Hostel</option>
            {hostels?.map(hst => <option key={hst._id} value={hst._id}>{hst.name}</option>)}
          </select>
        </div>
      )}

      {data.college && hostels?.length > 0 && (
        <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
          <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-1">
            <CheckSquare size={16} className="text-primary"/> Deliverable Hostels
          </label>
          <p className="text-xs text-slate-500 mb-3">Select the hostels where your canteen will deliver orders.</p>
          <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
            {hostels.map(hst => (
              <label key={hst._id} className="flex items-center gap-2 text-sm cursor-pointer p-1.5 hover:bg-white rounded border border-transparent hover:border-slate-200 transition-colors">
                <input 
                  type="checkbox" 
                  checked={data.allowedHostels?.includes(hst._id) || false}
                  onChange={() => handleHostelToggle(hst._id)}
                  className="accent-primary w-4 h-4 rounded"
                />
                <span className="text-slate-700 truncate">{hst.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 bg-slate-50 hover:bg-slate-100 transition-colors relative">
        <label className="block text-sm font-medium text-slate-700 mb-2">Canteen Thumbnail (Optional)</label>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-10 cursor-pointer">
            <div className="flex flex-col items-center justify-center">
              <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
              <p className="text-xs text-slate-500"><span className="font-semibold text-primary">Click to upload</span> image</p>
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => updateData('canteen', 'image', e.target.files[0])} />
          </label>
        </div>
        {data.image && <p className="text-xs font-bold text-green-600 mt-2 text-center">Selected: {data.image.name}</p>}
      </div>

      <div className="flex gap-4 pt-4">
        <button type="button" onClick={onBack} className="btn-secondary w-full border border-slate-300 rounded-lg p-3 font-semibold text-slate-700 hover:bg-slate-50">Back</button>
        <button type="submit" className="btn-primary w-full">Next: Payment Details</button>
      </div>
    </form>
  );
};

export default RegisterStep2;