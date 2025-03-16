// Función para abrir (o crear) la base de datos 'prestamosDB'
const abrirDB = () => {
  return new Promise((resolve, reject) => {
    // Abre (o crea) la base de datos con versión 1
    const request = indexedDB.open('prestamosDB', 1);

    // Se ejecuta si es la primera vez o si cambia la versión de la DB
    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Verifica si no existe el almacén 'prestamos' y lo crea
      if (!db.objectStoreNames.contains('prestamos')) {
        const store = db.createObjectStore('prestamos', { keyPath: 'id' });

        // Crea un índice para ordenar por fecha de actualización
        store.createIndex('updatedAt', 'updatedAt', { unique: false });
      }
    };

    // Si se abre correctamente, se resuelve la promesa con la conexión a la DB
    request.onsuccess = () => resolve(request.result);

    // Si hay un error al abrir la base de datos, se rechaza la promesa
    request.onerror = (event) => reject(event.target.error);
  });
};

// Función para obtener todos los registros de 'prestamos' en IndexedDB
const obtenerPrestamosIndexDB = async () => {
  const db = await abrirDB(); // Abre la base de datos

  return new Promise((resolve, reject) => {
    // Inicia una transacción de solo lectura en 'prestamos'
    const tx = db.transaction('prestamos', 'readonly');
    const store = tx.objectStore('prestamos');

    // Solicita obtener todos los registros
    const request = store.getAll();

    // Si la solicitud es exitosa, resuelve la promesa con los datos obtenidos
    request.onsuccess = () => resolve(request.result);

    // Si hay un error, se rechaza la promesa
    request.onerror = (event) => reject(event.target.error);
  });
};




// Función para renderizar la tabla de préstamos en el DOM
const renderizarTablaPrestamos = (prestamos) => {
  const contenedor = document.getElementById('contenedor-prestamos');
  contenedor.innerHTML = ''; // Limpia el contenido previo

  if (prestamos.length > 0) {
      prestamos.forEach((prestamo, index) => {
          const card = document.createElement('div');
          card.className = "card shadow-lg p-3 bg-body-tertiary rounded my-3";
          card.style.marginTop = "10px";
          card.style.marginBottom = "10px";
          card.innerHTML = `
              <div class="card-body">
                  <div class="row align-items-center">
                      <div class="col-lg-8 col-md-12">
                          <h5 class="card-title"><i class="bi bi-tree"></i> ${prestamo.nameSeed}</h5>
                          <p class="card-text"><span class="fw-bold">Cantidad Prestada:</span> <i class="bi bi-box-fill"></i> ${prestamo.amountSeeds}</p>
                          <p class="card-text"><span class="fw-bold">Estado:</span> 
                              <i class="bi bi-circle-fill text-${prestamo.status === 'sin devolver' ? 'warning' : 'success'}"></i>
                              ${prestamo.status === 'sin devolver' ? 'Sin Devolver' : 'Devuelto'}
                          </p>
                          <p class="card-text"><span class="fw-bold">Fecha Devolución:</span> 
                              ${prestamo.fechaDevolucion ? new Date(prestamo.fechaDevolucion).toLocaleDateString() : 'Debes intentar devolver las semillas lo antes posible'}
                          </p>
                          <p class="card-text"><span class="fw-bold">Semillas Devueltas:</span> ${prestamo.seedsReturned}</p>
                          <p class="card-text"><span class="fw-bold">Fecha Entrega:</span> ${new Date(prestamo.fechaEntregaSemilla).toLocaleDateString()}</p>
                      </div>
                  </div>
              </div>
          `;
          contenedor.appendChild(card);
      });
  } else {
      contenedor.innerHTML = `
          <div class="alert alert-warning text-center" role="alert">
              <i class="bi bi-exclamation-triangle-fill"></i> No se encontraron préstamos registrados.
          </div>`;
  }
};


// Función para guardar o actualizar registros en IndexedDB
const guardarPrestamosIndexDB = async (prestamos) => {
  const db = await abrirDB(); // Abre la base de datos

  return new Promise((resolve, reject) => {
    // Inicia una transacción de escritura en 'prestamos'
    const tx = db.transaction('prestamos', 'readwrite');
    const store = tx.objectStore('prestamos');

    // Recorre los préstamos y los guarda (o actualiza) en IndexedDB
    prestamos.forEach(prestamo => {
      // Si el préstamo tiene '_id', se usa como 'id' para la clave primaria
      if (prestamo._id) {
        prestamo.id = prestamo._id;
        delete prestamo._id;
      }
      store.put(prestamo); // Guarda o actualiza el registro
    });

    // Cuando la transacción se completa, resuelve la promesa
    tx.oncomplete = () => resolve();

    // Si hay un error, se rechaza la promesa
    tx.onerror = (event) => reject(event.target.error);
  });
};

// Función para sincronizar los préstamos entre el backend y IndexedDB
const sincronizarPrestamos = async () => {
  // Obtiene los préstamos locales de IndexedDB
  const prestamosLocales = await obtenerPrestamosIndexDB();

  // Si no hay registros locales, obtiene todos los préstamos del backend
  if (prestamosLocales.length === 0) {
    const response = await fetch('/api/user/prestamos');
    const data = await response.json();

    // Si hay datos, los guarda en IndexedDB
    if (data && data.data) {
      await guardarPrestamosIndexDB(data.data);
      console.log('IndexedDB actualizada con todos los préstamos.');
    }
  } else {
    // Si hay registros locales, obtiene la fecha de la última actualización
    const fechaIndexDb = prestamosLocales
      .map(prestamo => new Date(prestamo.updatedAt))
      .sort((a, b) => b - a)[0];

    // Solicita al backend solo los préstamos modificados después de esa fecha
    const response = await fetch('/api/user/ultimo-prestamo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fechaIndexDb }),
    });
    const data = await response.json();

    // Si hay datos nuevos, se actualiza IndexedDB
    if (data && data.data.length > 0) {
      await guardarPrestamosIndexDB(data.data);
      console.log('IndexedDB actualizada con los nuevos datos.');
    } else {
      console.log('No hay cambios en los préstamos.');
    }
  }
};

// Cuando el DOM esté listo, sincroniza los datos y renderiza la tabla
document.addEventListener('DOMContentLoaded', async () => {
  await sincronizarPrestamos(); // Sincroniza los datos
  const prestamos = await obtenerPrestamosIndexDB(); // Obtiene los datos locales
  renderizarTablaPrestamos(prestamos); // Muestra la tabla en la página
});
