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

  const inputClass = "w-full px-4 py-3 bg-background border border-borderCol rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-textDark";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
      <h3 className="text-lg font-bold text-textDark border-b border-borderCol pb-2 mb-4 sticky top-0 bg-surface z-10">Step 2: Business Details</h3>
      
      <div>
        <label className="block text-sm font-semibold text-textDark mb-1.5">Business / Canteen Name</label>
        <input type="text" required className={inputClass} placeholder="e.g. Campus Bites Center" value={data.canteenName} onChange={e => updateData('canteen', 'canteenName', e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-textDark mb-1.5">State</label>
          <select required className={inputClass} value={data.state} onChange={e => { updateData('canteen', 'state', e.target.value); updateData('canteen', 'district', ''); updateData('canteen', 'college', ''); updateData('canteen', 'hostelId', ''); }}>
            <option value="">Select State</option>
            {states.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-textDark mb-1.5">District</label>
          <select required className={inputClass} value={data.district} disabled={!data.state} onChange={e => { updateData('canteen', 'district', e.target.value); updateData('canteen', 'college', ''); updateData('canteen', 'hostelId', ''); }}>
            <option value="">Select District</option>
            {districts.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-textDark mb-1.5">College</label>
        <select required className={inputClass} value={data.college} disabled={!data.district} onChange={e => { updateData('canteen', 'college', e.target.value); updateData('canteen', 'hostelId', ''); }}>
          <option value="">Select College</option>
          {colleges.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-textDark mb-1.5">Canteen Type</label>
        <div className="grid grid-cols-2 gap-3">
          <label className={`border rounded-xl p-3 flex items-center gap-2 cursor-pointer transition-colors ${data.type === 'central' ? 'border-primary bg-primary/5 text-primary' : 'border-borderCol text-textLight hover:bg-background'}`}>
            <input type="radio" name="type" value="central" checked={data.type === 'central'} onChange={e => updateData('canteen', 'type', e.target.value)} className="hidden"/>
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${data.type === 'central' ? 'border-primary' : 'border-textLight'}`}>
              {data.type === 'central' && <div className="w-2 h-2 bg-primary rounded-full" />}
            </div>
            <span className="font-semibold text-sm">Central Canteen</span>
          </label>
          <label className={`border rounded-xl p-3 flex items-center gap-2 cursor-pointer transition-colors ${data.type === 'hostel' ? 'border-primary bg-primary/5 text-primary' : 'border-borderCol text-textLight hover:bg-background'}`}>
            <input type="radio" name="type" value="hostel" checked={data.type === 'hostel'} onChange={e => updateData('canteen', 'type', e.target.value)} className="hidden"/>
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${data.type === 'hostel' ? 'border-primary' : 'border-textLight'}`}>
              {data.type === 'hostel' && <div className="w-2 h-2 bg-primary rounded-full" />}
            </div>
            <span className="font-semibold text-sm">Hostel Canteen</span>
          </label>
        </div>
      </div>

      {data.type === 'hostel' && (
        <div>
          <label className="block text-sm font-semibold text-textDark mb-1.5">Located in Hostel</label>
          <select required className={inputClass} value={data.hostelId} disabled={!data.college} onChange={e => updateData('canteen', 'hostelId', e.target.value)}>
            <option value="">Select Hostel</option>
            {hostels.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
          </select>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-textDark mb-1.5 flex items-center gap-1"><Clock size={14}/> Opens At</label>
          <input type="time" required className={inputClass} value={data.openingTime} onChange={e => updateData('canteen', 'openingTime', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-textDark mb-1.5 flex items-center gap-1"><Clock size={14}/> Closes At</label>
          <input type="time" required className={inputClass} value={data.closingTime} onChange={e => updateData('canteen', 'closingTime', e.target.value)} />
        </div>
      </div>

      {hostels.length > 0 && (
        <div className="bg-background border border-borderCol p-4 rounded-xl">
          <label className="block text-sm font-semibold text-textDark mb-2 flex items-center gap-2"><CheckSquare size={16} className="text-primary"/> Delivery Access (Hostels)</label>
          <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto custom-scrollbar">
            {hostels.map(hst => (
              <label key={hst._id} className="flex items-center gap-2 p-2 bg-surface border border-borderCol rounded-lg cursor-pointer hover:border-primary transition-colors">
                <input type="checkbox" checked={(data.allowedHostels || []).includes(hst._id)} onChange={() => handleHostelToggle(hst._id)} className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary" />
                <span className="text-xs font-medium text-textDark truncate">{hst.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="border-2 border-dashed border-borderCol rounded-xl p-4 bg-background hover:border-primary transition-colors relative">
        <label className="block text-sm font-semibold text-textDark mb-2 text-center">Business Thumbnail (Optional)</label>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-12 cursor-pointer">
            <div className="flex flex-col items-center justify-center">
              <UploadCloud className="w-6 h-6 text-textLight mb-1" />
              <p className="text-xs text-textLight"><span className="font-semibold text-primary">Click to upload</span> image</p>
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => updateData('canteen', 'image', e.target.files[0])} />
          </label>
        </div>
        {data.image && <p className="text-xs font-bold text-success mt-2 text-center">Selected: {data.image.name}</p>}
      </div>

      <div className="flex gap-4 pt-4">
        <button type="button" onClick={onBack} className="w-full py-3 bg-background text-textDark border border-borderCol font-bold rounded-xl hover:bg-borderCol transition-colors">
          Back
        </button>
        <button type="submit" className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-md">
          Next Step
        </button>
      </div>
    </form>
  );
};

export default RegisterStep2;