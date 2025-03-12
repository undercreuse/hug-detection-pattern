import axios from 'axios';
import { getAuth } from 'firebase/auth';

// Configuration de l'URL de l'API
const API_URL = process.env.REACT_APP_API_URL || 'https://votre-api-cloud-run.a.run.app';

// Mode développement sans backend
const USE_MOCKS = process.env.REACT_APP_USE_MOCKS === 'true' || !API_URL;

// Créer une instance axios pour les appels API réels
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 secondes timeout
});

// Intercepteur pour ajouter le token d'authentification automatiquement
apiClient.interceptors.request.use(async (config) => {
  if (!USE_MOCKS) {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// ------ DONNÉES SIMULÉES POUR LE DÉVELOPPEMENT ------
const mockPatterns = [
  {
    id: "pattern1",
    name: "Motif Floral",
    description: "Motif avec des éléments floraux complexes sur fond de cuir",
    imagePath: "/images/mock/pattern1.png",
    createdAt: "2025-02-15T09:24:33Z",
    totalRecognitions: 432
  },
  {
    id: "pattern2",
    name: "Motif Géométrique",
    description: "Motif avec des formes géométriques régulières",
    imagePath: "/images/mock/pattern2.png",
    createdAt: "2025-02-20T14:18:07Z",
    totalRecognitions: 287
  },
  {
    id: "pattern3",
    name: "Arabesque Orientale",
    description: "Motif inspiré des arabesques traditionnelles du Moyen-Orient",
    imagePath: "/images/mock/pattern3.png",
    createdAt: "2025-03-01T11:42:19Z", 
    totalRecognitions: 156
  }
];

const mockRecognitionResults = {
  results: [
    {
      pattern_id: "pattern1",
      score: 0.87,
      metadata: {
        name: "Motif Floral",
        description: "Motif avec des éléments floraux complexes sur fond de cuir",
        filename: "floral_pattern.svg"
      },
      matched_variation: "pattern1_var3"
    },
    {
      pattern_id: "pattern2",
      score: 0.42,
      metadata: {
        name: "Motif Géométrique",
        description: "Motif avec des formes géométriques régulières",
        filename: "geometric_pattern.svg"
      },
      matched_variation: "pattern2_var1"
    }
  ]
};

const mockStats = {
  total_embeddings: 287,
  unique_patterns: 12,
  variations: 275,
  recognition_stats: {
    total_recognitions: 1248,
    successful_recognitions: 1152,
    success_rate: 0.92,
    average_confidence: 0.85,
    recognitions_by_day: [
      { date: "2025-03-03", count: 58 },
      { date: "2025-03-04", count: 37 },
      { date: "2025-03-05", count: 45 },
      { date: "2025-03-06", count: 51 },
      { date: "2025-03-07", count: 63 },
      { date: "2025-03-08", count: 49 },
      { date: "2025-03-09", count: 42 }
    ],
    most_recognized_patterns: [
      { pattern_id: "pattern1", name: "Motif Floral", count: 432 },
      { pattern_id: "pattern2", name: "Motif Géométrique", count: 287 },
      { pattern_id: "pattern3", name: "Arabesque Orientale", count: 156 }
    ]
  }
};

// Fonction utilitaire pour simuler un délai réseau
const mockDelay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

// ------ SERVICE DE PATTERNS ------
export const patternService = {
  
  // Rechercher un motif à partir d'une image
  searchPattern: async (imageFile, threshold = 0.1, normalize = true) => {
    if (USE_MOCKS) {
      await mockDelay(1500); // Simuler un délai réseau plus long pour la reconnaissance
      return { data: mockRecognitionResults };
    }
    
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('threshold', threshold.toString());
      formData.append('normalize', normalize.toString());
      
      return await apiClient.post('/api/search-pattern', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
    } catch (error) {
      console.error('Erreur lors de la recherche de motif:', error);
      throw error;
    }
  },
  
  // Récupérer tous les motifs
  getAllPatterns: async () => {
    if (USE_MOCKS) {
      await mockDelay();
      return { data: { patterns: mockPatterns } };
    }
    
    try {
      return await apiClient.get('/api/patterns');
    } catch (error) {
      console.error('Erreur lors de la récupération des motifs:', error);
      throw error;
    }
  },
  
  // Récupérer un motif spécifique par ID
  getPatternById: async (patternId) => {
    if (USE_MOCKS) {
      await mockDelay();
      const pattern = mockPatterns.find(p => p.id === patternId);
      if (!pattern) {
        throw new Error('Motif non trouvé');
      }
      return { data: pattern };
    }
    
    try {
      return await apiClient.get(`/api/patterns/${patternId}`);
    } catch (error) {
      console.error(`Erreur lors de la récupération du motif ${patternId}:`, error);
      throw error;
    }
  },
  
  // Télécharger un nouveau motif SVG
  uploadPattern: async (file, metadata = {}) => {
    if (USE_MOCKS) {
      await mockDelay(2000); // Simuler un traitement plus long
      const newId = `pattern${mockPatterns.length + 1}`;
      return { 
        data: {
          pattern_id: newId,
          total_embeddings: 15,
          metadata: {
            name: metadata.name || file.name,
            description: metadata.description || "",
            filename: file.name
          }
        }
      };
    }
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      if (metadata.name) {
        formData.append('name', metadata.name);
      }
      
      if (metadata.description) {
        formData.append('description', metadata.description);
      }
      
      return await apiClient.post('/api/patterns', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
    } catch (error) {
      console.error('Erreur lors de l\'upload du motif:', error);
      throw error;
    }
  },
  
  // Supprimer un motif
  deletePattern: async (patternId) => {
    if (USE_MOCKS) {
      await mockDelay();
      return { 
        data: { 
          message: `Motif ${patternId} supprimé avec succès` 
        } 
      };
    }
    
    try {
      return await apiClient.delete(`/api/patterns/${patternId}`);
    } catch (error) {
      console.error(`Erreur lors de la suppression du motif ${patternId}:`, error);
      throw error;
    }
  },
  
  // Récupérer les statistiques
  getStats: async (period = 'month') => {
    if (USE_MOCKS) {
      await mockDelay();
      return { data: mockStats };
    }
    
    try {
      return await apiClient.get(`/api/stats?period=${period}`);
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  },
  
  // Tester la reconnaissance (pour l'admin)
  testRecognition: async (patternId, testImage) => {
    if (USE_MOCKS) {
      await mockDelay(1500);
      return { 
        data: {
          success: true,
          score: 0.89,
          variations_detected: 3
        } 
      };
    }
    
    try {
      const formData = new FormData();
      formData.append('file', testImage);
      formData.append('pattern_id', patternId);
      
      return await apiClient.post('/api/test-recognition', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
    } catch (error) {
      console.error('Erreur lors du test de reconnaissance:', error);
      throw error;
    }
  }
};

// Export de l'instance axios pour d'autres utilisations si nécessaire
export default apiClient;