let deleteAccountType;
let deleteFranchises;
let deleteBank;

document.addEventListener("DOMContentLoaded", function () {
  // Obtener cookie de sesion del localStoragew
  var token = localStorage.getItem("AuthAplication");

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
      getAccounts();
      getFranchises();
      getBanks();
      getFixedCost();
    }
  } else {
    console.log("No se encontro datos para el bearer token");
  }

  /**
   * DATOS PARA CREACION DEL TIPO DE CUENTA
   */
  $("#saveTypeAccount").click(function () {
    let nameAccount = $("#accountTypeName").val();
    if (nameAccount != "") {
      saveAccount(nameAccount);
    } else {
      Swal.fire({
        title: "Error",
        text: "No hay datos para el tipo de cuenta",
        icon: "error",
      });
    }
  });

  /**
   * DATOS PARA CREACION DE LA FRANQUICIA
   */
  $("#saveFranchises").click(function () {
    let nameFranchises = $("#franchisesName").val();
    let url = $("#urlFranchises").val();
    let object = {
      campo1: nameFranchises,
      campo2: url,
    };
    if ((nameFranchises != "") & (url != "")) {
      saveFranchises(object);
    } else {
      Swal.fire({
        title: "Error",
        text: "No hay datos para crear la franquicia",
        icon: "error",
      });
    }
  });

  /**
   * DATOS PARA CREACION DE LOS BANCOS
   */
  $("#saveBank").click(function () {
    let nameBank = $("#bankName").val();
    let url = $("#urlBankName").val();
    let object = {
      campo1: nameBank,
      campo2: url,
    };
    if ((nameBank != "") & (url != "")) {
      saveBanks(object);
    } else {
      Swal.fire({
        title: "Error",
        text: "No hay datos para crear el banco",
        icon: "error",
      });
    }
  });

  /**
   * DATOS PARA CREACION DE LOS GASTOS FIJOS
   */
  $("#saveFixedCost").click(function(){
    let nameFixedCost = $("#fixedCostName").val();
    let cost = $("#fixedCostValue").val();
    let object = {
      campo1: nameFixedCost,
      campo2: cost,
    };
    if ((nameFixedCost != "") & (cost != "")) {
      saveFixedCosts(object);
    } else {
      Swal.fire({
        title: "Error",
        text: "No hay datos para crear el gasto fijo",
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
   * LLAMADO A LOS SERVICIOS REST
   */

  /**
   * CRUD TYPE ACCOUNT
   */

  function getAccounts() {
    $.ajax({
      method: "GET",
      url: `${urlEndPoint}/AccountTypes/getAllAccountTypes`,
      dataType: "json",
      headers: {
        Authorization: "Bearer " + token,
      },
      contentType: "application/json",
      complete: function (response) {
        if (response.status == 200) {
          console.log("Obteniendo datos getAccounts");
          mappingAccounts(JSON.parse(response.responseText));
        } else {
          console.log("Error getAccounts");
        }
      },
    });
  }

  function saveAccount(nameAccount) {
    requestBody = {
      idaccountTypes: " ",
      description: nameAccount,
      date: " ",
      state_id: "2",
    };

    $.ajax({
      method: "POST",
      url: `${urlEndPoint}/AccountTypes/saveAccountType`,
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
            text: "El tipo de cuenta ha sido creado",
            icon: "success",
          });

          //Peticionando otra vez a los tipos de cuenta
          getAccounts();
        } else {
          console.log("Error saveAccount");
          console.log(response.status);
        }
      },
    });
  }

  deleteAccountType = function (idAccountType) {
    let requestBody = {
      idaccountTypes: idAccountType,
      description: "N/A",
      date: "N/A",
      state_id: "0",
    };

    $.ajax({
      method: "DELETE",
      url: `${urlEndPoint}/AccountTypes/deleteAccountType`,
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
            text: "El tipo de cuenta ha sido borrado",
            icon: "success",
          });

          //Peticionando otra vez a los tipos de cuenta
          getAccounts();
        } else {
          console.log("Error saveAccount");
          console.log(response.status);
        }
      },
    });
  };

  /**
   * CRUD FRANCHISES
   */
  function getFranchises() {
    $.ajax({
      method: "GET",
      url: `${urlEndPoint}/Franchises/allFranchises`,
      dataType: "json",
      headers: {
        Authorization: "Bearer " + token,
      },
      contentType: "application/json",
      complete: function (response) {
        if (response.status == 200) {
          console.log("Obteniendo datos getFranchises");
          mappingFranchises(JSON.parse(response.responseText));
        } else {
          console.log("Error getFranchises");
        }
      },
    });
  }
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

  /**
   * CRUD BANKS
   */
  function getBanks() {
    $.ajax({
      method: "GET",
      url: `${urlEndPoint}/Banks/allBanks`,
      dataType: "json",
      headers: {
        Authorization: "Bearer " + token,
      },
      contentType: "application/json",
      complete: function (response) {
        if (response.status == 200) {
          console.log("Obteniendo datos getBanks");
          mostrarDatos(JSON.parse(response.responseText));
          mostrarPaginacion(JSON.parse(response.responseText));
          cambiarData(JSON.parse(response.responseText));
        } else {
          console.log("Error getBanks");
        }
      },
    });
  }

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

  /**
   * CRUD FIXED COST
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
          console.log("Obteniendo datos getFixedCost");
          console.log(JSON.parse(response.responseText));
          mostrarDatosTwo(JSON.parse(response.responseText));
          mostrarPaginacionTwo(JSON.parse(response.responseText));
          cambiarDataTwo(JSON.parse(response.responseText));
        } else {
          console.log("Error getFixedCost");
        }
      },
    });
  }

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

  deleteFixedCost = function (idFixedCost) {
    let requestBody = {
        "idfixedCosts": idFixedCost,
        "description": "N/A",
        "cost": "000",
        "date": "0",
        "state_id": 0,
        "users_id": 0
    };

    $.ajax({
      method: "DELETE",
      url: `${urlEndPoint}/fixedCost/deleteFixedCost`,
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
            text: "El gasto fijo ha sido borrado",
            icon: "success",
          });
          //Peticionando otra vez a los tipos de cuenta
          getFixedCost();
        } else {
          Swal.fire({
            title: "Lo sentimos!",
            text: "El gasto fijo no ha sido borrado",
            icon: "error",
          });
        }
      },
    });
  };
  /**
   * MAPEO DE DATOS
   */

  function mappingAccounts(data) {
    let cadena = "";

    data.forEach((element) => {
      cadena += `
                <tr>
                <td>
                <div class="d-flex px-2 py-1">
                    <div class="d-flex flex-column justify-content-center">
                    <h6 class="mb-0 text-sm">${element.description}</h6>
                    </div>
                </div>
                </td>
                <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold"
                    >${element.date}</span
                >
                </td>
                <td class="align-middle">
                <div class="ms-auto text-center" >
                    <a onclick="deleteAccountType('${element.idaccountTypes}')"
                    class="btn btn-link text-danger text-gradient px-3 mb-0"
                    ><i class="material-icons text-sm me-2"  >delete</i
                    >Delete</a
                    >
                </div>
                </td>
            </tr>
        `;
    });
    $("#accountType").html(cadena);
  }

  function mappingFranchises(data) {
    let cadena = "";

    data.forEach((element) => {
      cadena += `
        <tr>
        <td>
            <div class="d-flex px-2 py-1">
            <div>
                <img
                src="${element.url_photo}"
                class="avatar avatar-sm me-3 border-radius-lg"
                alt="user1"
                />
            </div>
            <div class="d-flex flex-column justify-content-center">
                <h6 class="mb-0 text-sm">${element.description}</h6>
            </div>
            </div>
        </td>
        <td class="align-middle text-center">
            <span class="text-secondary text-xs font-weight-bold"
            >${element.date}</span
            >
        </td>
        <td class="align-middle">
            <div class="ms-auto text-center">
            <a onclick="deleteFranchises('${element.idfranchises}')"
                class="btn btn-link text-danger text-gradient px-3 mb-0"
                href="javascript:;"
                ><i class="material-icons text-sm me-2">delete</i
                >Delete</a
            >
            </div>
        </td>
        </tr>
        `;
    });
    $("#franchises").html(cadena);
  }
});

deleteAccountType(typeAccount);
deleteFranchises(franchises);
deleteBank(bank);
deleteFixedCost(fixedCost);
