#!/usr/bin/env bash

set -e

if [ $# -ne 2 ]; then
  echo "Usage: $0 input.geojson output.json"
  exit 1
fi

INPUT=$1
OUTPUT=$2

jq '{
  pois: [
    .features[]
    | select(.properties.amenity)
    | select(.properties.name)
    | {
        lat: .geometry.coordinates[1],
        lon: .geometry.coordinates[0],
        amenity: .properties.amenity,
        name: .properties.name
      }
  ] 
  | to_entries 
  | map(.value + { id: (.key + 1) })
}' "$INPUT" > "$OUTPUT"

echo "✅ Done. Output written to $OUTPUT"
