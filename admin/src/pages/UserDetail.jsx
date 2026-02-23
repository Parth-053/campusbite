import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowLeft, Ban, Trash2, User, Mail, Phone, Calendar, School, ShoppingBag, MapPin } from 'lucide-react';
import { fetchCustomers, setCurrentCustomer, clearCurrentCustomer, toggleCustomerStatus, deleteCustomer } from '../store/customerSlice';
import Skeleton from '../components/common/Skeleton';

const safeName = (item) => (item && typeof item === 'object' ? item.name : item) || 'N/A';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { customers, currentCustomer: user, isLoading } = useSelector(state => state.customer);

  useEffect(() => {
    // If customers array is empty (e.g., direct page reload), fetch them first
    if (customers.length === 0) {
      dispatch(fetchCustomers()).then(() => dispatch(setCurrentCustomer(id)));
    } else {
      dispatch(setCurrentCustomer(id));
    }
    return () => dispatch(clearCurrentCustomer());
  }, [dispatch, id, customers.length]);

  const handleToggleBlock = () => {
    if (window.confirm(`Are you sure you want to ${!user.isDeleted ? 'block' : 'unblock'} this user?`)) {
      dispatch(toggleCustomerStatus(user._id));
    }
  };

  const handleDelete = () => {
    if (window.confirm("Permanently delete this user? This action cannot be undone.")) {
      dispatch(deleteCustomer(user._id)).then(() => navigate('/users', { replace: true }));
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white h-16 shadow-sm sticky top-0" />
        <div className="p-8 max-w-4xl mx-auto"><Skeleton className="h-[40vh] w-full rounded-2xl" /></div>
      </div>
    );
  }

  const isBlocked = user.isDeleted;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white h-16 flex items-center shadow-sm px-4 sticky top-0 z-30 border-b border-gray-200">
        <button onClick={() => navigate(-1)} className="p-2 mr-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={22} />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-gray-800 pr-10">Student Profile</h1>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 pb-20 animate-in fade-in duration-300">
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-2xl border border-primary/20 shrink-0">
              {user.name?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  {isBlocked ? 'Blocked' : 'Active'}
                </span>
              </div>
              <p className="text-gray-500 text-sm">ID: {user._id}</p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-4 tracking-wider flex items-center gap-2"><User size={16}/> Contact Information</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b pb-2"><span className="text-gray-500 flex items-center gap-2"><Mail size={14}/> Email</span><span className="font-bold text-gray-900">{user.email}</span></div>
              <div className="flex justify-between pb-2"><span className="text-gray-500 flex items-center gap-2"><Phone size={14}/> Phone</span><span className="font-bold text-gray-900">{user.phone || 'N/A'}</span></div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-4 tracking-wider flex items-center gap-2"><School size={16}/> Campus Info</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b pb-2"><span className="text-gray-500 flex items-center gap-2"><School size={14}/> College</span><span className="font-bold text-gray-900 text-right max-w-[60%]">{safeName(user.college)}</span></div>
              <div className="flex justify-between border-b pb-2"><span className="text-gray-500 flex items-center gap-2"><MapPin size={14}/> Hostel</span><span className="font-bold text-gray-900">{safeName(user.hostel)} (Room {user.roomNo || 'N/A'})</span></div>
              <div className="flex justify-between pb-2"><span className="text-gray-500 flex items-center gap-2"><Calendar size={14}/> Joined On</span><span className="font-bold text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</span></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserDetail;