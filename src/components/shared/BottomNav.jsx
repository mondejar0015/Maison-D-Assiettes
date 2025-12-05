import React from "react";
import { HomeIcon, Squares2X2Icon, ClockIcon, UserIcon } from "@heroicons/react/24/outline";

export default function BottomNav({ changePage = () => {} }) {
  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 w-11/12 max-w-sm bg-white/90 backdrop-blur-sm shadow-lg rounded-full py-2 px-4 flex justify-around items-center z-40 border border-gray-200">
      <button
        type="button"
        onClick={() => changePage("home")}
        className="flex flex-col items-center text-xs text-gray-600 hover:text-blue-600 transition p-2"
      >
        <HomeIcon className="w-6 h-6" />
        <span className="text-xs mt-1">Home</span>
      </button>
      <button
        type="button"
        onClick={() => changePage("categories")}
        className="flex flex-col items-center text-xs text-gray-600 hover:text-blue-600 transition p-2"
      >
        <Squares2X2Icon className="w-6 h-6" />
        <span className="text-xs mt-1">Categories</span>
      </button>
      <button
        type="button"
        onClick={() => changePage("history")}
        className="flex flex-col items-center text-xs text-gray-600 hover:text-blue-600 transition p-2"
      >
        <ClockIcon className="w-6 h-6" />
        <span className="text-xs mt-1">History</span>
      </button>
      <button
        type="button"
        onClick={() => changePage("profile")}
        className="flex flex-col items-center text-xs text-gray-600 hover:text-blue-600 transition p-2"
      >
        <UserIcon className="w-6 h-6" />
        <span className="text-xs mt-1">Profile</span>
      </button>
    </div>
  );
}