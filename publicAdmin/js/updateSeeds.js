const form = document.querySelector('#formActualizar');
const imgsDelete = [];
const btnsDeletesPhotes = document.querySelectorAll('.btnDelete');

btnsDeletesPhotes.forEach(btn => {
    btn.addEventListener('click', function (event) {
        const btnClicked = event.currentTarget; // Usamos currentTarget para obtener el botón mismo
        const dataIdSeeds = btnClicked.getAttribute('data-semilla-id');
        const photo = btnClicked.getAttribute('data-fotopath');
        imgsDelete.push({ idSeed: dataIdSeeds, photo });

        const card = btnClicked.parentNode; // Usamos closest() aquí si es necesario para encontrar la tarjeta
        card.remove();
    });
});


document.querySelector('#submitChanges').addEventListener('click',async()=>{
    try {
        for (let index = 0; index < imgsDelete.length; index++) {
            const element = imgsDelete[index];
            const response = await fetch('/api/admin/deletePhotoIdSeed', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    idseed: element.idSeed,
                    photo: element.photo
                })
            });
            const responseJson = await response.json();

            const {data, err} = responseJson;
            console.log(data, err)
            if(err != null){
                throw new Error("Hubo un error al eliminar las imagenes");
            }

        }

        form.submit();

    } catch (error) {

        console.log(error)
    }
});
