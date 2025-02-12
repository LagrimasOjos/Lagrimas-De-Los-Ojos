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
    // Construcción de la tabla
    let html = `
      <div class="table-responsive">
        <table class="table table-striped table-hover">
          <thead class="table-primary text-center">
            <tr>
              <th>#</th>
              <th><i class="bi bi-flower3"></i> Semilla</th>
              <th><i class="bi bi-box"></i> Cantidad Prestada</th>
              <th><i class="bi bi-flag"></i> Estado</th>
              <th><i class="bi bi-calendar-event"></i> Fecha Devolución</th>
              <th><i class="bi bi-flower3"></i> Semillas Devueltas</th>
              <th><i class="bi bi-calendar-event"></i> Fecha Entrega</th>
            </tr>
          </thead>
          <tbody>
    `;

    // Recorre los préstamos y construye filas de la tabla
    prestamos.forEach((prestamo, index) => {
      html += `
        <tr class="text-center">
          <td>${index + 1}</td>
          <td><i class="bi bi-tree"></i> ${prestamo.nameSeed}</td>
          <td><i class="bi bi-box-fill"></i> ${prestamo.amountSeeds}</td>
          <td>
            <i class="bi bi-circle-fill text-${prestamo.status === 'sin devolver' ? 'warning' : 'success'}"></i>
            ${prestamo.status === 'sin devolver' ? 'Sin Devolver' : 'Devuelto'}
          </td>
          <td>
            <i class="bi bi-clock"></i> 
            ${prestamo.fechaDevolucion ? new Date(prestamo.fechaDevolucion).toLocaleDateString() : 'Debes intentar devolver las semillas lo antes posible'}
          </td>
          <td>${prestamo.seedsReturned}</td>
          <td>${new Date(prestamo.fechaEntregaSemilla).toLocaleDateString()}</td>
        </tr>
      `;
    });

    // Cierra la tabla y la inserta en el contenedor
    html += `</tbody></table></div>`;
    contenedor.innerHTML = html;
  } else {
    // Si no hay préstamos, muestra un mensaje de alerta
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
