import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Pages publiques
import HomePage from './pages/HomePage';
import CapturePage from './pages/CapturePage';
import ResultsPage from './pages/ResultsPage';

// Pages administrateur
import AdminDashboard from './pages/admin/AdminDashboard';
import PatternManagement from './pages/admin/PatternManagement';
import StatsPage from './pages/admin/StatsPage';

// Composants d'authentification
import Login from './components/auth/Login';
import PrivateRoute from './components/auth/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<HomePage />} />
          <Route path="/capture" element={<CapturePage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/login" element={<Login />} />
          
          {/* Routes protégées (admin) */}
          <Route path="/admin" element={<PrivateRoute />}>
            <Route path="" element={<AdminDashboard />} />
            <Route path="patterns" element={<PatternManagement />} />
            <Route path="stats" element={<StatsPage />} />
          </Route>
          
          {/* Route par défaut */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;