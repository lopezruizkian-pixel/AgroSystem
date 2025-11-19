// =====================
// SISTEMA DE ALERTAS PERSONALIZADAS
// =====================
function mostrarAlerta(tipo, titulo, mensaje) {
    const overlay = document.createElement("div");
    overlay.classList.add("alerta-overlay", "active");

    overlay.innerHTML = `
        <div class="alerta-container">
            <div class="alerta-header ${tipo}">
                <span class="alerta-icon">⚠️</span>
                <h3 class="alerta-title">${titulo}</h3>
            </div>
            <div class="alerta-body">
                <p class="alerta-message">${mensaje}</p>
            </div>
            <div class="alerta-footer">
                <button class="btn-alerta-ok">Aceptar</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector(".btn-alerta-ok").addEventListener("click", () => {
        overlay.remove();
    });
}



// =====================
// VARIABLES
// =====================
const btnAgregar = document.querySelector(".btn-agregar");
const modalAgregar = document.getElementById("modalAgregarReporte");
const modalVisualizar = document.getElementById("modalVisualizarReporte");

const btnCerrarAgregar = document.getElementById("btnCerrarModal");
const btnCerrarVisualizar = document.getElementById("btnCerrarVisualizar");
const btnGuardar = document.getElementById("btnGuardarReporte");

const tabla = document.querySelector(".tabla-animales");

// Reportes almacenados
let reportes = [];

// Para identificar si estamos editando
let editIndex = -1;


// =====================
// ABRIR MODAL AGREGAR
// =====================
btnAgregar.addEventListener("click", () => {
    modalAgregar.style.display = "flex";
    limpiarCampos();
    editIndex = -1; 
});


// =====================
// CERRAR MODAL AGREGAR
// =====================
btnCerrarAgregar.addEventListener("click", () => {
    modalAgregar.style.display = "none";
});


// =====================
// CERRAR MODAL VISUALIZAR
// =====================
btnCerrarVisualizar.addEventListener("click", () => {
    modalVisualizar.style.display = "none";
});


// =====================
// GUARDAR (AGREGAR O EDITAR)
// =====================
btnGuardar.addEventListener("click", () => {

    const data = {
        numArete: document.getElementById("numArete").value,
        fecha: document.getElementById("fecha").value,
        veterinario: document.getElementById("veterinario").value,
        temperatura: document.getElementById("temperatura").value,
        condicionCorporal: document.getElementById("condicionCorporal").value,
        frecuenciaRespiratoria: document.getElementById("frecuenciaRespiratoria").value,
        diagnosticoPresuntivo: document.getElementById("diagnosticoPresuntivo").value,
        diagnosticoDefinitivo: document.getElementById("diagnosticoDefinitivo").value,
        sintomas: document.getElementById("sintomas").value,
        tratamiento: document.getElementById("tratamiento").value,
        medicamentos: document.getElementById("medicamentos").value,
        estado: document.getElementById("estado").value,
        observaciones: document.getElementById("observaciones").value
    };

    // Validación de campos obligatorios
    if (data.numArete === "" || data.fecha === "" || data.veterinario === "") {
        mostrarAlerta("warning", "Campos incompletos", "Debes llenar los campos obligatorios.");
        return;
    }

    // Si estamos editando
    if (editIndex !== -1) {
        reportes[editIndex] = data;
        mostrarAlerta("success", "Reporte actualizado", "Los datos del reporte se actualizaron correctamente.");
        editIndex = -1;
    } else {
        reportes.push(data);
        mostrarAlerta("success", "Reporte agregado", "El reporte médico fue registrado correctamente.");
    }

    mostrarTabla();
    modalAgregar.style.display = "none";
    limpiarCampos();
});


// =====================
// MOSTRAR TABLA
// =====================
function mostrarTabla() {
    if (reportes.length === 0) {
        tabla.innerHTML = "<p>No hay reportes registrados.</p>";
        return;
    }

    let html = `
      <table border="1" class="tabla-estilo">
        <tr>
          <th>Arete</th>
          <th>Fecha</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
    `;

    reportes.forEach((r, index) => {
        html += `
        <tr>
          <td>${r.numArete}</td>
          <td>${r.fecha}</td>
          <td>${r.estado}</td>
          <td>
            <button onclick="verReporte(${index})">👁</button>
            <button onclick="editarReporte(${index})">✏️</button>
            <button onclick="eliminarReporte(${index})">🗑️</button>
          </td>
        </tr>
      `;
    });

    html += "</table>";
    tabla.innerHTML = html;
}


// =====================
// VISUALIZAR REPORTE
// =====================
function verReporte(i) {

    const r = reportes[i];

    const contenido = `
      <p><strong>Arete:</strong> ${r.numArete}</p>
      <p><strong>Fecha:</strong> ${r.fecha}</p>
      <p><strong>Veterinario:</strong> ${r.veterinario}</p>
      <p><strong>Temperatura:</strong> ${r.temperatura}</p>
      <p><strong>Condición Corporal:</strong> ${r.condicionCorporal}</p>
      <p><strong>Frecuencia Respiratoria:</strong> ${r.frecuenciaRespiratoria}</p>
      <p><strong>Diagnóstico Presuntivo:</strong> ${r.diagnosticoPresuntivo}</p>
      <p><strong>Diagnóstico Definitivo:</strong> ${r.diagnosticoDefinitivo}</p>
      <p><strong>Síntomas:</strong> ${r.sintomas}</p>
      <p><strong>Tratamiento:</strong> ${r.tratamiento}</p>
      <p><strong>Medicamentos:</strong> ${r.medicamentos}</p>
      <p><strong>Estado:</strong> ${r.estado}</p>
      <p><strong>Observaciones:</strong> ${r.observaciones}</p>
    `;

    document.getElementById("contenidoReporte").innerHTML = contenido;

    modalVisualizar.style.display = "flex";
}


// =====================
// EDITAR REPORTE
// =====================
function editarReporte(i) {

    const r = reportes[i];
    editIndex = i;

    document.getElementById("numArete").value = r.numArete;
    document.getElementById("fecha").value = r.fecha;
    document.getElementById("veterinario").value = r.veterinario;
    document.getElementById("temperatura").value = r.temperatura;
    document.getElementById("condicionCorporal").value = r.condicionCorporal;
    document.getElementById("frecuenciaRespiratoria").value = r.frecuenciaRespiratoria;
    document.getElementById("diagnosticoPresuntivo").value = r.diagnosticoPresuntivo;
    document.getElementById("diagnosticoDefinitivo").value = r.diagnosticoDefinitivo;
    document.getElementById("sintomas").value = r.sintomas;
    document.getElementById("tratamiento").value = r.tratamiento;
    document.getElementById("medicamentos").value = r.medicamentos;
    document.getElementById("estado").value = r.estado;
    document.getElementById("observaciones").value = r.observaciones;

    modalAgregar.style.display = "flex";
}


// =====================
// ELIMINAR REPORTE
// =====================
function eliminarReporte(i) {
    mostrarAlerta(
        "warning",
        "Eliminar reporte",
        "¿Estás segura de que deseas eliminar este reporte?"
    );

    // Esperar que el usuario acepte
    setTimeout(() => {
        reportes.splice(i, 1);
        mostrarTabla();
        mostrarAlerta("success", "Eliminado", "El reporte se eliminó correctamente.");
    }, 500);
}


// =====================
// LIMPIAR CAMPOS
// =====================
function limpiarCampos() {
    document.getElementById("numArete").value = "";
    document.getElementById("fecha").value = "";
    document.getElementById("veterinario").value = "";
    document.getElementById("temperatura").value = "";
    document.getElementById("condicionCorporal").value = "";
    document.getElementById("frecuenciaRespiratoria").value = "";
    document.getElementById("diagnosticoPresuntivo").value = "";
    document.getElementById("diagnosticoDefinitivo").value = "";
    document.getElementById("sintomas").value = "";
    document.getElementById("tratamiento").value = "";
    document.getElementById("medicamentos").value = "";
    document.getElementById("estado").value = "Estable";
    document.getElementById("observaciones").value = "";
}


// =====================
// HACER FUNCIONES GLOBALES
// =====================
window.verReporte = verReporte;
window.editarReporte = editarReporte;
window.eliminarReporte = eliminarReporte;
