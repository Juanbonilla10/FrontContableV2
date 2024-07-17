let deleteIncomes;

// Configuración de la paginación
const registrosPorPagina = 5;
const paginadoresAMostrar = 2; // Mostrar solo 2 conjuntos de páginas
let paginaActual = 1;

let data = [];

// Función para mostrar los datos en la tabla
function mostrarDatos(dta) {
  const tablaBody = document.getElementById("incomesAll");
  const inicio = (paginaActual - 1) * registrosPorPagina;
  const fin = inicio + registrosPorPagina;
  const datosPagina = dta.slice(inicio, fin);

  tablaBody.innerHTML = "";
  datosPagina.forEach((element) => {
    const fila = `
    <tr>
          <td>
            <div class="d-flex px-2 py-1">
              <div>
                <img
                  src="../assets/img/team-2.jpg"
                  class="avatar avatar-sm me-3 border-radius-lg"
                  alt="user1"
                />
              </div>
              <div
                class="d-flex flex-column justify-content-center"
              >
                <h6 class="mb-0 text-sm">${element.message}</h6>
              </div>
            </div>
          </td>
          <td>
            <p class="text-xs font-weight-bold mb-0">
              ${element.banksAccount}
            </p>
            <p class="text-xs text-secondary mb-0">
              ${element.accountsDescription}
            </p>
          </td>
          <td class="align-middle text-center text-sm">
            <span class="badge badge-sm bg-gradient-success"
              > ${element.income_value}</span
            >
          </td>
          <td class="align-middle text-center">
            <span class="text-secondary text-xs font-weight-bold"
              >${element.date}</span
            >
          </td>
          <td class="align-middle">
            <div class="ms-auto text-center">
              <a onclick="deleteIncomes(${element.idincomes})"
                class="btn btn-link text-danger text-gradient px-3 mb-0"
                href="javascript:;"
                ><i class="material-icons text-sm me-2">delete</i
                >Delete</a
              >
              <a
                class="btn btn-link text-dark px-3 mb-0"
                href="javascript:;"
                ><i class="material-icons text-sm me-2">edit</i
                >Edit</a
              >
            </div>
          </td>
        </tr>
    `;
    tablaBody.innerHTML += fila;
  });
}

// Función para mostrar la paginación
function mostrarPaginacion(dta) {
  const pagination = document.getElementById("paginationIngresos");
  const cantidadTotalPaginas = Math.ceil(dta.length / registrosPorPagina);
  const cantidadPaginadores = Math.min(
    paginadoresAMostrar,
    cantidadTotalPaginas
  );

  pagination.innerHTML = "";
  for (let i = 1; i <= cantidadPaginadores; i++) {
    const li = document.createElement("li");
    li.className = `page-item ${i === paginaActual ? "active" : ""}`;
    li.innerHTML = `<a class="page-link" href="javascript:;" onclick="cambiarPagina(${i})">${i}</a>`;
    pagination.appendChild(li);
  }

  // Agregar el control de "..." si hay más páginas disponibles
  if (cantidadTotalPaginas > paginadoresAMostrar) {
    const li = document.createElement("li");
    li.className = "page-item disabled";
    li.innerHTML = `<span class="page-link">...</span>`;
    pagination.appendChild(li);

    const liUltimo = document.createElement("li");
    liUltimo.className = `page-item ${
      paginaActual === cantidadTotalPaginas ? "active" : ""
    }`;
    liUltimo.innerHTML = `<a class="page-link" href="javascript:;" onclick="cambiarPagina(${cantidadTotalPaginas})">${cantidadTotalPaginas}</a>`;
    pagination.appendChild(liUltimo);
  }
}

// Función para cambiar de página
function cambiarPagina(pagina) {
  paginaActual = pagina;
  mostrarDatos(data);
  mostrarPaginacion(data);
}

// Función para cambiar y ordenar los datos
function cambiarData(dataResponse) {
  // Ordenar los datos en orden descendente
  data = dataResponse.sort((a, b) => new Date(b.date) - new Date(a.date));
  // Reiniciar la página actual a la primera página
  paginaActual = 1;
  mostrarDatos(data);
  mostrarPaginacion(data);
}

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
      document.querySelector(".no-disguise_2").style.display = "block";
      getIncomes();
    }
  } else {
    console.log("No se encontro datos para el bearer token");
  }

  /**
   * DATOS PARA LA MODAL DE CREACION
   */
  $("#addIncomes").click(function () {
    getAccounts();
  });

  $("#saveIncomes").click(function(){

    let body = {
      campo1 : $("#accountsList").val(),
      campo2 : $("#valueIncome").val(),
      campo3 : $("#odateIncomes").val(),
      campo4 : $("#messageIncomes").val()
    }


    if(body.campo1 != "" & body.campo2 != "" & body.campo3 != "" & body.campo4 != ""){
      saveIncomes(body);
    }else{
      Swal.fire({
        title: "Error",
        text: "Hay datos vacios para crear el ingreso",
        icon: "error"
      });
    }

  });

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

  /**
   * LLAMADO A LOS SERVICIOS REST
   */

  function getIncomes() {
    $.ajax({
      method: "GET",
      url: `${urlEndPoint}/Incomes/allIncomes`,
      dataType: "json",
      headers: {
        Authorization: "Bearer " + token,
      },
      contentType: "application/json",
      complete: function (response) {
        if (response.status == 200) {
          console.log("Obteniendo datos");
          mostrarDatos(JSON.parse(response.responseText));
          mostrarPaginacion(JSON.parse(response.responseText));
          cambiarData(JSON.parse(response.responseText));
          //mappingIncomes(JSON.parse(response.responseText));
        } else {
          console.log("Error allIncomes");
        }
      },
    });
  }

  deleteIncomes = function (idincomes) {
    $.ajax({
      method: "DELETE",
      url: `${urlEndPoint}/Incomes/delIncomes/${idincomes}`,
      dataType: "json",
      headers: {
        Authorization: "Bearer " + token,
      },
      contentType: "application/json",
      complete: function (response) {
        if (response.status == 204) {
          Swal.fire({
            title: "Eliminado!",
            text: "El ingresao ha sido borrado",
            icon: "success",
          });

          //Peticionando otra vez a los tipos de cuenta
          getIncomes();
        } else {
          console.log("Error deleteIncomes");
          console.log(response.status);
        }
      },
    });
  };

  function saveIncomes(data) {

    requestBody = {
      idincomes : 0,
      income_value: data.campo2,
      message: data.campo4,
      date: data.campo3,
      accounts_id: data.campo1,
      users_id: 0
  };

    $.ajax({
      method: "POST",
      url: `${urlEndPoint}/Incomes/saveIncomes`,
      dataType: "json",
      headers: {
        Authorization: "Bearer " + token,
      },
      contentType: "application/json",
      data: JSON.stringify(requestBody),
      complete: function (response) {
        if (response.status == 200) {
          console.log("Obteniendo datos");
          getIncomes();
          // Cerrar la modal utilizando el método modal('hide')
          $('#exampleModal').modal('hide');
        } else {
          console.log("Error saveIncomes");
        }
      },
    });
  }

  function getAccounts() {
    $.ajax({
      method: "GET",
      url: `${urlEndPoint}/Accounts/getAccountsV1`,
      dataType: "json",
      headers: {
        Authorization: "Bearer " + token,
      },
      contentType: "application/json",
      complete: function (response) {
        if (response.status == 200) {
          console.log("Obteniendo datos de cuentas");
          mappingAccountsModal(JSON.parse(response.responseText));
        } else {
          console.log("Error getAccountsV1");
        }
      },
    });
  }

  /**
   * MAPEO DE DATOS
   */

  function mappingIncomes(data) {
    let cadena = "";

    data.forEach((element) => {
      cadena += `
          <tr>
          <td>
            <div class="d-flex px-2 py-1">
              <div>
                <img
                  src="../assets/img/team-2.jpg"
                  class="avatar avatar-sm me-3 border-radius-lg"
                  alt="user1"
                />
              </div>
              <div
                class="d-flex flex-column justify-content-center"
              >
                <h6 class="mb-0 text-sm">${element.message}</h6>
              </div>
            </div>
          </td>
          <td>
            <p class="text-xs font-weight-bold mb-0">
              ${element.banksAccount}
            </p>
            <p class="text-xs text-secondary mb-0">
              ${element.accountsDescription}
            </p>
          </td>
          <td class="align-middle text-center text-sm">
            <span class="badge badge-sm bg-gradient-success"
              > ${element.income_value}</span
            >
          </td>
          <td class="align-middle text-center">
            <span class="text-secondary text-xs font-weight-bold"
              >${element.date}</span
            >
          </td>
          <td class="align-middle">
            <div class="ms-auto text-center">
              <a onclick="deleteIncomes(${element.idincomes})"
                class="btn btn-link text-danger text-gradient px-3 mb-0"
                href="javascript:;"
                ><i class="material-icons text-sm me-2">delete</i
                >Delete</a
              >
              <a
                class="btn btn-link text-dark px-3 mb-0"
                href="javascript:;"
                ><i class="material-icons text-sm me-2">edit</i
                >Edit</a
              >
            </div>
          </td>
        </tr>
      `;

      $("#incomesAll").html(cadena);
    });
  }

  function mappingAccountsModal(data){
    let cadena = "";

    data.forEach((element) => {
      cadena += `
      <option value="${element.idaccounts}" >${element.banksDescription}  ${element.account_number}</option>
      `;

      $("#accountsList").html(cadena);
    });
  }
});

deleteIncomes(incomes);
