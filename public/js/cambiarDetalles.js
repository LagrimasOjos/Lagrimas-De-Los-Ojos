(()=>{
    document.getElementById('editar').addEventListener('click', function() {
        document.getElementById('phone').disabled = false;
    
        document.getElementById('enviar').classList.remove('disabled');
        document.getElementById('enviar').disabled = false;
    
        this.classList.add('disabled');
        this.disabled = true;
});
})()
