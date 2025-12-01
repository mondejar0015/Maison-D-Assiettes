import React, { useState } from "react";
import { supabase } from "../../supabaseClient.js";
import PageHeader from "../shared/PageHeader.jsx";
import BottomNav from "../shared/BottomNav.jsx";

export default function SecurityPage({ goBack, loading }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  async function handleUpdatePassword() {
    if (!newPassword || newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    
    const { data, error } = await supabase.auth.updateUser({ 
      password: newPassword 
    });
    
    if (error) {
      console.error("Update password error", error);
      alert(error.message || "Failed to update password.");
    } else {
      alert("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      goBack();
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="Security" showBack={true} onBack={goBack} />
      
      <div className="p-4 pb-20">
        <div className="border-2 border-gray-200 rounded-xl p-4 bg-white shadow-sm space-y-3">
          <div className="font-bold text-gray-800 mb-2 text-sm">Change Password</div>
          
          <input
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-400 text-sm"
            placeholder="Current Password (Optional)"
            type="password"
          />
          <input
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-400 text-sm"
            placeholder="New Password"
            type="password"
          />
          <input
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-400 text-sm"
            placeholder="Confirm New Password"
            type="password"
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
              onClick={handleUpdatePassword}
              disabled={loading}
              className="flex-1 py-2.5 rounded-full bg-yellow-100 border-2 border-yellow-400 text-gray-800 font-semibold hover:bg-yellow-200 transition text-sm"
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