# LÁGRIMAS DE LOS OJOS

**PROYECTO INTEGRADO DE DAW2 - IES GREGORIO PRIETO (Valdepeñas)**

**Proyecto realizado en colaboración con el IES Ojos del Guadiana de Daimiel**

### Tecnologías usadas

Este proyecto es una aplicación web desarrollada utilizando las siguientes tecnologías

- Node.js: Backend del proyecto.
- JavaScript: Lenguaje de programación utilizado en el frontend y el backend.
- Bootstrap: Framework de CSS para crear un diseño responsivo y moderno.
- HTML5 y CSS3: Para la estructura y el estilo de la interfaz de usuario.
- MongoDB: Base de datos NoSQL utilizada para almacenar los datos.

### Node.js

Este proyecto ha sido desarrollado utilizando **Node.js v20.17.0 LTS**. 
Para garantizar que todo funcione correctamente, recomendamos usar esta versión al probar o trabajar en el proyecto.
Nota: Lo ideal sería utilizar un contenedor docker en dockerhub pero por falta de tiempo, el entorno de desarrollo esta en local y para ello hemos usado nvm.

#### Gestionar versiones de Node.js

- **macOS/Linux/WSL (Windows)**:  
  Usa **nvm** para gestionar versiones de Node.js. Sigue las instrucciones de instalación aquí:  
  [https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm).

- **Windows**:  
  Usa **NVM for Windows**, una herramienta similar al nvm original. Descárgala e instálala desde:  
  [https://github.com/coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows).

#### Dependencias

Asimismo, este proyecto utiliza las siguientes dependencias de Node.js:

- bcryptjs 2.4.3
- connect-mongo 5.1.0
- cookie-parser 1.4.4
- debug 2.6.9
- dotenv 16.4.7
- ejs 2.6.1
- express 4.18.1
- express-fileupload 1.5.1
- express-session 1.18.1
- http-errors 1.6.3
- mongoose 7.0.0
- morgan 1.9.1
- nodemon 3.1.1 (para dev)

### Instrucciones para levantar el proyecto en local

1. Clona el repositorio:
   
`git clone <URL_DEL_REPOSITORIO>`

`cd <NOMBRE_DEL_PROYECTO>`

1.1. Notas para nvm:

`nvm install 20`
  
`echo "20.17.0" > .nvmrc` *(En PowerShell usa: `Set-Content .nvmrc "20.17.0"`)*
    
`nvm use`
    
2. Instala las dependencias:

`npm install`

3. Levanta el servidor en modo desarrollo:

`npm run dev`

3.1. En modo producción:
  
`npm start`

4. Accede a la aplicación:

Por defecto, el servidor estará disponible en [http://localhost:3000](http://localhost:3000).

### Despliegue para pruebas

Proyecto desplegado en Render.com

  [https://lagrimas-de-los-ojos.onrender.com](https://lagrimas-de-los-ojos.onrender.com)