#!/bin/zsh

# Build the application to dist/app/
bash ./scripts/build-app.sh

# Build the feature script to dist/features/
bash ./scripts/build-features.sh

# Build the demo deployment HTML file
bash ./scripts/build-demo.sh