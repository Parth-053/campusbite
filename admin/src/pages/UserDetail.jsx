import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowLeft, Ban, Trash2, User, Mail, Phone, Calendar, School, ShoppingBag } from 'lucide-react';

import { fetchUserById, toggleUserStatus, deleteUser, clearCurrentUser } from '../store/userSlice';
import Skeleton from '../components/common/Skeleton';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentUser: user, isDetailLoading } = useSelector(state => state.user);

  useEffect(() => {
    dispatch(fetchUserById(id));
    return () => dispatch(clearCurrentUser());
  }, [dispatch, id]);

  const handleToggleBlock = () => {
    if (window.confirm(`Are you sure you want to ${user.status === 'Active' ? 'block' : 'unblock'} this user?`)) {
      dispatch(toggleUserStatus(user.id));
    }
  };

  const handleDelete = () => {
    if (window.confirm("Permanently delete this user? This action cannot be undone.")) {
      dispatch(deleteUser(user.id)).then(() => navigate('/users', { replace: true }));
    }
  };

  if (isDetailLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white h-16 shadow-sm sticky top-0" />
        <div className="p-8 max-w-4xl mx-auto"><Skeleton className="h-[40vh] w-full rounded-2xl" /></div>
      </div>
    );
  }

  const isBlocked = user.status === 'Inactive';

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Top Standalone Header */}
      <div className="bg-white h-16 flex items-center shadow-sm px-4 sticky top-0 z-30 border-b border-gray-200">
        <button onClick={() => navigate(-1)} className="p-2 mr-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={22} />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-gray-800 pr-10">Student Profile</h1>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 pb-20 animate-in fade-in duration-300">
        
        {/* Banner Card & Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-2xl border border-primary/20 shrink-0">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  {isBlocked ? 'Blocked' : 'Active'}
                </span>
              </div>
              <p className="text-gray-500 text-sm">{user.id}</p>
            </div>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto mt-2 md:mt-0">
            <button 
              onClick={handleToggleBlock} 
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold text-sm border transition-colors ${isBlocked ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'}`}
            >
              <Ban size={16}/> {isBlocked ? 'Unblock' : 'Block'}
            </button>
            <button 
              onClick={handleDelete} 
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold text-sm bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors"
            >
              <Trash2 size={16}/> Delete
            </button>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-4 tracking-wider flex items-center gap-2"><User size={16}/> Contact Information</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b pb-2"><span className="text-gray-500 flex items-center gap-2"><Mail size={14}/> Email</span><span className="font-bold text-gray-900">{user.email}</span></div>
              <div className="flex justify-between pb-2"><span className="text-gray-500 flex items-center gap-2"><Phone size={14}/> Phone</span><span className="font-bold text-gray-900">{user.phone}</span></div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-4 tracking-wider flex items-center gap-2"><School size={16}/> Academic Info</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b pb-2"><span className="text-gray-500 flex items-center gap-2"><School size={14}/> College</span><span className="font-bold text-gray-900 text-right max-w-[60%]">{user.college}</span></div>
              <div className="flex justify-between pb-2"><span className="text-gray-500 flex items-center gap-2"><Calendar size={14}/> Joined Date</span><span className="font-bold text-gray-900">{user.joinedDate}</span></div>
            </div>
          </div>
        </div>

        {/* Order History Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center gap-2">
            <ShoppingBag size={18} className="text-primary" />
            <h3 className="text-base font-bold text-gray-800">Order History ({user.orders.length})</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Canteen</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {user.orders.length > 0 ? (
                  user.orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm text-gray-900">#{order.id}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{order.canteen}</td>
                      <td className="px-6 py-3 text-sm text-gray-500">{order.date}</td>
                      <td className="px-6 py-3 text-sm font-bold text-gray-900 text-right">${order.amount}</td>
                      <td className="px-6 py-3 text-right">
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${order.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-400 text-sm">No past orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserDetail;