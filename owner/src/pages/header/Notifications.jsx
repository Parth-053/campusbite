import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Bell, AlertCircle } from 'lucide-react';
import { fetchNotifications, markAsRead, clearAllNotifications, deleteNotification } from '../../store/notificationSlice';
import Skeleton from '../../components/common/Skeleton';

const Notifications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications, isLoading } = useSelector(state => state.notification);
  
  // State for Delete Popup
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  // Navigate to Order Details
  const handleNotificationClick = (notification) => {
    dispatch(markAsRead(notification.id));
    if (notification.type === 'order' && notification.orderId) {
      // In a real app, you might pass the order ID via state or URL param
      navigate('/orders'); 
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      dispatch(deleteNotification(deleteId));
      setDeleteId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-safe">
      
      {/* --- Header (Standalone) --- */}
      <div className="bg-white px-4 h-16 flex items-center justify-between shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-lg font-bold text-slate-800">Notifications</h1>
        </div>
        
        {notifications.length > 0 && (
          <button 
            onClick={() => dispatch(clearAllNotifications())}
            className="text-sm font-semibold text-primary hover:text-blue-700 active:opacity-70"
          >
            Clear All
          </button>
        )}
      </div>

      {/* --- Content --- */}
      <div className="p-4 space-y-3">
        {isLoading ? (
          // Skeletons
          [...Array(6)].map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 flex gap-4">
              <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="w-3/4 h-4" />
                <Skeleton className="w-1/2 h-3" />
              </div>
            </div>
          ))
        ) : notifications.length > 0 ? (
          // List
          notifications.map((n) => (
            <div 
              key={n.id}
              className={`relative group bg-white p-4 rounded-xl border transition-all duration-200 active:scale-[0.99]
                ${n.isRead ? 'border-slate-100' : 'border-blue-100 bg-blue-50/30 shadow-sm'}
              `}
            >
              {/* Highlight Dot for Unread */}
              {!n.isRead && (
                <span className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full"></span>
              )}

              <div className="flex gap-4">
                {/* Icon */}
                <div 
                  onClick={() => handleNotificationClick(n)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer
                    ${n.type === 'order' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-600'}
                  `}
                >
                  <Bell size={20} />
                </div>

                {/* Content */}
                <div className="flex-1 cursor-pointer" onClick={() => handleNotificationClick(n)}>
                  <p className={`text-sm ${n.isRead ? 'text-slate-600' : 'text-slate-900 font-semibold'}`}>
                    {n.message}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(n.timestamp).toLocaleString()}
                  </p>
                </div>

                {/* Delete Button (Stop Propagation to prevent navigation) */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteId(n.id);
                  }}
                  className="self-center p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Bell size={32} />
            </div>
            <p>No notifications yet</p>
          </div>
        )}
      </div>

      {/* --- Delete Confirmation Popup --- */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-in zoom-in-95">
            <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Delete Notification?</h3>
            <p className="text-slate-500 mt-2 mb-6 text-sm">This action cannot be undone.</p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 shadow-lg shadow-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Notifications;