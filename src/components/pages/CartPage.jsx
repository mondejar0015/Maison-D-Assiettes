import React from "react";
import { ShoppingCartIcon, TrashIcon } from "@heroicons/react/24/outline";
import PageHeader from "../shared/PageHeader.jsx";
import BottomNav from "../shared/BottomNav.jsx";
import Img from "../shared/Img.jsx";

export default function CartPage({ 
  cart, 
  formatCurrency, 
  removeFromCart, 
  updateCartQty, 
  changePage, 
  goBack 
}) {
  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const shipping = cart.length ? 150 : 0;
  const total = subtotal + shipping;
  
  return (
    <div className="min-h-screen bg-white">
      <PageHeader title={`Shopping Cart (${cart.length})`} showBack={true} onBack={goBack} />
      
      <div className="p-4 space-y-4 pb-20">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 border-2 border-gray-200 rounded-xl bg-white shadow-sm">
            <ShoppingCartIcon className="w-10 h-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Your cart is empty.</p>
            <button
              type="button"
              onClick={() => changePage("home")}
              className="mt-4 px-4 py-1.5 rounded-full bg-blue-200 border-2 border-blue-400 text-gray-800 font-semibold text-xs hover:bg-blue-300 transition"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="border-2 border-gray-200 rounded-xl p-4 bg-white shadow-sm space-y-3">
              <div className="font-bold text-gray-800 mb-2 text-sm">
                Items ({cart.length})
              </div>
              
              {cart.map((c) => (
                <div
                  key={c.cart_item_id}
                  className="flex items-center justify-between border-b last:border-b-0 py-2"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                      <Img src={c.img} alt={c.title} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-800 text-sm truncate">
                        {c.title}
                      </div>
                      <div className="text-xs text-gray-600">
                        {formatCurrency(c.price)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => updateCartQty(c.id, c.qty - 1)}
                      className="p-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50"
                      disabled={c.qty <= 1}
                    >
                      -
                    </button>
                    <span className="text-sm font-medium text-gray-800 w-4 text-center">
                      {c.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateCartQty(c.id, c.qty + 1)}
                      className="p-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFromCart(c.id)}
                      className="p-1 hover:bg-red-50 rounded-lg transition"
                    >
                      <TrashIcon className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="border-2 border-gray-200 rounded-xl p-4 bg-white shadow-sm">
              <div className="font-bold text-gray-800 mb-3 text-sm">
                Summary
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <div>Subtotal</div>
                <div className="font-medium">{formatCurrency(subtotal)}</div>
              </div>
              <div className="flex justify-between text-sm text-gray-600 pb-3 border-b border-gray-200">
                <div>Shipping Fee</div>
                <div className="font-medium">{formatCurrency(shipping)}</div>
              </div>
              <div className="flex justify-between font-bold text-gray-800 mt-3 text-base">
                <div>Total</div>
                <div>{formatCurrency(total)}</div>
              </div>
              
              <div className="mt-4 flex gap-2">
                <button 
                  type="button" 
                  onClick={() => goBack()} 
                  className="flex-1 py-2.5 rounded-full border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={() => changePage("checkout")} 
                  className="flex-1 py-2.5 rounded-full bg-blue-200 border-2 border-blue-400 text-gray-800 font-semibold hover:bg-blue-300 transition text-sm"
                >
                  Check Out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      
      <BottomNav changePage={changePage} />
    </div>
  );
}