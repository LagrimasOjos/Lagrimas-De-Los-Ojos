Instalaciones previas:
=====================
    En MacOS:
        brew install mongodb-database-tools
    
    En Windows:
        MongoDB Command Line Database Tools: https://www.mongodb.com/try/download/database-tools

Ficheros de configuración:
=========================
    En MacOS: config.env
    En Windows: config.ps1

Hacer backup de las colleciones de la base de datos actual:
==========================================================
Paso 1. Verificar configuración en el fichero config.env (MacOS) o config.ps1 (Windows)
    - Paso 1.1. Verificar la cadena de conexión
    - Paso 1.2. Verificar el nombre de la base de datos
    - Paso 1.3. Verificar el nombre de las collecciones de la base de datos

Paso 2. Lanzar el script para el sistema operativo

Importar una copia de datos para restaurar:
==========================================
Paso 1. Verificar configuración en el fichero config.env (MacOS) o config.ps1 (Windows)
    - Paso 1.1. Verificar la cadena de conexión
    - Paso 1.2. Verificar el nombre de la base de datos
    - Paso 1.3. Verificar el nombre de las collecciones de la base de datos
    - Paso 1.4. MUY IMPORTANTE: Verifica si se sobrescribe o no la información en el destino

Paso 2. Lanzar el script para el sistema operativo

Importar una copia de datos de prueba:
======================================
Análogo al anterior.
