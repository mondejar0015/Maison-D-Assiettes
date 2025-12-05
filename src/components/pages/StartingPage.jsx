import React from "react";

export default function StartingPage({ changePage }) {
  const handleStart = () => {
    changePage("login");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="w-40 h-40 rounded-full border-4 border-blue-400 bg-white shadow-lg flex items-center justify-center mb-8">
        <div className="relative w-24 h-28 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-blue-900 rounded-t-full"
            style={{
              clipPath: "polygon(50% 0%, 100% 0%, 85% 100%, 15% 100%, 0% 0%)",
            }}
          ></div>
          <div className="relative z-10 text-center mt-4">
            <div className="text-yellow-400 text-xs font-bold mb-1">⚜️</div>
            <div className="text-white text-[8px] font-bold leading-tight px-2">
              MAISON
              <br />
              D'ASSIETTES
            </div>
          </div>
        </div>
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