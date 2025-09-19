// Simple image categorization using keyword matching
// In a real implementation, this would use a proper ML model

const categoryKeywords = {
  'Roads': ['road', 'pothole', 'street', 'asphalt', 'pavement', 'traffic', 'vehicle', 'car', 'bus', 'bike', 'walkway', 'sidewalk', 'crossing', 'zebra', 'lane', 'highway', 'bridge', 'tunnel'],
  'Water': ['water', 'pipe', 'leak', 'flood', 'drain', 'sewer', 'tap', 'faucet', 'tank', 'well', 'pond', 'lake', 'river', 'stream', 'overflow', 'blockage', 'drainage', 'plumbing'],
  'Electricity': ['electric', 'power', 'wire', 'cable', 'pole', 'transformer', 'outage', 'blackout', 'light', 'lamp', 'bulb', 'switch', 'socket', 'generator', 'voltage', 'current', 'electrical'],
  'Sanitation': ['garbage', 'trash', 'waste', 'bin', 'dumpster', 'litter', 'clean', 'dirty', 'smell', 'odor', 'rubbish', 'refuse', 'disposal', 'collection', 'sweep', 'cleanup'],
  'Public Property': ['building', 'wall', 'fence', 'gate', 'door', 'window', 'roof', 'ceiling', 'floor', 'stair', 'elevator', 'escalator', 'bench', 'chair', 'table', 'sign', 'board', 'poster', 'graffiti', 'vandalism'],
  'Other': []
};

// Mock neural network categorization
export const categorizeImage = async (imageFile) => {
  try {
    // In a real implementation, this would:
    // 1. Send image to a ML service (TensorFlow.js, AWS Rekognition, etc.)
    // 2. Get predictions from the model
    // 3. Return the most likely category
    
    // For now, we'll use a simple keyword-based approach
    // This is a mock implementation that simulates ML categorization
    
    return new Promise((resolve) => {
      // Simulate processing time
      setTimeout(() => {
        // Mock categorization based on file name or random selection
        const fileName = imageFile.name.toLowerCase();
        
        // Check for keywords in filename
        for (const [category, keywords] of Object.entries(categoryKeywords)) {
          if (keywords.some(keyword => fileName.includes(keyword))) {
            resolve({
              category,
              confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
              suggestions: keywords.filter(keyword => fileName.includes(keyword))
            });
          }
        }
        
        // If no keywords found, return a random category with lower confidence
        const categories = Object.keys(categoryKeywords).filter(cat => cat !== 'Other');
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        
        resolve({
          category: randomCategory,
          confidence: Math.random() * 0.4 + 0.3, // 30-70% confidence
          suggestions: []
        });
      }, 1000 + Math.random() * 2000); // 1-3 seconds delay
    });
  } catch (error) {
    console.error('Error categorizing image:', error);
    return {
      category: 'Other',
      confidence: 0.1,
      suggestions: []
    };
  }
};

// Batch categorize multiple images
export const categorizeImages = async (imageFiles) => {
  const results = await Promise.all(
    imageFiles.map(file => categorizeImage(file))
  );
  
  // Return the category with highest average confidence
  const categoryScores = {};
  results.forEach(result => {
    if (!categoryScores[result.category]) {
      categoryScores[result.category] = { total: 0, count: 0 };
    }
    categoryScores[result.category].total += result.confidence;
    categoryScores[result.category].count += 1;
  });
  
  const bestCategory = Object.entries(categoryScores)
    .map(([category, data]) => ({
      category,
      averageConfidence: data.total / data.count,
      count: data.count
    }))
    .sort((a, b) => b.averageConfidence - a.averageConfidence)[0];
  
  return {
    category: bestCategory.category,
    confidence: bestCategory.averageConfidence,
    allResults: results,
    totalImages: imageFiles.length
  };
};

// Get category suggestions based on text description
export const getCategorySuggestions = (description) => {
  const text = description.toLowerCase();
  const suggestions = [];
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    const matches = keywords.filter(keyword => text.includes(keyword));
    if (matches.length > 0) {
      suggestions.push({
        category,
        confidence: matches.length / keywords.length,
        matchedKeywords: matches
      });
    }
  }
  
  return suggestions.sort((a, b) => b.confidence - a.confidence);
};
