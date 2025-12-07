import React from "react";

export default function StartingPage({ changePage }) {
  const handleStart = () => {
    changePage("login");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="w-40 h-40 rounded-full border-4 border-blue-400 bg-white shadow-lg flex items-center justify-center mb-8 overflow-hidden">
        <img
          src="/maison logo.svg"
          alt="Maison D'Assiettes"
          className="w-full h-full object-contain"
        />
      </div>

      <h1 className="text-2xl font-bold text-blue-900 mb-2">Maison D'Assiettes</h1>
      <p className="text-gray-600 mb-8 text-sm">Antique Plates Marketplace</p>

      <button
        type="button"
        onClick={handleStart}
        className="px-10 py-3 rounded-full bg-blue-200 border-2 border-blue-400 shadow-md hover:bg-blue-300 transition text-gray-800 font-semibold text-sm"
      >
        Start Exploring
      </button>
      
      <p className="mt-6 text-xs text-gray-500">
        Tap "Start" to begin your antique journey
      </p>
    </div>
  );
}