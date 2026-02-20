import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Tag, Info, CheckCircle, CheckCheck } from 'lucide-react';
import { markAsRead, markAllAsRead } from '../../store/notificationSlice';

const Notifications = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.notifications);

  // Map icons to types
  const getIcon = (type) => {
    switch (type) {
      case 'status': return <CheckCircle className="text-green-500" />;
      case 'promo': return <Tag className="text-orange-500" />;
      case 'info': return <Info className="text-blue-500" />;
      default: return <Info className="text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-10 animate-in slide-in-from-right-4 duration-300">
      <header className="bg-white px-4 py-4 shadow-sm flex items-center gap-4 sticky top-0 z-40">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-xl font-black text-gray-900 flex-1">Notifications</h1>
        {notifications.some(n => n.unread) && (
          <button 
            onClick={() => dispatch(markAllAsRead())}
            className="text-primary p-2 hover:bg-red-50 rounded-full transition-colors"
            title="Mark all as read"
          >
            <CheckCheck size={20} />
          </button>
        )}
      </header>

      <main className="p-4 space-y-3">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div 
              key={notif.id} 
              onClick={() => dispatch(markAsRead(notif.id))}
              className={`p-4 rounded-2xl border transition-all flex gap-4 cursor-pointer ${
                notif.unread 
                  ? 'bg-white border-primary/10 shadow-sm' 
                  : 'bg-gray-50/50 border-transparent opacity-80'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                notif.unread ? 'bg-white shadow-sm' : 'bg-gray-100'
              }`}>
                {getIcon(notif.type)}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`text-sm font-black ${notif.unread ? 'text-gray-900' : 'text-gray-500'}`}>
                    {notif.title}
                  </h3>
                  <span className="text-[10px] font-bold text-gray-400">{notif.time}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {notif.desc}
                </p>
              </div>
              
              {notif.unread && <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Info size={24} className="text-gray-300" />
            </div>
            <p className="text-gray-500 font-bold">All caught up!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Notifications;