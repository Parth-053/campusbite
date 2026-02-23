import React, { useState } from 'react';
import { Users, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Skeleton from '../common/Skeleton';

const safeName = (item) => (item && typeof item === 'object' ? item.name : item) || 'N/A';

const UsersTable = ({ users, isLoading }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = users.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (isDeleted) => !isDeleted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Student Name</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">College</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-3/4" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-1/2" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-2/3" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-6 w-16 rounded-full" /></td>
                  <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-10 ml-auto" /></td>
                </tr>
              ))
            ) : currentData.length > 0 ? (
              currentData.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{safeName(user.college)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-[11px] font-bold uppercase rounded-full ${getStatusColor(user.isDeleted)}`}>
                      {!user.isDeleted ? 'Active' : 'Blocked'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => navigate(`/users/${user._id}`)} 
                      className="text-primary bg-indigo-50 p-1.5 rounded-md hover:text-indigo-800 transition-colors inline-block" 
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="font-medium text-sm">No students found matching criteria.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {!isLoading && users.length > itemsPerPage && (
        <div className="flex justify-between px-6 py-3 border-t bg-gray-50 text-sm text-gray-600">
           <span>Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, users.length)}</span>
           <div className="flex gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage===1} className="p-1 rounded bg-white border hover:bg-gray-100 disabled:opacity-50"><ChevronLeft size={16}/></button>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage===totalPages} className="p-1 rounded bg-white border hover:bg-gray-100 disabled:opacity-50"><ChevronRight size={16}/></button>
           </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable;