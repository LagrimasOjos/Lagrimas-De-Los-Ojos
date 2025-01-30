const userLogin = async () => {
  try {
    const response = await fetch("/api/public/userActive");

    // Verificar si la respuesta fue exitosa
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    // Intentar convertir la respuesta a JSON
    const responseData = await response.json();

    // Verificar si el JSON contiene los datos esperados
    const { data, error } = responseData;

    if (error) {
      console.error("Error al cargar los datos:", error);
      return false;
    }

    return true;

  } catch (error) {
    console.error("Error al realizar la solicitud:", error.message);
    return false;
  }
};

class Buscador {
  constructor(domBuscador, domPaginacion, domCards, domBtnSearch) {
    this.init(domBuscador, domPaginacion, domCards, domBtnSearch);
  }

  async init(domBuscador, domPaginacion, domCards, domBtnSearch) {
    this.buscadorInputDOM = domBuscador;
    this.paginacionDivDOM = domPaginacion;
    this.cardsDivDOM = domCards;
    this.domBtnSearch = domBtnSearch;
    this.isLoggedUser = await userLogin();
    this.page = 1;
    this.nameSeed = '';
    this.buscador();
    this.cargarPeticion();
  }

  async cargarPeticion() {
    this.peticion = `/api/public/paginateSeeds?page=${this.page}&nameseed=${this.nameSeed}`;
    const documentos = await this.fetchAndLoadData();
    return documentos;
  }

  async fetchAndLoadData() {
    // Mostrar el spinner mientras se cargan los datos
    this.cardsDivDOM.innerHTML = `
      <div id="spinner-container" class="d-flex justify-content-center align-items-center w-100" style="height: 525px;">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>
    `;

    try {
      const response = await fetch(this.peticion);

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const { data, error } = await response.json();

      if (!error) {
        const { documentos, totalPaginas, paginaActual } = data;

        this.cargarPaginacion(totalPaginas, paginaActual);
        this.cargarCards(documentos);
        return documentos;
      } else {
        console.log('Error en la respuesta de la API:', error);
        this.cardsDivDOM.innerHTML = 'No se pudo cargar la información correctamente.';
      }
    } catch (error) {
      console.error('Error al cargar los datos:', error);
      this.cardsDivDOM.innerHTML = 'Hubo un error al cargar los datos.';
    }
  }

  buscador() {
    let busquedaEncontrada = true;
    let longitudBusqueda = 0;
    this.buscadorInputDOM.addEventListener('input', async (event) => {
      this.nameSeed = this.buscadorInputDOM.value.trim();

      if (this.nameSeed == '') {
        this.page = 1;
        this.nameSeed = '';
        busquedaEncontrada = true;
        await this.cargarPeticion();
      }

      if ((this.nameSeed.length > 1 && busquedaEncontrada) || (this.nameSeed.length < longitudBusqueda)) {
        this.page = 1;
        const documentos = await this.cargarPeticion();
        busquedaEncontrada = documentos.length > 0;
        if (!busquedaEncontrada) longitudBusqueda = this.nameSeed.length;

        // Mensaje cuando no hay coincidencias
        if (!busquedaEncontrada) {
          this.cardsDivDOM.innerHTML = 'No hay semillas que coincidan con tu búsqueda.';
        }
      }
    });

    this.domBtnSearch.addEventListener('click', async () => {
      this.nameSeed = this.buscadorInputDOM.value.trim();
      this.page = 1;
      await this.cargarPeticion();
    });

    this.buscadorInputDOM.addEventListener('keypress', async (event) => {
      if (event.key == 'Enter') {
        this.nameSeed = this.buscadorInputDOM.value.trim();
        this.page = 1;
        await this.cargarPeticion();
      }
    });
  }

  cargarPaginacion(totalPages, paginaActual) {
    let paginadoDom = this.paginacionDivDOM;
    paginadoDom.classList.add('pagination');
    paginadoDom.innerHTML = '';

    if (totalPages > 0) {
      // Cargar botón anterior Paginación
      paginadoDom.append(this.btnBeforePage(paginaActual));

      // Páginas
      for (let i = 1; i <= totalPages; i++) {
        const linkPage = document.createElement('a');
        if (i == paginaActual) {
          linkPage.classList += 'active ';
        }
        linkPage.classList += 'page-link ';
        linkPage.innerHTML += i;

        linkPage.addEventListener('click', () => {
          if (paginaActual != i) {
            this.page = i;
            this.cargarPeticion();
          }
        });

        const elementLi = document.createElement('li');
        elementLi.classList += 'page-item';

        elementLi.append(linkPage);
        paginadoDom.append(elementLi);
      }

      paginadoDom.append(this.btnAfterPage(paginaActual, totalPages));
    }
  }

  cargarCards(documentos) {
    if (documentos.length > 0) {
      this.cardsDivDOM.innerHTML = '';
      documentos.forEach(({ _id, fotoPath, nombre, nombreCientifico, tipoDeSuelo, descripcion, exposicionSolar, frecuenciaRiego, cantidadRiego, temperaturaIdeal, epocaSiembra, profundidadSiembra, espaciadoPlantas, tiempoGerminacion, tiempoCosecha, cuidadosPlantas, stock }) => {
        this.cardsDivDOM.innerHTML += `
          <div class="col">
            <div class="card shadow-sm h-100">
              <img src="${fotoPath}" height="300" alt="Foto de la semilla" class="card-img-top">
              <div class="card-body">
                <h5 class="card-title">${nombre}</h5>
                <p class="card-text text-muted">${descripcion}</p>
                <p class="mb-2">
                  <strong><i class="bi bi-calendar-event"></i> Época de siembra:</strong> ${epocaSiembra}
                </p>
                <p class="mb-3">
                  <strong><i class="bi bi-box-seam"></i> Stock:</strong> ${stock} unidades disponibles
                </p>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal${_id}">
                      <i class="bi bi-eye"></i> Ver más detalles
                    </button>
                    <a href="/me/reservas/${_id}" class="btn btn-sm btn-outline-success ${this.isLoggedUser ? '' : 'disabled'}">
                      Reservar
                    </a>
                    <div class="modal modal-xl fade" id="exampleModal${_id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                      <div class="modal-dialog">
                        <div class="modal-content">
                          <div class="modal-header bg-cuaternario">
                            <h1 class="modal-title fs-5 text-light" id="exampleModalLabel">Detalles Semilla:</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <div class="modal-body">
                            <div class="row mb-4">
                              <div class="col-md-4 text-center">
                                  <img src="${fotoPath}" alt="Foto de la semilla" class="img-fluid rounded shadow-sm">
                              </div>
                              <div class="col-md-8">
                                  <h4 class="mb-3">
                                      <i class="bi bi-leaf"></i> ${nombre}
                                      <small class="text-muted">(${nombreCientifico || 'Nombre científico no disponible'})</small>
                                  </h4>
                                  <p><strong><i class="bi bi-file-text"></i> Descripción:</strong> ${descripcion}</p>
                                  <p><strong><i class="bi bi-box-seam"></i> Stock disponible:</strong>
                                      <span class="badge bg-primary">${stock}</span>
                                  </p>
                                  ${this.isLoggedUser 
                                    ? `<a href="/me/reservas/${_id}" class="btn btn-sm btn-outline-success">
                                          <i class="bi bi-check-circle"></i> Reservar
                                      </a>`
                                    : `<button class="btn btn-sm btn-outline-success" disabled>
                                          <i class="bi bi-check-circle"></i> Reservar
                                      </button>`
                                  }
                              </div>
                            </div>
                            <h5 class="mb-4"><i class="bi bi-info-circle"></i> Información Adicional</h5>
                            <table class="table table-striped">
                              <tbody>
                                <tr>
                                  <th><i class="bi bi-geo-alt"></i> Tipo de suelo</th>
                                  <td>${tipoDeSuelo || "No especificado"}</td>
                                </tr>
                                <tr>
                                  <th><i class="bi bi-brightness-high"></i> Exposición solar</th>
                                  <td>${exposicionSolar || "No especificado"}</td>
                                </tr>
                                <tr>
                                  <th><i class="bi bi-droplet"></i> Frecuencia de riego</th>
                                  <td>${frecuenciaRiego || "No especificado"}</td>
                                </tr>
                                <tr>
                                  <th><i class="bi bi-droplet-half"></i> Cantidad de riego</th>
                                  <td>${cantidadRiego || "No especificado"} ml</td>
                                </tr>
                                <tr>
                                  <th><i class="bi bi-thermometer"></i> Temperatura ideal</th>
                                  <td>${temperaturaIdeal || "No especificado"} °C</td>
                                </tr>
                                <tr>
                                  <th><i class="bi bi-calendar"></i> Época de siembra</th>
                                  <td>${epocaSiembra || "No especificado"}</td>
                                </tr>
                                <tr>
                                  <th><i class="bi bi-box"></i> Profundidad de siembra</th>
                                  <td>${profundidadSiembra || "No especificado"}</td>
                                </tr>
                                <tr>
                                  <th><i class="bi bi-arrows-expand"></i> Espaciado entre plantas</th>
                                  <td>${espaciadoPlantas || "No especificado"} cm</td>
                                </tr>
                                <tr>
                                  <th><i class="bi bi-clock"></i> Tiempo de germinación</th>
                                  <td>${tiempoGerminacion || "No especificado"} días</td>
                                </tr>
                                <tr>
                                  <th><i class="bi bi-clock-history"></i> Tiempo de cosecha</th>
                                  <td>${tiempoCosecha || "No especificado"} días</td>
                                </tr>
                                <tr>
                                  <th><i class="bi bi-heart"></i> Cuidados de la planta</th>
                                  <td>${cuidadosPlantas || "No especificado"}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
      });
    } else {
      this.cardsDivDOM.innerHTML = 'No se encontraron semillas.';
    }
  }

  btnBeforePage(paginaActual) {
    const prevBtn = document.createElement('li');
    prevBtn.classList.add('page-item');
    prevBtn.innerHTML = `<a class="page-link" href="#" aria-label="Previous">
                          <span aria-hidden="true">&laquo;</span>
                        </a>`;
    prevBtn.addEventListener('click', () => {
      if (paginaActual > 1) {
        this.page = paginaActual - 1;
        this.cargarPeticion();
      }
    });

    return prevBtn;
  }

  btnAfterPage(paginaActual, totalPaginas) {
    const nextBtn = document.createElement('li');
    nextBtn.classList.add('page-item');
    nextBtn.innerHTML = `<a class="page-link" href="#" aria-label="Next">
                          <span aria-hidden="true">&raquo;</span>
                        </a>`;
    nextBtn.addEventListener('click', () => {
      if (paginaActual < totalPaginas) {
        this.page = paginaActual + 1;
        this.cargarPeticion();
      }
    });

    return nextBtn;
  }
}


new Buscador(document.querySelector('#buscador'), document.querySelector('#paginacion'), document.querySelector('#boxSeeds'), document.querySelector('#sendSearch'));