import React from 'react';
import { User, Clock, MapPin, Store, CreditCard, Shield, Phone, Mail, Building } from 'lucide-react';

const CanteenBasicInfo = ({ canteen }) => {
  if (!canteen) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in duration-300">
      
      {/* 1. Canteen Details */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
          <Store size={18} className="text-primary"/> Canteen Details
        </h3>
        <div className="space-y-4 text-sm">
          <div className="flex justify-between border-b border-dashed pb-2">
            <span className="text-gray-500">Canteen Name</span>
            <span className="font-bold text-gray-900">{canteen.name || 'N/A'}</span>
          </div>
          <div className="flex justify-between border-b border-dashed pb-2">
            <span className="text-gray-500">Canteen Type</span>
            <span className={`font-bold capitalize px-2 py-0.5 rounded text-xs ${canteen.canteenType === 'central' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
              {canteen.canteenType || 'N/A'}
            </span>
          </div>
          <div className="flex justify-between border-b border-dashed pb-2">
            <span className="text-gray-500">GSTIN</span>
            <span className="font-bold text-gray-900">{canteen.gstin || 'Not Provided'}</span>
          </div>
          <div className="flex justify-between pb-2">
            <span className="text-gray-500">Account Status</span>
            <span className={`font-bold ${canteen.isActive ? 'text-green-600' : 'text-red-600'}`}>
              {canteen.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Owner Details */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
          <User size={18} className="text-blue-500"/> Owner Details
        </h3>
        <div className="space-y-4 text-sm">
          <div className="flex justify-between border-b border-dashed pb-2">
            <span className="text-gray-500">Name</span>
            <span className="font-bold text-gray-900">{canteen.owner?.name || 'N/A'}</span>
          </div>
          <div className="flex justify-between border-b border-dashed pb-2">
            <span className="text-gray-500 flex items-center gap-1"><Phone size={14}/> Phone</span>
            <span className="font-bold text-gray-900">{canteen.owner?.phone || 'N/A'}</span>
          </div>
          <div className="flex justify-between border-b border-dashed pb-2">
            <span className="text-gray-500 flex items-center gap-1"><Mail size={14}/> Email</span>
            <span className="font-bold text-gray-900">{canteen.owner?.email || 'N/A'}</span>
          </div>
          <div className="flex justify-between border-b border-dashed pb-2">
            <span className="text-gray-500 flex items-center gap-1"><CreditCard size={14}/> UPI ID</span>
            <span className="font-bold text-gray-900">{canteen.owner?.upiId || 'N/A'}</span>
          </div>
          <div className="flex justify-between pb-2">
            <span className="text-gray-500 flex items-center gap-1"><Shield size={14}/> Approval</span>
            <span className={`font-bold capitalize ${canteen.owner?.status === 'approved' ? 'text-green-600' : 'text-amber-600'}`}>
              {canteen.owner?.status || 'Pending'}
            </span>
          </div>
        </div>
      </div>
      
      {/* 3. Operational & Location Info */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
          <Clock size={18} className="text-orange-500"/> Operations & Location
        </h3>
        <div className="space-y-4 text-sm">
          <div className="flex justify-between border-b border-dashed pb-2">
            <span className="text-gray-500">Timings</span>
            <span className="font-bold text-gray-900">
              {canteen.openingTime && canteen.closingTime ? `${canteen.openingTime} - ${canteen.closingTime}` : 'Not Set'}
            </span>
          </div>
          
          <div className="flex justify-between border-b border-dashed pb-2">
            <span className="text-gray-500 flex items-center gap-1"><MapPin size={14}/> College</span>
            <span className="font-bold text-gray-900 text-right">{canteen.college?.name || 'N/A'}</span>
          </div>

          {/* 🚀 NEW: Base Physical Location (If type is Hostel) */}
          {canteen.canteenType === 'hostel' && (
            <div className="flex justify-between border-b border-dashed pb-2">
              <span className="text-gray-500">Base Location</span>
              <span className="font-bold text-purple-700 text-right">{canteen.hostel?.name || 'N/A'}</span>
            </div>
          )}

          {/* 🚀 NEW: Serviceable / Allowed Hostels Tags */}
          <div className="flex justify-between border-b border-dashed pb-2">
            <span className="text-gray-500 flex items-center gap-1"><Building size={14}/> Delivers To</span>
            <div className="flex flex-wrap gap-1 justify-end max-w-[180px]">
              {canteen.allowedHostels?.length > 0 ? (
                canteen.allowedHostels.map(h => (
                  <span key={h._id} className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full font-bold">
                    {h.name}
                  </span>
                ))
              ) : (
                <span className="font-bold text-gray-400 text-xs">No Hostels Assigned</span>
              )}
            </div>
          </div>

          <div className="flex justify-between pb-2">
            <span className="text-gray-500">State/District</span>
            <span className="font-bold text-gray-900 text-right">
              {canteen.college?.district?.name}, {canteen.college?.district?.state?.name}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CanteenBasicInfo;