import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

          {/* Bouton menu mobile */}
          <button 
            className="md:hidden text-gray-700 focus:outline-none" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center space-x-6">
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

        {/* Menu mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 py-3 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="text-gray-700 hover:text-primary py-1" onClick={() => setMobileMenuOpen(false)}>Accueil</Link>
              <Link to="/capture" className="text-gray-700 hover:text-primary py-1" onClick={() => setMobileMenuOpen(false)}>Capture</Link>
              <Link to="/home" className="text-gray-700 hover:text-primary py-1" onClick={() => setMobileMenuOpen(false)}>À propos</Link>
              
              {currentUser && isAdmin() && (
                <>
                  <div className="font-medium text-gray-700 py-1">Administration</div>
                  <Link to="/admin" className="text-gray-700 hover:text-primary py-1 pl-2" onClick={() => setMobileMenuOpen(false)}>Tableau de bord</Link>
                  <Link to="/admin/patterns" className="text-gray-700 hover:text-primary py-1 pl-2" onClick={() => setMobileMenuOpen(false)}>Gestion des motifs</Link>
                  <Link to="/admin/stats" className="text-gray-700 hover:text-primary py-1 pl-2" onClick={() => setMobileMenuOpen(false)}>Statistiques</Link>
                </>
              )}
              
              {currentUser ? (
                <div className="flex flex-col space-y-2">
                  <span className="text-sm text-gray-600">{currentUser.displayName || currentUser.email}</span>
                  <button onClick={() => {handleLogout(); setMobileMenuOpen(false);}} className="text-gray-700 hover:text-primary text-left">
                    Déconnexion
                  </button>
                </div>
              ) : (
                <Link to="/login" className="text-gray-700 hover:text-primary py-1" onClick={() => setMobileMenuOpen(false)}>Connexion</Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
