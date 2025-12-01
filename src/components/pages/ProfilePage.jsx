import React from "react";
import PageHeader from "../shared/PageHeader.jsx";
import BottomNav from "../shared/BottomNav.jsx";
import Img from "../shared/Img.jsx";

export default function ProfilePage({ 
  profile, 
  orders, 
  favorites, 
  notifications, 
  formatCurrency, 
  changePage, 
  handleLogout, 
  loading 
}) {
  if (!profile) return null;
  
  return (
    <div className="min-h-screen bg-white pb-20">
      <PageHeader title="Profile" />
      
      <div className="p-4 space-y-4">
        {/* User Info Card */}
        <div className="flex items-center gap-4 border-2 border-gray-200 rounded-xl p-4 bg-white shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 rounded-bl-full -mr-2 -mt-2"></div>
          
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md relative z-10">
            {profile?.avatar ? (
              <Img src={profile.avatar} />
            ) : (
              <div className="text-2xl">👤</div>
            )}
          </div>
          
          <div className="flex-1 min-w-0 relative z-10">
            <div className="font-bold text-sm text-gray-800">
              {profile?.display_name || "New User"}
            </div>
            <div className="text-xs text-gray-500">
              {profile?.email || "No email"}
            </div>
            <div className={`px-2 py-0.5 text-xs border rounded font-medium inline-block mt-1 ${'border-blue-300 bg-blue-50 text-blue-700'}`}>
              Member
            </div>
          </div>
        </div>

        {/* Orders Section */}
        {orders && orders.length > 0 ? (
          <div className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="font-bold text-sm text-gray-800 mb-3">Recent Orders</div>
            <div className="space-y-2 text-xs">
              {orders.map((o) => (
                <div 
                  key={o.id} 
                  className="flex items-center justify-between py-2 border-t first:border-t-0"
                >
                  <div className="text-gray-700 font-medium">
                    {`ORD-${o.id}`}
                  </div>
                  <div className={`font-semibold text-xs px-3 py-1 rounded-full ${
                    o.status === "delivered" ? "text-green-600 bg-green-50" : 
                    o.status === "processing" ? "text-yellow-600 bg-yellow-50" : 
                    "text-red-600 bg-red-50"
                  }`}>
                    {o.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center text-sm text-gray-500 shadow-sm">
            No recent orders.
          </div>
        )}

        {/* General Settings */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="font-bold text-sm text-gray-800 mb-2">Account Settings</div>
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => changePage("personal")}
              className="w-full text-left text-xs text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 font-medium"
            >
              👤 Personal Info
            </button>
            <button
              type="button"
              onClick={() => changePage("favorites")}
              className="w-full text-left text-xs text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 font-medium"
            >
              ❤️ Favorites ({favorites.length})
            </button>
            <button
              type="button"
              onClick={() => changePage("paymentMethod")}
              className="w-full text-left text-xs text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 font-medium"
            >
              💳 Payment Method
            </button>
            <button
              type="button"
              onClick={() => changePage("notifications")}
              className="w-full text-left text-xs text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 font-medium"
            >
              🔔 Notifications
            </button>
            <button
              type="button"
              onClick={() => changePage("security")}
              className="w-full text-left text-xs text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 font-medium"
            >
              🔒 Security
            </button>
          </div>
        </div>

        {/* Support */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="font-bold text-sm text-gray-800 mb-2">Support</div>
          <div className="space-y-1">
            <button type="button" className="w-full text-left text-xs text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 font-medium">
              ❓ Help Center
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full text-left text-xs text-red-600 py-2 px-3 rounded-lg hover:bg-red-50 transition font-semibold flex items-center gap-2"
            >
              🚪 Log Out
            </button>
          </div>
        </div>
      </div>
      
      <BottomNav changePage={changePage} />
    </div>
  );
}