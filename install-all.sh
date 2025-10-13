#!/usr/bin/env bash
set -euo pipefail

echo "Installing API dependencies..."
pushd API >/dev/null
npm install
popd >/dev/null

echo "Installing Quasar app dependencies..."
pushd quasar-project >/dev/null
npm install
popd >/dev/null

echo "All dependencies installed."


