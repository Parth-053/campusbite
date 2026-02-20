import React, { useState } from 'react';
import { School, ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import Skeleton from '../common/Skeleton';

const CollegesTable = ({ colleges, isLoading, onToggleStatus, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(colleges.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = colleges.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status) => {
    return status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">College Name</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-3/4" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-1/2" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-6 w-16 rounded-full" /></td>
                  <td className="px-6 py-4 text-right"><Skeleton className="h-6 w-24 ml-auto" /></td>
                </tr>
              ))
            ) : currentData.length > 0 ? (
              currentData.map((college) => (
                <tr key={college.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{college.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{college.district}, {college.state}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => onToggleStatus(college.id)}
                      className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full transition-opacity hover:opacity-80 ${getStatusColor(college.status)}`}
                      title="Click to toggle status"
                    >
                      {college.status}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => onEdit(college)}
                        className="text-blue-500 hover:text-blue-700 bg-blue-50 p-1.5 rounded-md transition-colors"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button 
                        onClick={() => onDelete(college.id)}
                        className="text-red-500 hover:text-red-700 bg-red-50 p-1.5 rounded-md transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                  <School className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="text-base font-medium">No colleges found matching the criteria.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {!isLoading && colleges.length > itemsPerPage && (
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-gray-50">
          <span className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, colleges.length)} of {colleges.length}
          </span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded bg-white border border-gray-300 text-gray-600 disabled:opacity-50 hover:bg-gray-100"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-medium px-2">{currentPage} / {totalPages}</span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded bg-white border border-gray-300 text-gray-600 disabled:opacity-50 hover:bg-gray-100"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegesTable;