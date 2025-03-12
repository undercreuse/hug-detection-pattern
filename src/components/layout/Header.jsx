import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
    }
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo et titre */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">Reconnaissance Visuelle</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary">
              Accueil
            </Link>
            <Link to="/capture" className="text-gray-700 hover:text-primary">
             Capture
            </Link>
<Link to="/home" className="text-gray-700 hover:text-primary">
  À propos
</Link>
            
            {/* Afficher les liens admin si l'utilisateur est admin */}
            {currentUser && isAdmin() && (
              <div className="relative group">
                <button className="text-gray-700 hover:text-primary">
                  Administration ▾
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <Link to="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Tableau de bord
                  </Link>
                  <Link to="/admin/patterns" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Gestion des motifs
                  </Link>
                  <Link to="/admin/stats" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Statistiques
                  </Link>
                </div>
              </div>
            )}

            {/* Connexion / Déconnexion */}
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {currentUser.displayName || currentUser.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-primary"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-gray-700 hover:text-primary">
                Connexion
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;