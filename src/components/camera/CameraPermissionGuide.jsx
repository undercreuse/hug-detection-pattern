import React, { useState } from 'react';
import { FaCamera, FaCheckCircle, FaTimesCircle, FaArrowRight } from 'react-icons/fa';

const CameraPermissionGuide = ({ onRequestPermission, onSkip }) => {
  const [step, setStep] = useState(1);
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);

  const handleNext = () => {
    if (step < (isIOS ? 4 : 2)) {
      setStep(step + 1);
    } else {
      onRequestPermission();
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Accès à la caméra</h2>
      
      {step === 1 && (
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <FaCamera className="text-3xl text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Autorisation nécessaire</h3>
          <p className="mb-6 text-gray-600">
            Pour capturer et reconnaître les motifs, nous avons besoin d'accéder à la caméra de votre appareil.
          </p>
          <button 
            onClick={handleNext}
            className="px-6 py-2 bg-primary text-white rounded-lg flex items-center mx-auto"
          >
            Continuer <FaArrowRight className="ml-2" />
          </button>
        </div>
      )}
      
      {isIOS && step === 2 && (
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">Sur iOS</h3>
          <p className="mb-4 text-gray-600">
            Safari va vous demander l'autorisation d'accéder à votre caméra.
          </p>
          <div className="border border-gray-300 rounded-lg p-4 mb-6 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">"hug-pattern.web.app"</span>
              <span className="text-gray-500">souhaite utiliser</span>
            </div>
            <div className="flex items-center justify-center mb-4">
              <span className="font-bold text-lg">votre appareil photo</span>
            </div>
            <div className="flex justify-center space-x-4">
              <div className="border border-gray-300 rounded-md px-4 py-2 bg-white">Refuser</div>
              <div className="border border-blue-500 rounded-md px-4 py-2 bg-blue-500 text-white">Autoriser</div>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Appuyez sur "Autoriser" lorsque cette invite apparaît.
          </p>
          <button 
            onClick={handleNext}
            className="px-6 py-2 bg-primary text-white rounded-lg flex items-center mx-auto"
          >
            Suivant <FaArrowRight className="ml-2" />
          </button>
        </div>
      )}
      
      {isIOS && step === 3 && (
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">Si l'accès est refusé</h3>
          <p className="mb-4 text-gray-600">
            Si vous avez refusé l'accès ou si l'invite n'apparaît pas, vous devrez modifier les paramètres de Safari :
          </p>
          <ol className="text-left mb-6 space-y-2">
            <li className="flex items-start">
              <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">1</span>
              <span>Ouvrez l'application <strong>Réglages</strong> sur votre appareil</span>
            </li>
            <li className="flex items-start">
              <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">2</span>
              <span>Faites défiler vers le bas et appuyez sur <strong>Safari</strong></span>
            </li>
            <li className="flex items-start">
              <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">3</span>
              <span>Appuyez sur <strong>Paramètres pour les sites web</strong></span>
            </li>
            <li className="flex items-start">
              <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">4</span>
              <span>Appuyez sur <strong>Appareil photo</strong></span>
            </li>
            <li className="flex items-start">
              <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">5</span>
              <span>Trouvez notre site web et sélectionnez <strong>Autoriser</strong></span>
            </li>
          </ol>
          <button 
            onClick={handleNext}
            className="px-6 py-2 bg-primary text-white rounded-lg flex items-center mx-auto"
          >
            Suivant <FaArrowRight className="ml-2" />
          </button>
        </div>
      )}
      
      {((!isIOS && step === 2) || (isIOS && step === 4)) && (
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">Prêt à commencer</h3>
          <p className="mb-6 text-gray-600">
            Nous allons maintenant demander l'accès à votre caméra. Veuillez appuyer sur "Autoriser" lorsque l'invite apparaît.
          </p>
          <div className="flex flex-col space-y-3">
            <button 
              onClick={onRequestPermission}
              className="px-6 py-3 bg-primary text-white rounded-lg flex items-center justify-center"
            >
              <FaCheckCircle className="mr-2" /> Demander l'accès à la caméra
            </button>
            <button 
              onClick={onSkip}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg flex items-center justify-center"
            >
              <FaTimesCircle className="mr-2" /> Continuer sans caméra (mode simulation)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraPermissionGuide;
