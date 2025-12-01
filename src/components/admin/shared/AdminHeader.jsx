import React from "react";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

export default function AdminHeader({ title, subtitle, onLogout }) {
  return (
    <div className="bg-gradient-to-r from-blue-900 to-purple-800 text-white p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle && (
            <p className="text-blue-200 text-sm mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition"
        >
          <ArrowRightOnRectangleIcon className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}