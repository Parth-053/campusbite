import React, { useState } from 'react';
import { Coffee, Eye, Pencil, Trash2, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Skeleton from '../common/Skeleton';

const CanteensTable = ({ canteens = [], isLoading, onToggleStatus, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(canteens.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = canteens.slice(startIndex, startIndex + itemsPerPage);

  const getStatusStyle = (isActive) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Canteen Name</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Location Type</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
               Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4"><Skeleton className="h-6 w-3/4" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-6 w-1/2" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-6 w-16 rounded-full" /></td>
                  <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-24 ml-auto" /></td>
                </tr>
              ))
            ) : currentData.length > 0 ? (
              currentData.map((canteen) => (
                <tr key={canteen._id} className="hover:bg-gray-50 transition-colors">
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-50 p-2 rounded-lg text-orange-600">
                        <Coffee size={18} />
                      </div>
                      <span className="text-sm font-bold text-gray-900 block">{canteen.name}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-800 flex items-center gap-1">
                        <MapPin size={14} className="text-indigo-500" />
                        {canteen.college?.name}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${canteen.canteenType === 'central' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {canteen.canteenType}
                        </span>
                        {canteen.canteenType === 'hostel' && canteen.hostel && (
                          <span className="text-xs text-gray-500">
                            ({canteen.hostel.name})
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => onToggleStatus(canteen._id)}
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full transition-opacity hover:opacity-80 ${getStatusStyle(canteen.isActive)}`}
                      title="Click to Block/Unblock Canteen"
                    >
                      {canteen.isActive ? 'Active' : 'Blocked'}
                    </button>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => navigate(`/canteens/${canteen._id}`)} className="text-indigo-500 bg-indigo-50 p-1.5 rounded-md hover:text-indigo-700" title="View Details">
                        <Eye size={16} />
                      </button>
                      
                      <button onClick={() => onEdit(canteen)} className="text-blue-500 bg-blue-50 p-1.5 rounded-md hover:text-blue-700" title="Edit">
                        <Pencil size={16} />
                      </button>
                      
                      <button onClick={() => onDelete(canteen._id)} className="text-red-500 bg-red-50 p-1.5 rounded-md hover:text-red-700" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                  <Coffee className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="font-medium text-gray-600">No canteens found matching the criteria.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {!isLoading && canteens.length > itemsPerPage && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-3 border-t border-gray-200 bg-gray-50 gap-4">
           <span className="text-sm text-gray-600">
             Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(startIndex + itemsPerPage, canteens.length)}</span> of <span className="font-medium">{canteens.length}</span>
           </span>
           <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
              disabled={currentPage===1} 
              className="p-1.5 rounded bg-white border border-gray-300 text-gray-600 disabled:opacity-50 hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft size={16}/>
            </button>
            <span className="text-sm font-medium px-3 text-gray-700">{currentPage} / {totalPages}</span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
              disabled={currentPage===totalPages} 
              className="p-1.5 rounded bg-white border border-gray-300 text-gray-600 disabled:opacity-50 hover:bg-gray-100 transition-colors"
            >
              <ChevronRight size={16}/>
            </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default CanteensTable;