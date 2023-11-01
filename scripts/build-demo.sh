#!/bin/zsh

# User variables
APP_DIR=dist/app
DEMO_DIR=dist/demo
APP_MIN=$APP_DIR/app-min.js
DEMO_HTML=$DEMO_DIR/index.html
DEMO_HTML_TEMPLATE=scripts/assets/template.html
TOKEN_DATA=src/shared/token-data.js
CALCULATE_FEATURES=src/features/features.template.js

# =============================================================================

# Make sure the input file exists
if [ ! -f $APP_MIN ]; then
  echo "Cannot generate index.html for DEMO because $APP_MIN does not exist."
  exit 1
fi

# Make a DEMO directory in dist
rm -rf $DEMO_DIR
if [ ! -d $DEMO_DIR ]; then
  mkdir -p $DEMO_DIR
fi

# Inject the app code
sed -e '/\/\/APP_BEGIN\/\//r'$APP_MIN $DEMO_HTML_TEMPLATE > $DEMO_HTML.tmp0

# Inject the token code
sed -e '/\/\/TOKEN_DATA_BEGIN\/\//r'$TOKEN_DATA $DEMO_HTML.tmp0 > $DEMO_HTML.tmp1

# Inject the feature calculation code
sed -e '/\/\/CALCULATE_FEATURES_BEGIN\/\//r'$CALCULATE_FEATURES $DEMO_HTML.tmp1 > $DEMO_HTML

# Remove the temporary files
rm $DEMO_HTML.tmp0
rm $DEMO_HTML.tmp1