import React from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import PageHeader from "../shared/PageHeader.jsx";
import BottomNav from "../shared/BottomNav.jsx";

export default function PaymentMethodPage({ 
  paymentMethods, 
  loading, 
  addCard, 
  removeCard, 
  goBack 
}) {
  return (
    <div className="min-h-screen bg-white pb-20">
      <PageHeader title="Payment Methods" showBack={true} onBack={goBack} />
      
      <div className="p-4 space-y-3">
        {paymentMethods.map((c) => (
          <div key={c.id} className="flex items-center justify-between border-2 border-gray-200 rounded-xl p-4 bg-white shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-9 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0 shadow-sm">
                {c.brand[0]}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-gray-800 text-sm">
                  {c.brand}
                </div>
                <div className="text-xs text-gray-600">
                  **** **** **** {c.last4}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeCard(c.id)}
              className="p-2 hover:bg-red-50 rounded-lg transition flex-shrink-0"
            >
              <TrashIcon className="w-5 h-5 text-red-500" />
            </button>
          </div>
        ))}
        
        {paymentMethods.length === 0 && (
          <div className="text-center text-sm text-gray-500 py-6">
            No payment methods saved.
          </div>
        )}
        
        <button
          type="button"
          onClick={addCard}
          disabled={loading}
          className="w-full py-2.5 rounded-full bg-blue-200 border-2 border-blue-400 text-gray-800 font-semibold hover:bg-blue-300 transition text-sm mt-4"
        >
          {loading ? "Adding..." : "Add New Card (Demo)"}
        </button>
      </div>
      
      <BottomNav changePage={() => {}} />
    </div>
  );
}