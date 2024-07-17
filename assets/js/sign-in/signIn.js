document.addEventListener("DOMContentLoaded", function () {
    // Obtener cookie de sesion del localStoragew
    let dato = localStorage.getItem("Bearer Token");
  
    // Url petición service
    let urlEndPoint = "http://localhost:8080/login";


    $("#continueLogin").click(function(){

      let mail = $("#mail").val();
      let pwd = $("#pwd").val();
        if(mail != "" & pwd != ""){
          getLogin(mail,pwd);
        }else{
          Swal.fire({
            title: "Error",
            text: "Usuario o contraseña vacia",
            icon: "error"
          });
        };
    });
  
    function getLogin(mail,pwd) {

        let bodyRe = {
          "email" : mail,
          "password" : pwd
      };

      $.ajax({
        method: "POST",
        url: `${urlEndPoint}`,
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(bodyRe),
        complete: function (response) {
          var headers = response.getResponseHeader("authorization");
          console.log(headers);
          if (response.status == 200) {
            localStorage.setItem("AuthAplication",headers);
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Bienvenido",
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              window.location.href = "../index.html";
            });

          } else {
            Swal.fire({
              title: "Error",
              text: "Usuario no autorizado",
              icon: "error"
            });
          }
        },
      });
    }

  });
  