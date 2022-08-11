var featureSeeds = (()=>{

  // Calculate and save any randomness here that contributes to features.
  // In so doing, feature-dependent randomness can be distinguished from 
  // aesthetic randomness (e.g. perlin noise).

  let radius = R.n(10,50);
  
  return {
    radius,
  };

})();