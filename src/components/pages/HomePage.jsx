import React, { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { HeartIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import PageHeader from "../shared/PageHeader.jsx";
import BottomNav from "../shared/BottomNav.jsx";
import Img from "../shared/Img.jsx";

export default function HomePage({ 
  items, 
  loadingItems, 
  cart, 
  favorites, 
  formatCurrency, 
  changePage, 
  toggleFavorite, 
  addToCart 
}) {
  const [searchTerm, setSearchTerm] = useState("");
  
  if (loadingItems) {
    return (
      <div className="min-h-screen bg-white">
        <PageHeader title="Home" showCart={true} changePage={changePage} cart={cart} />
        <div className="p-4 text-center text-sm text-gray-500">
          Loading items...
        </div>
      </div>
    );
  }
  
  const displayedItems = items.filter(it => 
    it.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const arrivals = displayedItems.slice(0, 4);

  return (
    <div className="min-h-screen bg-white pb-20">
      <PageHeader title="Maison D' Assiettes" showCart={true} changePage={changePage} cart={cart} />
      
      <div className="p-4 space-y-5">
        {/* Search Bar */}
        <div className="relative">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-full pl-4 pr-10 py-2 text-sm placeholder-gray-400 focus:outline-none focus:border-blue-400 bg-gray-50"
            placeholder="Search..."
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative w-full h-40 bg-blue-100 rounded-xl overflow-hidden shadow-lg border-2 border-blue-300">
          <div className="p-4 absolute inset-0 flex flex-col justify-end">
            <div className="text-xl font-bold text-blue-900 leading-tight">
              Discover the <br />
              Lost Treasures
            </div>
            <p className="text-xs text-blue-700 mt-1">
              Unique antiques, just for you.
            </p>
            <button
              type="button"
              onClick={() => changePage("categories")}
              className="mt-3 w-fit px-4 py-1.5 rounded-full bg-blue-900 text-white text-xs font-semibold hover:bg-blue-800 transition"
            >
              Explore
            </button>
          </div>
          <div className="absolute right-0 top-0 w-28 h-28 bg-blue-400 rounded-bl-full"></div>
          <div className="absolute right-0 bottom-0 w-28 h-28 bg-blue-200 rounded-tl-full opacity-50"></div>
        </div>

        {/* Featured */}
        {displayedItems.length > 0 && (
          <div>
            <div className="font-bold text-gray-800 mb-3 text-base">Featured</div>
            <div className="p-3 rounded-xl border-2 border-gray-200 bg-white shadow-sm flex items-center gap-3">
              <div className="w-24 h-24 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
                <Img src={displayedItems[0].img} alt={displayedItems[0].title} />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm text-gray-800">{displayedItems[0].title}</div>
                <div className="text-lg font-bold text-gray-900 mt-1">{formatCurrency(displayedItems[0].price)}</div>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => toggleFavorite(displayedItems[0])}>
                  {favorites.find((f) => f.id === displayedItems[0].id) ?
                    <HeartSolid className="w-5 h-5 text-red-500" /> : <HeartIcon className="w-5 h-5 text-gray-400" />}
                </button>
                <button onClick={() => addToCart(displayedItems[0])}>
                  <ShoppingCartIcon className="w-5 h-5 text-blue-600" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* New Arrivals */}
        <div>
          <div className="font-bold text-gray-800 mb-3 text-base">New Arrivals</div>
          <div className="grid grid-cols-2 gap-3">
            {arrivals.length === 0 ? (
              <div className="col-span-2 text-center text-gray-500">No new arrivals</div>
            ) : (
              arrivals.map((it) => (
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
                        className="flex-1 p-1.5 hover:bg-gray-100 rounded-lg transition"
                      >
                        {favorites.find((f) => f.id === it.id) ?
                          <HeartSolid className="w-4 h-4 text-red-500 mx-auto" /> 
                          : <HeartIcon className="w-4 h-4 text-gray-400 mx-auto" />}
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
              ))
            )}
          </div>
        </div>
      </div>
      
      <BottomNav changePage={changePage} />
    </div>
  );
}