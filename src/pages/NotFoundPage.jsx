import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="max-w-md mx-auto text-center">
      <div className="text-9xl font-bold text-gray-200 mb-6">404</div>
      <h1 className="text-2xl font-bold mb-4">Page non trouvée</h1>
      <p className="text-gray-600 mb-8">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Link
        to="/"
        className="inline-block bg-primary text-white font-medium py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
};

export default NotFoundPage;