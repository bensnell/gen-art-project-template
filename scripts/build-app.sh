#!/bin/zsh

# User variables
APP_DIR=dist/app
APP_MIN=$APP_DIR/app-min.js
APP_MIN_SPLIT=$APP_DIR/app-min-split-
SPLIT_SIZE=24000
HTML_SCRIPT_CLASS=app
RESERVED_NAMES_FILE=scripts/assets/reserved-names.txt

# =============================================================================

# Determine what system we're on
unameOut="$(uname -s)"
case "${unameOut}" in
  Linux*)     machine=Linux;;
  Darwin*)    machine=Mac;;
  CYGWIN*)    machine=Cygwin;;
  MINGW*)     machine=MinGw;;
  *)          machine="UNKNOWN:${unameOut}"
esac
echo "Running on ${machine}."

# Make an app directory in dist
rm -rf $APP_DIR
if [ ! -d $APP_DIR ]; then
  mkdir -p $APP_DIR
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

# Load all reserved names that should not be mangled by uglifyjs
function join_by { local IFS="$1"; shift; echo "$*"; }
RESERVED_NAMES_ARRAY=()
while IFS= read -r name || [ -n "$name" ]; do
  RESERVED_NAMES_ARRAY+=(\'$name\')
done < scripts/assets/reserved-names.txt
RESERVED_NAMES=$(join_by , ${RESERVED_NAMES_ARRAY[@]})

# Combine, compress and mangle all application js files
uglifyjs \
  -c drop_console=true \
  -m toplevel=true,reserved=[$RESERVED_NAMES] \
  --mangle-props keep_quoted=true \
  -o $APP_MIN $SCRIPT_FILES

# List the size
if [ "$machine" == "Linux" ]; then
  APP_MIN_SIZE=$(stat --format=%s "$APP_MIN")
else
  APP_MIN_SIZE=$(stat -f%z "$APP_MIN")
fi
echo "Compressed app to $APP_MIN_SIZE bytes."

# Split the file 
split -d -b $SPLIT_SIZE $APP_MIN $APP_MIN_SPLIT

# List the number of splits
NUM_SPLITS=$(ls -1q dist/app/app-min-split-* | wc -l | xargs)
echo "Split file into $NUM_SPLITS files each <=$SPLIT_SIZE bytes."

# Remove the temporary file
# rm $APP_MIN