// ===========================
// SISTEMA DE ALERTAS PERSONALIZADAS
// ===========================

// Crear modal de alerta al cargar
const modalAlerta = document.createElement('div');
modalAlerta.classList.add('alerta-overlay');
modalAlerta.innerHTML = `
  <div class="alerta-container">
    <div class="alerta-header" id="alertaHeader">
      <i class="fas fa-info-circle alerta-icon" id="alertaIcon"></i>
      <h3 class="alerta-title" id="alertaTitle">Alerta</h3>
    </div>
    <div class="alerta-body">
      <p class="alerta-message" id="alertaMessage"></p>
    </div>
    <div class="alerta-footer">
      <button class="btn-alerta-ok" id="btnAlertaOk">Aceptar</button>
    </div>
  </div>
`;
document.body.appendChild(modalAlerta);

const alertaHeader = document.getElementById('alertaHeader');
const alertaIcon = document.getElementById('alertaIcon');
const alertaTitle = document.getElementById('alertaTitle');
const alertaMessage = document.getElementById('alertaMessage');
const btnAlertaOk = document.getElementById('btnAlertaOk');

function mostrarAlerta(mensaje, tipo = 'info') {
  // Configurar según el tipo de alerta
  alertaHeader.className = 'alerta-header ' + tipo;
  
  const config = {
    error: {
      icon: 'fa-exclamation-circle',
      title: 'Error'
    },
    success: {
      icon: 'fa-check-circle',
      title: 'Éxito'
    },
    warning: {
      icon: 'fa-exclamation-triangle',
      title: 'Advertencia'
    },
    info: {
      icon: 'fa-info-circle',
      title: 'Información'
    }
  };

  const tipoConfig = config[tipo] || config.info;
  alertaIcon.className = `fas ${tipoConfig.icon} alerta-icon`;
  alertaTitle.textContent = tipoConfig.title;
  alertaMessage.textContent = mensaje;
  
  modalAlerta.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function cerrarAlerta() {
  modalAlerta.classList.remove('active');
  document.body.style.overflow = 'auto';
}

btnAlertaOk.addEventListener('click', cerrarAlerta);

// Cerrar alerta con ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalAlerta.classList.contains('active')) {
    cerrarAlerta();
  }
});

// ===========================
// CÓDIGO ORIGINAL CON ALERTAS PERSONALIZADAS
// ===========================

// Arreglo para almacenar enfermedades
let enfermedades = [];

// Selección de elementos
const modal = document.getElementById('modalAgregarEnfermedad');
const btnGuardar = document.getElementById('btnGuardarEnfermedad');
const btnCerrarModal = document.getElementById('btnCerrarModal');
const btnAgregar = document.querySelector('.btn-agregar');
const tablaEnfermedades = document.querySelector('.tabla-animales');
const inputNombre = document.getElementById('nombre');
const inputTipo = document.getElementById('tipo');
const inputSintomas = document.getElementById('sintomas');
const inputDuracion = document.getElementById('duracion');
const inputTratamientos = document.getElementById('tratamientos');
const selectRiesgo = document.getElementById('riesgo');
const inputTransmision = document.getElementById('transmision');
const inputAnalisis = document.getElementById('analisis');
const buscador = document.querySelector('.buscador input');

// Modal de visualizar
const modalVisualizar = document.getElementById('modalVisualizarEnfermedad');
const contenidoEnfermedad = document.getElementById('contenidoEnfermedad');
const btnCerrarVisualizar = document.getElementById('btnCerrarVisualizar');

// Modal de eliminar
let enfermedadAEliminar = null;
const modalEliminar = document.createElement('div');
modalEliminar.id = 'modalEliminarEnfermedad';
modalEliminar.classList.add('modal-overlay');
modalEliminar.innerHTML = `
  <div class="modal-container">
    <div class="modal-header-custom">
      <h2 class="modal-title-custom">
        <i class="fas fa-trash-alt"></i> Eliminar Enfermedad
      </h2>
      <button onclick="cerrarModalEliminar()" class="btn-close-custom">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <div class="modal-body-custom">
      <div class="modal-icon-warning" style="background-color: #f8d7da;">
        <i class="fas fa-exclamation-triangle" style="color: #721c24;"></i>
      </div>
      <p class="modal-message">¿Estás seguro de eliminar esta enfermedad?</p>
      <p class="modal-submessage" id="mensajeEliminarEnfermedad">
        Esta acción no se puede deshacer.
      </p>
    </div>
    <div class="modal-footer-custom">
      <button onclick="cerrarModalEliminar()" class="btn-modal-cancelar">
        <i class="fas fa-times"></i> Cancelar
      </button>
      <button onclick="confirmarEliminarEnfermedad()" class="btn-modal-confirmar">
        <i class="fas fa-trash-alt"></i> Eliminar
      </button>
    </div>
  </div>
`;
document.body.appendChild(modalEliminar);

let editIndex = null;

// -------------------------
// ABRIR MODAL
// -------------------------
btnAgregar.addEventListener('click', () => {
  limpiarModal();
  modal.style.display = 'flex';
});

// Cerrar modal agregar/editar
btnCerrarModal.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', (e) => { 
  if (e.target === modal) modal.style.display = 'none'; 
});

// Cerrar modal visualizar
btnCerrarVisualizar.addEventListener('click', () => modalVisualizar.style.display = 'none');
window.addEventListener('click', (e) => { 
  if (e.target === modalVisualizar) modalVisualizar.style.display = 'none'; 
});

// -------------------------
// LIMPIAR MODAL
// -------------------------
function limpiarModal() {
  inputNombre.value = '';
  inputTipo.value = '';
  inputSintomas.value = '';
  inputDuracion.value = '';
  inputTratamientos.value = '';
  selectRiesgo.value = 'Leve';
  inputTransmision.value = '';
  inputAnalisis.value = '';
  editIndex = null;
}

// Badge de riesgo
function getBadgeClass(riesgo) {
  const clases = {
    'Leve': 'badge-leve',
    'Moderado': 'badge-moderado',
    'Grave': 'badge-grave',
    'Crítico': 'badge-critico'
  };
  return clases[riesgo] || 'badge-leve';
}

// -------------------------
// GUARDAR ENFERMEDAD
// -------------------------
btnGuardar.addEventListener('click', () => {
  const nombre = inputNombre.value.trim();
  const tipo = inputTipo.value.trim();
  
  // VALIDACIÓN CON ALERTA PERSONALIZADA
  if (!nombre || !tipo) {
    mostrarAlerta('Por favor complete todos los campos obligatorios: Nombre y Tipo de la enfermedad.', 'error');
    return;
  }

  const enfermedadData = {
    nombre,
    tipo,
    sintomas: inputSintomas.value.trim(),
    duracion: inputDuracion.value.trim(),
    tratamientos: inputTratamientos.value.trim(),
    riesgo: selectRiesgo.value,
    transmision: inputTransmision.value.trim(),
    analisis: inputAnalisis.value.trim()
  };

  if (editIndex !== null) {
    enfermedades[editIndex] = enfermedadData;
    mostrarAlerta(`La enfermedad "${enfermedadData.nombre}" ha sido actualizada exitosamente.`, 'success');
  } else {
    enfermedades.push(enfermedadData);
    mostrarAlerta(`La enfermedad "${enfermedadData.nombre}" ha sido registrada exitosamente.`, 'success');
  }

  modal.style.display = 'none';
  renderizarEnfermedades();
});

// -------------------------
// MODAL DE ELIMINAR
// -------------------------
function abrirModalEliminar(enfermedad) {
  enfermedadAEliminar = enfermedad;
  document.getElementById('mensajeEliminarEnfermedad').textContent =
    `Se eliminará la enfermedad "${enfermedad.nombre}".`;
  document.getElementById('modalEliminarEnfermedad').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function cerrarModalEliminar() {
  document.getElementById('modalEliminarEnfermedad').classList.remove('active');
  document.body.style.overflow = 'auto';
  enfermedadAEliminar = null;
}

function confirmarEliminarEnfermedad() {
  if (enfermedadAEliminar) {
    const nombreEnfermedad = enfermedadAEliminar.nombre;
    const idx = enfermedades.indexOf(enfermedadAEliminar);
    enfermedades.splice(idx, 1);
    renderizarEnfermedades();
    cerrarModalEliminar();
    
    // Mostrar alerta de éxito
    mostrarAlerta(`La enfermedad "${nombreEnfermedad}" ha sido eliminada exitosamente.`, 'success');
  }
}

// -------------------------
// RENDERIZAR TABLA
// -------------------------
function renderizarEnfermedades(lista = enfermedades) {
  tablaEnfermedades.innerHTML = '';
  
  if (lista.length === 0) {
    tablaEnfermedades.innerHTML = '<p>No hay enfermedades registradas.</p>';
    return;
  }

  const tabla = document.createElement('table');
  tabla.innerHTML = `
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Tipo</th>
        <th>Riesgo</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const tbody = tabla.querySelector('tbody');
  lista.forEach(enfermedad => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${enfermedad.nombre}</td>
      <td>${enfermedad.tipo}</td>
      <td><span class="badge-riesgo ${getBadgeClass(enfermedad.riesgo)}">${enfermedad.riesgo}</span></td>
      <td>
        <button class="btn-ver">👁️</button>
        <button class="btn-editar">✏️</button>
        <button class="btn-eliminar">🗑️</button>
      </td>
    `;

    // VISUALIZAR
    fila.querySelector('.btn-ver').addEventListener('click', () => {
      contenidoEnfermedad.innerHTML = `
        <p><strong>Nombre:</strong> ${enfermedad.nombre}</p>
        <p><strong>Tipo:</strong> ${enfermedad.tipo}</p>
        <p><strong>Síntomas:</strong> ${enfermedad.sintomas}</p>
        <p><strong>Duración:</strong> ${enfermedad.duracion}</p>
        <p><strong>Tratamientos:</strong> ${enfermedad.tratamientos}</p>
        <p><strong>Riesgo:</strong> <span class="badge-riesgo ${getBadgeClass(enfermedad.riesgo)}">${enfermedad.riesgo}</span></p>
        <p><strong>Transmisión:</strong> ${enfermedad.transmision}</p>
        <p><strong>Análisis:</strong> ${enfermedad.analisis}</p>
      `;
      modalVisualizar.style.display = 'flex';
    });

    // EDITAR
    fila.querySelector('.btn-editar').addEventListener('click', () => {
      inputNombre.value = enfermedad.nombre;
      inputTipo.value = enfermedad.tipo;
      inputSintomas.value = enfermedad.sintomas;
      inputDuracion.value = enfermedad.duracion;
      inputTratamientos.value = enfermedad.tratamientos;
      selectRiesgo.value = enfermedad.riesgo;
      inputTransmision.value = enfermedad.transmision;
      inputAnalisis.value = enfermedad.analisis;
      editIndex = enfermedades.indexOf(enfermedad);
      modal.style.display = 'flex';
    });

    // ELIMINAR
    fila.querySelector('.btn-eliminar').addEventListener('click', () => {
      abrirModalEliminar(enfermedad);
    });

    tbody.appendChild(fila);
  });

  tablaEnfermedades.appendChild(tabla);
}

// -------------------------
// BUSCADOR
// -------------------------
buscador.addEventListener('input', () => {
  const texto = buscador.value.toLowerCase();
  const resultados = enfermedades.filter(e =>
    e.nombre.toLowerCase().includes(texto) ||
    e.tipo.toLowerCase().includes(texto)
  );
  renderizarEnfermedades(resultados);
});

// Inicializar tabla
renderizarEnfermedades();