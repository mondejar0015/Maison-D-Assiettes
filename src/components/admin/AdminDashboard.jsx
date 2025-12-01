import React, { useEffect, useState } from "react";
import { 
  CubeIcon, 
  ShoppingBagIcon, 
  UsersIcon, 
  CurrencyDollarIcon,
  ArrowRightOnRectangleIcon,
  PlusIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";
import AdminHeader from "./shared/AdminHeader.jsx";
import AdminStatsCard from "./shared/AdminStatsCard.jsx";

export default function AdminDashboard({ 
  profile,
  items,
  adminItems,
  formatCurrency,
  changePage,
  handleLogout,
  fetchAllOrders,
  fetchAllUsers
}) {
  const [stats, setStats] = useState({
    totalItems: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  async function loadDashboardStats() {
    setLoading(true);
    try {
      const [allOrders, allUsers] = await Promise.all([
        fetchAllOrders(),
        fetchAllUsers()
      ]);

      const totalRevenue = allOrders.reduce((sum, order) => sum + (order.total || 0), 0);
      const pendingOrders = allOrders.filter(order => order.status === 'processing').length;

      setStats({
        totalItems: items.length,
        totalOrders: allOrders.length,
        totalUsers: allUsers.length,
        totalRevenue,
        pendingOrders
      });
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Admin Header */}
      <AdminHeader 
        title="Admin Dashboard"
        subtitle={`Welcome back, ${profile?.display_name || 'Administrator'}`}
        onLogout={handleLogout}
      />

      <div className="p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <AdminStatsCard
            icon={<CubeIcon className="w-8 h-8 text-blue-500" />}
            label="Total Items"
            value={stats.totalItems}
            color="blue"
          />
          
          <AdminStatsCard
            icon={<ShoppingBagIcon className="w-8 h-8 text-green-500" />}
            label="Total Orders"
            value={stats.totalOrders}
            color="green"
          />
          
          <AdminStatsCard
            icon={<UsersIcon className="w-8 h-8 text-purple-500" />}
            label="Total Users"
            value={stats.totalUsers}
            color="purple"
          />
          
          <AdminStatsCard
            icon={<CurrencyDollarIcon className="w-8 h-8 text-yellow-500" />}
            label="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            color="yellow"
          />
        </div>

        {/* Admin Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => changePage("adminInventory")}
              className="bg-white border-2 border-blue-200 rounded-xl p-4 text-left hover:bg-blue-50 transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <CubeIcon className="w-6 h-6 text-blue-600" />
                <PlusIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
              </div>
              <h3 className="font-bold text-gray-800">Manage Inventory</h3>
              <p className="text-sm text-gray-600 mt-1">Add, edit or remove items</p>
            </button>

            <button
              onClick={() => changePage("adminOrders")}
              className="bg-white border-2 border-green-200 rounded-xl p-4 text-left hover:bg-green-50 transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <ShoppingBagIcon className="w-6 h-6 text-green-600" />
                <ChartBarIcon className="w-5 h-5 text-gray-400 group-hover:text-green-500" />
              </div>
              <h3 className="font-bold text-gray-800">Manage Orders</h3>
              <p className="text-sm text-gray-600 mt-1">View and update orders ({stats.pendingOrders} pending)</p>
            </button>

            <button
              onClick={() => changePage("adminUsers")}
              className="bg-white border-2 border-purple-200 rounded-xl p-4 text-left hover:bg-purple-50 transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <UsersIcon className="w-6 h-6 text-purple-600" />
                <ChartBarIcon className="w-5 h-5 text-gray-400 group-hover:text-purple-500" />
              </div>
              <h3 className="font-bold text-gray-800">Manage Users</h3>
              <p className="text-sm text-gray-600 mt-1">View and manage user accounts</p>
            </button>
          </div>
        </div>

        {/* Recent Items */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Recent Items</h2>
            <button
              onClick={() => changePage("adminInventory")}
              className="text-blue-600 font-medium text-sm hover:text-blue-700"
            >
              View All →
            </button>
          </div>
          
          <div className="space-y-3">
            {adminItems.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
                    <img 
                      src={item.img} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => e.target.src = "/images/placeholder.png"}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.type} • {item.origin}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">{formatCurrency(item.price)}</p>
                  <p className="text-xs text-gray-500">{item.date}</p>
                </div>
              </div>
            ))}
            
            {adminItems.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No items in inventory. Add your first item!
              </div>
            )}
          </div>
        </div>

        {/* Admin Navigation */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <button
            onClick={() => changePage("home")}
            className="py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium text-gray-700 transition"
          >
            View as Customer
          </button>
          <button
            onClick={loadDashboardStats}
            disabled={loading}
            className="py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium text-white transition disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh Dashboard"}
          </button>
        </div>
      </div>
    </div>
  );
}