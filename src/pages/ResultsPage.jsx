import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaArrowLeft, FaCamera, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

const ResultsPage = () => {
  const location = useLocation();
  const results = location.state?.results || { results: [] };
  
  // Si pas de résultats, afficher un message
  if (!results.results || results.results.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white p-8 rounded-lg shadow-md mb-6">
          <div className="text-red-500 text-5xl mb-4 flex justify-center">
            <FaExclamationTriangle />
          </div>
          <h1 className="text-2xl font-bold mb-4">Aucun motif trouvé</h1>
          <p className="text-gray-600 mb-6">
            Aucun motif n'a pu être identifié avec certitude. Veuillez réessayer avec une autre image ou un autre angle.
          </p>
          <Link
            to="/capture"
            className="inline-flex items-center bg-primary text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaCamera className="mr-2" /> Nouvelle capture
          </Link>
        </div>
      </div>
    );
  }
  
  // Récupérer le meilleur résultat
  const bestMatch = results.results[0];
  const alternatives = results.results.slice(1);
  
  // Fonction pour formater le score en pourcentage
  const formatScore = (score) => {
    return `${Math.round(score * 100)}%`;
  };
  
  // Fonction pour obtenir la classe CSS de la confiance
  const getConfidenceClass = (score) => {
    if (score >= 0.8) return 'text-green-500';
    if (score >= 0.5) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <Link to="/capture" className="text-gray-600 hover:text-primary mr-3">
          <FaArrowLeft />
        </Link>
        <h1 className="text-2xl font-bold">Résultats de la reconnaissance</h1>
      </div>
      
      {/* Meilleur résultat */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <FaCheck className="text-green-500 mr-2" /> Motif identifié
          </h2>
          <div className={`font-bold text-lg ${getConfidenceClass(bestMatch.score)}`}>
            Confiance: {formatScore(bestMatch.score)}
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:space-x-6">
          <div className="mb-4 md:mb-0 md:w-1/3">
            <div className="bg-gray-100 h-40 w-full rounded-lg flex items-center justify-center">
              <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          
          <div className="md:w-2/3">
            <h3 className="text-lg font-medium mb-2">{bestMatch.metadata.name}</h3>
            <p className="text-gray-600 mb-4">{bestMatch.metadata.description}</p>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">ID:</span>
                <span className="font-mono">{bestMatch.pattern_id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Fichier d'origine:</span>
                <span>{bestMatch.metadata.filename}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Variation correspondante:</span>
                <span className="font-mono">{bestMatch.matched_variation}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Alternatives */}
      {alternatives.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Autres correspondances possibles</h2>
          
          <div className="space-y-4">
            {alternatives.map((alt, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{alt.metadata.name}</h3>
                  <div className={`font-medium ${getConfidenceClass(alt.score)}`}>
                    {formatScore(alt.score)}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{alt.metadata.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Actions */}
      <div className="flex justify-center space-x-4">
        <Link
          to="/capture"
          className="bg-primary text-white font-medium py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <FaCamera className="mr-2" /> Nouvelle capture
        </Link>
      </div>
    </div>
  );
};

export default ResultsPage;