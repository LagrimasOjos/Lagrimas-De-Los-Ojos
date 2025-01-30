#!/bin/zsh

# Configuración
source ./config.env

if [ ! -d "$DATA_DIR" ]; then
    mkdir -p "$DATA_DIR"
fi

for collection in "${COLLECTIONS[@]}"; do
    OUTPUT_FILE="$DATA_DIR/$collection.json"
    echo "Exportando colección $collection a $OUTPUT_FILE..."
    mongoexport --uri "$URI" --collection "$collection" --out "$OUTPUT_FILE" --jsonArray
done
