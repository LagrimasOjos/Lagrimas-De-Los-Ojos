#!/bin/zsh

# Cargar configuración
source ./config.env

# Verificar si el directorio de datos existe
if [ ! -d "$DATA_TEST_DIR" ]; then
    echo "El directorio $DATA_TEST_DIR no existe. Por favor verifica la ruta."
    exit 1
fi

# Iterar sobre cada colección en el array
for collection in "${COLLECTIONS_TEST[@]}"; do
    FILE="$DATA_TEST_DIR/$collection.test.json"

    if [ -f "$FILE" ]; then
        echo "Importando archivo $FILE a la colección $collection..."

        # Ejecutar mongoimport
        mongoimport --uri "$URI" --collection "$collection" --file "$FILE" --jsonArray $OVERWRITE
    else
        echo "Archivo $FILE no encontrado. Saltando importación para la colección $collection."
    fi
done

echo "Importación completada."
