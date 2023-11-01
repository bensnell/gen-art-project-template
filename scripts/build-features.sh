#!/bin/zsh

# User variables
FEATURES_DIR=dist/features
FEATURES_MIN=$FEATURES_DIR/features-min.js
FEATURES_SCRIPT=$FEATURES_DIR/feature-script.js
HTML_SCRIPT_CLASS=features

# =============================================================================

# Make a features directory in dist
rm -rf $FEATURES_DIR
if [ ! -d $FEATURES_DIR ]; then
  mkdir -p $FEATURES_DIR
fi

# Collect all script files with the matching class
SCRIPT_SRCS=$(xmllint --xpath "//script[contains(concat(' ', normalize-space(@class), ' '),'$HTML_SCRIPT_CLASS')]/@src" --html index.html 2>/dev/null)
SCRIPT_FILES_ARRAY=()
for i in $SCRIPT_SRCS; do
  length=${#i}
  SCRIPT_FILE=${i:5:length-6}
  SCRIPT_FILES_ARRAY+=("$SCRIPT_FILE")
done
SCRIPT_FILES="${SCRIPT_FILES_ARRAY[@]}"

# Combine, compress and mangle all application js files
uglifyjs -c -m -o $FEATURES_MIN $SCRIPT_FILES

# Put the minified feature script libraries into the feature script
sed -e '/\/\/FEATURE_SCRIPT_DEPENDENCIES_BEGIN\/\//r'$FEATURES_MIN src/features/features.template.js > $FEATURES_SCRIPT

# Remove the minified feature script
rm $FEATURES_MIN