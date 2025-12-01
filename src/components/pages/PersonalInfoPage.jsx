import React, { useState } from "react";
import { supabase } from "../../supabaseClient.js";
import PageHeader from "../shared/PageHeader.jsx";
import BottomNav from "../shared/BottomNav.jsx";
import Img from "../shared/Img.jsx";

export default function PersonalInfoPage({ profile, goBack, loading }) {
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const email = profile?.email || "";

  async function handleUpdateProfile() {
    if (!profile) return;
    
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName })
      .eq("id", profile.id);
    
    if (error) {
      console.error("Update profile error", error);
      alert("Failed to update profile.");
    } else {
      alert("Profile updated!");
      goBack();
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="Personal Information" showBack={true} onBack={goBack} />
      
      <div className="p-4 pb-20">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-400 to-pink-500 mx-auto flex items-center justify-center overflow-hidden mb-6 shadow-md border-4 border-white ring-2 ring-gray-200">
          {profile?.avatar ? <Img src={profile.avatar} /> : <div className="text-4xl">👤</div>}
        </div>
        
        <div className="space-y-3">
          <input
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-400 text-sm"
            placeholder="Full Name"
          />
          <input
            value={email}
            disabled
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-400 text-sm bg-gray-100"
            placeholder="Email"
          />
          <input
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-400 text-sm"
            placeholder="Phone Number"
          />
          <input
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-400 text-sm"
            placeholder="Address"
          />
          
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={goBack}
              disabled={loading}
              className="flex-1 py-2.5 rounded-full border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpdateProfile}
              disabled={loading}
              className="flex-1 py-2.5 rounded-full bg-blue-200 border-2 border-blue-400 text-gray-800 font-semibold hover:bg-blue-300 transition text-sm"
            >
              {loading ? "Saving..." : "Confirm"}
            </button>
          </div>
        </div>
      </div>
      
      <BottomNav changePage={() => {}} />
    </div>
  );
}