#!/bin/zsh

# User variables
FEATURES_DIR=dist/features
FEATURES_MIN=$FEATURES_DIR/features-min.js
FEATURES_SCRIPT=$FEATURES_DIR/feature-script.js

# =============================================================================

# Make a features directory in dist
rm -rf $FEATURES_DIR
if [ ! -d $FEATURES_DIR ]; then
  mkdir -p $FEATURES_DIR
fi

# Generate the minified features script
uglifyjs -c -m -o $FEATURES_MIN \
  src/features/window-shim.js \
  src/app/metadata.js \
  src/app/random-number-generator.js \
  src/app/globals.js \
  src/features/main.js

# Put the minified feature script libraries into the feature script
sed -e '/\/\/FEATURE_SCRIPT_BEGIN\/\//r'$FEATURES_MIN src/features/features.template.js > $FEATURES_SCRIPT

# Remove the minified feature script
rm $FEATURES_MIN