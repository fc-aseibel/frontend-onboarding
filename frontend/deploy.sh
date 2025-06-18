#!/bin/bash
set -e

IMAGE_NAME=ghcr.io/${GITHUB_REPOSITORY,,}/frontend:${VERSION}

# Login mit PAT
echo "${GHCR_PAT}" | docker login ghcr.io -u "${GITHUB_ACTOR}" --password-stdin

# Build und Push
docker build -t $IMAGE_NAME .
docker push $IMAGE_NAME
