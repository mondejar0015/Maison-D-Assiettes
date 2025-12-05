import React from "react";
import { ChevronLeftIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";

export default function PageHeader({ 
  title, 
  showCart = false, 
  showBack = false, 
  onBack, 
  changePage = () => {}, 
  cart = [] 
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-2">
        {showBack && (
          <button type="button" onClick={onBack} className="p-1">
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
        )}
        <span className="text-sm font-semibold text-gray-800">{title}</span>
      </div>
      
      {showCart && (
        <button type="button" onClick={() => changePage("cart")} className="p-1 relative">
          <ShoppingCartIcon className="w-5 h-5 text-gray-600" />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </button>
      )}
    </div>
  );
}