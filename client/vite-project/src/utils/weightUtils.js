// Utility to convert string weights to KG numbers
export const parseWeightToKg = (weightStr) => {
  if (!weightStr) return 1;
  const lowerStr = weightStr.toLowerCase();
  
  // If it's explicitly KG
  if (lowerStr.includes('kg')) {
    const num = parseFloat(lowerStr.replace(/[^\d.]/g, ''));
    return isNaN(num) ? 1 : num;
  }
  
  // If it's Grams (g or gm)
  if (lowerStr.includes('g') || lowerStr.includes('gm')) {
    const num = parseFloat(lowerStr.replace(/[^\d.]/g, ''));
    return isNaN(num) ? 1 : num / 1000;
  }
  
  // Default for "Box of 6", "Standard Box", etc (Gift packs)
  return 1;
};
