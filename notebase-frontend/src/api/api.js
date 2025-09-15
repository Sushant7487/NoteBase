
// src/api/api.js
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Helper function to attach the auth token to protected requests
export async function authFetch(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = { ...options.headers };

  if (!headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed: ${res.status}`);
  }
  
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// Function for user login
export async function loginUser({ email, password }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Login failed");
  }

  const data = await res.json();
  if (data.token && data.user) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));
  }
  return data;
}

// Function for user registration
export async function registerUser(payload) {
  // **FIX WAS HERE**: Corrected API__URL to API_URL
  const res = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Registration failed");
  }

  const data = await res.json();
  if (data.token && data.user) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));
  }
  return data;
}

// Function to get all tenants
export async function fetchTenants() {
    const res = await fetch(`${API_URL}/tenants`);
    if (!res.ok) throw new Error(`Failed to load tenants (${res.status})`);
    return await res.json();
}