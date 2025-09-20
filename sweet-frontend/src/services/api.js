// services/api.js
import axios from "axios";

 export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials : true
});

// attach token for protected routes
api.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ================== Auth ==================
export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);

// ================== Sweets ==================
export const fetchSweets = () => api.get("/sweets");
export const addSweet = (sweet) => api.post("/sweets", sweet);
export const updateSweet = (id, sweet) => api.put(`/sweets/${id}`, sweet);
export const deleteSweet = (id) => api.delete(`/sweets/${id}`);
export const purchaseSweet = (id) => api.post(`/sweets/${id}/purchase`);
export const restockSweet = (id, qty) => api.post(`/sweets/${id}/restock`, { qty });
