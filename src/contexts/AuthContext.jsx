import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Créer le contexte d'authentification
const AuthContext = createContext();

// Utilisateurs mock pour les tests
const MOCK_USERS = [
  {
    uid: 'admin-123',
    email: 'admin@example.com',
    password: 'admin123',
    displayName: 'Administrateur',
    photoURL: null,
    isAdmin: true,
    createdAt: '2025-01-15T10:30:00Z'
  },
  {
    uid: 'user-456',
    email: 'user@example.com',
    password: 'user123',
    displayName: 'Utilisateur Test',
    photoURL: null,
    isAdmin: false,
    createdAt: '2025-02-20T14:45:00Z'
  }
];

// La clé utilisée pour stocker l'utilisateur dans localStorage
const STORAGE_KEY = 'auth_mock_user';

// Hook personnalisé pour utiliser le contexte
export function useAuth() {
  return useContext(AuthContext);
}

// Fournisseur d'authentification
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Effet pour charger l'utilisateur depuis le stockage local au démarrage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY);
      if (savedUser) {
        const user = JSON.parse(savedUser);
        // Ne pas inclure le mot de passe dans l'utilisateur courant
        const { password, ...safeUser } = user;
        setCurrentUser(safeUser);
      }
    } catch (err) {
      console.error('Erreur lors du chargement de l\'utilisateur:', err);
    } finally {
      // Simuler un court délai de chargement pour que ça semble réaliste
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, []);

  // Effet pour sauvegarder l'utilisateur dans le stockage local quand il change
  useEffect(() => {
    if (currentUser) {
      const { password, ...safeUser } = currentUser;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [currentUser]);

  // Fonction de connexion simulée
  const login = async (email, password) => {
    try {
      setError(null);
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Rechercher l'utilisateur dans notre base simulée
      const user = MOCK_USERS.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.password === password
      );
      
      if (user) {
        // Ne pas inclure le mot de passe dans l'utilisateur courant
        const { password, ...safeUser } = user;
        setCurrentUser(safeUser);
        return safeUser;
      } else {
        throw new Error('Identifiants incorrects');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Fonction de déconnexion simulée
  const logout = async () => {
    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 300));
      setCurrentUser(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Fonction d'inscription simulée
  const signup = async (email, password, displayName) => {
    try {
      setError(null);
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Vérifier si l'email existe déjà
      if (MOCK_USERS.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('Cet email est déjà utilisé');
      }
      
      // Créer un nouvel utilisateur (uniquement en mémoire pour la session)
      const newUser = {
        uid: `user-${Date.now().toString(36)}`,
        email,
        password,
        displayName,
        photoURL: null,
        isAdmin: false,
        createdAt: new Date().toISOString()
      };
      
      // Ajouter l'utilisateur à notre liste (seulement pour cette session)
      MOCK_USERS.push(newUser);
      
      // Ne pas inclure le mot de passe dans l'utilisateur courant
      const { password: pwd, ...safeUser } = newUser;
      setCurrentUser(safeUser);
      return safeUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Fonction de mise à jour du profil simulée
  const updateProfile = async (updates) => {
    try {
      setError(null);
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (!currentUser) {
        throw new Error('Aucun utilisateur connecté');
      }
      
      // Mettre à jour l'utilisateur dans notre liste
      const userIndex = MOCK_USERS.findIndex(u => u.uid === currentUser.uid);
      if (userIndex >= 0) {
        MOCK_USERS[userIndex] = {
          ...MOCK_USERS[userIndex],
          ...updates
        };
      }
      
      // Mettre à jour l'utilisateur courant
      setCurrentUser({
        ...currentUser,
        ...updates
      });
      
      return currentUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Fonction de récupération de mot de passe simulée
  const resetPassword = async (email) => {
    try {
      setError(null);
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Vérifier si l'email existe
      const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        throw new Error('Aucun compte avec cet email');
      }
      
      // Simuler l'envoi d'un email de réinitialisation
      console.log(`[MOCK] Email de réinitialisation envoyé à ${email}`);
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Fonction pour obtenir un token d'authentification simulé
  const getIdToken = async () => {
    if (!currentUser) {
      throw new Error('Aucun utilisateur connecté');
    }
    
    // Créer un token factice pour les tests
    return `mock-auth-token-${currentUser.uid}-${Date.now()}`;
  };

  // Vérifier si l'utilisateur est administrateur
  const isAdmin = () => {
    return currentUser?.isAdmin === true;
  };

  // Valeur du contexte
  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    signup,
    updateProfile,
    resetPassword,
    getIdToken,
    isAdmin
  };

  // Rendre le contexte d'authentification
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Composant de route protégée (à utiliser avec react-router-dom v6)
export function RequireAuth({ children, requireAdmin = false }) {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        // Rediriger vers la page de connexion si non connecté
        navigate('/login', { state: { from: location } });
      } else if (requireAdmin && !currentUser.isAdmin) {
        // Rediriger vers la page d'accueil si l'admin est requis mais l'utilisateur n'est pas admin
        navigate('/');
      }
    }
  }, [currentUser, loading, requireAdmin, navigate, location]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  if (requireAdmin && !currentUser.isAdmin) {
    return null;
  }

  return children;
}

// Composant "wrapper" pour les routes privées
// Exemple d'utilisation:
// <Route path="/admin" element={<PrivateRoute requireAdmin={true}><AdminPage /></PrivateRoute>} />
export function PrivateRoute({ children, requireAdmin = false }) {
  return <RequireAuth requireAdmin={requireAdmin}>{children}</RequireAuth>;
}

export default AuthContext;