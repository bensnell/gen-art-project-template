#!/bin/zsh

# User variables
APP_DIR=dist/app
APP_MIN=$APP_DIR/app-min.js
APP_MIN_SPLIT=$APP_DIR/app-min-split-
SPLIT_SIZE=10500

# =============================================================================

# Make an app directory in dist
rm -rf $APP_DIR
if [ ! -d $APP_DIR ]; then
  mkdir -p $APP_DIR
fi

# Combine, compress and mangle all application js files 
uglifyjs -c -m -o $APP_MIN \
  src/app/metadata.js \
  src/app/random-number-generator.js \
  src/app/feature-seeds.js \
  src/app/helpers.js \
  src/app/globals.js \
  src/app/main.js

# List the size
APP_MIN_SIZE=$(stat -f%z "$APP_MIN")
echo "Compressed app to $APP_MIN_SIZE bytes."

# Split the file 
split -b $SPLIT_SIZE $APP_MIN $APP_MIN_SPLIT

# List the number of splits
NUM_SPLITS=$(ls -1q dist/app/app-min-split-a* | wc -l | xargs)
echo "Split file into $NUM_SPLITS files each <=$SPLIT_SIZE bytes."

# Remove the temporary file
# rm $APP_MIN