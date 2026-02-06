import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VehiclesPage from './pages/VehiclesPage';
import VehicleDetailsPage from './pages/VehicleDetailsPage';
import MyReservationsPage from './pages/MyReservationsPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import ComplaintsPage from './pages/ComplaintsPage';
import StaffComplaintsPage from './pages/StaffComplaintsPage';
import UserManagementPage from './pages/UserManagementPage';
import SystemSettingsPage from './pages/SystemSettingsPage';
import ActivityLogsPage from './pages/ActivityLogsPage';
import StaffReservationsPage from './pages/StaffReservationsPage';
import VehicleManagementPage from './pages/VehicleManagementPage';
import DocumentVerificationPage from './pages/DocumentVerificationPage';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Axios Interceptor for 401 Unauthenticated
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} onLogout={handleLogout} />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/vozila" element={<VehiclesPage />} />
            <Route path="/vozila/:id" element={<VehicleDetailsPage />} />

            {/* Protected Routes */}
            <Route path="/rezervacije" element={
              <ProtectedRoute allowedRoles={['KLIJENT', 'SLUZBENIK', 'ADMINISTRATOR']}>
                <MyReservationsPage />
              </ProtectedRoute>
            } />
            <Route path="/profil" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/podrska" element={
              <ProtectedRoute allowedRoles={['KLIJENT']}>
                <ComplaintsPage />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['ADMINISTRATOR']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/upravljanje" element={
              <ProtectedRoute allowedRoles={['SLUZBENIK', 'ADMINISTRATOR']}>
                <StaffReservationsPage />
              </ProtectedRoute>
            } />
            <Route path="/upravljanje-vozilima" element={
              <ProtectedRoute allowedRoles={['SLUZBENIK', 'ADMINISTRATOR']}>
                <VehicleManagementPage />
              </ProtectedRoute>
            } />
            <Route path="/upravljanje-podrskom" element={
              <ProtectedRoute allowedRoles={['SLUZBENIK', 'ADMINISTRATOR']}>
                <StaffComplaintsPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/korisnici" element={
              <ProtectedRoute allowedRoles={['ADMINISTRATOR']}>
                <UserManagementPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/podesavanja" element={
              <ProtectedRoute allowedRoles={['ADMINISTRATOR']}>
                <SystemSettingsPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/logovi" element={
              <ProtectedRoute allowedRoles={['ADMINISTRATOR']}>
                <ActivityLogsPage />
              </ProtectedRoute>
            } />
            <Route path="/dokumenti" element={
              <ProtectedRoute allowedRoles={['SLUZBENIK', 'ADMINISTRATOR']}>
                <DocumentVerificationPage />
              </ProtectedRoute>
            } />

            {/* Redirect any other route to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="bg-white border-t border-gray-100 py-10 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-center md:text-left">
              <div>
                <p className="text-sm font-black text-gray-900 uppercase tracking-widest">Fakultet organizacionih nauka</p>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Katedra za elektronsko poslovanje</p>
              </div>
              <div className="text-xs text-gray-400 font-medium">
                <p>Marko Marin 2020/0328 • Luka Ćosić 2020/0123</p>
                <p>© 2026 Projekt iz ITEH-a. Sva prava zadržana.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
