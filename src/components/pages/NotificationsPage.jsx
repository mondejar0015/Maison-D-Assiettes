import React from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import PageHeader from "../shared/PageHeader.jsx";
import BottomNav from "../shared/BottomNav.jsx";

export default function NotificationsPage({ notifications, markNotificationAsRead, goBack }) {
  const unreadCount = notifications.filter(n => !n.is_read).length;
  
  return (
    <div className="min-h-screen bg-white pb-20">
      <PageHeader title={`Notifications (${unreadCount > 0 ? unreadCount : '0'})`} showBack={true} onBack={goBack} />
      
      <div className="p-4 space-y-3">
        {notifications.map((n) => (
          <div 
            key={n.id} 
            className={`flex items-start gap-3 border-2 border-gray-200 rounded-xl p-4 bg-white shadow-sm transition ${!n.is_read ? 'border-blue-400 bg-blue-50/50' : ''}`}
            onClick={() => markNotificationAsRead(n.id)}
          >
            <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${!n.is_read ? 'bg-blue-500' : 'bg-gray-300'}`} />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-gray-800">
                {n.title}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {n.message}
              </div>
              <div className="text-[10px] text-gray-400 mt-1">
                {new Date(n.created_at).toLocaleDateString()}
              </div>
            </div>
            <BellIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
          </div>
        ))}
        
        {notifications.length === 0 && (
          <div className="text-center text-sm text-gray-500 py-6">
            No new notifications.
          </div>
        )}
      </div>
      
      <BottomNav changePage={() => {}} />
    </div>
  );
}