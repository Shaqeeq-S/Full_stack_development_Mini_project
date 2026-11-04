import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import FindDonors from './pages/FindDonors';
import DonorDashboard from './pages/DonorDashboard';
import RecipientDashboard from './pages/RecipientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CreateRequest from './pages/CreateRequest';
import MyRequests from './pages/MyRequests';
import Profile from './pages/Profile';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/find-donors" element={<FindDonors />} />

      {/* Protected Routes */}
      <Route
        path="/donor-dashboard"
        element={<ProtectedRoute allowedRoles={['donor']}><DonorDashboard /></ProtectedRoute>}
      />
      <Route
        path="/recipient-dashboard"
        element={<ProtectedRoute allowedRoles={['recipient']}><RecipientDashboard /></ProtectedRoute>}
      />
      <Route
        path="/admin-dashboard"
        element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>}
      />
      <Route
        path="/create-request"
        element={<ProtectedRoute allowedRoles={['recipient','donor','admin']}><CreateRequest /></ProtectedRoute>}
      />
      <Route
        path="/my-requests"
        element={<ProtectedRoute allowedRoles={['recipient','admin']}><MyRequests /></ProtectedRoute>}
      />
      <Route
        path="/profile"
        element={<ProtectedRoute allowedRoles={['admin','donor','recipient']}><Profile /></ProtectedRoute>}
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
