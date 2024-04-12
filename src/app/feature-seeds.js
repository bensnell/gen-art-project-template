var featureSeeds = (()=>{

  // Diverge the random number generator to use specifically for making
  // feature seeds.
  let RF = R.diverge().restart().step(1e4);

  // Calculate and save any randomness here that contributes to features.
  // In so doing, feature-dependent randomness can be distinguished from 
  // aesthetic randomness (e.g. perlin noise).

  // ------------------------
  
  RF.goto('Seed');
  let seed = RF.int(0, 2**24);

  RF.goto('Radius');
  let radius = RF.num(10,50);
  
  return {
    seed,
    radius,
  };

})();