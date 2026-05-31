// =============================================================================
//  🚀  SPACEX FLIGHT CONTROL CENTER
//  Centro de Control de Lanzamientos Espaciales
//
//  Proyecto de Desempeño · SENA Formación Complementaria 3406211
//  Módulo: JavaScript · Unidades 1 a 7
//
//  INSTRUCCIONES PARA EL APRENDIZ:
//  ─────────────────────────────────────────────────────────────────────────────   
//  Este archivo está vacío. Tu tarea es implementar todas las funciones
//  necesarias para que la aplicación funcione de acuerdo al enunciado.
//
//  Pasos recomendados:
//    1. Lee el enunciado completo en ENUNCIADO.md
//    2. Abre spacex_control_vuelos.html en el navegador con F12 activo
//    3. Revisa el HTML para conocer los IDs disponibles
//    4. Revisa el CSS para conocer las clases que debes aplicar
//    5. Implementa las secciones de este archivo en orden
//
//  IMPORTANTE: No modifiques spacex_control_vuelos.html ni styles-vuelos.css
// =============================================================================


// ─────────────────────────────────────────────────────────────────────────────
//  SECCIÓN 1 — ALMACÉN DE DATOS
    
    let lanzamientos = []
    let filtroActivo= "todos"
    let contadorlanzamientos = 1
//
//  Declara aquí las variables que guardarán el estado global de la aplicación:
//  la colección de lanzamientos registrados y cualquier variable de control
//  que necesites para el funcionamiento de la interfaz.
//
//  Piensa en qué tipo de estructura de datos es más apropiada para
//  mantener una lista de registros, cada uno con múltiples propiedades.
// ─────────────────────────────────────────────────────────────────────────────



// ─────────────────────────────────────────────────────────────────────────────
//  SECCIÓN 2 — FUNCIONES UTILITARIAS
//


function generarId() {
    const id = "SX-" + String(contadorlanzamientos).padStart(3, "0");
    contadorlanzamientos++;
    return id;
}


function formatearFecha(fecha) {
    return new Date(fecha).toLocaleString();
}


function buscarLanzamiento(id) {
    return lanzamientos.find(lanzamiento => lanzamiento.id === id);
}


function obtenerNombreCohete(tipo) {
    const tipos = {
        "falcon": "FALCON 9",
        "falcon-heavy": "FALCON HEAVY",
        "starship": "STARSHIP"
    };

    return tipos[tipo];
}
//  Funciones de propósito general que pueden reutilizarse en distintas
//  partes del código. Considera qué operaciones se repiten frecuentemente
//  y valdría la pena encapsular como función auxiliar.
//
//  Por ejemplo: generar un identificador único para cada registro,
//  o transformar una fecha al formato que se mostrará en las tarjetas.
// ─────────────────────────────────────────────────────────────────────────────



// ─────────────────────────────────────────────────────────────────────────────
//  SECCIÓN 3 — RENDERIZADO DE TARJETAS
function crearTarjeta(lanzamiento) {

    const tarjeta = document.createElement("article");

    tarjeta.classList.add(
        "organism-launch-card",
        `organism-launch-card--${lanzamiento.estado}`
    );

    tarjeta.dataset.id = lanzamiento.id;
    tarjeta.dataset.tipo = lanzamiento.tipo;
    tarjeta.dataset.estado = lanzamiento.estado;

    // HEADER
    const header = document.createElement("div");
    header.classList.add("molecule-card-header");

    const id = document.createElement("span");
    id.classList.add("molecule-card-header__id", "atom-mono");
    id.textContent = lanzamiento.id;

    const badge = document.createElement("span");
    badge.classList.add(
        "atom-badge",
        `atom-badge--${lanzamiento.estado}`
    );
    badge.textContent = lanzamiento.estado.toUpperCase();

    header.appendChild(id);
    header.appendChild(badge);

    
    const body = document.createElement("div");
    body.classList.add("molecule-card-body");

    const nombre = document.createElement("div");
    nombre.classList.add("molecule-card-body__name");
    nombre.textContent = lanzamiento.nombre;

    const tipo = document.createElement("div");
    tipo.classList.add("molecule-card-body__type");
    tipo.textContent = obtenerNombreCohete(lanzamiento.tipo);

    const objetivo = document.createElement("div");
    objetivo.classList.add("molecule-card-body__objective");
    objetivo.textContent = lanzamiento.objetivo;

    const fecha = document.createElement("div");
    fecha.classList.add("molecule-card-body__date", "atom-mono");
    fecha.textContent = formatearFecha(lanzamiento.fecha);

    body.appendChild(nombre);
    body.appendChild(tipo);
    body.appendChild(objetivo);
    body.appendChild(fecha);

    
    const footer = document.createElement("div");
    footer.classList.add("molecule-card-footer");

    const btnEditar = document.createElement("button");
    btnEditar.classList.add(
        "atom-btn",
        "atom-btn--secondary",
        "atom-btn--sm"
    );
    btnEditar.dataset.action = "editar";
    btnEditar.dataset.id = lanzamiento.id;
    btnEditar.textContent = "EDITAR";

    const btnCancelar = document.createElement("button");
    btnCancelar.classList.add(
        "atom-btn",
        "atom-btn--danger",
        "atom-btn--sm"
    );
    btnCancelar.dataset.action = "cancelar";
    btnCancelar.dataset.id = lanzamiento.id;
    btnCancelar.textContent = "CANCELAR";

    footer.appendChild(btnEditar);
    footer.appendChild(btnCancelar);

    btnEditar.addEventListener("click", () => {
    editarLanzamiento(lanzamiento.id);
});

btnCancelar.addEventListener("click", () => {
    cancelarLanzamiento(lanzamiento.id);
});

    
    tarjeta.appendChild(header);
    tarjeta.appendChild(body);
    tarjeta.appendChild(footer);

    return tarjeta;
}


function renderizarLanzamientos() {

    const grid = document.getElementById("grid-lanzamientos");

    grid.innerHTML = "";

    lanzamientos.forEach(lanzamiento => {

        const tarjeta = crearTarjeta(lanzamiento);

        agregarEventosHover(tarjeta);

        grid.appendChild(tarjeta);

    });

    document.getElementById("contador-lanzamientos").textContent =
        lanzamientos.length;

    document.getElementById("contador-visibles").textContent =
        `${lanzamientos.length} REGISTROS`;

    aplicarFiltro(filtroActivo);

    actualizarEstadisticas();

}

//  Funciones que leen el almacén de datos y convierten cada lanzamiento
//  en un elemento HTML visible dentro del contenedor del grid.
//
//  La tarjeta debe construirse como un elemento del DOM con la estructura
//  documentada en el archivo HTML. Revisa los comentarios del grid para
//  conocer exactamente qué clases y atributos debe tener cada parte.
//
//  IDs relevantes del HTML:
//    · #grid-lanzamientos  → contenedor donde se insertan las tarjetas
//    · #estado-vacio       → se muestra cuando no hay tarjetas
//    · #contador-visibles  → muestra cuántas tarjetas son visibles
//    · #contador-lanzamientos → contador de vuelos en la topbar
// ─────────────────────────────────────────────────────────────────────────────



// ─────────────────────────────────────────────────────────────────────────────
//  SECCIÓN 4 — ANIMACIONES DE TARJETAS (HOVER)

function agregarEventosHover(tarjeta) {

    tarjeta.addEventListener("mouseover", () => {
        tarjeta.classList.add("is-hovered");
    });

    tarjeta.addEventListener("mouseout", () => {
        tarjeta.classList.remove("is-hovered");
    });

}

//
//  Cada tarjeta creada debe escuchar eventos del cursor y responder
//  aplicando o removiendo la clase CSS que activa la animación.
//
//  La clase de activación está definida en el archivo de estilos.
//  El CSS ya tiene la transición configurada para entrada y salida.
//
//  Eventos que debes capturar en cada tarjeta:
//    · mouseover  → activar el estado de hover
//    · mouseout   → desactivar el estado de hover
// ─────────────────────────────────────────────────────────────────────────────



// ─────────────────────────────────────────────────────────────────────────────
//  SECCIÓN 5 — FORMULARIO: REGISTRO Y EDICIÓN
// ─────────────────────────────────────────────────────────────────────────────
// SECCIÓN 5 — FORMULARIO DE REGISTRO Y EDICIÓN
// ─────────────────────────────────────────────────────────────────────────────

function manejarFormulario(evento) {

    evento.preventDefault();

    try {

        const nombre = document.getElementById("input-nombre-serie").value;
        const tipo = document.getElementById("select-tipo-cohete").value;
        const fecha = document.getElementById("input-fecha-lanzamiento").value;
        const objetivo = document.getElementById("input-objetivo-mision").value;
        const idEdicion = document.getElementById("input-id-edicion").value;

        if (
            nombre === "" ||
            tipo === "" ||
            fecha === "" ||
            objetivo === ""
        ) {
            alert("Todos los campos son obligatorios");
            return;
        }

        
        if (idEdicion !== "") {

            const lanzamiento = buscarLanzamiento(idEdicion);

            if (lanzamiento) {

                lanzamiento.nombre = nombre;
                lanzamiento.tipo = tipo;
                lanzamiento.fecha = fecha;
                lanzamiento.objetivo = objetivo;

            }

        } else {

            
            const lanzamiento = {
                id: generarId(),
                nombre: nombre,
                tipo: tipo,
                fecha: fecha,
                objetivo: objetivo,
                estado: "pendiente"
            };

            lanzamientos.push(lanzamiento);

        }

        renderizarLanzamientos();

        document.getElementById("form-lanzamiento").reset();
        document.getElementById("input-id-edicion").value = "";

    } catch (error) {

        console.error(error);
        alert("Error al registrar el lanzamiento");

    }

}
document
    .getElementById("form-lanzamiento")
    .addEventListener("submit", manejarFormulario); 
//
//  Función que responde al evento de envío del formulario.
//  Debe leer el valor de cada campo, verificar que no estén vacíos,
//  construir el objeto del lanzamiento y añadirlo al almacén.
//  Si el campo oculto de edición contiene un ID, debe actualizar el
//  registro existente en lugar de crear uno nuevo.
//
//  IDs relevantes del HTML:
//    · #form-lanzamiento        → el elemento <form>
//    · #input-nombre-serie      → campo texto nombre
//    · #select-tipo-cohete      → campo selección tipo
//    · #input-fecha-lanzamiento → campo fecha y hora
//    · #input-objetivo-mision   → campo texto objetivo
//    · #input-id-edicion        → campo oculto con el ID en modo edición
//    · #btn-registrar           → botón principal del formulario
//    · #btn-cancelar-edicion    → botón para salir del modo edición
// ─────────────────────────────────────────────────────────────────────────────



// ─────────────────────────────────────────────────────────────────────────────
//  SECCIÓN 6 — CAMBIOS DE ESTADO
//



function editarLanzamiento(id) {

    const lanzamiento = buscarLanzamiento(id);

    if (!lanzamiento || lanzamiento.estado !== "pendiente") {
        return;
    }

    document.getElementById("input-nombre-serie").value =
        lanzamiento.nombre;

    document.getElementById("select-tipo-cohete").value =
        lanzamiento.tipo;

    document.getElementById("input-fecha-lanzamiento").value =
        lanzamiento.fecha;

    document.getElementById("input-objetivo-mision").value =
        lanzamiento.objetivo;

    document.getElementById("input-id-edicion").value =
        lanzamiento.id;

    document.getElementById("btn-registrar").textContent =
        "GUARDAR CAMBIOS";
}



function cancelarLanzamiento(id) {

    const lanzamiento = buscarLanzamiento(id);

    if (!lanzamiento || lanzamiento.estado !== "pendiente") {
        return;
    }

    lanzamiento.estado = "cancelado";

    renderizarLanzamientos();

}
//  Funciones que modifican un lanzamiento existente:
//    · Modo edición: cargar los datos del registro en el formulario
//    · Cancelación: cambiar el estado del registro a "cancelado"
//
//  Las tarjetas tienen botones con los atributos data-id y data-action.
//  Puedes usar estos atributos para saber qué registro modificar y
//  qué acción ejecutar cuando el usuario hace clic.
// ─────────────────────────────────────────────────────────────────────────────



// ─────────────────────────────────────────────────────────────────────────────
//  SECCIÓN 7 — FILTRADO POR ESTADO

function aplicarFiltro(filtro) {

    filtroActivo = filtro;

    const tarjetas = document.querySelectorAll(".organism-launch-card");
    let visibles = 0;

    tarjetas.forEach(tarjeta => {

        const estado = tarjeta.dataset.estado;

        if (filtro === "todos" || estado === filtro) {

            tarjeta.style.display = "";
            visibles++;

        } else {

            tarjeta.style.display = "none";

        }

    });

    const botones = document.querySelectorAll(
        "#grupo-filtros .atom-btn--filter"
    );

    botones.forEach(boton => {

        boton.classList.remove("atom-btn--filter-active");

    });

    document
        .querySelector(`[data-filter="${filtro}"]`)
        .classList.add("atom-btn--filter-active");

    document.getElementById("contador-visibles").textContent =
        `${visibles} REGISTROS`;

}


// EVENTOS DE LOS BOTONES DE FILTRO
document.querySelectorAll("#grupo-filtros button")
    .forEach(boton => {

        boton.addEventListener("click", () => {

            aplicarFiltro(boton.dataset.filter);

        });

    });
//
//  Funciones que muestran u ocultan tarjetas según el filtro activo.
//  Al aplicar un filtro, solo deben verse las tarjetas que coincidan
//  con el estado seleccionado. El botón activo debe marcarse visualmente.
//
//  IDs relevantes del HTML:
//    · #grupo-filtros  → contenedor de los botones de filtro
//
//  Atributo en los botones de filtro: data-filter
//  Valores posibles: "todos" · "pendiente" · "lanzado" · "cancelado"
//
//  Clase CSS del botón activo: atom-btn--filter-active
// ─────────────────────────────────────────────────────────────────────────────



// ─────────────────────────────────────────────────────────────────────────────
//  SECCIÓN 8 — RELOJ Y MONITOREO AUTOMÁTICO
// ─────────────────────────────────────────────────────────────────────────────

setInterval(() => {

    const ahora = new Date();

    const horas = String(ahora.getUTCHours()).padStart(2, "0");
    const minutos = String(ahora.getUTCMinutes()).padStart(2, "0");
    const segundos = String(ahora.getUTCSeconds()).padStart(2, "0");

    document.getElementById("reloj-principal").textContent =
        `${horas}:${minutos}:${segundos}Z`;

    
    let cambios = false;

    lanzamientos.forEach(lanzamiento => {

        if (
            lanzamiento.estado === "pendiente" &&
            new Date(lanzamiento.fecha) <= new Date()
        ) {

            lanzamiento.estado = "lanzado";
            cambios = true;

        }

    });

    if (cambios) {
        renderizarLanzamientos();
    }

}, 1000);



//  Un intervalo de tiempo que se ejecuta cada segundo y realiza dos tareas:
//
//    Tarea A: Reloj en tiempo real
//      Obtener la hora actual en UTC y mostrarla en el elemento del reloj
//      usando el formato HH:MM:SSZ (horas, minutos, segundos + letra Z).
//
//    Tarea B: Detección automática de lanzamientos
//      Recorrer el almacén y buscar registros con estado "pendiente"
//      cuya fecha programada ya se haya alcanzado o superado.
//      Cuando se detecte uno, cambiar su estado a "lanzado" y
//      actualizar la vista para reflejar el cambio.
//
//  ID relevante del HTML:
//    · #reloj-principal → elemento donde se despliega la hora
// ─────────────────────────────────────────────────────────────────────────────



// ─────────────────────────────────────────────────────────────────────────────
//  SECCIÓN 9 — ESTADÍSTICAS


// ─────────────────────────────────────────────────────────────────────────────
// SECCIÓN 9 — ESTADÍSTICAS
// ─────────────────────────────────────────────────────────────────────────────

function actualizarEstadisticas() {

    let pendientes = 0;
    let lanzados = 0;
    let cancelados = 0;

    lanzamientos.forEach(lanzamiento => {

        if (lanzamiento.estado === "pendiente") {
            pendientes++;
        } else if (lanzamiento.estado === "lanzado") {
            lanzados++;
        } else if (lanzamiento.estado === "cancelado") {
            cancelados++;
        }

    });

    document.getElementById("stat-pendientes").textContent =
        pendientes;

    document.getElementById("stat-lanzados").textContent =
        lanzados;

    document.getElementById("stat-cancelados").textContent =
        cancelados;

    document.getElementById("stat-total").textContent =
        lanzamientos.length;

}
//  Función que recorre el almacén, cuenta los registros por estado
//  y actualiza los elementos del panel de estadísticas con los totales.
//
//  IDs relevantes del HTML:
//    · #stat-pendientes  → contador de lanzamientos pendientes
//    · #stat-lanzados    → contador de lanzamientos ejecutados
//    · #stat-cancelados  → contador de lanzamientos cancelados
//    · #stat-total       → total de registros en el sistema
// ─────────────────────────────────────────────────────────────────────────────



// ─────────────────────────────────────────────────────────────────────────────
//  SECCIÓN 10 — INICIALIZACIÓN

document.addEventListener("DOMContentLoaded", () => {

    document
        .getElementById("form-lanzamiento")
        .addEventListener("submit", manejarFormulario);

    document
        .getElementById("btn-cancelar-edicion")
        .addEventListener("click", () => {

            document.getElementById("form-lanzamiento").reset();

            document.getElementById("input-id-edicion").value = "";

            document.getElementById("btn-registrar").textContent =
                "▶ REGISTRAR LANZAMIENTO";

        });

    renderizarLanzamientos();

    actualizarEstadisticas();

});
//
//  Punto de arranque de la aplicación. Todo el código que necesita
//  interactuar con elementos del DOM debe ejecutarse aquí, dentro de
//  un mecanismo que garantice que la página ya terminó de cargar.
//
//  Desde aquí debes:
//    · Conectar los eventos del formulario y los botones
//    · Iniciar el intervalo del reloj y el monitor automático
//    · Hacer el primer renderizado y actualizar las estadísticas
// ─────────────────────────────────────────────────────────────────────────────
