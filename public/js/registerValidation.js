// TODO Metemos async/await para el correo. Nos toca marcar las funciones como async
(async function () {
    "use strict";
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll(".needs-validation");
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms).forEach(function (form) {
        form.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();
                event.stopPropagation();

                const esValido = await realizarMiValidacion(form);

                if (form.checkValidity() && esValido) {
                    form.submit(); // Solo enviar si todas las validaciones son correctas
                }

                form.classList.add("was-validated");
            },
            false
        );
    });

    const actualizarEstado = (input, valido) => {
        if (valido) {
            input.classList.remove("is-invalid");
            input.classList.add("is-valid");
            input.setCustomValidity(""); //Mensaje de error nativo de HTML5. Nunca se muestra pero controla el color del input
        } else {
            input.classList.remove("is-valid");
            input.classList.add("is-invalid");
            input.setCustomValidity("Is invalid"); //Mensaje de error nativo de HTML5. Nunca se muestra pero controla el color del input
        }
    };
    /**
     * TODO Ver
     */
    const mismaPwd = (inputPwd1, inputPwd2) => {
        let valido = true;
        let msg = "";
        if (
            !inputPwd1 ||
            !inputPwd2 ||
            !inputPwd1.value.trim() ||
            !inputPwd2.value.trim()
        ) {
            console.warn(
                "Uno o ambos campos de contraseña no existen o están vacíos."
            );
            return false;
        }
        if (inputPwd1.value !== inputPwd2.value) {
            valido = false;
            msg = "Las contraseñas no son iguales.";
        } else {
            //Volvemos al mensaje original para que la API nativa valide la longitud si es necesario
            msg = "La contraseña debe tener al menos 8 caracteres.";
        }

        // Actualizar estado visual de ambos campos
        actualizarEstado(inputPwd1, valido);
        actualizarEstado(inputPwd2, valido);
        inputPwd1.nextElementSibling.textContent = msg;
        inputPwd2.nextElementSibling.textContent = msg;

        return valido;
    };


    const existeEmail = async (inputEmail) => {
        if (!inputEmail || !inputEmail.value.trim()) {
            console.warn("El campo email no existe o está vacío.");
            return false;
        }
        try {
            const response = await fetch("/auth/existEmail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: inputEmail.value }),
            });

            if (!response.ok) {
                throw new Error(
                    `Error del servidor: ${response.status} ${response.statusText}`
                );
            }

            const data = await response.json();
            const valido = !data.status; // `status: true` significa que ya existe
            const msg = valido
                ? "Por favor, introduce un email válido."
                : "El email ya está registrado.";
            actualizarEstado(inputEmail, valido);
            inputEmail.nextElementSibling.textContent = msg;

            return valido;
        } catch (error) {
            console.error("Error al verificar el email:", error);
            actualizarEstado(inputEmail, false);
            inputEmail.nextElementSibling.textContent =
                "No se pudo verificar el email. Inténtalo más tarde.";
            return false;
        }
    };

    async function realizarMiValidacion(form) {
        let esValido = true;

        // Validar contraseñas primero
        const passwordInput = form.querySelector("#password");
        const repasswordInput = form.querySelector("#repassword");
        const contrasenasValidas = mismaPwd(passwordInput, repasswordInput);
        esValido = contrasenasValidas && esValido;

        //ExisteEmail, devuelve una Promise.
        //Hay que esperar a que la promesa se resuelva para obtener el resultado
        const emailInput = form.querySelector("#email");
        const emailValido = await existeEmail(emailInput);
        esValido = emailValido && esValido;

        return esValido;
    }
})();
