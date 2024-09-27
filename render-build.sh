#!/usr/bin/env bash
# exit on error
set -o errexit

STORAGE_DIR=/opt/render/project/.render


if [[ ! -d $STORAGE_DIR/chrome ]]; then
  echo "...Downloading Chrome"
  mkdir -p $STORAGE_DIR/chrome
  cd $STORAGE_DIR/chrome
  wget -P ./ https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
  dpkg -x ./google-chrome-stable_current_amd64.deb $STORAGE_DIR/chrome
  rm ./google-chrome-stable_current_amd64.deb
  cd $HOME/project/src # Make sure we return to where we were
else
  echo "...Using Chrome from cache"
fi

# Install dependencies
cd server && npm install && cd ../client && npm install
cd ../client && npm run build

# Set Puppeteer to use the installed Chrome executable
export PUPPETEER_EXECUTABLE_PATH=$STORAGE_DIR/chrome/opt/google/chrome/chrome

# Install Puppeteer and the necessary browsers
cd $HOME/project/src && npx puppeteer install
