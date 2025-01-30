
(() => {
  const mensajeDiv = document.getElementById("cb-cookie-banner");


    try {
      let username = getCookie("lagrimas")
      if (username) {
        deleteMsg();
      }else{
        const aecptarBoton = document.getElementById("accept")
        const rechazarBoton = document.getElementById("decline")
        const botonModal = document.getElementById("botonModal")
        const cerrarModal = document.getElementById("cerrarModal")
        
        aecptarBoton.addEventListener("click", function(){setCookie("lagrimas", "aceptar", 30); aviableAuth()})
        botonModal.addEventListener("click", function(){setCookie("lagrimas", "aceptar", 30); aviableAuth()})
        cerrarModal.addEventListener("click", disableAuth())
        cerrarModal.addEventListener("click", deleteAllCookies())
        rechazarBoton.addEventListener("click", deleteMsg)
      }
      
    } catch (err) { }

})()


function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  deleteMsg();
}


function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function disableAuth(){
  const loginBtn = document.getElementById("btnLogin")
  const registerBtn = document.getElementById("btnRegister")
  loginBtn.classList.add("disabled")
  registerBtn.classList.add("disabled")
}

function aviableAuth(){
  const loginBtn = document.getElementById("btnLogin")
  const registerBtn = document.getElementById("btnRegister")
  loginBtn.classList.remove("disabled")
  registerBtn.classList.remove("disabled")
}

function deleteMsg(){
  const mensajeDiv = document.getElementById("cb-cookie-banner");

  if (mensajeDiv) {
    mensajeDiv.style.display = "none";
  }
}

function deleteAllCookies() {
    document.cookie.split(';').forEach(cookie => {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    });
}

