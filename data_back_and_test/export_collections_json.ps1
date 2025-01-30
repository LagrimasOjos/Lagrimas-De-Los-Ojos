# Cargar configuración desde config.ps1
. "./config.ps1"

# Crear el directorio de salida si no existe
if (!(Test-Path $DATA_DIR)) {
    New-Item -ItemType Directory -Path $DATA_DIR
}

# Exportar cada colección
foreach ($collection in $COLLECTIONS) {
    $outputFile = Join-Path $DATA_DIR "$collection.json"
    Write-Host "Exportando $collection a $outputFile..."
    mongoexport --uri $URI --collection $collection --out $outputFile --jsonArray
}
