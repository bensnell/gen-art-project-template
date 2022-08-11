/**
 * Calculate features for the given token data.
 * @param {Object} tokenData
 * @param {string} tokenData.tokenId - Unique identifier of the token on its contract.
 * @param {string} tokenData.hash - Unique hash generated upon minting the token.
 */
function calculateFeatures(tokenData) {

  //FEATURE_SCRIPT_DEPENDENCIES_BEGIN//
  
  //FEATURE_SCRIPT_DEPENDENCIES_END//  

  // ^ DO NOT EDIT
  // ==========================================================================

  let features = {};

  // Calculate your features here, using the existing object `featureSeeds`.

  features['Radius'] = featureSeeds.radius;

  return features;
}