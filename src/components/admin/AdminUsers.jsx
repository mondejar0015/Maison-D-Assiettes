import React, { useEffect, useState } from "react";
import {
  UserIcon,
  EnvelopeIcon,
  CalendarIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";
import AdminHeader from "./shared/AdminHeader.jsx";
import AdminStatsCard from "./shared/AdminStatsCard.jsx";

export default function AdminUsers({
  fetchAllUsers,
  updateUserRole,
  goBack,
  loading,
  changePage
}) {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const allUsers = await fetchAllUsers();
    setUsers(allUsers);
  }

  const filteredUsers = users.filter(user =>
    user.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isAdminEmail = (email) => {
    const adminEmails = ["admin@maison.com", "administrator@maison.com"];
    return adminEmails.includes(email?.toLowerCase());
  };

  const handleRoleUpdate = async (userId, newRole) => {
    if (newRole === "admin") {
      if (!confirm("Grant admin privileges to this user? This will give them full access to the admin panel.")) {
        return;
      }
    }
    
    await updateUserRole(userId, newRole);
    loadUsers(); // Refresh users
  };

  const stats = {
    total: users.length,
    admins: users.filter(u => isAdminEmail(u.email)).length,
    customers: users.filter(u => !isAdminEmail(u.email)).length,
    today: users.filter(u => {
      const today = new Date();
      const userDate = new Date(u.created_at);
      return userDate.toDateString() === today.toDateString();
    }).length
  };

  return (
    <div className="min-h-screen bg-white">
      <AdminHeader 
        title="User Management"
        subtitle="View and manage user accounts"
        onLogout={() => changePage("login")}
      />

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <AdminStatsCard
            icon={<UserIcon className="w-8 h-8 text-blue-500" />}
            label="Total Users"
            value={stats.total}
            color="blue"
          />
          
          <AdminStatsCard
            icon={<ShieldCheckIcon className="w-8 h-8 text-purple-500" />}
            label="Admins"
            value={stats.admins}
            color="purple"
          />
          
          <AdminStatsCard
            icon={<UserIcon className="w-8 h-8 text-green-500" />}
            label="Customers"
            value={stats.customers}
            color="green"
          />
          
          <AdminStatsCard
            icon={<CalendarIcon className="w-8 h-8 text-yellow-500" />}
            label="Today"
            value={stats.today}
            color="yellow"
          />
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-blue-400"
            placeholder="Search users by name or email..."
          />
          <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Users List */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-800">
                Users ({filteredUsers.length})
              </h3>
              <button
                onClick={loadUsers}
                disabled={loading}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 text-sm"
              >
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <div key={user.id} className="p-6 hover:bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                      {user.display_name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-800">
                          {user.display_name || "Unnamed User"}
                        </h4>
                        {isAdminEmail(user.email) && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium flex items-center gap-1">
                            <ShieldCheckIcon className="w-3 h-3" />
                            Super Admin
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <EnvelopeIcon className="w-4 h-4" />
                        {user.email || "No email"}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CalendarIcon className="w-4 h-4" />
                        Joined {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {/* Current Role */}
                    <div className={`px-3 py-1 rounded-full text-xs font-medium text-center ${
                      isAdminEmail(user.email)
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {isAdminEmail(user.email) ? "Super Admin" : "Customer"}
                    </div>

                    {/* Role Actions (only for non-super-admin users) */}
                    {!isAdminEmail(user.email) && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRoleUpdate(user.id, "admin")}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        >
                          Make Admin
                        </button>
                        <button
                          onClick={() => handleRoleUpdate(user.id, "customer")}
                          className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                        >
                          Make Customer
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-2">👥</div>
                <p className="text-gray-500">
                  {searchTerm ? "No users match your search" : "No users found"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}