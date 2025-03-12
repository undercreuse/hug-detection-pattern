// src/mocks/patternData.js
export const mockPatterns = [
  {
    id: "pattern1",
    name: "Motif Floral",
    description: "Motif avec des éléments floraux complexes",
    imagePath: "/images/mock/pattern1.png",
    confidence: 0.87
  },
  {
    id: "pattern2",
    name: "Motif Géométrique",
    description: "Motif avec des formes géométriques régulières",
    imagePath: "/images/mock/pattern2.png",
    confidence: 0.93
  }
];

export const mockRecognitionResults = {
  bestMatch: {
    id: "pattern1",
    name: "Motif Floral",
    description: "Motif avec des éléments floraux complexes",
    imagePath: "/images/mock/pattern1.png",
    confidence: 0.87
  },
  alternatives: [
    {
      id: "pattern2",
      name: "Motif Géométrique",
      description: "Motif avec des formes géométriques régulières",
      imagePath: "/images/mock/pattern2.png",
      confidence: 0.42
    }
  ]
};