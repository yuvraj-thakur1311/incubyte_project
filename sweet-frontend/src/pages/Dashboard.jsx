// src/pages/Dashboard.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import {UserDashboard} from "./UserDashboard"
import {AdminDashboard} from "./AdminDashboard"

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';
  
  return isAdmin ? <AdminDashboard /> : <UserDashboard />;
};

export default Dashboard;