let deleteExpense;

// Configuración de la paginación
const registrosPorPagina = 5;
const paginadoresAMostrar = 2; // Mostrar solo 2 conjuntos de páginas
let paginaActual = 1;

let data = [];

// Función para mostrar los datos en la tabla
function mostrarDatos(dta) {
  const tablaBody = document.getElementById("egresos");
  const inicio = (paginaActual - 1) * registrosPorPagina;
  const fin = inicio + registrosPorPagina;
  const datosPagina = dta.slice(inicio, fin);

  tablaBody.innerHTML = "";

  console.log("DATOS DE LAS RESPO ");
  console.log(datosPagina);
  datosPagina.forEach((element) => {
    element.idegresos =
      element.creditCard == true
        ? `TC${element.idegresos}`
        : `AC${element.idegresos}`;

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
        <div class="d-flex flex-column justify-content-center">
          <h6 class="mb-0 text-sm">${element.description_expense}</h6>
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
      <span class="badge badge-sm bg-gradient-success">
        ${element.egress_value}
      </span>
    </td>
    <td class="align-middle text-center">
      <span class="text-secondary text-xs font-weight-bold">
        ${element.date}
      </span>
    </td>
    <td class="align-middle text-center">
        <a onclick="deleteExpense('${element.idegresos}')"
        class="btn btn-link text-danger text-gradient px-3 mb-0"
        href="javascript:;">
        <i class="material-icons text-sm me-2">delete</i>Delete</a>
    </td>
  </tr>
    `;
    tablaBody.innerHTML += fila;
  });
}

// Función para mostrar la paginación
function mostrarPaginacion(dta) {
  const pagination = document.getElementById("paginationGastos");
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

// Datos desde aqui

document.addEventListener("DOMContentLoaded", function () {
  // Obtener cookie de sesion del localStoragew
  var token = localStorage.getItem("AuthAplication");

  var fixedCost = [];

  // Url petición service
  let urlEndPoint = "http://3.12.136.169:8083/api";

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
      //getAccountType();
      //getFranchises();
      getExpenses();
      getAccounts();
    }
  } else {
    console.log("No se encontro datos para el bearer token");
  }

  /**
   * DATOS PARA CREACION DEL TIPO DE CUENTA
   */

  // Add an event listener to detect changes in the switch state
  const switchElementT = document.getElementById("flexSwitchCheckDefault");
  switchElementT.addEventListener("change", vldCheck);

  const switchElementCost = document.getElementById("listMandatoryExpenses");
  switchElementCost.addEventListener("change", vldInputCost);

  $("#agregar").click(function () {
    vldCheck();
  });

  $("#saveExpenses").click(function () {
    let body = {
      account: $("#listBanks").val(),
      costExpense: $("#costExpense").val(),
      date: $("#dateExpense").val(),
      optionListExpense: $("#listMandatoryExpenses").val(),
      descriptionExpense: $("#descriptionExpense").val(),
    };

    if ((body.account != "") & (body.costExpense != "") & (body.date != "")) {
      saveExpense(body);
    } else {
      Swal.fire({
        title: "Error",
        text: "Datos incompletos para crear el gasto",
        icon: "error",
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
   * VALIDAR SI ESTA EN TRU OR FALSE EL CHECK
   */

  function vldCheck() {
    const switchElement = document.getElementById("flexSwitchCheckDefault");

    if (switchElement.checked) {
      document.querySelector("#noMandatoryExpenses").style.display = "none";
      document.querySelector("#mandatoryExpenses").style.display = "block";
      console.log("El switch está encendido.");
      $("#descriptionExpense").val("");
      getFixedCost();
      return true;
    } else {
      document.querySelector("#noMandatoryExpenses").style.display = "block";
      document.querySelector("#mandatoryExpenses").style.display = "none";
      console.log("El switch está apagado.");
      $("#costExpense").val("0");
      $("#descriptionExpense").val("");
      $("#listMandatoryExpenses").val("0");
      return false;
    }
  }

  function vldInputCost() {
    let dataList = $("#listMandatoryExpenses").val();
    fixedCost.forEach((element) => {
      if (element.id == dataList) {
        $("#costExpense").val(element.cost);
      }
    });
  }

  /**
   * LLAMADO A LOS SERVICIOS REST
   */

  /**
   * GET FIXED COSTS
   */

  function getFixedCost() {
    $.ajax({
      method: "GET",
      url: `${urlEndPoint}/fixedCost/allFixedCost`,
      dataType: "json",
      headers: {
        Authorization: "Bearer " + token,
      },
      contentType: "application/json",
      complete: function (response) {
        if (response.status == 200) {
          console.log("Obteniendo datos para gastos fijos");
          mappingFixedCost(JSON.parse(response.responseText));
        } else {
          console.log("Error gastos fijos");
        }
      },
    });
  }

  /**
   * CRUD EXPENSES
   */

  function saveExpense(data) {
    requestBody = {
      idegresos: 0,
      egress_value: data.costExpense,
      description_expense: data.descriptionExpense,
      date: data.date,
      accounts_id: data.account.includes("TC") == true ? 15 : data.account,
      users_id: 0,
      cards_id:
        data.account.includes("TC") == true
          ? parseInt(data.account.substring(2))
          : 0,
      fixedcosts_id:
        data.optionListExpense === null ? 2 : data.optionListExpense,
    };

    $.ajax({
      method: "POST",
      url: `${urlEndPoint}/Expenses/saveExpenses`,
      dataType: "json",
      headers: {
        Authorization: "Bearer " + token,
      },
      contentType: "application/json",
      data: JSON.stringify(requestBody),
      complete: function (response) {
        if (response.status == 200) {
          Swal.fire({
            title: "Guardado!",
            text: "El gasto ha sido creado",
            icon: "success",
          });
          // Cerrar la modal utilizando el método modal('hide')
          $("#exampleModal").modal("hide");
          //Peticionando a gastos
          getExpenses();
        } else {
          console.log("Error saveExpense");
          console.log(response.status);
        }
      },
    });
  }

  /**
   * NO SE UTILIZA AUN

  function saveFranchises(data) {
    requestBody = {
      idfranchises: "0",
      description: data.campo1,
      url_photo: data.campo2,
      date: " ",
      state_id: "0",
    };

    $.ajax({
      method: "POST",
      url: `${urlEndPoint}/Franchises/createFranchises`,
      dataType: "json",
      headers: {
        Authorization: "Bearer " + token,
      },
      contentType: "application/json",
      data: JSON.stringify(requestBody),
      complete: function (response) {
        if (response.status == 201) {
          Swal.fire({
            title: "Guardado!",
            text: "El tipo de franquicia ha sido creado",
            icon: "success",
          });
          //Peticionando otra vez a los tipos de cuenta
          getFranchises();
        } else {
          console.log("Error saveFranchises");
          console.log(response.status);
        }
      },
    });
  }

  deleteFranchises = function (idFranchises) {
    let requestBody = {
      idfranchises: idFranchises,
      description: "N/A",
      url_photo: "N/A",
      date: "N/A",
      state_id: "0",
    };

    $.ajax({
      method: "DELETE",
      url: `${urlEndPoint}/Franchises/deleteFranchises`,
      dataType: "json",
      headers: {
        Authorization: "Bearer " + token,
      },
      contentType: "application/json",
      data: JSON.stringify(requestBody),
      complete: function (response) {
        if (response.status == 200) {
          Swal.fire({
            title: "Eliminado!",
            text: "La franquicia ha sido borrado",
            icon: "success",
          });
          //Peticionando otra vez a los tipos de cuenta
          getFranchises();
        } else {
          Swal.fire({
            title: "Lo sentimos!",
            text: "La franquicia no ha sido borrado",
            icon: "error",
          });
        }
      },
    });
  };
     */

  /**
   * CRUD BANKS
   */
  function getExpenses() {
    $.ajax({
      method: "GET",
      url: `${urlEndPoint}/Expenses/allExpenses`,
      dataType: "json",
      headers: {
        Authorization: "Bearer " + token,
      },
      contentType: "application/json",
      complete: function (response) {
        if (response.status == 200) {
          console.log("Obteniendo datos getExpenses");
          mostrarDatos(JSON.parse(response.responseText));
          mostrarPaginacion(JSON.parse(response.responseText));
          cambiarData(JSON.parse(response.responseText));
          //mapListExpenses(JSON.parse(response.responseText));
        } else {
          console.log("Error getExpenses");
        }
      },
    });
  }

  /**
   * NO SE UTILIZA AUN

  function saveBanks(data) {
    requestBody = {
      idbanks: "0",
      description: data.campo1,
      url_photo: data.campo2,
      date: "0",
      state_id: "0",
    };

    $.ajax({
      method: "POST",
      url: `${urlEndPoint}/Banks/createBanks`,
      dataType: "json",
      headers: {
        Authorization: "Bearer " + token,
      },
      contentType: "application/json",
      data: JSON.stringify(requestBody),
      complete: function (response) {
        if (response.status == 201) {
          Swal.fire({
            title: "Guardado!",
            text: "El banco ha sido creado",
            icon: "success",
          });
          //Peticionando otra vez a los tipos de cuenta
          getBanks();
        } else {
          console.log("Error saveBank");
          console.log(response.status);
        }
      },
    });
  }

  deleteBank = function (idBank) {
    let requestBody = {
      idbanks: idBank,
      description: "N/A",
      url_photo: "N/A",
      date: "0",
      state_id: 0,
    };

    $.ajax({
      method: "DELETE",
      url: `${urlEndPoint}/Banks/deleteBanks`,
      dataType: "json",
      headers: {
        Authorization: "Bearer " + token,
      },
      contentType: "application/json",
      data: JSON.stringify(requestBody),
      complete: function (response) {
        if (response.status == 200) {
          Swal.fire({
            title: "Eliminado!",
            text: "El banco ha sido borrado",
            icon: "success",
          });
          //Peticionando otra vez a los tipos de cuenta
          getBanks();
        } else {
          Swal.fire({
            title: "Lo sentimos!",
            text: "El banco no ha sido borrado",
            icon: "error",
          });
        }
      },
    });
  };
     */

  /**
   * CRUD ACCOUNTS
   */

  function getAccounts() {
    $.ajax({
      method: "GET",
      url: `${urlEndPoint}/Accounts/getAccountsV1/FullOper`,
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

  function mappingAccountsModal(data) {
    let cadena = "";

    data.forEach((element) => {
      if (element.accountTypesDescription === "Tarjeta Credito") {
        cadena += `
        <option value="TC${element.idaccounts}" >TC ${element.banksDescription}  ${element.account_number}</option>
        `;
      } else {
        cadena += `
        <option value="${element.idaccounts}" >${element.banksDescription}  ${element.account_number}</option>
        `;
      }

      $("#listBanks").html(cadena);
    });
  }

  deleteExpense = function (expense) {
    if (expense != "") {
      $.ajax({
        method: "DELETE",
        url: `${urlEndPoint}/Expenses/delExpenses/${expense}`,
        dataType: "json",
        headers: {
          Authorization: "Bearer " + token,
        },
        contentType: "application/json",
        complete: function (response) {
          if (response.status == 201) {
            Swal.fire({
              title: "Eliminado!",
              text: "El gasto ha sido borrada",
              icon: "success",
            });
            getExpenses();
          } else {
            Swal.fire({
              title: "Lo sentimos!",
              text: "El gasto no ha sido borrado",
              icon: "error",
            });
          }
        },
      });
    } else {
      console.log("El dato no se encuentra habilitado para borrado");
    }
  };

  /**

  function saveFixedCosts(data) {
    requestBody = {
        "idfixedCosts": 0,
        "description": data.campo1,
        "cost": data.campo2,
        "date": "0",
        "state_id": 0,
        "users_id": 1
    };

    $.ajax({
      method: "POST",
      url: `${urlEndPoint}/fixedCost/createFixedCost`,
      dataType: "json",
      headers: {
        Authorization: "Bearer " + token,
      },
      contentType: "application/json",
      data: JSON.stringify(requestBody),
      complete: function (response) {
        if (response.status == 201) {
          Swal.fire({
            title: "Guardado!",
            text: "El gasto fijo ha sido creado",
            icon: "success",
          });
          getFixedCost();
        } else {
          console.log("Error saveFixedCosts");
          console.log(response.status);
        }
      },
    });
  }

    */

  /**
   * MAPEO DE DATOS
   */

  function mappingFixedCost(data) {
    let cadena = "";

    data.forEach((element) => {
      cadena += `
            <option value="${element.idfixedCosts}" >${element.description}</option>
        `;

      fixedCost.push({ id: element.idfixedCosts, cost: element.cost });
    });
    $("#listMandatoryExpenses").html(cadena);

    $("#costExpense").val(data[0].cost);
  }
});

deleteExpense(expense);
