import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { patternService } from '../../services/api';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  
  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await patternService.getStats();
        setStats(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord administrateur</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-semibold mb-4">Bienvenue, {currentUser.displayName || 'Administrateur'}</h2>
        <p className="text-gray-600 mb-4">
          Gérez les motifs de référence et consultez les statistiques d'utilisation du système de reconnaissance visuelle.
        </p>
      </div>
      
      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-3xl font-bold text-primary mb-2">{stats?.unique_patterns || 0}</div>
          <div className="text-gray-600">Motifs de référence</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-3xl font-bold text-primary mb-2">{stats?.total_embeddings || 0}</div>
          <div className="text-gray-600">Embeddings vectoriels</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-3xl font-bold text-primary mb-2">
            {stats?.recognition_stats?.total_recognitions || 0}
          </div>
          <div className="text-gray-600">Reconnaissances totales</div>
        </div>
      </div>
      
      {/* Accès rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/admin/patterns" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-2">Gestion des motifs</h3>
          <p className="text-gray-600 mb-4">
            Ajoutez, modifiez ou supprimez des motifs de référence pour la reconnaissance.
          </p>
          <div className="text-primary font-medium">Accéder →</div>
        </Link>
        
        <Link to="/admin/stats" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-2">Statistiques d'utilisation</h3>
          <p className="text-gray-600 mb-4">
            Consultez les statistiques détaillées d'utilisation et les taux de reconnaissance.
          </p>
          <div className="text-primary font-medium">Accéder →</div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;