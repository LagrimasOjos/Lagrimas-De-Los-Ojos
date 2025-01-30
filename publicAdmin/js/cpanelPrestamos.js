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
                this.currentPage = paginaActual;
                this.totalPages = totalPaginas;

                this.renderPrestamos(documentos, busqueda);
                this.updatePagination();
            }

        } catch (error) {
            this.content.innerHTML = '<tr><td colspan="7" class="text-center">No hay prestamos disponibles.</td></tr>';
        }
    }

    renderPrestamos(prestamos, busqueda) {
        this.content.innerHTML = '';
        if (prestamos.length > 0) {
            prestamos.forEach((prestamo, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td><i class="bi bi-person-circle"></i> ${prestamo.username} (${prestamo.emailUser})</td>
                    <td><i class="bi bi-tree"></i> ${prestamo.nameSeed}</td>
                    <td><i class="bi bi-box-fill"></i> ${prestamo.amountSeeds}</td>
                    <td>
                    <i class="bi bi-circle-fill text-${prestamo.status === 'sin devolver' ? 'warning' : 'success'}"></i> 
                    ${prestamo.status === 'sin devolver' ? 'Sin Devolver' : 'Devuelto'}
                    </td>
                    <td>
                    <i class="bi bi-clock"></i> ${prestamo.fechaDevolucion ? new Date(prestamo.fechaDevolucion).toLocaleDateString() : 'N/A'}
                    </td>
                    <td>${prestamo.seedsReturned}</td>
                    <td>${new Date(prestamo.fechaEntregaSemilla).toLocaleDateString()}</td>
                    <td>
                    ${prestamo.status === 'sin devolver' ? 
                        `<button type="button" class="btn btn-success btn-sm" data-bs-toggle="modal"
                        data-bs-target="#devueltoModal" data-id="${prestamo._id}" data-seeds="${prestamo.amountSeeds}">
                        <i class="bi bi-check-circle"></i> Marcar como devuelto
                        </button>` : 'N/A'}
                    </td>
                `;

                this.content.appendChild(row);
            });
        } else {
            this.content.innerHTML = `<tr><td colspan="7" class="text-center">No se encontraron prestamos para: ${busqueda}</td></tr>`;
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