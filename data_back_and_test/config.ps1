$URI = "mongodb+srv://usercompass:5PIcO0AfkCYghPCx@libreriasemillasdb.svf5m.mongodb.net/test"
$DATABASE = "test"
$DATA_DIR = "./backup"
$OVERWRITE = ""  # Cambia a "" si no quieres sobrescribir. Cambia a "--drop" para sobreescribir.
#DATOSO ORIGINALES
$COLLECTIONS = @("users",
    "semillas",
    "reservas",
    "prestamos",
    "sessions",
    "preferences",
    "flashmessages"
) # Lista tus colecciones aquí
#DATOS DE PRUEBA PARA LA DEMOSTRACIÓN
$DATA_TEST_DIR = "./demo_test"
$COLLECTIONS_TEST = @("users",
    "semillas",
    "reservas",
    "prestamos"
) # Lista tus colecciones con datos de prueba aquí