import React from 'react'; // Removed { useEffect }
import { useAuth } from '../../hooks/useAuth';

const RegisterStep2 = ({ data, updateData, onNext, onBack }) => {
  const { locationData } = useAuth();
  
  // Destructure for easier access
  const { states, districts, colleges, hostels } = locationData;

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  // Reset dependent fields when parent fields change
  const handleStateChange = (e) => {
    updateData('canteen', 'state', e.target.value);
    updateData('canteen', 'district', '');
    updateData('canteen', 'college', '');
  };

  const handleDistrictChange = (e) => {
    updateData('canteen', 'district', e.target.value);
    updateData('canteen', 'college', '');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4">Step 2: Canteen & Location</h3>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Canteen Name</label>
        <input 
          type="text" required className="input-field" placeholder="e.g. Tech Bites"
          value={data.canteenName} onChange={e => updateData('canteen', 'canteenName', e.target.value)} 
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
          <input type="text" value="India" readOnly className="input-field bg-slate-100 text-slate-500 cursor-not-allowed" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
          <select 
            required className="input-field bg-white" 
            value={data.state} onChange={handleStateChange}
          >
            <option value="">Select State</option>
            {states.map(st => <option key={st.id} value={st.id}>{st.name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">District</label>
          <select 
            required className="input-field bg-white" 
            value={data.district} onChange={handleDistrictChange}
            disabled={!data.state}
          >
            <option value="">Select District</option>
            {data.state && districts[data.state]?.map(dt => (
              <option key={dt.id} value={dt.id}>{dt.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">College/Institute</label>
          <select 
            required className="input-field bg-white" 
            value={data.college} onChange={e => updateData('canteen', 'college', e.target.value)}
            disabled={!data.district}
          >
            <option value="">Select College</option>
            {data.district && colleges[data.district]?.map(col => (
              <option key={col.id} value={col.id}>{col.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Canteen Type</label>
        <div className="flex gap-4">
          <label className={`flex-1 border p-3 rounded-lg cursor-pointer transition-colors ${data.type === 'central' ? 'border-primary bg-blue-50' : 'border-slate-200'}`}>
            <input 
              type="radio" name="ctype" value="central" 
              checked={data.type === 'central'} 
              onChange={e => updateData('canteen', 'type', e.target.value)} 
              className="mr-2 accent-primary"
            />
            <span className="font-medium text-sm">Central Canteen</span>
          </label>
          <label className={`flex-1 border p-3 rounded-lg cursor-pointer transition-colors ${data.type === 'hostel' ? 'border-primary bg-blue-50' : 'border-slate-200'}`}>
            <input 
              type="radio" name="ctype" value="hostel" 
              checked={data.type === 'hostel'} 
              onChange={e => updateData('canteen', 'type', e.target.value)} 
              className="mr-2 accent-primary"
            />
            <span className="font-medium text-sm">Hostel Mess</span>
          </label>
        </div>
      </div>

      {data.type === 'hostel' && (
        <div className="animate-in fade-in slide-in-from-top-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Select Hostel</label>
          <select 
            required className="input-field bg-white"
            value={data.hostelId} onChange={e => updateData('canteen', 'hostelId', e.target.value)}
            disabled={!data.college}
          >
            <option value="">Select Hostel Name</option>
            {data.college && hostels[data.college]?.map(hst => (
               <option key={hst.id} value={hst.id}>{hst.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <button type="button" onClick={onBack} className="btn-secondary w-full">Back</button>
        <button type="submit" className="btn-primary w-full">Next: Bank Details</button>
      </div>
    </form>
  );
};

export default RegisterStep2;