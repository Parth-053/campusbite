import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowLeft, Ban, Trash2, User, ShoppingBag, Activity } from 'lucide-react';

import { fetchCanteenById, toggleCanteenStatus, deleteCanteen, clearCurrentCanteen } from '../store/canteenSlice';
import Skeleton from '../components/common/Skeleton';
import CanteenBasicInfo from '../components/canteens/detail/CanteenBasicInfo';
import CanteenMenu from '../components/canteens/detail/CanteenMenu';
import CanteenBusiness from '../components/canteens/detail/CanteenBusiness';

const CanteenDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentCanteen: canteen, isDetailLoading } = useSelector(state => state.canteen);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    dispatch(fetchCanteenById(id));
    return () => dispatch(clearCurrentCanteen());
  }, [dispatch, id]);

  const handleToggleBlock = () => {
    if (window.confirm(`Are you sure you want to ${canteen.status === 'Active' ? 'block' : 'unblock'} this canteen?`)) {
      dispatch(toggleCanteenStatus(canteen.id));
    }
  };

  const handleDelete = () => {
    if (window.confirm("Permanently delete this canteen? This action cannot be undone.")) {
      dispatch(deleteCanteen(canteen.id)).then(() => navigate('/canteens', { replace: true }));
    }
  };

  if (isDetailLoading || !canteen) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white h-16 shadow-sm sticky top-0" />
        <div className="p-8 max-w-5xl mx-auto"><Skeleton className="h-[60vh] w-full rounded-2xl" /></div>
      </div>
    );
  }

  const isBlocked = canteen.status === 'Inactive';

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Top Standalone Header */}
      <div className="bg-white h-16 flex items-center shadow-sm px-4 sticky top-0 z-30 border-b border-gray-200">
        <button onClick={() => navigate(-1)} className="p-2 mr-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={22} />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-gray-800 pr-10">{canteen.name}</h1>
      </div>

      <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6 pb-20">
        
        {/* Banner Card & Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-bold text-gray-900">{canteen.name}</h2>
              <span className={`px-2.5 py-1 text-[11px] font-bold uppercase rounded-full ${isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                {isBlocked ? 'Blocked' : 'Active'}
              </span>
            </div>
            <p className="text-gray-500 text-sm">{canteen.college}</p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
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

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto gap-2 border-b border-gray-200 pb-px">
          {[
            { id: 'info', label: 'Basic Info', icon: User },
            { id: 'menu', label: 'Menu List', icon: ShoppingBag },
            { id: 'business', label: 'Business & Finance', icon: Activity }
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)} 
              className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-bold whitespace-nowrap transition-colors ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Tab Rendering */}
        <div className="pt-2">
          {activeTab === 'info' && <CanteenBasicInfo canteen={canteen} />}
          {activeTab === 'menu' && <CanteenMenu canteen={canteen} />}
          {activeTab === 'business' && <CanteenBusiness canteen={canteen} />}
        </div>

      </div>
    </div>
  );
};

export default CanteenDetail;