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
        if(reservas.length > 0){
            reservas.forEach((reserva, index) => {
            const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${reserva.username} (${reserva.emailUser})</td>
                    <td>${reserva.nameSeed}</td>
                    <td>${reserva.amountSeeds}</td>
                    <td>
                       <i class="
                            ${reserva.status === 'recogidas' ? 'text-success bi bi-circle-fill' : 
                            reserva.status === 'pendiente' ? 'text-warning bi bi-circle-fill' : 
                            reserva.status === 'no recogidas' ? 'text-danger bi bi-circle-fill' : ''}">
                        </i> ${reserva.status}
                    </td>
                    <td>${new Date(reserva.collectionDate).toLocaleDateString()}</td>
                    <td>
                        ${reserva.status === 'pendiente' ? `
                            <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#recogerModal" data-id="${reserva._id}">
                                <i class="bi bi-check-circle"></i> Ha venido a recogerlo
                            </button>
                            <button class="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#cancelarModal" data-id="${reserva._id}" data-userId="${reserva.idUser}">
                                <i class="bi bi-trash"></i> Cancelar Reserva
                            </button>
                        ` : 'N/A'}
                    </td>
                `;
                this.content.appendChild(row);
            });
        }else{
            this.content.innerHTML = `<tr><td colspan="7" class="text-center">No se encontraron reservas para: ${busqueda}</td></tr>`;
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