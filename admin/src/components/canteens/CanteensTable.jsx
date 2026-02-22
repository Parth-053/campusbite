import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';
import Skeleton from '../common/Skeleton';

const CanteensTable = ({ canteens, isLoading, onToggleStatus, onApproveReject, onDelete }) => {
  const navigate = useNavigate();
  if (isLoading) return <Skeleton className="h-64 w-full" />;

  if (!canteens || canteens.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 text-center">
        <p className="text-slate-500">No canteens or pending requests found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 text-sm">
              <th className="p-4 font-medium">Canteen Info</th>
              <th className="p-4 font-medium">Location</th>
              <th className="p-4 font-medium">Owner</th>
              <th className="p-4 font-medium">Status / Request</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100">
            {canteens.map((canteen) => {
              const ownerStatus = canteen.owner?.status || 'pending'; 

              return (
                <tr key={canteen._id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-slate-800 flex items-center gap-2">
                      {canteen.name}
                      <button onClick={() => navigate(`/canteens/${canteen._id}`)} className="text-primary hover:text-blue-700">
                        <ExternalLink size={14} />
                      </button>
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${canteen.canteenType === 'central' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                      {canteen.canteenType === 'central' ? 'Central' : 'Hostel'}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">
                    <p className="font-medium text-slate-800">{canteen.college?.name}</p>
                    <p className="text-xs">{canteen.college?.district?.name}, {canteen.college?.district?.state?.name}</p>
                  </td>
                  <td className="p-4 text-slate-600">
                    <p className="font-medium text-slate-800">{canteen.owner?.name}</p>
                    <p className="text-xs">{canteen.owner?.email}</p>
                    {canteen.owner?.isBanned && (
                      <span className="inline-block mt-1 bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-full font-bold">BANNED</span>
                    )}
                  </td>
                  <td className="p-4">
                    {ownerStatus === 'pending' && <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-md text-xs font-semibold w-max"><Clock size={14} /> Pending</span>}
                    {ownerStatus === 'rejected' && <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-md text-xs font-semibold w-max"><XCircle size={14} /> Rejected</span>}
                    {ownerStatus === 'approved' && (
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={canteen.isActive} onChange={() => onToggleStatus(canteen._id)} />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                        <span className="ml-2 text-xs font-medium text-slate-600">{canteen.isActive ? 'Active' : 'Hidden'}</span>
                      </label>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {ownerStatus === 'pending' && (
                        <>
                          <button onClick={() => onApproveReject(canteen.owner._id, 'approved')} className="p-1.5 text-green-600 bg-green-50 hover:bg-green-100 rounded-md transition-colors" title="Approve"><CheckCircle size={18} /></button>
                          <button onClick={() => onApproveReject(canteen.owner._id, 'rejected')} className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors" title="Reject"><XCircle size={18} /></button>
                        </>
                      )}
                      <button onClick={() => onDelete(canteen._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Delete"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default CanteensTable;