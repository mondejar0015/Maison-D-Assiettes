import React from "react";

export default function LoadingOverlay({ loading }) {
  if (!loading) return null;
  
  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg shadow-xl flex items-center space-x-3">
        <div className="w-3 h-3 rounded-full animate-spin border-2 border-blue-500 border-t-transparent" />
        <span className="text-sm font-medium">Loading...</span>
      </div>
    </div>
  );
}