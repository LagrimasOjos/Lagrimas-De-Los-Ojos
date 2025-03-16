class UsuariosSearch {
    constructor() {
        this.input = document.querySelector('#buscadorUsuarios');
        this.content = document.querySelector('.content');
        this.paginacion = document.querySelector('#paginacion')

        this.currentPage = 1;
        this.totalPages = 1;
        const params = new URLSearchParams(window.location.search); 
        this.busqueda = params.has('emailUser') ? params.get('emailUser') : '';
        this.input.value = this.busqueda;
        this.initListeners();
        this.fetchUsuarios();
    }

    initListeners() {
        this.input.addEventListener('input', () => this.fetchUsuarios(1));
    }

    async fetchUsuarios() {
        let busqueda = this.input.value;

        try {
            
            const response = await fetch(`/api/admin/usuariosEmailFind?emailUser=${busqueda}&pagina=${this.currentPage}`);
            const { data, error } = await response.json();

            if (!error) {
                let { documentos, totalPaginas, paginaActual } = data;

                if(totalPaginas < this.currentPage){
                    this.currentPage = 1;
                    this.fetchUsuarios();
                }

                this.currentPage = paginaActual;
                this.totalPages = totalPaginas;
                
                this.renderUsuarios(documentos, busqueda);
                this.updatePagination();
            }

        } catch (error) {
            console.log(error)
            this.content.innerHTML = '<tr><td colspan="7" class="text-center">No hay usuarios disponibles.</td></tr>';
        }
    }

    renderUsuarios(usuarios, busqueda) {
        this.content.innerHTML = '';

        if (usuarios.length > 0) {
            usuarios.forEach((usuario, index) => {
                const card = document.createElement('div');
                card.className = 'col-12';

                card.innerHTML = `
                     <div class="card shadow-lg p-3 bg-body-tertiary rounded my-3">
                        <div class="card-body">
                            <div class="row align-items-center">
                
                                <div class="col-lg-8 col-md-12">
                                    <h5 class="card-title"><i class="bi bi-person-circle"></i> ${usuario.username}</h5>
                                    <p class="card-text"><span class="fw-bold">Email:</span> ${usuario.email}</p>
                                    <p class="card-text"><span class="fw-bold">Teléfono:</span> ${usuario.phone}</p>
                                    <p class="card-text"><span class="fw-bold">Rol:</span> ${usuario.rol}</p>
                                    <p class="card-text"><span class="fw-bold">Activo:</span> ${usuario.activo}</p>
                                </div>

                
                                <div class="col-lg-4 col-md-12 mt-3 mt-lg-0 d-grid gap-2">
                                    <button type="button" class="btn btn-danger" data-bs-toggle="modal"
                                        data-userId="${usuario._id}" data-userEmail="${usuario.email}" data-bs-target="#modalEliminar">
                                        Eliminar usuario
                                    </button>
                                    <a href="/admin/reservas?emailUser=${usuario.email}" class="btn btn-primary">Ver Reservas</a>
                                    <a href="/admin/prestamos?emailUser=${usuario.email}" class="btn btn-secondary">Ver Préstamos</a>
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
                    <p class="text-muted ">No se encontraron reservas para: ${busqueda}</p>
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
                this.fetchUsuarios();
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
                    this.fetchUsuarios();
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
            
                this.fetchUsuarios();
            }
        });

        this.paginacion.append(sigBtn);
    }

}

new UsuariosSearch();

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

