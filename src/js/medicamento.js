let medicamentos = [];

const modal = document.getElementById('modalMedicamento');
const btnGuardar = document.getElementById('btnGuardarMedicamento');
const btnCerrarModal = document.getElementById('btnCerrarModal');
const btnAgregar = document.querySelector('.btn-agregar');
const tablaMedicamentos = document.querySelector('.tabla-medicamentos');
const buscador = document.querySelector('.buscador input');

const inputNombre = document.getElementById('nombre');
const inputPresentacion = document.getElementById('presentacion');
const inputDosis = document.getElementById('dosis');
const inputCaducidad = document.getElementById('caducidad');
const inputVia = document.getElementById('via');
const inputComposicion = document.getElementById('composicion');
const inputIndicaciones = document.getElementById('indicaciones');

// Modal de visualización
const modalVisualizar = document.getElementById('modalVisualizarMedicamento');
const contenidoMedicamento = document.getElementById('contenidoMedicamento');
const btnCerrarVisualizar = document.getElementById('btnCerrarVisualizar');

let editIndex = null;
let medicamentoAEliminar = null;

// ===================================
// SISTEMA DE ALERTAS PERSONALIZADAS
// ===================================

// Agregar estilos CSS si no existen
if (!document.getElementById('estilos-alertas')) {
  const estilosAlerta = document.createElement('style');
  estilosAlerta.id = 'estilos-alertas';
  estilosAlerta.textContent = `
    .alerta-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.6);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 10001;
    }
    .alerta-overlay.active {
      display: flex !important;
    }
    .alerta-container {
      background: white;
      border-radius: 12px;
      max-width: 400px;
      width: 90%;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      animation: alertaSlideIn 0.3s ease;
    }
    @keyframes alertaSlideIn {
      from {
        transform: scale(0.8);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }
    .alerta-header {
      padding: 20px;
      border-radius: 12px 12px 0 0;
      display: flex;
      align-items: center;
      gap: 15px;
      color: white;
    }
    .alerta-header.error {
      background-color: #dc3545;
    }
    .alerta-header.success {
      background-color: #28a745;
    }
    .alerta-header.warning {
      background-color: #ffc107;
      color: #333;
    }
    .alerta-header.info {
      background-color: #17a2b8;
    }
    .alerta-icon {
      font-size: 2rem;
    }
    .alerta-title {
      margin: 0;
      font-size: 1.2rem;
      font-weight: bold;
    }
    .alerta-body {
      padding: 25px;
      text-align: center;
    }
    .alerta-message {
      font-size: 1rem;
      color: #333;
      line-height: 1.6;
    }
    .alerta-footer {
      padding: 15px 20px;
      display: flex;
      justify-content: center;
      border-top: 1px solid #e0e0e0;
    }
    .btn-alerta-ok {
      padding: 10px 30px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
      font-size: 0.95rem;
      background-color: rgba(114, 158, 100, 1);
      color: white;
      transition: all 0.3s ease;
    }
    .btn-alerta-ok:hover {
      background-color: rgba(94, 138, 80, 1);
      transform: translateY(-2px);
    }
  `;
  document.head.appendChild(estilosAlerta);
}

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

// ===================================
// MODAL DE ELIMINAR
// ===================================
const modalEliminar = document.createElement('div');
modalEliminar.id = 'modalEliminarMedicamento';
modalEliminar.classList.add('modal-overlay');
modalEliminar.innerHTML = `
  <div class="modal-container">
    <div class="modal-header-custom">
      <h2 class="modal-title-custom">
        <i class="fas fa-trash-alt"></i> Eliminar Medicamento
      </h2>
      <button id="btnCerrarModalEliminar" class="btn-close-custom">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <div class="modal-body-custom">
      <div class="modal-icon-warning" style="background-color: #f8d7da;">
        <i class="fas fa-exclamation-triangle" style="color: #721c24;"></i>
      </div>
      <p class="modal-message">¿Estás seguro de eliminar este medicamento?</p>
      <p class="modal-submessage" id="mensajeEliminarMedicamento">Esta acción no se puede deshacer.</p>
    </div>
    <div class="modal-footer-custom">
      <button id="btnCancelarEliminar" class="btn-modal-cancelar">
        <i class="fas fa-times"></i> Cancelar
      </button>
      <button id="btnConfirmarEliminar" class="btn-modal-confirmar">
        <i class="fas fa-trash-alt"></i> Eliminar
      </button>
    </div>
  </div>
`;
document.body.appendChild(modalEliminar);

// ===================================
// FUNCIONES DEL MODAL DE ELIMINAR
// ===================================
function abrirModalEliminar(medicamento) {
  medicamentoAEliminar = medicamento;
  document.getElementById('mensajeEliminarMedicamento').textContent = 
    `Se eliminará el medicamento "${medicamento.nombre}".`;
  document.getElementById('modalEliminarMedicamento').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function cerrarModalEliminar() {
  document.getElementById('modalEliminarMedicamento').classList.remove('active');
  document.body.style.overflow = 'auto';
  medicamentoAEliminar = null;
}

function confirmarEliminarMedicamento() {
  if (medicamentoAEliminar) {
    const nombreMedicamento = medicamentoAEliminar.nombre;
    const idx = medicamentos.indexOf(medicamentoAEliminar);
    medicamentos.splice(idx, 1);
    renderizarMedicamentos();
    cerrarModalEliminar();
    
    // Mostrar alerta de éxito
    mostrarAlerta(`El medicamento "${nombreMedicamento}" ha sido eliminado exitosamente.`, 'success');
  }
}

// Event listeners para botones del modal de eliminar
// Los agregamos INMEDIATAMENTE después de crear el modal
const btnCerrarEliminar = document.getElementById('btnCerrarModalEliminar');
const btnCancelarEliminar = document.getElementById('btnCancelarEliminar');
const btnConfirmarEliminar = document.getElementById('btnConfirmarEliminar');

if (btnCerrarEliminar) btnCerrarEliminar.addEventListener('click', cerrarModalEliminar);
if (btnCancelarEliminar) btnCancelarEliminar.addEventListener('click', cerrarModalEliminar);
if (btnConfirmarEliminar) btnConfirmarEliminar.addEventListener('click', confirmarEliminarMedicamento);

// ===================================
// FUNCIONES PRINCIPALES
// ===================================

// Abrir modal
btnAgregar.addEventListener('click', () => {
  limpiarModal();
  modal.style.display = 'flex';
});

// Cerrar modal agregar/editar
btnCerrarModal.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', e => { if(e.target === modal) modal.style.display = 'none'; });

// Cerrar modal visualizar
btnCerrarVisualizar.addEventListener('click', () => modalVisualizar.style.display = 'none');
window.addEventListener('click', e => { if(e.target === modalVisualizar) modalVisualizar.style.display = 'none'; });

// Limpiar modal
function limpiarModal() {
  inputNombre.value = '';
  inputPresentacion.value = '';
  inputDosis.value = '';
  inputCaducidad.value = '';
  inputVia.value = '';
  inputComposicion.value = '';
  inputIndicaciones.value = '';
  editIndex = null;
}

// Guardar medicamento (agregar o editar)
btnGuardar.addEventListener('click', () => {
  const nombre = inputNombre.value.trim();
  const presentacion = inputPresentacion.value.trim();
  const dosis = inputDosis.value.trim();
  const caducidad = inputCaducidad.value.trim();
  const via = inputVia.value.trim();
  const composicion = inputComposicion.value.trim();
  const indicaciones = inputIndicaciones.value.trim();

  if(!nombre || !presentacion) {
    mostrarAlerta('Por favor complete al menos los campos: Nombre y Presentación.', 'error');
    return;
  }

  const medData = { nombre, presentacion, dosis, caducidad, via, composicion, indicaciones };

  if(editIndex !== null){
    medicamentos[editIndex] = medData;
    mostrarAlerta(`El medicamento "${nombre}" ha sido actualizado exitosamente.`, 'success');
  } else {
    medicamentos.push(medData);
    mostrarAlerta(`El medicamento "${nombre}" ha sido registrado exitosamente.`, 'success');
  }

  modal.style.display = 'none';
  renderizarMedicamentos();
});

// Renderizar tabla de medicamentos
function renderizarMedicamentos(lista = medicamentos){
  tablaMedicamentos.innerHTML = '';

  if(lista.length === 0){
    tablaMedicamentos.innerHTML = '<p>No hay medicamentos registrados.</p>';
    return;
  }

  const tabla = document.createElement('table');
  tabla.innerHTML = `
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Presentación</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
  const tbody = tabla.querySelector('tbody');

  lista.forEach((med, index) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${med.nombre}</td>
      <td>${med.presentacion}</td>
      <td>
        <button class="btn-ver">👁️</button>
        <button class="btn-editar">✏️</button>
        <button class="btn-eliminar">🗑️</button>
      </td>
    `;

    // Visualizar - con modal mejorado
    fila.querySelector('.btn-ver').addEventListener('click', () => {
      contenidoMedicamento.innerHTML = `
        <div class="detalle-item">
          <strong>Nombre</strong>
          <p>${med.nombre}</p>
        </div>
        <div class="detalle-item">
          <strong>Presentación</strong>
          <p>${med.presentacion}</p>
        </div>
        <div class="detalle-item">
          <strong>Dosis</strong>
          <p>${med.dosis || 'No especificada'}</p>
        </div>
        <div class="detalle-item">
          <strong>Caducidad</strong>
          <p>${med.caducidad || 'No especificada'}</p>
        </div>
        <div class="detalle-item">
          <strong>Vía de Administración</strong>
          <p>${med.via || 'No especificada'}</p>
        </div>
        <div class="detalle-item">
          <strong>Composición</strong>
          <p>${med.composicion || 'No especificada'}</p>
        </div>
        <div class="detalle-item">
          <strong>Indicaciones</strong>
          <p>${med.indicaciones || 'No especificadas'}</p>
        </div>
      `;
      modalVisualizar.style.display = 'flex';
    });

    // Editar
    fila.querySelector('.btn-editar').addEventListener('click', () => {
      inputNombre.value = med.nombre;
      inputPresentacion.value = med.presentacion;
      inputDosis.value = med.dosis;
      inputCaducidad.value = med.caducidad;
      inputVia.value = med.via;
      inputComposicion.value = med.composicion;
      inputIndicaciones.value = med.indicaciones;
      editIndex = medicamentos.indexOf(med);
      modal.style.display = 'flex';
    });

    // Eliminar - con modal de confirmación personalizado
    fila.querySelector('.btn-eliminar').addEventListener('click', () => {
      abrirModalEliminar(med);
    });

    tbody.appendChild(fila);
  });

  tablaMedicamentos.appendChild(tabla);
}

// Buscar medicamentos
buscador.addEventListener('input', () => {
  const texto = buscador.value.toLowerCase();
  const resultados = medicamentos.filter(m =>
    m.nombre.toLowerCase().includes(texto) ||
    m.presentacion.toLowerCase().includes(texto)
  );
  renderizarMedicamentos(resultados);
});

// Cerrar modal de eliminar con ESC o click fuera
window.addEventListener('click', (e) => {
  const modalElim = document.getElementById('modalEliminarMedicamento');
  if (e.target === modalElim) {
    cerrarModalEliminar();
  }
});

// Cerrar modal de eliminar con tecla ESC
document.addEventListener('keydown', (e) => {
  const modalElim = document.getElementById('modalEliminarMedicamento');
  if (e.key === 'Escape' && modalElim.classList.contains('active')) {
    cerrarModalEliminar();
  }
});

// Inicializar
renderizarMedicamentos();