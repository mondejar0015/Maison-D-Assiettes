import React from "react";

export default function AdminStatsCard({ icon, label, value, color = "blue" }) {
  const colorClasses = {
    blue: "text-blue-500",
    green: "text-green-500",
    purple: "text-purple-500",
    yellow: "text-yellow-500",
    red: "text-red-500"
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={colorClasses[color]}>
          {icon}
        </div>
      </div>
    </div>
  );
}