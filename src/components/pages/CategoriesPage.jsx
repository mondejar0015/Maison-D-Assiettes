import React, { useState } from "react";
import { FunnelIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { HeartIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { ITEM_TYPES, ITEM_ORIGINS, ITEM_ERAS, ITEM_MATERIALS } from "../../App.jsx";
import PageHeader from "../shared/PageHeader.jsx";
import BottomNav from "../shared/BottomNav.jsx";
import Img from "../shared/Img.jsx";

export default function CategoriesPage({ 
  items, 
  favorites, 
  formatCurrency, 
  toggleFavorite, 
  addToCart 
}) {
  const [filterType, setFilterType] = useState("all");
  const [filterOrigin, setFilterOrigin] = useState("all");
  const [filterEra, setFilterEra] = useState("all");
  const [filterMaterial, setFilterMaterial] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  
  // Filter & Sort Logic
  const filtered = items.filter(it => {
    let matches = true;
    if (filterType !== "all" && it.type !== filterType) matches = false;
    if (filterOrigin !== "all" && it.origin !== filterOrigin) matches = false;
    if (filterEra !== "all" && it.era !== Number(filterEra)) matches = false;
    if (filterMaterial !== "all" && it.material !== filterMaterial) matches = false;
    return matches;
  }).sort((a, b) => {
    if (sortOrder === "price_asc") return a.price - b.price;
    if (sortOrder === "price_desc") return b.price - a.price;
    return b.id - a.id;
  });
  
  const clearFilters = () => {
    setFilterType("all");
    setFilterOrigin("all");
    setFilterEra("all");
    setFilterMaterial("all");
    setSortOrder("newest");
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <PageHeader title="Categories" showCart={true} />
      
      <div className="p-4 space-y-4">
        <div className="border-2 border-gray-200 rounded-xl p-4 bg-white shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <div className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <FunnelIcon className="w-4 h-4" /> Filters
            </div>
            {(filterType !== "all" || filterOrigin !== "all" || filterEra !== "all" || filterMaterial !== "all" || sortOrder !== "newest") && (
              <button 
                onClick={clearFilters} 
                className="text-xs text-red-500 font-medium hover:text-red-700 flex items-center gap-1"
              >
                <ArrowPathIcon className="w-3 h-3" /> Reset
              </button>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-blue-400 bg-white"
              >
                <option value="all">Type: All</option>
                {ITEM_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <select
                value={filterOrigin}
                onChange={(e) => setFilterOrigin(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-blue-400 bg-white"
              >
                <option value="all">Origin: All</option>
                {ITEM_ORIGINS.map((origin) => (
                  <option key={origin} value={origin}>{origin}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <select
                value={filterEra}
                onChange={(e) => setFilterEra(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-blue-400 bg-white"
              >
                <option value="all">Era: All</option>
                {ITEM_ERAS.map((era) => (
                  <option key={era} value={era}>{era}</option>
                ))}
              </select>
              <select
                value={filterMaterial}
                onChange={(e) => setFilterMaterial(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-blue-400 bg-white"
              >
                <option value="all">Material: All</option>
                {ITEM_MATERIALS.map((mat) => (
                  <option key={mat} value={mat}>{mat}</option>
                ))}
              </select>
            </div>
            
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-blue-400 bg-white"
            >
              <option value="newest">Sort: Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="font-bold text-gray-800 mb-3 text-base flex justify-between items-center">
          <span>{filtered.length} Items Found</span>
          <span className="text-xs text-gray-500 font-normal">
            {sortOrder === 'newest' ? 'Latest' : sortOrder === 'price_asc' ? 'Cheapest' : 'Most Expensive'}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((it) => (
            <div key={it.id} className="p-3 rounded-xl border-2 border-gray-200 bg-white shadow-sm">
              <div className="h-28 rounded-lg bg-gray-100 mb-3 flex items-center justify-center overflow-hidden border border-gray-200">
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
                      : <HeartIcon className="w-4 h-4 text-gray-400 mx-auto" />
                    }
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
          
          {filtered.length === 0 && (
            <div className="col-span-2 text-center text-gray-500 py-6">
              No items match your filters.
            </div>
          )}
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}