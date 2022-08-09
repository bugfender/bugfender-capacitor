#!/bin/bash

# Script to facilitate the process of building the plugin + example

# Go to the script directory (the same as the plugin)
cd "${0%/*}"
# Build the plugin
npm run build
# Go to the example directory
cd example
# Build the example
npm run build
# Sync with the platforms
npx cap sync
