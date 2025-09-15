
// src/pages/Users.jsx
import React, { useEffect, useState, useCallback } from "react";
import { authFetch, fetchTenants } from "../api/api";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const usersData = await authFetch("/users");
      const tenantsData = await fetchTenants();
      setUsers(Array.isArray(usersData) ? usersData : []);
      setTenants(Array.isArray(tenantsData) ? tenantsData : []);
    } catch (e) {
      setErr(e.message || "Failed to load data.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);
  
  // Note: The assignment does not require an "invite user" feature on the frontend,
  // but this page lists all users as a demonstration for the admin.
  // The seeder script creates all the necessary users.

  return (
    <div className="container p-4 mx-auto md:p-6">
      <h2 className="mb-6 text-3xl font-bold text-gray-800">User Management (Admin)</h2>
      
      {err && <div className="p-3 mb-4 text-red-800 bg-red-100 border border-red-300 rounded-md">{err}</div>}
      
      <section className="p-6 bg-white border rounded-lg shadow-sm">
        <h4 className="mb-4 text-xl font-semibold text-gray-700">All System Users</h4>
        {loading ? (
          <div>Loading users...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left table-auto">
              <thead className="text-xs font-semibold text-gray-600 uppercase bg-gray-100">
                <tr>
                  <th className="px-4 py-3">Full Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Tenant</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-200">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{u.fullName}</td>
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3 capitalize">{u.userType}</td>
                    <td className="px-4 py-3">{tenants.find(t => t._id === u.tenant)?.name || 'Unknown'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}