window.onload = () => {
    // Abrir el modal si el mensaje existe
    var messageModal = new bootstrap.Modal(document.getElementById('messageModal'), {
        keyboard: false
    });
    messageModal.show();
}