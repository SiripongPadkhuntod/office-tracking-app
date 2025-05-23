// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/react"; 

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/auth/Profile';
import EquipmentList from './pages/equipment/EquipmentList';
import UserList from './pages/users/UserList';

function App() {
  return (
    <Router>
     
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes - require authentication */}
          <Route element={<Layout />}>
            <Route path="/equipment" element={
              <ProtectedRoute>
                <EquipmentList />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            <Route path="/users" element={
              <ProtectedRoute>
                <UserList />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </AuthProvider>
      <Analytics />
      <SpeedInsights />
    </Router>
  );
}

export default App;