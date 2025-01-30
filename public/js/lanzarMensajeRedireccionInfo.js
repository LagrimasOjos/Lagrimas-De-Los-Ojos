window.onload = () => {
    // Abrir el modal si el mensaje existe
    var messageModal = new bootstrap.Modal(document.getElementById('messageModalRedirect'), {
        keyboard: false
    });
    messageModal.show();
}