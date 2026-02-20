import React from 'react';
import { User, Clock, MapPin } from 'lucide-react';

const CanteenBasicInfo = ({ canteen }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
        <User size={18} className="text-gray-400"/> Owner Details
      </h3>
      <div className="space-y-4 text-sm">
        <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Name</span><span className="font-bold text-gray-900">{canteen.ownerName}</span></div>
        <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Phone</span><span className="font-bold text-gray-900">{canteen.phone}</span></div>
        <div className="flex justify-between pb-2"><span className="text-gray-500">Email</span><span className="font-bold text-gray-900">{canteen.email}</span></div>
      </div>
    </div>
    
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Clock size={18} className="text-gray-400"/> Operational Info
      </h3>
      <div className="space-y-4 text-sm">
        <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Opening Time</span><span className="font-bold text-gray-900">{canteen.openTime}</span></div>
        <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Closing Time</span><span className="font-bold text-gray-900">{canteen.closeTime}</span></div>
        <div className="flex justify-between pb-2"><span className="text-gray-500">Location</span><span className="font-bold text-gray-900 flex items-center gap-1"><MapPin size={14}/> {canteen.address}</span></div>
      </div>
    </div>
  </div>
);

export default CanteenBasicInfo;