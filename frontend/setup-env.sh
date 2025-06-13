#!/bin/bash

# Script zum Aufsetzen der Entwicklungsumgebung für das Angular-Projekt
set -e

# 0. nvm prüfen und ggf. installieren
NVM_VERSION="v0.40.3"
NODE_VERSION="24.1.0"

if ! command -v nvm >/dev/null 2>&1; then
  echo "nvm ist nicht installiert. Installiere nvm $NVM_VERSION ..."
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/$NVM_VERSION/install.sh | bash
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
else
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

# Node.js Version prüfen und ggf. installieren
if ! nvm ls | grep -q "v$NODE_VERSION"; then
  echo "Installiere Node.js Version $NODE_VERSION über nvm ..."
  nvm install $NODE_VERSION
fi
nvm use $NODE_VERSION

# 1. Angular CLI global installieren, falls nicht vorhanden
if ! command -v ng >/dev/null 2>&1; then
  echo "Angular CLI wird global installiert..."
  npm install -g @angular/cli
fi

# 2. Abhängigkeiten installieren
echo "Installiere npm-Abhängigkeiten im Frontend..."
npm install

echo "Fertig!"