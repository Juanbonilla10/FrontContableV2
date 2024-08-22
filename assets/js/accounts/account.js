let deleteAccount;

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
      document.querySelector(".no-disguise_2").style.display = "block";
      getAccountType();
      getFranchises();
      getBanks();
      getAccounts();
    }
  } else {
    console.log("No se encontro datos para el bearer token");
  }

  /**
   * DATOS PARA CREACION DEL TIPO DE CUENTA
   */

  $("#saveAccount").click(function () {

    let body = {
        value : $("#valueAccount").val(),
        accountNumber : $("#accountOrPhone").val(),
        numberCard : $("#numberCard").val(),
        bank : $("#listBanks").val(),
        accountType : $("#listAccountType").val(),
        franchise : $("#listFranchises").val()
    }


    if (body.accountNumber != "" & body.numberCard != "" & body.bank != "" & body.accountType != ""  & body.franchise != "" & body.value != "") {
      saveAccount(body);
    } else {
      Swal.fire({
        title: "Error",
        text: "Datos incompletos para crear la cuenta",
        icon: "error",
      });
    }
  });


  /**
   * DATOS PARA CREACION DE LA FRANQUICIA
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
     */

  /**
   * DATOS PARA CREACION DE LOS BANCOS

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
     */

  /**
   * DATOS PARA CREACION DE LOS GASTOS FIJOS

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
     */

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

  function getAccountType() {
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
          console.log("Obteniendo datos getTypeAccounts");
          mappingAccounts(JSON.parse(response.responseText));
        } else {
          console.log("Error getAccounts");
        }
      },
    });
  }


  function saveAccount(data) {
    requestBody = {
        idaccounts: 0,
        account_number: data.accountNumber,
        card_number: data.numberCard,
        balance: data.value,
        banks_id: data.bank,
        accountTypes_id: data.accountType,
        franchises_id: data.franchise,
        users_id: 0
    };

    $.ajax({
      method: "POST",
      url: `${urlEndPoint}/Accounts/saveAccount`,
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

    /**
   *  NO SE UTILIZA AUN


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
     */



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
          mappingBanks(JSON.parse(response.responseText));
        } else {
          console.log("Error getBanks");
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
      url: `${urlEndPoint}/Accounts/getAccountsV1/FullAccounts`,
      dataType: "json",
      headers: {
        Authorization: "Bearer " + token,
      },
      contentType: "application/json",
      complete: function (response) {
        if (response.status == 200) {
          console.log("Obteniendo datos getAccounts");
          mapListAccountsUser(JSON.parse(response.responseText));
          mapListCardsAccount(JSON.parse(response.responseText));
        } else {
          console.log("Error getAccounts");
        }
      },
    });
  }

  deleteAccount = function (account) {

    if(account != ""){
        $.ajax({
            method: "DELETE",
            url: `${urlEndPoint}/Accounts/deleteAccount/${account}`,
            dataType: "json",
            headers: {
              Authorization: "Bearer " + token,
            },
            contentType: "application/json",
            complete: function (response) {
              if (response.status == 200) {
                Swal.fire({
                  title: "Eliminado!",
                  text: "La cuenta ha sido borrada",
                  icon: "success",
                });
                getAccounts();
              } else {
                Swal.fire({
                  title: "Lo sentimos!",
                  text: "La cuenta no ha sido borrada",
                  icon: "error",
                });
              }
            },
          });
    }else{
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

  function mappingAccounts(data) {
    let cadena = "";

    data.forEach((element) => {
      cadena += `
            <option value="${element.idaccountTypes}" >${element.description}</option>
        `;
    });
    $("#listAccountType").html(cadena);
  }

  function mappingFranchises(data) {
    let cadena = "";

    data.forEach((element) => {
      cadena += `
        <option value="${element.idfranchises}" >${element.description}</option>
        `;
    });
    $("#listFranchises").html(cadena);
  }

  function mappingBanks(data) {
    let cadena = "";

    data.forEach((element) => {
      cadena += `
      <option value="${element.idbanks}">${element.description}</option>
        `;
    });
    $("#listBanks").html(cadena);
  }
  function mapListAccountsUser(data) {
    let cadena = "";

    data.forEach((element) => {
      cadena += `
            <li  
            class="list-group-item border-0 d-flex p-4 mb-2 bg-gray-100 border-radius-lg"
            >
            <div class="d-flex flex-column">
                <h6 class="mb-3 text-sm">${element.banksDescription}</h6>
                <span class="mb-2 text-xs"
                >Tipo de cuenta:
                <span class="text-dark font-weight-bold ms-sm-2"
                    >${element.accountTypesDescription}</span
                ></span
                >
                <span class="mb-2 text-xs"
                >Numero de cuenta/celular:
                <span class="text-dark ms-sm-2 font-weight-bold">
                    ${element.account_number}</span
                ></span
                >
                <span class="text-xs"
                >Estado:
                <span class="text-dark ms-sm-2 font-weight-bold"
                    >Activo</span
                ></span
                >
            </div>
            <div class="ms-auto text-end">
                <a onclick="deleteAccount(${element.idaccounts})"
                class="btn btn-link text-danger text-gradient px-3 mb-0"
                href="javascript:;"
                ><i class="material-icons text-sm me-2">delete</i
                >Delete</a
                >
                <a disabled
                class="btn btn-link text-dark px-3 mb-0"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                href="javascript:;"
                ><i class="material-icons text-sm me-2" disabled>edit</i>Edit</a
                >
            </div>
            </li>
        `;      
    });

    $("#listAccountsUser").html(cadena);
  }

  function mapListCardsAccount(data){

    // Crear un nuevo objeto Date
    var fecha = new Date();

    // Obtener el año actual
    var año = fecha.getFullYear();
    console.log(data);
    let cadena = "";

    data.forEach((element) => {
      cadena += `
      <div class="row" >
      <div class="col-xl-6 mb-xl-0 mb-4">
        <div class="card bg-transparent shadow-xl">
          <div
            class="overflow-hidden position-relative border-radius-xl"
          >
            <img
              src="../assets/img/illustrations/pattern-tree.svg"
              class="position-absolute opacity-2 start-0 top-0 w-100 z-index-1 h-100"
              alt="pattern-tree"
            />
            <span class="mask bg-gradient-dark opacity-10"></span>
            <div class="card-body position-relative z-index-1 p-3">
              <i class="material-icons text-white p-2">wifi</i>
              <h5 class="text-white mt-4 mb-5 pb-2">
                ${element.card_number.substring(1,5)}&nbsp;&nbsp;&nbsp;${element.card_number.substring(1,5)}&nbsp;&nbsp;&nbsp;${element.card_number.substring(1,5)}&nbsp;&nbsp;&nbsp;${element.card_number.substring(12,16)}
              </h5>
              <div class="d-flex">
                <div class="d-flex">
                  <div class="me-4">
                    <p class="text-white text-sm opacity-8 mb-0">
                      ${element.banksDescription}
                    </p>
                    <h6 class="text-white mb-0">Juan Coronado</h6>
                  </div>
                  <div>
                    <p class="text-white text-sm opacity-8 mb-0">
                      Expires
                    </p>
                    <h6 class="text-white mb-0">${año}</h6>
                  </div>
                </div>
                <div
                  class="ms-auto w-20 d-flex align-items-end justify-content-end"
                >
                  <img
                    class="w-60 mt-2"
                    src="../assets/img/logos/mastercard.png"
                    alt="logo"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-6">
        <div class="row">
          <div class="col-md-6 col-6">
            <div class="card">
              <div class="card-header mx-4 p-3 text-center">
                <div
                  class="icon icon-shape icon-lg bg-gradient-primary shadow text-center border-radius-lg"
                >
                  <i class="material-icons opacity-10"
                    >account_balance</i
                  >
                </div>
              </div>
              <div class="card-body pt-0 p-3 text-center">
                <h6 class="text-center mb-0">Salario</h6>
                <span class="text-xs">Salario devengado</span>
                <hr class="horizontal dark my-3" />
                <h5 class="mb-0">$${element.salary.slice(-9,-6)}'${element.salary.slice(-6,-3)}.${element.salary.slice(-3)}</h5>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-6">
            <div class="card">
              <div class="card-header mx-4 p-3 text-center">
                <div
                  class="icon icon-shape icon-lg bg-gradient-primary shadow text-center border-radius-lg"
                >
                  <i class="material-icons opacity-10"
                    >account_balance_wallet</i
                  >
                </div>
              </div>
              <div class="card-body pt-0 p-3 text-center">
                <h6 class="text-center mb-0">Saldo</h6>
                <span class="text-xs">Fondos disponibles</span>
                <hr class="horizontal dark my-3" />
                <h5 class="mb-0">$${element.balance.slice(-9,-6)}'${element.balance.slice(-6,-3)}.${element.balance.slice(-3)}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <br>
        `;      
    });

    $("#cardList").html(cadena);
  }
});


deleteAccount(account);