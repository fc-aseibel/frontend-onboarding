#!/usr/bin/env bash
#
# Andi's GeoJSON Slimmer & Bulk Builder (mit Skip-Logik)
#
# Usage:
#   ./geojson_reduce_and_bulk.sh input.geojson output.bulk.json

set -e

INPUT=$1
OUTPUT=$2

if [ -z "$INPUT" ] || [ -z "$OUTPUT" ]; then
  echo "Usage: $0 <input.geojson> <output.bulk.json>"
  exit 1
fi

echo "Reducing $INPUT and building bulk file: $OUTPUT"

> "$OUTPUT"

jq -c '.features[]' "$INPUT" | while read -r feature; do
  ID=$(echo "$feature" | jq -r '.id // empty')
  CATEGORY=$(echo "$feature" | jq -r '.properties?.amenity // empty')
  NAME=$(echo "$feature" | jq -r '.properties?.name // empty')
  LON=$(echo "$feature" | jq -r '.geometry.coordinates[0]')
  LAT=$(echo "$feature" | jq -r '.geometry.coordinates[1]')

  # Falls amenity ODER name fehlt → skippen!
  if [ -z "$CATEGORY" ] || [ -z "$NAME" ]; then
    echo "⏭️  Skipping ID=$ID (missing amenity or name)"
    continue
  fi

  echo "{ \"index\": { \"_index\": \"geo_pois\", \"_id\": \"$ID\" } }" >> "$OUTPUT"
  echo "{ \"category\": \"$CATEGORY\", \"name\": \"$NAME\", \"location\": { \"lat\": $LAT, \"lon\": $LON } }" >> "$OUTPUT"
done

echo "✅ Done! Output written to $OUTPUT"
