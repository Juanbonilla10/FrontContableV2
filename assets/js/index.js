document.addEventListener("DOMContentLoaded", function () {

  // Obtener cookie de sesion del localStoragew
  var token = localStorage.getItem("AuthAplication");

  // Url petición service
  let urlEndPoint = "http://localhost:8080/api";

  if (token) {
    token = token.split(" ");

    if ((token[1] != "AuthAplication") & vldTk(token[1])) {
      token = token[1];
      // Ocultar el primer elemento con la clase "spinner"
      $("#idSpin").hide();
      //// Remover la clase disguise para que ya no se none
      $("#mainClass").removeClass("disguise");
      //// Cambiar de none  a block del aside
      document.querySelector(".no-disguise").style.display = "block";
    }
  } else {
    console.log("No se encontro datos para el bearer token");
  }

  /**
   * VALIDATE TOKEN
   */
  function vldTk(token) {
    // Divide el token en partes (cabecera, carga útil y firma)
    let partes = token.split(".");

    // Verifica si el token tiene exactamente tres partes
    if (partes.length !== 3) {
      return false; // La estructura del token no es válida
    }

    try {
      payload = JSON.parse(atob(partes[1]));
      return true;
    } catch (error) {
      return false; // La carga útil no es un JSON válido
    }
  }
});
