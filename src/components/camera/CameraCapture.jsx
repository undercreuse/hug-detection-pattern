import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { patternService } from '../../services/api';
import { FaCamera, FaSync, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import CaptureOverlay from './CaptureOverlay';
import useWindowSize from '../../hooks/useWindowSize';

const CameraCapture = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [alignmentScore, setAlignmentScore] = useState(0);
  const [alignmentStatus, setAlignmentStatus] = useState('waiting'); // 'waiting', 'aligning', 'ready', 'error'
  const [showMockControls, setShowMockControls] = useState(false);
  const [useMockCapture, setUseMockCapture] = useState(
    process.env.REACT_APP_USE_MOCKS === 'true' || !process.env.REACT_APP_API_URL
  );
  
  const webcamRef = useRef(null);
  const alignmentInterval = useRef(null);
  const captureContainerRef = useRef(null);
  const navigate = useNavigate();
  const windowSize = useWindowSize();
  
  // Dimensions du SVG
  const svgWidth = 86.89;
  const svgHeight = 280.63;
  const aspectRatio = svgWidth / svgHeight;

  // Calcul de la hauteur optimale
  const [captureHeight, setCaptureHeight] = useState(0);
  
  useEffect(() => {
    if (captureContainerRef.current) {
      // Obtenir la largeur du conteneur parent
      const containerWidth = captureContainerRef.current.offsetWidth;
      
      // Calculer la hauteur correspondante selon le ratio du SVG
      let calculatedHeight = containerWidth / aspectRatio;
      
      // Limiter la hauteur à 80% de la hauteur de la fenêtre
      const maxHeight = windowSize.height * 0.8;
      if (calculatedHeight > maxHeight) {
        calculatedHeight = maxHeight;
      }
      
      // Mettre à jour la hauteur
      setCaptureHeight(calculatedHeight);
    }
  }, [windowSize, aspectRatio]);

  // Configuration de la webcam
  const videoConstraints = {
    width: 720,
    height: 720,
    facingMode: 'environment', // Utiliser la caméra arrière sur mobile
  };

  // Simuler l'évolution de l'alignement
  const simulateAlignment = useCallback(() => {
    // Génère une série de scores qui augmentent progressivement
    // avec une légère variation aléatoire
    setAlignmentScore(prevScore => {
      // Augmentation progressive du score avec variations aléatoires
      const variation = Math.random() * 0.05 - 0.02; // Entre -0.02 et +0.03
      const newScore = Math.min(1, Math.max(0, prevScore + 0.03 + variation));
      
      // Mise à jour du statut en fonction du score
      if (newScore < 0.3) {
        setAlignmentStatus('waiting');
      } else if (newScore < 0.7) {
        setAlignmentStatus('aligning');
      } else {
        setAlignmentStatus('ready');
      }
      
      return newScore;
    });
  }, []);

  // Démarrer la simulation d'alignement
  useEffect(() => {
    if (useMockCapture || isCameraReady) {
      // Nettoyer tout intervalle existant
      if (alignmentInterval.current) {
        clearInterval(alignmentInterval.current);
      }
      
      // Initialiser le score et démarrer l'intervalle
      setAlignmentScore(0.1);
      setAlignmentStatus('waiting');
      
      alignmentInterval.current = setInterval(simulateAlignment, 300);
      
      // Activer le mode développement après double-clic
      const handleDblClick = () => {
        setShowMockControls(prev => !prev);
      };
      
      document.addEventListener('dblclick', handleDblClick);
      
      // Nettoyage
      return () => {
        clearInterval(alignmentInterval.current);
        document.removeEventListener('dblclick', handleDblClick);
      };
    }
  }, [useMockCapture, isCameraReady, simulateAlignment]);

  // Réinitialiser l'alignement
  const resetAlignment = () => {
    setAlignmentScore(0.1);
    setAlignmentStatus('waiting');
  };

  // Capture automatique quand l'alignement est optimal
  useEffect(() => {
    if (alignmentScore > 0.9 && alignmentStatus === 'ready' && !isCapturing) {
      // Attendre un peu pour que l'utilisateur voit le bon alignement
      const timer = setTimeout(() => {
        capture();
      }, 300);
      
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alignmentScore, alignmentStatus, isCapturing]);

  // Fonction pour capturer l'image
  const capture = useCallback(async () => {
    setIsCapturing(true);
    
    try {
      let imageData;
      
      if (useMockCapture) {
        // Utiliser une image fictive pour les tests
        imageData = "mock-image-data";
      } else if (webcamRef.current) {
        // Capturer l'image réelle depuis la webcam
        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) {
          throw new Error("Impossible de capturer l'image");
        }
        
        // Convertir le base64 en blob
        const base64 = imageSrc.split(',')[1];
        imageData = await fetch(`data:image/jpeg;base64,${base64}`).then(res => res.blob());
      } else {
        throw new Error("La webcam n'est pas initialisée");
      }
      
      // Envoyer l'image à l'API (réelle ou simulée)
      const response = await patternService.searchPattern(imageData);
      
      // Rediriger vers la page de résultats avec les données
      navigate('/results', { state: { results: response.data } });
    } catch (error) {
      console.error('Erreur lors de la capture ou reconnaissance:', error);
      setAlignmentStatus('error');
      
      // Réinitialiser après une erreur
      setTimeout(() => {
        setIsCapturing(false);
        resetAlignment();
      }, 2000);
    }
  }, [webcamRef, navigate, useMockCapture]);

  // Gérer l'événement d'initialisation de la webcam
  const handleUserMedia = () => {
    setIsCameraReady(true);
  };

  // Gérer les erreurs de webcam
  const handleWebcamError = (error) => {
    console.error('Erreur de webcam:', error);
    setIsCameraReady(false);
    // Passer automatiquement en mode mock si la caméra échoue
    setUseMockCapture(true);
  };

  // Forcer une nouvelle tentative d'alignement
  const handleRetry = () => {
    resetAlignment();
    setIsCapturing(false);
  };

  // Rendu du statut d'alignement
  const renderAlignmentStatus = () => {
    switch (alignmentStatus) {
      case 'waiting':
        return (
          <div className="text-yellow-500 flex items-center">
            <FaExclamationTriangle className="mr-2" />
            <span>Positionnez le motif dans le cadre</span>
          </div>
        );
      case 'aligning':
        return (
          <div className="text-blue-500 flex items-center">
            <FaSync className="mr-2 animate-spin" />
            <span>Ajustement en cours...</span>
          </div>
        );
      case 'ready':
        return (
          <div className="text-green-500 flex items-center">
            <FaCheck className="mr-2" />
            <span>Motif bien aligné! Capture en cours...</span>
          </div>
        );
      case 'error':
        return (
          <div className="text-red-500 flex items-center">
            <FaExclamationTriangle className="mr-2" />
            <span>Erreur lors de la capture</span>
          </div>
        );
      default:
        return null;
    }
  };

  // Couleur du cadre en fonction du score d'alignement
  const getBorderColor = () => {
    if (alignmentStatus === 'error') return 'border-red-500';
    if (alignmentScore < 0.3) return 'border-gray-400';
    if (alignmentScore < 0.7) return 'border-yellow-400';
    return 'border-green-500';
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-center mb-6">Capture du motif</h1>
      
      {/* Contrôles de mock (visibles en mode développement avec double-clic) */}
      {showMockControls && (
        <div className="bg-gray-100 p-3 mb-4 rounded-lg border border-gray-300">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Contrôles de développement</h3>
          <div className="flex items-center">
            <label className="inline-flex items-center mr-4">
              <input
                type="checkbox"
                checked={useMockCapture}
                onChange={e => setUseMockCapture(e.target.checked)}
                className="form-checkbox h-4 w-4 text-primary"
              />
              <span className="ml-2 text-sm text-gray-700">Mode simulation</span>
            </label>
            
            <button
              onClick={resetAlignment}
              className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
            >
              Réinitialiser alignement
            </button>
          </div>
        </div>
      )}
      
      {/* Conteneur de la caméra avec hauteur dynamique */}
      <div 
        ref={captureContainerRef}
        className="relative w-full bg-black overflow-hidden rounded-lg shadow-lg mb-4"
        style={{ 
          height: captureHeight > 0 ? `${captureHeight}px` : 'auto'
        }}
      >
        {/* Webcam réelle ou simulée */}
        {!useMockCapture ? (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            onUserMedia={handleUserMedia}
            onUserMediaError={handleWebcamError}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <svg className="w-24 h-24 mx-auto mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-sm">Mode simulation de caméra</p>
            </div>
          </div>
        )}
        
        {/* Overlay SVG */}
        <CaptureOverlay />
        
        {/* Overlay de traitement lors de la capture */}
        {isCapturing && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="inline-block w-12 h-12 border-4 border-t-4 border-white rounded-full animate-spin mb-2"></div>
              <p>Reconnaissance en cours...</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Indicateur d'alignement et score */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Qualité d'alignement</span>
          <span className="text-sm font-medium">{Math.round(alignmentScore * 100)}%</span>
        </div>
        
        {/* Barre de progression d'alignement */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ease-out rounded-full ${
              alignmentScore < 0.3 ? 'bg-gray-400' : 
              alignmentScore < 0.7 ? 'bg-yellow-400' : 'bg-green-500'
            }`}
            style={{ width: `${alignmentScore * 100}%` }}
          ></div>
        </div>
        
        {/* Texte de statut */}
        <div className="mt-2 text-sm">{renderAlignmentStatus()}</div>
      </div>
      
      {/* Boutons de contrôle */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleRetry}
          disabled={isCapturing}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
        >
          <FaSync className="mr-2" /> Réinitialiser
        </button>
        
        <button
          onClick={capture}
          disabled={isCapturing || alignmentScore < 0.3}
          className="px-6 py-2 bg-primary text-white rounded-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          <FaCamera className="mr-2" /> Capturer manuellement
        </button>
      </div>
      
      {/* Instructions */}
      <div className="mt-6 text-sm text-gray-600 bg-gray-100 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Comment capturer un motif :</h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>Positionnez le motif au centre du cadre</li>
          <li>Attendez que le cadre devienne vert</li>
          <li>Une capture automatique sera effectuée</li>
          <li>Ou utilisez le bouton "Capturer manuellement"</li>
        </ol>
      </div>
    </div>
  );
};

export default CameraCapture;