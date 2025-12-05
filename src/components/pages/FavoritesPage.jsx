import React from "react";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { HeartIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import PageHeader from "../shared/PageHeader.jsx";
import BottomNav from "../shared/BottomNav.jsx";
import Img from "../shared/Img.jsx";

export default function FavoritesPage({ 
  items, 
  favorites, 
  favoriteTab, 
  setFavoriteTab, 
  toggleFavorite, 
  addToCart, 
  formatCurrency, 
  goBack,
  changePage
}) {
  const favoriteItems = items.filter(it => favorites.some(f => f.id === it.id));
  
  return (
    <div className="min-h-screen bg-white pb-20">
      <PageHeader title={`Favorites (${favoriteItems.length})`} showBack={true} onBack={goBack} />
      
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-center p-3 border-2 border-gray-200 rounded-xl bg-white shadow-sm">
          <button
            type="button"
            onClick={() => setFavoriteTab("items")}
            className={`flex-1 text-center py-2 text-sm font-semibold rounded-lg transition ${
              favoriteTab === "items" ? "bg-red-50 text-red-600" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Items
          </button>
          <button
            type="button"
            onClick={() => setFavoriteTab("sellers")}
            className={`flex-1 text-center py-2 text-sm font-semibold rounded-lg transition ${
              favoriteTab === "sellers" ? "bg-red-50 text-red-600" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Sellers
          </button>
        </div>

        {favoriteTab === "items" && (
          <div className="grid grid-cols-2 gap-3">
            {favoriteItems.map((it) => (
              <div key={it.id} className="p-3 rounded-xl border-2 border-gray-200 bg-white shadow-sm">
                <div className="w-full h-28 rounded-lg bg-gray-100 flex items-center justify-center mb-3 overflow-hidden border border-gray-200">
                  <Img src={it.img} alt={it.title} />
                </div>
                <div>
                  <div className="font-semibold text-xs text-gray-800 mb-1">
                    {it.title}
                  </div>
                  <div className="text-sm text-gray-700 font-medium mb-2">
                    {formatCurrency(it.price)}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => toggleFavorite(it)}
                      className="flex-1 p-1.5 rounded-lg bg-red-100 hover:bg-red-200 transition"
                    >
                      <HeartSolid className="w-4 h-4 text-red-600 mx-auto" />
                    </button>
                    <button
                      type="button"
                      onClick={() => addToCart(it)}
                      className="flex-1 p-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 transition"
                    >
                      <ShoppingCartIcon className="w-4 h-4 text-blue-600 mx-auto" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {favoriteItems.length === 0 && (
              <div className="col-span-2 text-center text-gray-500 py-6">
                No favorite items yet.
              </div>
            )}
          </div>
        )}
        
        {favoriteTab === "sellers" && (
          <div className="p-6 border-2 border-gray-200 rounded-xl bg-white shadow-sm text-center text-sm text-gray-500">
            Seller favorites feature coming soon.
          </div>
        )}
      </div>
      
      <BottomNav changePage={changePage} />
    </div>
  );
}