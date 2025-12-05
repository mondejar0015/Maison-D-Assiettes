import React, { useState } from "react";
import { MagnifyingGlassIcon, ChevronRightIcon, ClockIcon } from "@heroicons/react/24/outline";
import PageHeader from "../shared/PageHeader.jsx";
import BottomNav from "../shared/BottomNav.jsx";

export default function HistoryPage({ orders, formatCurrency, changePage, goBack }) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredOrders = orders.filter(o => 
    o.id.toString().includes(searchTerm) || 
    (o.status && o.status.includes(searchTerm))
  );
  
  return (
    <div className="min-h-screen bg-white pb-20">
      <PageHeader title="History" showBack={true} onBack={goBack} showCart={true} changePage={changePage} />
      
      <div className="p-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-full pl-4 pr-10 py-2 text-sm placeholder-gray-400 focus:outline-none focus:border-blue-400 bg-gray-50"
            placeholder="Search history..."
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />
          </div>
        </div>
        
        <div className="space-y-3">
          {filteredOrders.length === 0 ? (
            <div className="text-center text-gray-500 py-6">No history found.</div>
          ) : (
            filteredOrders.map(order => (
              <div key={order.id} className="p-4 border-2 border-gray-200 rounded-xl bg-white shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                    <ClockIcon className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-gray-800">Order #{order.id}</div>
                    <div className="text-xs text-gray-500">{new Date(order.placed_at).toLocaleDateString()}</div>
                    <div className="font-semibold text-gray-800 mt-1">{formatCurrency(order.total)}</div>
                  </div>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
              </div>
            ))
          )}
        </div>
      </div>
      
      <BottomNav changePage={changePage} />
    </div>
  );
}