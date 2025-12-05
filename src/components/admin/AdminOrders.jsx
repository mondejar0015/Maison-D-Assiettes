import React, { useEffect, useState } from "react";
import {
  CheckCircleIcon,
  ClockIcon,
  TruckIcon,
  XCircleIcon,
  ArrowLeftIcon
} from "@heroicons/react/24/outline";
import AdminStatsCard from "./shared/AdminStatsCard.jsx";

export default function AdminOrders({
  fetchAllOrders,
  formatCurrency,
  updateOrderStatus,
  goBack,
  loading,
  changePage
}) {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all"); // all, pending, completed, cancelled

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    const allOrders = await fetchAllOrders();
    setOrders(allOrders);
  }

  const filteredOrders = orders.filter(order => {
    if (filter === "all") return true;
    if (filter === "pending") return order.status === "processing";
    if (filter === "completed") return order.status === "delivered";
    if (filter === "cancelled") return order.status === "cancelled";
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "processing": return "bg-yellow-100 text-yellow-800";
      case "shipped": return "bg-blue-100 text-blue-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "processing": return <ClockIcon className="w-4 h-4" />;
      case "shipped": return <TruckIcon className="w-4 h-4" />;
      case "delivered": return <CheckCircleIcon className="w-4 h-4" />;
      case "cancelled": return <XCircleIcon className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    loadOrders(); // Refresh orders
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "processing").length,
    completed: orders.filter(o => o.status === "delivered").length,
    revenue: orders.reduce((sum, o) => sum + (o.total || 0), 0)
  };

  // Custom Header with Back Button
  const CustomHeader = () => (
    <div className="bg-gradient-to-r from-blue-900 to-purple-800 text-white p-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={goBack}
            className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Dashboard
          </button>
          <div>
            <h1 className="text-2xl font-bold">Order Management</h1>
            <p className="text-blue-200 text-sm mt-1">
              View and update all orders
            </p>
          </div>
        </div>
        <button
          onClick={() => changePage("adminDashboard")}
          className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition"
        >
          Dashboard
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <CustomHeader />

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <AdminStatsCard
            icon={<ClockIcon className="w-8 h-8 text-blue-500" />}
            label="Total Orders"
            value={stats.total}
            color="blue"
          />
          
          <AdminStatsCard
            icon={<ClockIcon className="w-8 h-8 text-yellow-500" />}
            label="Pending"
            value={stats.pending}
            color="yellow"
          />
          
          <AdminStatsCard
            icon={<CheckCircleIcon className="w-8 h-8 text-green-500" />}
            label="Completed"
            value={stats.completed}
            color="green"
          />
          
          <AdminStatsCard
            icon={<TruckIcon className="w-8 h-8 text-purple-500" />}
            label="Revenue"
            value={formatCurrency(stats.revenue)}
            color="purple"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {["all", "pending", "completed", "cancelled"].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                filter === filterType
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
          <button
            onClick={loadOrders}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 whitespace-nowrap"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-bold text-gray-800">
              Orders ({filteredOrders.length})
            </h3>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredOrders.map((order) => (
              <div key={order.id} className="p-6 hover:bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-gray-800">Order #{order.id}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      User ID: {order.user_id}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.placed_at).toLocaleDateString()} • {formatCurrency(order.total)}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-800">{formatCurrency(order.total)}</p>
                      <p className="text-sm text-gray-500">
                        Subtotal: {formatCurrency(order.subtotal)} + Shipping: {formatCurrency(order.shipping || 0)}
                      </p>
                    </div>

                    {/* Status Actions */}
                    <div className="flex gap-2">
                      {order.status === "processing" && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(order.id, "shipped")}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                          >
                            Mark Shipped
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(order.id, "cancelled")}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {order.status === "shipped" && (
                        <button
                          onClick={() => handleStatusUpdate(order.id, "delivered")}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                        >
                          Mark Delivered
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-2">📦</div>
                <p className="text-gray-500">
                  {filter === "all" ? "No orders yet" : `No ${filter} orders`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}