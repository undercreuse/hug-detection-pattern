import { useState, useEffect } from 'react';

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    // Handler pour mettre à jour la taille lors du redimensionnement
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
    
    // Ajouter l'event listener
    window.addEventListener('resize', handleResize);
    
    // Appeler le handler immédiatement pour la valeur initiale
    handleResize();
    
    // Nettoyage
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

export default useWindowSize;