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

    return data;
  } catch (error) {
    console.error("Error al realizar la solicitud:", error.message);
    return false;
  }
};

class Buscador {
  constructor(
    domBuscador,
    domPaginacion,
    domCards,
    domBtnSearch,
    domSelectFiltroEpocaSiembra
  ) {
    this.init(
      domBuscador,
      domPaginacion,
      domCards,
      domBtnSearch,
      domSelectFiltroEpocaSiembra
    );
  }

  async init(
    domBuscador,
    domPaginacion,
    domCards,
    domBtnSearch,
    domSelectFiltroEpocaSiembra
  ) {
    this.buscadorInputDOM = domBuscador;
    this.paginacionDivDOM = domPaginacion;
    this.selectFiltroEpocaSiembraDom = domSelectFiltroEpocaSiembra;
    this.cardsDivDOM = domCards;
    this.domBtnSearch = domBtnSearch;
    this.isLoggedUser = await userLogin();
    this.page = 1;
    this.nameSeed = "";
    this.buscador();
    this.cargarPeticion();
  }

  async cargarPeticion() {
    this.peticion = `/api/public/paginateSeeds?page=${this.page}&nameseed=${this.nameSeed}&epocaSiembra=${this.selectFiltroEpocaSiembraDom.value}`;
    const documentos = await this.fetchAndLoadData();
    return documentos;
  }

  async fetchAndLoadData() {
    // Mostrar el spinner mientras se cargan los datos
    this.cardsDivDOM.innerHTML = `
      <div id="spinner-container" class="d-flex justify-content-center align-items-center w-100" style="height: 525px;">
        <div class="spinner-border text-dark" role="status">
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
        console.log("Error en la respuesta de la API:", error);
        this.cardsDivDOM.innerHTML =
          "No se pudo cargar la información correctamente.";
      }
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      this.cardsDivDOM.innerHTML = "Hubo un error al cargar los datos.";
    }
  }

  buscador() {
    let busquedaEncontrada = true;
    let longitudBusqueda = 0;
    this.buscadorInputDOM.addEventListener("input", async (event) => {
      this.nameSeed = this.buscadorInputDOM.value.trim();

      if (this.nameSeed == "") {
        this.page = 1;
        this.nameSeed = "";
        busquedaEncontrada = true;
        await this.cargarPeticion();
      }

      if (
        (this.nameSeed.length > 1 && busquedaEncontrada) ||
        this.nameSeed.length < longitudBusqueda
      ) {
        this.page = 1;
        const documentos = await this.cargarPeticion();
        busquedaEncontrada = documentos.length > 0;
        if (!busquedaEncontrada) longitudBusqueda = this.nameSeed.length;

        // Mensaje cuando no hay coincidencias
        if (!busquedaEncontrada) {
          this.cardsDivDOM.innerHTML =
            "No hay semillas que coincidan con tu búsqueda.";
        }
      }
    });

    this.domBtnSearch.addEventListener("click", async () => {
      this.nameSeed = this.buscadorInputDOM.value.trim();
      this.page = 1;
      await this.cargarPeticion();
    });

    this.buscadorInputDOM.addEventListener("keypress", async (event) => {
      if (event.key == "Enter") {
        this.nameSeed = this.buscadorInputDOM.value.trim();
        this.page = 1;
        await this.cargarPeticion();
      }
    });
  }

  cargarPaginacion(totalPages, paginaActual) {
    let paginadoDom = this.paginacionDivDOM;
    paginadoDom.classList.add("pagination");
    paginadoDom.innerHTML = "";

    if (totalPages > 0) {
      // Cargar botón anterior Paginación
      paginadoDom.append(this.btnBeforePage(paginaActual));

      // Páginas
      for (let i = 1; i <= totalPages; i++) {
        const linkPage = document.createElement("a");
        if (i == paginaActual) {
          linkPage.classList += "active ";
        }
        linkPage.classList += "page-link ";
        linkPage.innerHTML += i;

        linkPage.addEventListener("click", () => {
          if (paginaActual != i) {
            this.page = i;
            this.cargarPeticion();
          }
        });

        const elementLi = document.createElement("li");
        elementLi.classList += "page-item";

        elementLi.append(linkPage);
        paginadoDom.append(elementLi);
      }

      paginadoDom.append(this.btnAfterPage(paginaActual, totalPages));
    }
  }

  cargarCards(documentos) {
    if (documentos.length > 0) {
      this.cardsDivDOM.innerHTML = "";
      documentos.forEach(
        ({
          _id,
          fotoPath,
          nombre,
          nombreCientifico,
          tipoDeSuelo,
          descripcion,
          exposicionSolar,
          frecuenciaRiego,
          cantidadRiego,
          temperaturaIdeal,
          epocaSiembra,
          profundidadSiembra,
          espaciadoPlantas,
          tiempoGerminacion,
          tiempoCosecha,
          cuidadosPlantas,
          stock,
        }) => {
          this.cardsDivDOM.innerHTML += `
            <div class="col">
              <div class="card shadow-sm h-100">
                <div id="carouselSemillas${_id}" class="carousel slide" data-bs-ride="carousel">
                  <div class="carousel-indicators">
                    ${fotoPath.map((_, index) => `
                      <button type="button" aria-label="Slider" data-bs-target="#carouselSemillas${_id}" data-bs-slide-to="${index}" class="${index === 0 ? 'active' : ''}" aria-current="${index === 0 ? 'true' : ''}"></button>
                    `).join('')}
                  </div>
                  <div class="carousel-inner">
                    ${fotoPath.map((foto, index) => `
                      <div class="carousel-item ${index === 0 ? 'active' : ''}">
                        <img src="${foto}" class="d-block w-100" height="300" alt="Foto de la semilla">
                      </div>
                    `).join('')}
                  </div>
                  <button class="carousel-control-prev" type="button" data-bs-target="#carouselSemillas${_id}" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                  </button>
                  <button class="carousel-control-next" type="button" data-bs-target="#carouselSemillas${_id}" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                  </button>
                </div>
                <div class="card-body">
                  <p class="card-title">${nombre}</p>
                  <p class="card-text text-muted">${descripcion}</p>
                  <p class="mb-2">
                    <span class="fw-bold"><i class="bi bi-calendar-event"></i> Época de siembra:</span> ${epocaSiembra}
                  </p>
                  <p class="mb-3">
                    <span class="fw-bold"><i class="bi bi-box-seam"></i> Stock:</span> ${stock} unidades disponibles
                  </p>
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group">
                      <button type="button" class="btn btn-sm btn-outline-secondary btn-details" data-semilla-id="${_id}">
                        <i class="bi bi-eye"></i> Ver más detalles
                      </button>
                      <button type="button" class="btn btn-sm btn-outline-secondary btn-reservar" data-semilla-id="${_id}" ${this.isLoggedUser ? "" : "disabled"}>
                        <i class="bi-calendar"></i> Reservar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>`;
        }
      );

      //Modal reservas
      const btnsReservas = document.querySelectorAll(".btn-reservar");
      btnsReservas.forEach((btn) => {
        btn.addEventListener("click", async function () {
          const idSeeds = btn.getAttribute("data-semilla-id");

          try {
            const response = await fetch(
              `/api/public/seedId?seedId=${idSeeds}`
            );

            // Verifica si la respuesta fue exitosa (status 200)
            if (!response.ok) {
              throw new Error(
                "Error en la respuesta de la API: " + response.status
              );
            }

            const responseObject = await response.json();
            const { data, err } = responseObject;

            if (err) {
              // Si hay un error en la respuesta, lo mostramos en consola
              console.error("Error recibido desde la API:", data);
            } else {
              const { _id, nombre, stock } = data;

              document.querySelector("#reservarBox").innerHTML = `
                    <div class="modal fade" id="reservaModal" aria-hidden="true">
                      <div class="modal-dialog">
                        <div class="modal-content">
                          <!-- Encabezado atractivo -->
                          <div class="modal-header bg-cuaternario text-white">
                            <h1 class="modal-title fs-4">
                              <i class="bi bi-calendar-check"></i> Reservar semilla: ${nombre}
                            </h1>
                            <button type="button" aria-label="modal" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                          </div>

                          <div class="modal-body p-4">
                            <div class="row">
                              <form id="reservationForm${_id}" action="/me/reservas/${_id}" method="POST" class="needs-validation" novalidate>
                                <!-- Cantidad de semillas -->
                                <div class="mb-4">
                                  <label for="amountSeeds" class="form-label fw-bold">
                                    <i class="bi bi-pencil-square"></i> Cantidad a reservar (Máx: ${stock}):
                                  </label>
                                  <input 
                                    type="number" 
                                    class="form-control form-control-lg" 
                                    id="amountSeeds${_id}" 
                                    name="amountSeeds" 
                                    min="1" 
                                    max="${stock}" 
                                    required
                                    placeholder="Ingrese la cantidad"
                                  />
                                  <div class="invalid-feedback">
                                    Por favor ingrese una cantidad válida entre 1 y ${stock}.
                                  </div>
                                </div>

                                <!-- Botón de reserva -->
                                <div class="d-grid">
                                  <button type="submit" class="btn btn-lg btn-success shadow-sm">
                                    <i class="bi bi-check-circle-fill"></i> Confirmar Reserva
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    `;

              const modal = new bootstrap.Modal(
                document.getElementById("reservaModal")
              );
              modal.show();
            }
          } catch (error) {
            // Si algo falla durante la solicitud, mostramos el error en consola
            console.error("Error durante la solicitud fetch:", error.message);
          }
        });
      });

      const btnDetallesSeeds = document.querySelectorAll(".btn-details");

      btnDetallesSeeds.forEach((btn) => {
        btn.addEventListener("click", async function () {
          const idSeeds = btn.getAttribute("data-semilla-id");
          try {
            const response = await fetch(
              `/api/public/seedId?seedId=${idSeeds}`
            );

            // Verifica si la respuesta fue exitosa (status 200)
            if (!response.ok) {
              throw new Error(
                "Error en la respuesta de la API: " + response.status
              );
            }

            const responseObject = await response.json();
            const { data, err } = responseObject;

            if (err) {
              console.error("Error recibido desde la API:", data);
            } else {
              const {
                _id,
                nombre,
                stock,
                nombreCientifico,
                fotoPath,
                descripcion,
                tipoDeSuelo,
                exposicionSolar,
                frecuenciaRiego,
                cantidadRiego,
                temperaturaIdeal,
                epocaSiembra,
                profundidadSiembra,
                espaciadoPlantas,
                tiempoGerminacion,
                tiempoCosecha,
                cuidadosPlantas,
              } = data;

              document.querySelector("#detallesBox").innerHTML = `
                <div class="modal modal-xl fade" id="details" aria-hidden="true">
                  <div class="modal-dialog">
                    <div class="modal-content">
                      <div class="modal-header bg-cuaternario">
                        <h1 class="modal-title fs-5 text-light" id="exampleModalLabel">Detalles Semilla: ${nombre}</h1>
                        <button type="button"  aria-label="close" class="btn-close" data-bs-dismiss="modal"></button>
                      </div>
                      <div class="modal-body">
                        
                        <h4 class="mb-3">
                          <i class="bi bi-leaf"></i> ${nombre}
                          <small class="text-muted">(${nombreCientifico || "Nombre científico no disponible"})</small>
                        </h4>
                        <p><span class="fw-bold"><i class="bi bi-file-text"></i> Descripción:</span> ${descripcion}</p>
                        <p><span class="fw-bold"><i class="bi bi-box-seam"></i> Stock disponible:</span>
                          <span class="badge bg-cuaternario">${stock}</span>
                        </p>
                        <h5 class="mb-4"><i class="bi bi-info-circle"></i> Información Adicional</h5>
                        <table class="table table-striped">
                          <tbody>
                            <tr><th><i class="bi bi-geo-alt"></i> Tipo de suelo</th><td>${tipoDeSuelo || "No especificado"}</td></tr>
                            <tr><th><i class="bi bi-brightness-high"></i> Exposición solar</th><td>${exposicionSolar || "No especificado"}</td></tr>
                            <tr><th><i class="bi bi-droplet"></i> Frecuencia de riego</th><td>${frecuenciaRiego || "No especificado"}</td></tr>
                            <tr><th><i class="bi bi-droplet-half"></i> Cantidad de riego</th><td>${cantidadRiego || "No especificado"} ml</td></tr>
                            <tr><th><i class="bi bi-thermometer"></i> Temperatura ideal</th><td>${temperaturaIdeal || "No especificado"} °C</td></tr>
                            <tr><th><i class="bi bi-calendar"></i> Época de siembra</th><td>${epocaSiembra || "No especificado"}</td></tr>
                            <tr><th><i class="bi bi-box"></i> Profundidad de siembra</th><td>${profundidadSiembra || "No especificado"}</td></tr>
                            <tr><th><i class="bi bi-arrows-expand"></i> Espaciado entre plantas</th><td>${espaciadoPlantas || "No especificado"} cm</td></tr>
                            <tr><th><i class="bi bi-clock"></i> Tiempo de germinación</th><td>${tiempoGerminacion || "No especificado"} días</td></tr>
                            <tr><th><i class="bi bi-clock-history"></i> Tiempo de cosecha</th><td>${tiempoCosecha || "No especificado"} días</td></tr>
                            <tr><th><i class="bi bi-heart"></i> Cuidados de la planta</th><td>${cuidadosPlantas || "No especificado"}</td></tr>
                          </tbody>
                        </table>

                        <div class="row mb-4">
                          <h3>Galería:</h3>
                          <div class="col-md-12">
                            <div class="row">
                              ${fotoPath.map(foto => `
                                <div class="col-md-3 mb-3 text-center">
                                  <img src="${foto}" alt="Foto de la semilla" class="img-fluid rounded shadow-sm">
                                </div>
                              `).join('')}
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>

                    `;

              const modal = new bootstrap.Modal(
                document.getElementById("details")
              );
              modal.show();
            }
          } catch (error) {
            // Si algo falla durante la solicitud, mostramos el error en consola
            console.error("Error durante la solicitud fetch:", error.message);
          }
        });
      });
    } else {
      this.cardsDivDOM.innerHTML = "No se encontraron semillas.";
    }
  }

  btnBeforePage(paginaActual) {
    const prevBtn = document.createElement("li");
    prevBtn.classList.add("page-item");
    prevBtn.innerHTML = `<a class="page-link">
                          <span aria-hidden="true">&laquo;</span>
                        </a>`;
    prevBtn.addEventListener("click", () => {
      if (paginaActual > 1) {
        this.page = Number(paginaActual) - 1;
        this.cargarPeticion();
      }
    });

    return prevBtn;
  }

  btnAfterPage(paginaActual, totalPaginas) {
    const nextBtn = document.createElement("li");
    nextBtn.classList.add("page-item");
    nextBtn.innerHTML = `<a class="page-link">
                          <span aria-hidden="true">&raquo;</span>
                        </a>`;
    nextBtn.addEventListener("click", () => {
      if (paginaActual < totalPaginas) {
        this.page = Number(paginaActual) + 1;
        this.cargarPeticion();
      }
    });

    return nextBtn;
  }
}

const btnSaveFilterEpocaSiembra = document.querySelector(
  "#btn_guardar_filtro_epoca_siembra"
);
const filterLocalStore = localStorage.getItem("filtro");
const domFilterEpocaSiembra = document.querySelector("#select_epoca_siembra");
const domBtnSearch = document.querySelector("#sendSearch");
const domCardsSeeds = document.querySelector("#boxSeeds");
const domPaginationSearch = document.querySelector("#paginacion");
const domInputSearch = document.querySelector("#buscador");

const buscador = new Buscador(
  domInputSearch,
  domPaginationSearch,
  domCardsSeeds,
  domBtnSearch,
  domFilterEpocaSiembra
);

//Filtros localStore
btnSaveFilterEpocaSiembra.addEventListener("click", () => {
  localStorage.setItem("filtro", domFilterEpocaSiembra.value);
});

domFilterEpocaSiembra.addEventListener("input", () => {
  buscador.page = 1;
  buscador.cargarPeticion();
});

if (filterLocalStore) {
  domFilterEpocaSiembra.querySelectorAll("option").forEach((option) => {
    if (filterLocalStore == option.getAttribute("value")) {
      option.setAttribute("selected", true);
    }
  });
} else {
  domFilterEpocaSiembra
    .querySelectorAll("option")[0]
    .setAttribute("selected", true);
}