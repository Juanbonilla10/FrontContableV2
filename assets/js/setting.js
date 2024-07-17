
  // Configuración de la paginación
  const registrosPorPagina = 2;
  let paginaActual = 1;

  let data = "";

  // Función para mostrar los datos en la tabla
  function mostrarDatos(dta) {
    const tablaBody = document.getElementById("tablaBody");
    const inicio = (paginaActual - 1) * registrosPorPagina;
    const fin = inicio + registrosPorPagina;
    const datosPagina = dta.slice(inicio, fin);

    tablaBody.innerHTML = "";
    datosPagina.forEach((dato) => {
      const fila = `
            <tr>
               <td>
                  <div class="d-flex px-2 py-1">
                    <div>
                      <img
                        src="${dato.url_photo}"
                        class="avatar avatar-sm me-3 border-radius-lg"
                        alt="user1"
                      />
                    </div>
                    <div
                      class="d-flex flex-column justify-content-center"
                    >
                      <h6 class="mb-0 text-sm">${dato.description}</h6>
                    </div>
                  </div>
                </td>
                <td class="align-middle text-center">
                  <span class="text-secondary text-xs font-weight-bold">${dato.date}</span>
                </td>
                <td class="align-middle">
                  <div class="ms-auto text-center">
                    <a onclick="deleteBank(${dato.idbanks})"
                      class="btn btn-link text-danger text-gradient px-3 mb-0"
                      href="javascript:;"
                      ><i class="material-icons text-sm me-2">delete</i
                      >Delete</a
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
    const pagination = document.getElementById("pagination");
    const cantidadPaginas = Math.ceil(dta.length / registrosPorPagina);

    pagination.innerHTML = "";
    for (let i = 1; i <= cantidadPaginas; i++) {
      const li = document.createElement("li");
      li.className = `page-item ${i === paginaActual ? "active" : ""}`;
      li.innerHTML = `<a class="page-link" href="javascript:;" onclick="cambiarPagina(${i})">${i}</a>`;
      pagination.appendChild(li);
    }
  }

  // Función para cambiar de página
  function cambiarPagina(pagina) {
    //console.log(dta);
    paginaActual = pagina;
    mostrarDatos(data);
    mostrarPaginacion(data);
  }

  function cambiarData(dataResponse){
    data = dataResponse; 
  } 


  /**
   * Datos para la tabla de gastos fijos
   */

  
  // Configuración de la paginación
  const registrosPorPaginaTwo = 2;
  let paginaActualTwo = 1;

  let dataTwo = "";

  // Función para mostrar los datos en la tabla
  function mostrarDatosTwo(dta) {
    const tablaBody = document.getElementById("tablaBodyGastos");
    const inicio = (paginaActualTwo - 1) * registrosPorPaginaTwo;
    const fin = inicio + registrosPorPaginaTwo;
    const datosPagina = dta.slice(inicio, fin);

    tablaBody.innerHTML = "";
    datosPagina.forEach((dato) => {
      const fila = `
          <tr>
            <td>
              <div class="d-flex px-2 py-1">
                <div
                  class="d-flex flex-column justify-content-center"
                >
                  <h6 class="mb-0 text-sm">${dato.description}</h6>
                </div>
              </div>
            </td>
            <td class="align-middle ">
              <span class="text-secondary text-xs font-weight-bold">${dato.cost}</span>
            </td>
            <td class="align-middle">
              <span class="text-secondary text-xs font-weight-bold">${dato.date}</span>
            </td>
            <td class="align-middle">
                <div class="ms-auto text-center">
                  <a onclick="deleteFixedCost(${dato.idfixedCosts})"
                    class="btn btn-link text-danger text-gradient px-3 mb-0"
                    href="javascript:;"
                    ><i class="material-icons text-sm me-2">delete</i
                    >Delete</a
                  >
                </div>
            </td>
        </tr>
        `;
      tablaBody.innerHTML += fila;
    });
  }

  // Función para mostrar la paginación
  function mostrarPaginacionTwo(dta) {
    const pagination = document.getElementById("paginationGastos");
    const cantidadPaginas = Math.ceil(dta.length / registrosPorPaginaTwo);

    pagination.innerHTML = "";
    for (let i = 1; i <= cantidadPaginas; i++) {
      const li = document.createElement("li");
      li.className = `page-item ${i === paginaActualTwo ? "active" : ""}`;
      li.innerHTML = `<a class="page-link" href="javascript:;" onclick="cambiarPaginaTwo(${i})">${i}</a>`;
      pagination.appendChild(li);
    }
  }

  // Función para cambiar de página
  function cambiarPaginaTwo(pagina) {
    //console.log(dta);
    paginaActualTwo = pagina;
    mostrarDatosTwo(dataTwo);
    mostrarPaginacionTwo(dataTwo);
  }

  function cambiarDataTwo(dataResponse){
    dataTwo = dataResponse; 
  } 
