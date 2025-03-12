import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-4">Système de Reconnaissance Visuelle de Motifs</h1>
        <p className="text-lg text-gray-600 mb-6">
          Identifiez rapidement vos motifs sur différents supports grâce à notre technologie de reconnaissance avancée.
        </p>
        <Link
          to="/capture"
          className="inline-block bg-primary text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Commencer la reconnaissance
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-primary text-4xl mb-4 flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2 text-center">Capture Intuitive</h2>
          <p className="text-gray-600">
            Utilisez notre interface de capture avec masque de guidage pour aligner parfaitement votre motif.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-primary text-4xl mb-4 flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2 text-center">Reconnaissance Précise</h2>
          <p className="text-gray-600">
            Notre technologie reconnaît vos motifs indépendamment de la couleur du support et des conditions d'éclairage.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-primary text-4xl mb-4 flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2 text-center">Résultats Détaillés</h2>
          <p className="text-gray-600">
            Obtenez des informations complètes sur le motif identifié, avec score de confiance et alternatives.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 mb-10">
        <h2 className="text-xl font-semibold mb-4">Comment ça marche</h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700">
          <li>Accédez à l'écran de capture et positionnez votre motif dans le cadre</li>
          <li>Notre système analyse le motif et le compare à notre base de données</li>
          <li>Consultez les résultats avec les informations détaillées du motif identifié</li>
          <li>Si nécessaire, effectuez une nouvelle capture pour améliorer la précision</li>
        </ol>
      </div>
    </div>
  );
};

export default HomePage;