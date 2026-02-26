import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UploadCloud, Clock, CheckSquare } from 'lucide-react'; 
import { fetchStates, fetchDistricts, fetchColleges, fetchHostels, clearDistricts, clearColleges, clearHostels } from '../../store/locationSlice';

const RegisterStep2 = ({ data, updateData, onNext, onBack }) => {
  const dispatch = useDispatch();
  const { states = [], districts = [], colleges = [], hostels = [] } = useSelector(state => state.location || {});

  useEffect(() => { dispatch(fetchStates()); }, [dispatch]);
  useEffect(() => { if (data.state) dispatch(fetchDistricts(data.state)); else dispatch(clearDistricts()); }, [data.state, dispatch]);
  useEffect(() => { if (data.district) dispatch(fetchColleges(data.district)); else dispatch(clearColleges()); }, [data.district, dispatch]);
  useEffect(() => { 
    if (data.college) dispatch(fetchHostels(data.college)); 
    else { dispatch(clearHostels()); updateData('canteen', 'allowedHostels', []); } 
  }, [data.college, dispatch, updateData]);

  const handleSubmit = (e) => { e.preventDefault(); onNext(); };
   
  const handleHostelToggle = (hostelId) => {
    const currentList = data.allowedHostels || [];
    const newList = currentList.includes(hostelId) ? currentList.filter(id => id !== hostelId) : [...currentList, hostelId];
    updateData('canteen', 'allowedHostels', newList);
  };
  
  const inputClass = "w-full px-4 py-3 bg-background border border-borderCol rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-textDark placeholder:text-textLight/60 font-medium";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <h3 className="text-lg font-black text-textDark border-b border-borderCol pb-2 mb-4">Step 2: Business Info</h3>
      
      <div>
        <label className="block text-xs font-bold text-textLight uppercase tracking-widest mb-1.5">Business Name</label>
        <input type="text" required className={inputClass} placeholder="e.g. Sharma Canteen" value={data.canteenName} onChange={e => updateData('canteen', 'canteenName', e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-textLight uppercase tracking-widest mb-1.5">State</label>
          <select required className={inputClass} value={data.state} onChange={e => { updateData('canteen', 'state', e.target.value); updateData('canteen', 'district', ''); updateData('canteen', 'college', ''); }}>
            <option value="" disabled>Select State</option>
            {states.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-textLight uppercase tracking-widest mb-1.5">District</label>
          <select required className={inputClass} value={data.district} onChange={e => { updateData('canteen', 'district', e.target.value); updateData('canteen', 'college', ''); }} disabled={!data.state}>
            <option value="" disabled>Select District</option>
            {districts.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-textLight uppercase tracking-widest mb-1.5">College</label>
        <select required className={inputClass} value={data.college} onChange={e => updateData('canteen', 'college', e.target.value)} disabled={!data.district}>
          <option value="" disabled>Select College</option>
          {colleges.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
      </div>

      <div className="flex gap-4 p-3 bg-background border border-borderCol rounded-xl">
        <label className="flex items-center gap-2 cursor-pointer font-bold text-sm">
          <input type="radio" name="type" className="accent-primary" checked={data.type === 'central'} onChange={() => { updateData('canteen', 'type', 'central'); updateData('canteen', 'hostelId', ''); }} />
          Central Canteen
        </label>
        <label className="flex items-center gap-2 cursor-pointer font-bold text-sm">
          <input type="radio" name="type" className="accent-primary" checked={data.type === 'hostel'} onChange={() => updateData('canteen', 'type', 'hostel')} />
          Hostel Canteen
        </label>
      </div>

      {data.type === 'hostel' && (
        <div>
          <label className="block text-xs font-bold text-textLight uppercase tracking-widest mb-1.5">Select Hostel Location</label>
          <select required className={inputClass} value={data.hostelId} onChange={e => updateData('canteen', 'hostelId', e.target.value)} disabled={!data.college}>
            <option value="" disabled>Choose Hostel</option>
            {hostels.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
          </select>
        </div>
      )}

      {hostels.length > 0 && (
        <div className="border border-borderCol rounded-xl p-4 bg-background">
          <label className="block text-xs font-bold text-textLight uppercase tracking-widest mb-3">Serviceable Hostels (Delivery)</label>
          <div className="grid grid-cols-2 gap-3 max-h-32 overflow-y-auto custom-scrollbar">
            {hostels.map(h => (
              <label key={h._id} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${data.allowedHostels?.includes(h._id) ? 'bg-primary/10 border-primary text-primary' : 'border-borderCol text-textLight hover:bg-surface'}`}>
                
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={data.allowedHostels?.includes(h._id) || false} 
                  onChange={() => handleHostelToggle(h._id)} 
                />
                <CheckSquare size={16} className={data.allowedHostels?.includes(h._id) ? 'fill-primary stroke-white' : 'stroke-textLight'} />
                <span className="text-xs font-bold truncate">{h.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-textLight uppercase tracking-widest mb-1.5">Opening Time</label>
          <div className="relative">
            <input type="time" required className={`pl-10 ${inputClass}`} value={data.openingTime} onChange={e => updateData('canteen', 'openingTime', e.target.value)} />
            <Clock size={16} className="absolute left-3 top-3.5 text-textLight" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-textLight uppercase tracking-widest mb-1.5">Closing Time</label>
          <div className="relative">
            <input type="time" required className={`pl-10 ${inputClass}`} value={data.closingTime} onChange={e => updateData('canteen', 'closingTime', e.target.value)} />
            <Clock size={16} className="absolute left-3 top-3.5 text-textLight" />
          </div>
        </div>
      </div>

      <div className="border-2 border-dashed border-borderCol rounded-xl p-4 bg-background hover:border-primary transition-colors relative">
        <label className="block text-xs font-bold text-textLight uppercase tracking-widest mb-2 text-center">Business Thumbnail (Optional)</label>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-12 cursor-pointer">
            <div className="flex flex-col items-center justify-center">
              <UploadCloud className="w-6 h-6 text-textLight mb-1" />
              <p className="text-xs text-textLight"><span className="font-bold text-primary">Click to upload</span> image</p>
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => updateData('canteen', 'image', e.target.files[0])} />
          </label>
        </div>
        {data.image && <p className="text-xs font-bold text-success mt-2 text-center bg-success/10 py-1 rounded-md">Selected: {data.image.name}</p>}
      </div>

      <div className="flex gap-4 pt-4">
        <button type="button" onClick={onBack} className="w-full py-4 bg-background text-textDark border border-borderCol font-bold rounded-xl hover:bg-surface transition-all">Back</button>
        <button type="submit" className="w-full py-4 bg-primary text-white font-black rounded-xl hover:bg-primary-dark transition-all shadow-lg hover:shadow-primary/30">Next Step</button>
      </div>
    </form>
  );
};

export default RegisterStep2;