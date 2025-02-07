const form = document.getElementById('resetPasswordForm');
    const newPassword = document.getElementById('new-password');
    const confirmPassword = document.getElementById('confirm-password');

    form.addEventListener('submit', function(event) {
        let valid = true;


        if (newPassword.value.length < 8) {
            alert('La contraseña debe ser mayor de 8 caracteres')
            valid = false;
        }

        if (newPassword.value != confirmPassword.value) {
            alert('Las contraseñas deben de ser iguales')
            valid = false;
        }

        
        if (!valid) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            form.classList.add('was-validated');
        }
    });