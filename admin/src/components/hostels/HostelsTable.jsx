import React, { useState } from 'react';
import { Building, ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import Skeleton from '../common/Skeleton';

const HostelsTable = ({ hostels, isLoading, onToggleStatus, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(hostels.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = hostels.slice(startIndex, startIndex + itemsPerPage);

  const getStatusStyle = (isActive) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Hostel Name</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Linked College</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              // Loading Skeleton
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-3/4" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-1/2" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-6 w-16 rounded-full" /></td>
                  <td className="px-6 py-4 text-right"><Skeleton className="h-6 w-24 ml-auto" /></td>
                </tr>
              ))
            ) : currentData.length > 0 ? (
              // Data Rows
              currentData.map((hostel) => (
                <tr key={hostel._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-50 p-2 rounded-lg text-orange-600">
                        <Building size={16} />
                      </div>
                      <span className="text-sm font-bold text-gray-900">{hostel.name}</span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-800">{hostel.college?.name}</div>
                    <div className="text-xs text-gray-500">{hostel.college?.district?.name}</div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => onToggleStatus(hostel._id)}
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full transition-opacity hover:opacity-80 ${getStatusStyle(hostel.isActive)}`}
                      title="Click to toggle status"
                    >
                      {hostel.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => onEdit(hostel)}
                        className="text-blue-500 hover:text-blue-700 bg-blue-50 p-1.5 rounded-md transition-colors"
                        title="Edit Hostel"
                      >
                        <Pencil size={16} />
                      </button>
                      <button 
                        onClick={() => onDelete(hostel._id)}
                        className="text-red-500 hover:text-red-700 bg-red-50 p-1.5 rounded-md transition-colors"
                        title="Delete Hostel"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              // Empty State
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                  <Building className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="text-base font-medium text-gray-600">No hostels found matching the criteria.</p>
                  <p className="text-sm mt-1">Try adjusting your filters or add a new hostel.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {!isLoading && hostels.length > itemsPerPage && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-3 border-t border-gray-200 bg-gray-50 gap-4">
          <span className="text-sm text-gray-600">
            Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(startIndex + itemsPerPage, hostels.length)}</span> of <span className="font-medium">{hostels.length}</span>
          </span>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded bg-white border border-gray-300 text-gray-600 disabled:opacity-50 hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-medium px-3 text-gray-700">
              {currentPage} / {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded bg-white border border-gray-300 text-gray-600 disabled:opacity-50 hover:bg-gray-100 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostelsTable;