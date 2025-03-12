import React, { useState, useEffect } from 'react';
import { patternService } from '../../services/api';
import { FaPlus, FaTrash, FaUpload, FaSpinner, FaImage } from 'react-icons/fa';

const PatternManagement = () => {
  const [patterns, setPatterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadData, setUploadData] = useState({ name: '', description: '' });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [overlayFile, setOverlayFile] = useState(null);
  const [uploadingOverlay, setUploadingOverlay] = useState(false);
  
  // Charger les motifs
  useEffect(() => {
    const fetchPatterns = async () => {
      try {
        setLoading(true);
        const response = await patternService.getAllPatterns();
        setPatterns(response.data.patterns || []);
      } catch (error) {
        console.error('Erreur lors du chargement des motifs:', error);
        setError('Erreur lors du chargement des motifs');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatterns();
  }, []);
  
  // Gérer l'upload d'un nouveau motif
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      // Utiliser le nom du fichier comme nom par défaut
      setUploadData({
        ...uploadData,
        name: uploadData.name || file.name.replace(/\.[^/.]+$/, '') // Enlever l'extension
      });
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUploadData({ ...uploadData, [name]: value });
  };
  
  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!uploadFile) {
      setError('Veuillez sélectionner un fichier');
      return;
    }
    
    try {
      setUploading(true);
      setError(null);
      
      const response = await patternService.uploadPattern(uploadFile, uploadData);
      
      // Ajouter le nouveau motif à la liste
      const newPattern = {
        id: response.data.pattern_id,
        name: uploadData.name,
        description: uploadData.description,
        imagePath: '/images/mock/pattern3.png', // Image factice pour le mock
        createdAt: new Date().toISOString(),
        totalRecognitions: 0
      };
      
      setPatterns([newPattern, ...patterns]);
      
      // Réinitialiser le formulaire
      setUploadFile(null);
      setUploadData({ name: '', description: '' });
      setUploadOpen(false);
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      setError('Erreur lors de l\'upload du motif');
    } finally {
      setUploading(false);
    }
  };
  
  // Gérer l'upload d'un overlay personnalisé
  const handleOverlayFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setOverlayFile(file);
    }
  };
  
  const handleOverlayUpload = async (e) => {
    e.preventDefault();
    
    if (!overlayFile) {
      setError('Veuillez sélectionner un fichier SVG');
      return;
    }
    
    try {
      setUploadingOverlay(true);
      setError(null);
      
      // Simulation de l'upload d'overlay (en mode mock)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Message de succès
      alert('Overlay personnalisé téléchargé avec succès!');
      
      // Réinitialiser le formulaire
      setOverlayFile(null);
      setOverlayOpen(false);
    } catch (error) {
      console.error('Erreur lors de l\'upload de l\'overlay:', error);
      setError('Erreur lors de l\'upload de l\'overlay');
    } finally {
      setUploadingOverlay(false);
    }
  };
  
  // Supprimer un motif
  const handleDelete = async (patternId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce motif ?')) {
      return;
    }
    
    try {
      await patternService.deletePattern(patternId);
      setPatterns(patterns.filter(p => p.id !== patternId));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError('Erreur lors de la suppression du motif');
    }
  };
  
  // Formatter la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des motifs</h1>
        <div className="space-x-2">
          <button
            onClick={() => setOverlayOpen(!overlayOpen)}
            className="bg-indigo-600 text-white rounded-lg px-4 py-2 flex items-center hover:bg-indigo-700"
          >
            {overlayOpen ? 'Annuler' : <><FaImage className="mr-2" /> Overlay personnalisé</>}
          </button>
          <button
            onClick={() => setUploadOpen(!uploadOpen)}
            className="bg-primary text-white rounded-lg px-4 py-2 flex items-center hover:bg-blue-700"
          >
            {uploadOpen ? 'Annuler' : <><FaPlus className="mr-2" /> Ajouter un motif</>}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      {/* Formulaire d'upload d'overlay */}
      {overlayOpen && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-lg font-semibold mb-4">Télécharger un overlay personnalisé</h2>
          <form onSubmit={handleOverlayUpload}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Fichier SVG d'overlay
              </label>
              <div className="border-2 border-dashed border-indigo-300 rounded-lg p-6 text-center">
                {overlayFile ? (
                  <div className="text-green-500 font-medium">
                    {overlayFile.name} ({Math.round(overlayFile.size / 1024)} Ko)
                  </div>
                ) : (
                  <div className="text-gray-500">
                    Cliquez ou glissez-déposez un fichier SVG ici
                  </div>
                )}
                <input
                  type="file"
                  accept=".svg"
                  onChange={handleOverlayFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  style={{ top: 0, left: 0, height: '100%' }}
                />
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Le fichier SVG sera utilisé comme overlay dans l'interface de capture.
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setOverlayOpen(false)}
                className="mr-3 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                disabled={uploadingOverlay}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
                disabled={uploadingOverlay}
              >
                {uploadingOverlay ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" /> Traitement...
                  </>
                ) : (
                  <>
                    <FaUpload className="mr-2" /> Téléverser
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Formulaire d'upload de motif */}
      {uploadOpen && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-lg font-semibold mb-4">Ajouter un nouveau motif</h2>
          <form onSubmit={handleUpload}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Fichier SVG ou PNG
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {uploadFile ? (
                  <div className="text-green-500 font-medium">
                    {uploadFile.name} ({Math.round(uploadFile.size / 1024)} Ko)
                  </div>
                ) : (
                  <div className="text-gray-500">
                    Cliquez ou glissez-déposez un fichier ici
                  </div>
                )}
                <input
                  type="file"
                  accept=".svg,.png"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  style={{ top: 0, left: 0, height: '100%' }}
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Nom du motif
              </label>
              <input
                type="text"
                name="name"
                value={uploadData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Nom du motif"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={uploadData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Description du motif"
                rows={3}
              ></textarea>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setUploadOpen(false)}
                className="mr-3 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                disabled={uploading}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 flex items-center"
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" /> Traitement...
                  </>
                ) : (
                  <>
                    <FaUpload className="mr-2" /> Téléverser
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Liste des motifs */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : patterns.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-600">Aucun motif n'a été ajouté.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Motif
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'ajout
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reconnaissances
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {patterns.map((pattern) => (
                <tr key={pattern.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md"></div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {pattern.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {pattern.description.length > 50
                            ? `${pattern.description.substring(0, 50)}...`
                            : pattern.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(pattern.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {pattern.totalRecognitions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(pattern.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PatternManagement;