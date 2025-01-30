# Cargar configuración desde config.ps1
. "./config.ps1"

# Verificar si el directorio de datos existe
if (!(Test-Path $DATA_DIR)) {
    Write-Host "El directorio $DATA_DIR no existe. Por favor verifica la ruta."
    exit 1
}

# Iterar sobre cada colección en el array
foreach ($collection in $COLLECTIONS) {
    $filePath = Join-Path $DATA_DIR "$collection.json"

    if (Test-Path $filePath) {
        Write-Host "Importando archivo $filePath a $collection..."

        # Ejecutar mongoimport
        mongoimport --uri $URI --collection $collection --file $filePath --jsonArray $OVERWRITE
    }
    else {
        Write-Host "Archivo $filePath no encontrado."
    }
}

Write-Host "Importación completada."
