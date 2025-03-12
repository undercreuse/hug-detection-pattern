import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PrivateRoute = ({ requireAdmin = false }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Rediriger vers la page de connexion si non connecté
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  // Vérifier si l'utilisateur est admin (si requis)
  if (requireAdmin && !currentUser.isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  // Afficher la route protégée
  return <Outlet />;
};

export default PrivateRoute;