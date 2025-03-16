document.addEventListener("DOMContentLoaded", function () {
    let confirmDeleteModal = document.getElementById('confirmDeleteModal');
    confirmDeleteModal.addEventListener('show.bs.modal', function (event) {
        let button = event.relatedTarget;
        let semillaId = button.getAttribute('data-id');
        let deleteForm = document.getElementById('deleteForm');
        deleteForm.action = "/admin/semillas/delete/" + semillaId;
    });
});