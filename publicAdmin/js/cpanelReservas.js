class ReservaSearch {
    constructor() {
        this.input = document.querySelector('#buscadorReservas');
        this.content = document.querySelector('.content');
        this.paginacion = document.querySelector('#paginacion')

        this.currentPage = 1;
        this.totalPages = 1;
        const params = new URLSearchParams(window.location.search); 
        this.busqueda = params.has('emailUser') ? params.get('emailUser') : '';
        this.input.value = this.busqueda;
        this.initListeners();
        this.fetchReservas();
    }

    initListeners() {
        this.input.addEventListener('input', () => this.fetchReservas(1));
    }

    async fetchReservas() {
        let busqueda = this.input.value;

        try {
            const response = await fetch(`/api/admin/reservasEmailFind?emailUser=${busqueda}&pagina=${this.currentPage}`);
            const { data, error } = await response.json();
           
            if (!error) {
                const { documentos, totalPaginas, paginaActual } = data;
                if(totalPaginas < this.currentPage){
                    this.currentPage = 1;
                    this.fetchReservas();
                }
                this.currentPage = paginaActual;
                this.totalPages = totalPaginas;

                this.renderReservas(documentos, busqueda);
                this.updatePagination();
            }

        } catch (error) {
            this.content.innerHTML = '<tr><td colspan="7" class="text-center">No hay reservas disponibles.</td></tr>';
        }
    }

    renderReservas(reservas, busqueda) {
        this.content.innerHTML = '';
    
        if (reservas.length > 0) {
            reservas.forEach((reserva, index) => {
                const card = document.createElement('div');
                card.className = 'col-12'; // Tarjeta en una fila completa
    
                card.innerHTML = `
                    <div class="card shadow-lg p-3 bg-body-tertiary rounded my-3">
                        <div class="card-body">
                            <div class="row align-items-center">
                              
                                <div class="col-lg-8 col-md-12">
                                    <h5 class="card-title"><i class="bi bi-person-circle"></i> ${reserva.username} (${reserva.emailUser})</h5>
                                    <p class="card-text"><i class="bi bi-tree"></i> <span class="fw-bold">Semilla:</span> ${reserva.nameSeed}</p>
                                    <p class="card-text"><i class="bi bi-box-fill"></i> <span class="fw-bold">Cantidad Reservada:</span> ${reserva.amountSeeds}</p>
                                    <p class="card-text">
                                        <i class="
                                            ${reserva.status === 'recogidas' ? 'text-success bi bi-circle-fill' : 
                                            reserva.status === 'pendiente' ? 'text-warning bi bi-circle-fill' : 
                                            reserva.status === 'no recogidas' ? 'text-danger bi bi-circle-fill' : ''}">
                                        </i> <span class="fw-bold">Estado:</span> ${reserva.status}
                                    </p>
                                    <p class="card-text"><i class="bi bi-calendar-event"></i> <span class="fw-bold">Fecha de Recogida:</span> ${new Date(reserva.collectionDate).toLocaleDateString()}</p>
                                </div>
    
                       
                                <div class="col-lg-4 col-md-12 mt-3 mt-lg-0 d-grid gap-2">
                                    ${reserva.status === 'pendiente' ? `
                                        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#recogerModal" data-id="${reserva._id}">
                                            <i class="bi bi-check-circle"></i> Ha venido a recogerlo
                                        </button>
                                        <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#cancelarModal" data-id="${reserva._id}" data-userId="${reserva.idUser}">
                                            <i class="bi bi-trash"></i> Cancelar Reserva
                                        </button>
                                    ` : '<span class="text-muted text-center">No hay acciones disponibles</span>'}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
    
                this.content.appendChild(card);
            });
        } else {
            this.content.innerHTML = `
                <div class="col-12 text-center">
                    <p class="text-muted">No se encontraron reservas para: ${busqueda}</p>
                </div>
            `;
        }
    }
    

    updatePagination() {
        this.paginacion.innerHTML = '';

        this.btnprevio();

        this.numerospaginacion();

        this.btnSiguiente();

    }

    btnprevio(){
        const prevBtn = document.createElement('li');
        prevBtn.classList.add('page-item');
        prevBtn.innerHTML = `
                    <a class="page-link" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>`;
        prevBtn.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage = Number(this.currentPage) - 1;
                this.fetchReservas();
            }
        });

        this.paginacion.prepend(prevBtn);
    }

    numerospaginacion(){
        for (let i = 1; i <= this.totalPages; i++) {
            const linkPage = document.createElement('a');
            if (i == this.currentPage) {
                linkPage.classList += 'active ';
            }
            linkPage.classList += 'page-link ';
            linkPage.innerHTML += i;

            linkPage.addEventListener('click', () => {
                if (this.currentPage != i) {
                    this.currentPage = i;
                    this.fetchReservas();
                }
            });

            const elementLi = document.createElement('li');
            elementLi.classList += 'page-item';

            elementLi.append(linkPage);
            this.paginacion.append(elementLi);
        }
    }


    btnSiguiente(){
        const sigBtn = document.createElement('li');
        sigBtn.classList.add('page-item');
        sigBtn.innerHTML = `
                    <a class="page-link" aria-label="Previous">
                        <span aria-hidden="true">&raquo;</span>
                    </a>`;
        sigBtn.addEventListener('click', () => {
            if (this.currentPage < this.totalPages) {
                this.currentPage = Number(this.currentPage) + 1;
             
                this.fetchReservas();
            }
        });

        this.paginacion.append(sigBtn);
    }

}

new ReservaSearch();


const recogerModal = document.getElementById('recogerModal');
const idReservaInput = document.getElementById('idReservaInput');

recogerModal.addEventListener('show.bs.modal', function (event) {
    const button = event.relatedTarget; // Botón que activó el modal
    const reservaId = button.getAttribute('data-id'); // Obtiene el ID de la reserva
    idReservaInput.value = reservaId; // Asigna el ID al input oculto
});

// Configuración del modal "Cancelar Reserva"
const cancelModal = document.getElementById('cancelarModal');
const cancelReservaInput = document.getElementById('cancelReservaInput');
const cancelUserInput = document.getElementById('cancelUserInput');

cancelModal.addEventListener('show.bs.modal', function (event) {
    const button = event.relatedTarget; // Botón que activó el modal
    const reservaId = button.getAttribute('data-id');
    const userId = button.getAttribute('data-userId');
    cancelUserInput.value = userId;
    cancelReservaInput.value = reservaId; // Asigna el ID al input oculto
})