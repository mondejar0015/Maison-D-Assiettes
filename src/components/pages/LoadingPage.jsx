import React, { useEffect, useState } from "react";

export default function LoadingPage() {
  const [showReload, setShowReload] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowReload(true);
      console.log("⚠️ Loading taking too long - showing reload button");
    }, 5000); // 5 seconds
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="w-40 h-40 rounded-full border-4 border-blue-400 bg-white shadow-lg flex items-center justify-center mb-6">
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

      <h2 className="text-lg font-semibold text-blue-900 mb-4">Loading...</h2>
      
      <div className="flex items-center gap-1 mb-8">
        <div className="w-3 h-3 rounded-full animate-bounce bg-blue-400" />
        <div
          className="w-3 h-3 rounded-full animate-bounce bg-teal-400"
          style={{ animationDelay: "0.1s" }}
        />
        <div
          className="w-3 h-3 rounded-full animate-bounce bg-blue-300"
          style={{ animationDelay: "0.2s" }}
        />
      </div>
      
      <p className="text-sm text-gray-600 mb-2">Preparing your antique experience</p>
      <p className="text-xs text-gray-500">This will only take a moment</p>
      
      {showReload && (
        <button
          onClick={() => window.location.reload()}
          className="mt-8 px-4 py-2 rounded-full bg-blue-100 border border-blue-300 text-blue-700 font-medium hover:bg-blue-200 transition text-sm"
        >
          Taking too long? Tap to reload
        </button>
      )}
    </div>
  );
}