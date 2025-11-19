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

// ===================================
// MODAL DE ELIMINAR (usando mismo estilo de alertas)
// ===================================
const modalEliminar = document.createElement('div');
modalEliminar.classList.add('alerta-overlay');
modalEliminar.id = 'modalEliminarMedicamento';
modalEliminar.innerHTML = `
  <div class="alerta-container">
    <div class="alerta-header error">
      <i class="fas fa-trash-alt alerta-icon"></i>
      <h3 class="alerta-title">Eliminar Medicamento</h3>
    </div>
    <div class="alerta-body">
      <p class="alerta-message">¿Estás seguro de eliminar este medicamento?</p>
      <p class="alerta-message" id="mensajeEliminarMedicamento" style="font-size: 0.9rem; color: #666; margin-top: 10px;"></p>
    </div>
    <div class="alerta-footer" style="gap: 10px;">
      <button id="btnCancelarEliminar" class="btn-alerta-ok" style="background-color: #6c757d;">
        <i class="fas fa-times"></i> Cancelar
      </button>
      <button id="btnConfirmarEliminar" class="btn-alerta-ok" style="background-color: #dc3545;">
        <i class="fas fa-trash-alt"></i> Eliminar
      </button>
    </div>
  </div>
`;
document.body.appendChild(modalEliminar);

const btnCancelarEliminar = document.getElementById('btnCancelarEliminar');
const btnConfirmarEliminar = document.getElementById('btnConfirmarEliminar');

// ===================================
// FUNCIONES DEL MODAL DE ELIMINAR
// ===================================
function abrirModalEliminar(medicamento) {
  medicamentoAEliminar = medicamento;
  document.getElementById('mensajeEliminarMedicamento').textContent = 
    `Se eliminará el medicamento "${medicamento.nombre}".`;
  modalEliminar.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function cerrarModalEliminar() {
  modalEliminar.classList.remove('active');
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
btnCancelarEliminar.addEventListener('click', cerrarModalEliminar);
btnConfirmarEliminar.addEventListener('click', confirmarEliminarMedicamento);

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
window.addEventListener('click', e => { 
  if(e.target === modal) modal.style.display = 'none'; 
});

// Cerrar modal visualizar
btnCerrarVisualizar.addEventListener('click', () => modalVisualizar.style.display = 'none');
window.addEventListener('click', e => { 
  if(e.target === modalVisualizar) modalVisualizar.style.display = 'none'; 
});

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

  lista.forEach((med) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${med.nombre}</td>
      <td>${med.presentacion}</td>
      <td>
        <button class="btn-ver" title="Ver detalles">👁️</button>
        <button class="btn-editar" title="Editar">✏️</button>
        <button class="btn-eliminar" title="Eliminar">🗑️</button>
      </td>
    `;

    // Visualizar
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
          <strong>Solucion</strong>
          <p>${med.Solucion || 'No especificada'}</p>
        </div>
        <div class="detalle-item">
          <strong>Frecuencia de aplicacion</strong>
          <p>${med.Frecuenciadeaplicacion || 'No especificada'}</p>
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
      imputFrecuenciadeaplicacion =med.Frecuenciadeaplicacion;
      inputIndicaciones.value = med.indicaciones;
      editIndex = medicamentos.indexOf(med);
      modal.style.display = 'flex';
    });

    // Eliminar
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

// Cerrar modales con ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (modalAlerta.classList.contains('active')) {
      cerrarAlerta();
    }
    if (modalEliminar.classList.contains('active')) {
      cerrarModalEliminar();
    }
  }
});

// Cerrar modal de eliminar con click fuera
window.addEventListener('click', (e) => {
  if (e.target === modalEliminar) {
    cerrarModalEliminar();
  }
  if (e.target === modalAlerta) {
    cerrarAlerta();
  }
});

// Inicializar
renderizarMedicamentos();

console.log('✅ Sistema de medicamentos cargado correctamente');