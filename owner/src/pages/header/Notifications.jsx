import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Trash2, Bell, CheckCheck, Receipt, Wallet, AlertCircle, Info, CheckCircle2 } from 'lucide-react';
import { fetchNotifications, markAsRead, markAllAsRead, deleteNotification, optimisticMarkRead } from '../../store/notificationSlice';
import Skeleton from '../../components/common/Skeleton';

 
const iconConfig = {
  'Order': { icon: Receipt, color: 'text-primary', bg: 'bg-primary/10' },
  'Wallet': { icon: Wallet, color: 'text-success', bg: 'bg-success/10' },
  'Alert': { icon: AlertCircle, color: 'text-error', bg: 'bg-error/10' },
  'System': { icon: Info, color: 'text-textLight', bg: 'bg-background' },
  'Profile': { icon: Info, color: 'text-warning', bg: 'bg-warning/10' }
};

const Notifications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
   
  const rawItems = useSelector(state => state.notification?.notifications);
  const isLoading = useSelector(state => state.notification?.isLoading) || false;
  const unreadCount = useSelector(state => state.notification?.unreadCount) || 0;
  
  const notifications = useMemo(() => rawItems || [], [rawItems]);

  const [activeTab, setActiveTab] = useState('All'); 

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAsRead = (e, id) => {
    e.stopPropagation(); 
    dispatch(optimisticMarkRead(id)); 
    dispatch(markAsRead(id)); 
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      dispatch(optimisticMarkRead(notification._id));
      dispatch(markAsRead(notification._id));
    }
    
    
    if (notification.type === 'Order') {
      navigate('/orders'); 
    } else if (notification.type === 'Wallet') {
      navigate('/transactions');
    }
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    dispatch(deleteNotification(id));
  };

  const handleMarkAllRead = () => {
    if (unreadCount > 0) dispatch(markAllAsRead());
  };

  const filteredNotifications = useMemo(() => {
    if (activeTab === 'Unread') return notifications.filter(n => !n.isRead);
    return notifications;
  }, [notifications, activeTab]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20 md:pb-0 max-w-4xl mx-auto">
      
      {/* 1. Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface p-4 sm:p-5 rounded-2xl border border-borderCol shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl relative">
            <Bell size={24} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[10px] font-bold text-white shadow-sm ring-2 ring-surface">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-textDark">Notifications</h2>
            <p className="text-xs sm:text-sm text-textLight mt-0.5">Stay updated with your latest alerts.</p>
          </div>
        </div>
        
        <button 
          onClick={handleMarkAllRead} 
          disabled={unreadCount === 0}
          className="w-full sm:w-auto px-4 py-2.5 bg-background border border-borderCol rounded-xl text-sm font-bold text-textDark hover:bg-surface hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
        >
         
          <CheckCheck size={16} /> Mark all as read
        </button>
      </div>

      {/* 2. Tabs */}
      <div className="flex bg-surface border border-borderCol rounded-xl p-1 w-full sm:w-fit shadow-sm">
        {['All', 'Unread'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)} 
            className={`flex-1 sm:px-8 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === tab ? 'bg-background text-primary shadow-sm border border-borderCol' : 'text-textLight hover:text-textDark'}`}
          >
            {tab} {tab === 'Unread' && unreadCount > 0 && `(${unreadCount})`}
          </button>
        ))}
      </div>

      {/* 3. Notifications List */}
      <div className="bg-surface border border-borderCol rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="w-full h-20 rounded-xl" />)}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-10 flex flex-col items-center justify-center text-center text-textLight">
             <Bell size={48} className="opacity-20 mb-4" />
             <h3 className="text-lg font-bold text-textDark">No {activeTab === 'Unread' ? 'unread' : ''} notifications</h3>
             <p className="text-sm font-medium mt-1">You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-borderCol">
            {filteredNotifications.map((notif) => {
              const TypeIcon = iconConfig[notif.type]?.icon || Info;
              const typeStyle = iconConfig[notif.type] || iconConfig['System'];

              return (
                <div 
                  key={notif._id} 
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-4 transition-colors flex items-start gap-4 group cursor-pointer ${notif.isRead ? 'bg-surface hover:bg-background/50' : 'bg-primary/5 hover:bg-primary/10'}`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm border border-borderCol/50 ${typeStyle.bg} ${typeStyle.color}`}>
                    <TypeIcon size={20} />
                  </div>
                  
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className={`text-sm sm:text-base font-bold truncate ${notif.isRead ? 'text-textDark/80' : 'text-textDark'}`}>
                        {notif.title}
                      </h4>
                      <p className="text-[10px] sm:text-xs font-bold text-textLight whitespace-nowrap shrink-0">
                        {new Date(notif.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <p className={`text-xs sm:text-sm mt-1 leading-relaxed ${notif.isRead ? 'text-textLight' : 'text-textDark/80 font-medium'}`}>
                      {notif.message}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity pt-1">
                    {!notif.isRead && (
                      <button 
                        onClick={(e) => handleMarkAsRead(e, notif._id)} 
                        title="Mark as Read"
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <CheckCircle2 size={18} />
                      </button>
                    )}
                    <button 
                      onClick={(e) => handleDelete(e, notif._id)} 
                      title="Delete"
                      className="p-2 text-textLight hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default Notifications;