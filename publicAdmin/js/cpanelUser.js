class ModalReservas {
    constructor(modalElement) {
        this.modalElement = modalElement;
        this.tbody = modalElement.querySelector('#modalReservasBody');
        this.pagination = modalElement.querySelector('#pagination');
        this.userId = null;
        this.currentPage = 1;
        this.totalPaginas = 1;
        this.modalElement.addEventListener('show.bs.modal', this.handleShow.bind(this)); //bind es para pasarle el puntero del evento
    }

    async handleShow(event) {
        const button = event.relatedTarget;
        this.userId = button.getAttribute('data-userId');
        this.modalElement.querySelector('#modalReservasTitle').innerHTML = `Reservas de ${button.getAttribute('data-username')} (${button.getAttribute('data-email')}) `
        this.currentPage = 1;
        await this.cargarReservas(this.currentPage);
    }

    async cargarReservas(pagina) {
        const response = await fetch(`/api/admin/reservarsUserId?idUser=${this.userId}&pagina=${pagina}`);
        
        const { data, error } = await response.json();

        this.modalTitle = data;
        if (!error && data.documentos.length > 0) {
            this.tbody.innerHTML = '';
            this.totalPaginas = data.totalPaginas;
            data.documentos.forEach(({ nameSeed, collectionDate, amountSeeds, status }) => {
                this.tbody.innerHTML +=
                    `
                        <tr>
                            <td>${nameSeed}</td>
                            <td>${new Date(collectionDate).toLocaleDateString()}</td>
                            <td>${amountSeeds}</td>
                            <td>${status}</td>
                            <td>
                                <button class="btn btn-sm btn-primary">Cancelar Reserva</button>
                                <button class="btn btn-sm btn-primary">Ha venido a recogerlas</button>
                            </td>
                        </tr>
                `});
            this.actualizarPaginacion();
        }else{
            this.tbody.innerHTML = 'No hay registros';
            this.pagination.innerHTML = '';
        }

    }

    actualizarPaginacion() {
        this.pagination.innerHTML = '';
        for (let i = 1; i <= this.totalPaginas; i++) {

            const li = document.createElement('li');

            li.classList.add('page-item');

            li.innerHTML = `<a class="page-link">${i}</a>`;

            if (i === this.currentPage) {
                li.classList.add('active');
            } else {
                li.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.currentPage = i;
                    this.cargarReservas(i);
                });
            }
            this.pagination.appendChild(li);
        }
    }
}
//new ModalReservas(document.getElementById('modalReservas'));

const modalEliminar = document.querySelector('#modalEliminar');

modalEliminar.addEventListener('show.bs.modal', async function (event){
    const btn_historico_false = modalEliminar.querySelector('#btn_historico_false');
    const btn_historico_true = modalEliminar.querySelector('#btn_historico_true');
    const formEliminar = modalEliminar.querySelector('form');


    const button = event.relatedTarget;
    const userId = button.getAttribute('data-userId');
    const userEmail = button.getAttribute('data-userEmail');

    modalEliminar.querySelector('.modal-title').innerHTML = `Eliminar usuario: ${userEmail}`;

    let eliminarHistorico = true;
    
    formEliminar.querySelector('#idUser').value = userId;
    formEliminar.querySelector('#borrarHistorico').value = eliminarHistorico;

    btn_historico_false.addEventListener('click',()=>{
        eliminarHistorico = false
        formEliminar.querySelector('#borrarHistorico').value = eliminarHistorico;
        formEliminar.submit();
    });

    btn_historico_true.addEventListener('click',()=>{
        eliminarHistorico = true
        formEliminar.querySelector('#borrarHistorico').value = eliminarHistorico;
        formEliminar.submit();
    });

});

