import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Composants de mise en page
import Layout from './components/layout/Layout';

// Pages
import HomePage from './pages/HomePage';
import CapturePage from './pages/CapturePage';
import ResultsPage from './pages/ResultsPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';

// Pages Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import PatternManagement from './pages/admin/PatternManagement';
import StatsPage from './pages/admin/StatsPage';

// Composant de route protégée
import PrivateRoute from './components/auth/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Redirection directe vers la page de capture */}
            <Route index element={<Navigate to="/capture" replace />} />
            
            {/* Routes publiques */}
            <Route path="home" element={<HomePage />} />
            <Route path="capture" element={<CapturePage />} />
            <Route path="results" element={<ResultsPage />} />
            <Route path="login" element={<LoginPage />} />
            
            {/* Routes protégées (admin) */}
            <Route path="admin" element={<PrivateRoute requireAdmin={true} />}>
              <Route index element={<AdminDashboard />} />
              <Route path="patterns" element={<PatternManagement />} />
              <Route path="stats" element={<StatsPage />} />
            </Route>
            
            {/* Route 404 */}
            <Route path="404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;