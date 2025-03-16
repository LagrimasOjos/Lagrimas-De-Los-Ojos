class PrestamosSearch {
    constructor() {
        this.input = document.querySelector('#buscadorPrestamos');
        this.content = document.querySelector('.content');
        this.paginacion = document.querySelector('#paginacion')

        this.currentPage = 1;
        this.totalPages = 1;
        const params = new URLSearchParams(window.location.search);
        this.busqueda = params.has('emailUser') ? params.get('emailUser') : '';
        this.input.value = this.busqueda;
        this.initListeners();
        this.fetchPrestamos();
    }

    initListeners() {
        this.input.addEventListener('input', () => this.fetchPrestamos(1));
    }

    async fetchPrestamos() {
        let busqueda = this.input.value;

        try {
            const response = await fetch(`/api/admin//prestamosEmailFind?emailUser=${busqueda}&pagina=${this.currentPage}`);
            const { data, error } = await response.json();

            if (!error) {
                const { documentos, totalPaginas, paginaActual } = data;

                if(totalPaginas < this.currentPage){
                    this.currentPage = 1;
                    this.fetchPrestamos();
                }

                this.currentPage = paginaActual;
                this.totalPages = totalPaginas;

                this.renderPrestamos(documentos, busqueda);
                this.updatePagination();
            }

        } catch (error) {
            this.content.innerHTML = '<tr><td colspan="9" class="text-center">No hay prestamos disponibles.</td></tr>';
        }
    }

    renderPrestamos(prestamos, busqueda) {
        this.content.innerHTML = '';
    
        if (prestamos.length > 0) {
            prestamos.forEach((prestamo, index) => {
                const card = document.createElement('div');
                card.className = 'col-12';
    
                card.innerHTML = `
                    <div class="card shadow-lg p-3 bg-body-tertiary rounded my-3">
                        <div class="card-body">
                            <div class="row align-items-center">

                                <div class="col-lg-8 col-md-12">
                                    
                                    <h5 class="card-title"><i class="bi bi-person-circle"></i> ${prestamo.username} (${prestamo.emailUser})</h5>
                                    <p class="card-text"><i class="bi bi-tree"></i> <span class="fw-bold">Semilla:</span> ${prestamo.nameSeed}</p>
                                    <p class="card-text"><i class="bi bi-box-fill"></i> <span class="fw-bold">Cantidad Prestada:</span> ${prestamo.amountSeeds}</p>
                                    <p class="card-text">
                                        <i class="bi bi-circle-fill text-${prestamo.status === 'sin devolver' ? 'warning' : 'success'}"></i> 
                                        <span class="fw-bold">Estado:</span> ${prestamo.status}
                                    </p>
                                    <p class="card-text">
                                        <i class="bi bi-clock"></i> <span class="fw-bold">Fecha Devolución:</span> 
                                        ${prestamo.fechaDevolucion ? new Date(prestamo.fechaDevolucion).toLocaleDateString() : 'N/A'}
                                    </p>
                                    <p class="card-text"><i class="bi bi-flower3"></i> <span class="fw-bold">Semillas Devueltas:</span> ${prestamo.seedsReturned}</p>
                                    <p class="card-text"><i class="bi bi-calendar-event"></i> <span class="fw-bold">Fecha Entrega:</span> ${new Date(prestamo.fechaEntregaSemilla).toLocaleDateString()}</p>
                                </div>
    
                             
                                <div class="col-lg-4 col-md-12 mt-3 mt-lg-0 d-grid gap-2">
                                    ${prestamo.status === 'sin devolver' ? 
                                        `<button type="button" class="btn btn-success" data-bs-toggle="modal"
                                        data-bs-target="#devueltoModal" data-id="${prestamo._id}" data-seeds="${prestamo.amountSeeds}">
                                        <i class="bi bi-check-circle"></i> Marcar como devuelto
                                        </button>` 
                                        : '<span class="text-muted text-center">No hay acciones disponibles</span>'}
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
                    <p class="text-muted">No se encontraron préstamos para: ${busqueda}</p>
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

    btnprevio() {
        const prevBtn = document.createElement('li');
        prevBtn.classList.add('page-item');
        prevBtn.innerHTML = `
            <a class="page-link" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
            </a>`;
        prevBtn.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage = Number(this.currentPage) - 1;
                this.fetchPrestamos();
            }
        });

        this.paginacion.prepend(prevBtn);
    }

    numerospaginacion() {
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
                    this.fetchPrestamos();
                }
            });

            const elementLi = document.createElement('li');
            elementLi.classList += 'page-item';

            elementLi.append(linkPage);
            this.paginacion.append(elementLi);
        }
    }


    btnSiguiente() {
        const sigBtn = document.createElement('li');
        sigBtn.classList.add('page-item');
        sigBtn.innerHTML = `
            <a class="page-link" aria-label="Previous">
                <span aria-hidden="true">&raquo;</span>
            </a>`;
        sigBtn.addEventListener('click', () => {
            if (this.currentPage < this.totalPages) {
                this.currentPage = Number(this.currentPage) + 1;
              
                this.fetchPrestamos();
            }
        });

        this.paginacion.append(sigBtn);
    }

}

new PrestamosSearch();


const devueltoModal = document.getElementById('devueltoModal');
devueltoModal.addEventListener('show.bs.modal', function (event) {
    const button = event.relatedTarget; // Botón que disparó el modal
    const prestamoId = button.getAttribute('data-id'); // Obtener el ID del préstamo
    const modalPrestamoId = document.getElementById('modalPrestamoId');
    modalPrestamoId.value = prestamoId;
});