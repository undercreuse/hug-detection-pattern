import React from 'react';
import CameraCapture from '../components/camera/CameraCapture';

const CapturePage = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Capture de motif</h1>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <CameraCapture />
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h2 className="text-lg font-medium mb-2">Conseils pour une reconnaissance optimale</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
          <li>Assurez-vous que le motif est bien éclairé, sans ombres excessives</li>
          <li>Évitez les reflets trop importants sur les surfaces brillantes</li>
          <li>Centrez le motif dans le cadre de guidage</li>
          <li>Maintenez l'appareil stable pendant la capture</li>
          <li>Si les résultats ne sont pas satisfaisants, essayez avec un angle légèrement différent</li>
        </ul>
      </div>
    </div>
  );
};

export default CapturePage;