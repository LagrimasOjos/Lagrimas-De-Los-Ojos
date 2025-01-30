
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

