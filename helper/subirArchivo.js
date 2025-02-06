const path = require('path');
const fs = require('fs');

async function subirArchivo(file, uploadFolder, maxSize, extensiones) {
    try {
        // Verificar si el archivo está presente
        if (!file) {
            throw new Error('No se subió ningún archivo');
        }

        const uploadedFile = file;

        // Verificar el tamaño del archivo
        if (uploadedFile.size > maxSize) {
            throw new Error('El archivo supera la cantidad máxima permitida');
        }

        // Verificar la extensión del archivo
        let allowedExtensions = extensiones || ['.jpg', '.jpeg', '.png', '.pdf']; // Usar las extensiones proporcionadas o las predeterminadas
        allowedExtensions = allowedExtensions.map(elemento => elemento.toLowerCase());
        const fileExtension = path.extname(uploadedFile.name.toLowerCase());

        if (!allowedExtensions.includes(fileExtension)) {
            console.log('Mi extension no valida');
            throw new Error('Extensión no válida');
        }

        // Generar un nombre único basado en la fecha y un valor aleatorio
        const timestamp = Date.now(); // Tiempo actual en milisegundos
        const randomStr = Math.random().toString(36).substring(2, 10); // Cadena aleatoria
        const uniqueFileName = `${timestamp}-${randomStr}${fileExtension}`;

        // Construir la ruta completa donde se subirá el archivo
        const uploadPath = path.join(__dirname, `../${uploadFolder}`, uniqueFileName);

        // Verificar si la carpeta de destino existe, si no, crearla
        if (!fs.existsSync(path.dirname(uploadPath))) {
            fs.mkdirSync(path.dirname(uploadPath), { recursive: true });
        }

        // Usar `mv` de forma asíncrona con Promesas para esperar la subida
        await new Promise((resolve, reject) => {
            uploadedFile.mv(uploadPath, (err) => {
                if (err) {
                    throw new Error("Hubo un error en la subida del archivo");
                }else{
                    resolve();
                }
            });
        });

        // Devolver éxito (esto puede ser manejado desde la ruta Express)
        let publicPath = uploadFolder.startsWith('/public') ? `${uploadFolder.split('/public')[1]}/${uniqueFileName}` : null;
        
        return {
            uploadPath, 
            uploadPathRelative:`${uploadFolder}/${uniqueFileName}`,
            publicPath
        };
    } catch (error) {
        throw new Error(`Error en la subida del archivo: ${error.message}`);
    }
}



async function subirArchivos(files, uploadFolder, maxSize, extensiones) {
    try {
        // Verificar si el archivo está presente
        if (!files) {
            throw new Error('No se subió ningún archivo');
        }

        const uploadedFiles = files;

        uploadedFiles.forEach(uploadedFile => {
            if (uploadedFile.size > maxSize) {
                throw new Error('El archivo supera la cantidad máxima permitida');
            }

            // Verificar la extensión del archivo
            let allowedExtensions = extensiones || ['.jpg', '.jpeg', '.png', '.pdf']; // Usar las extensiones proporcionadas o las predeterminadas
            allowedExtensions = allowedExtensions.map(elemento => elemento.toLowerCase());
            const fileExtension = path.extname(uploadedFile.name.toLowerCase());

            if (!allowedExtensions.includes(fileExtension)) {
                console.log('Mi extension no valida');
                throw new Error('Extensión no válida');
            }
        });

        let publicPaths = [];

        for (const uploadedFile of uploadedFiles) {
            const fileExtension = path.extname(uploadedFile.name.toLowerCase());
            const timestamp = Date.now(); // Tiempo actual en milisegundos
            const randomStr = Math.random().toString(36).substring(2, 10); // Cadena aleatoria
            const uniqueFileName = `${timestamp}-${randomStr}${fileExtension}`;
            const uploadPath = path.join(__dirname, `../${uploadFolder}`, uniqueFileName);

            if (!fs.existsSync(path.dirname(uploadPath))) {
                fs.mkdirSync(path.dirname(uploadPath), { recursive: true });
            }

            await new Promise((resolve, reject) => {
                uploadedFile.mv(uploadPath, (err) => {
                    if (err) {
                        return reject(new Error("Hubo un error en la subida del archivo"));
                    }
                    resolve();
                });
            });

            let publicPath = uploadFolder.startsWith('/public') ? `${uploadFolder.split('/public')[1]}/${uniqueFileName}` : null;
            publicPaths.push(publicPath);
        }

        return publicPaths;
        

    } catch (error) {
    
        throw new Error(`Error en la subida del archivo: ${error.message}`);
    
    }
}


module.exports = {subirArchivo, subirArchivos};
