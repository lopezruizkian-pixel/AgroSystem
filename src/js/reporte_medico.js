// ============================================
// SISTEMA DE ALERTAS PERSONALIZADAS
// ============================================

// Crear el modal de alerta si no existe
function crearModalAlerta() {
  if (document.getElementById('alertaPersonalizada')) return;
  
  const alertaModal = document.createElement('div');
  alertaModal.id = 'alertaPersonalizada';
  alertaModal.classList.add('alerta-overlay');
  alertaModal.innerHTML = `
    <div class="alerta-container">
      <div class="alerta-header" id="alertaHeader">
        <i class="fas fa-info-circle alerta-icon" id="alertaIcon"></i>
        <h3 class="alerta-title" id="alertaTitle">Alerta</h3>
      </div>
      <div class="alerta-body">
        <p class="alerta-message" id="alertaMessage"></p>
      </div>
      <div class="alerta-footer">
        <button class="btn-alerta-ok" id="btnAlertaOk">
          <i class="fas fa-check"></i> Aceptar
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(alertaModal);
  
  // Evento para cerrar
  document.getElementById('btnAlertaOk').addEventListener('click', cerrarAlerta);
  
  // Cerrar con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && alertaModal.classList.contains('active')) {
      cerrarAlerta();
    }
  });
}

// Mostrar alerta personalizada
function mostrarAlerta(mensaje, tipo = 'error') {
  crearModalAlerta();
  
  const alertaModal = document.getElementById('alertaPersonalizada');
  const header = document.getElementById('alertaHeader');
  const icon = document.getElementById('alertaIcon');
  const title = document.getElementById('alertaTitle');
  const message = document.getElementById('alertaMessage');
  
  // Limpiar clases previas
  header.classList.remove('error', 'success', 'warning', 'info');
  
  // Configurar según el tipo
  switch(tipo) {
    case 'error':
      header.classList.add('error');
      icon.className = 'fas fa-exclamation-circle alerta-icon';
      title.textContent = 'Error';
      break;
    case 'success':
      header.classList.add('success');
      icon.className = 'fas fa-check-circle alerta-icon';
      title.textContent = 'Éxito';
      break;
    case 'warning':
      header.classList.add('warning');
      icon.className = 'fa-exclamation-circle';
      title.textContent = 'Error';
      break;
    case 'info':
      header.classList.add('info');
      icon.className = 'fas fa-info-circle alerta-icon';
      title.textContent = 'Información';
      break;
  }
  
  message.textContent = mensaje;
  alertaModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Cerrar alerta
function cerrarAlerta() {
  const alertaModal = document.getElementById('alertaPersonalizada');
  if (alertaModal) {
    alertaModal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

// ============================================
// CÓDIGO PRINCIPAL (MODIFICADO)
// ============================================

// Arreglo para almacenar reportes médicos
let reportesMedicos = [];

// Selección de elementos
const modal = document.getElementById('modalAgregarReporte');
const btnGuardar = document.getElementById('btnGuardarReporte');
const btnCerrarModal = document.getElementById('btnCerrarModal');
const btnAgregar = document.querySelector('.btn-agregar');
const tablaReportes = document.querySelector('.tabla-animales');
const inputNumArete = document.getElementById('numArete');
const inputFecha = document.getElementById('fecha');
const inputVeterinario = document.getElementById('veterinario');
const inputDiagnostico = document.getElementById('diagnostico');
const inputSintomas = document.getElementById('sintomas');
const inputTratamiento = document.getElementById('tratamiento');
const inputMedicamentos = document.getElementById('medicamentos');
const selectEstado = document.getElementById('estado');
const inputObservaciones = document.getElementById('observaciones');
const buscador = document.querySelector('.buscador input');

// Modal de visualización
const modalVisualizar = document.getElementById('modalVisualizarReporte');
const contenidoReporte = document.getElementById('contenidoReporte');
const btnCerrarVisualizar = document.getElementById('btnCerrarVisualizar');

let editIndex = null;
let reporteAEliminar = null;

// Crear modal de confirmación de eliminación
const modalEliminar = document.createElement('div');
modalEliminar.id = 'modalEliminarReporte';
modalEliminar.classList.add('modal-overlay');
modalEliminar.innerHTML = `
  <div class="modal-container">
    <div class="modal-header-custom">
      <h2 class="modal-title-custom">
        <i class="fas fa-trash-alt"></i> Eliminar Reporte Médico
      </h2>
      <button onclick="cerrarModalEliminar()" class="btn-close-custom">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <div class="modal-body-custom">
      <div class="modal-icon-warning" style="background-color: #f8d7da;">
        <i class="fas fa-exclamation-triangle" style="color: #721c24;"></i>
      </div>
      <p class="modal-message">¿Estás seguro de eliminar este reporte médico?</p>
      <p class="modal-submessage" id="mensajeEliminarReporte">Esta acción no se puede deshacer.</p>
    </div>
    <div class="modal-footer-custom">
      <button onclick="cerrarModalEliminar()" class="btn-modal-cancelar">
        <i class="fas fa-times"></i> Cancelar
      </button>
      <button onclick="confirmarEliminarReporte()" class="btn-modal-confirmar">
        <i class="fas fa-trash-alt"></i> Eliminar
      </button>
    </div>
  </div>
`;
document.body.appendChild(modalEliminar);

// Abrir modal de agregar/editar
btnAgregar.addEventListener('click', () => {
  limpiarModal();
  modal.style.display = 'flex';
});

// Cerrar modal de agregar/editar
btnCerrarModal.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', (e) => {
  if (e.target === modal) modal.style.display = 'none';
});

// Cerrar modal de visualizar
btnCerrarVisualizar.addEventListener('click', () => modalVisualizar.style.display = 'none');
window.addEventListener('click', (e) => {
  if (e.target === modalVisualizar) modalVisualizar.style.display = 'none';
});

// Limpiar modal
function limpiarModal() {
  inputNumArete.value = '';
  inputFecha.value = '';
  inputVeterinario.value = '';
  inputDiagnostico.value = '';
  inputSintomas.value = '';
  inputTratamiento.value = '';
  inputMedicamentos.value = '';
  selectEstado.value = 'Estable';
  inputObservaciones.value = '';
  editIndex = null;
}

// Guardar reporte (agregar o editar) - MODIFICADO PARA USAR ALERTA PERSONALIZADA
btnGuardar.addEventListener('click', () => {
  const numArete = inputNumArete.value.trim();
  const fecha = inputFecha.value.trim();
  const veterinario = inputVeterinario.value.trim();
  const diagnostico = inputDiagnostico.value.trim();
  const sintomas = inputSintomas.value.trim();
  const tratamiento = inputTratamiento.value.trim();
  const medicamentos = inputMedicamentos.value.trim();
  const estado = selectEstado.value;
  const observaciones = inputObservaciones.value.trim();

  // REEMPLAZAR alert() CON mostrarAlerta()
  if (!numArete || !fecha || !veterinario || !diagnostico) {
    mostrarAlerta('Por favor complete los campos obligatorios: Animal, Fecha, Veterinario y Diagnóstico', 'warning');
    return;
  }

  const reporteData = {
    numArete,
    fecha,
    veterinario,
    diagnostico,
    sintomas,
    tratamiento,
    medicamentos,
    estado,
    observaciones
  };

  if (editIndex !== null) {
    reportesMedicos[editIndex] = reporteData;
    mostrarAlerta('Reporte médico actualizado correctamente', 'success');
  } else {
    reportesMedicos.push(reporteData);
    mostrarAlerta('Reporte médico agregado correctamente', 'success');
  }

  modal.style.display = 'none';
  renderizarReportes();
});

// Funciones del modal de eliminar
function abrirModalEliminar(reporte) {
  reporteAEliminar = reporte;
  document.getElementById('mensajeEliminarReporte').textContent = 
    `Se eliminará el reporte médico del animal ${reporte.numArete} (Fecha: ${reporte.fecha}). Esta acción no se puede deshacer.`;
  document.getElementById('modalEliminarReporte').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function cerrarModalEliminar() {
  document.getElementById('modalEliminarReporte').classList.remove('active');
  document.body.style.overflow = 'auto';
  reporteAEliminar = null;
}

function confirmarEliminarReporte() {
  if (reporteAEliminar) {
    const globalIndex = reportesMedicos.indexOf(reporteAEliminar);
    reportesMedicos.splice(globalIndex, 1);
    renderizarReportes();
    cerrarModalEliminar();
    mostrarAlerta('Reporte médico eliminado correctamente', 'success');
  }
}

// Renderizar reportes en la tabla
function renderizarReportes(lista = reportesMedicos) {
  tablaReportes.innerHTML = '';

  if (lista.length === 0) {
    tablaReportes.innerHTML = '<p>No hay reportes médicos registrados.</p>';
    return;
  }

  const tabla = document.createElement('table');
  tabla.innerHTML = `
    <thead>
      <tr>
        <th>Num. Arete</th>
        <th>Fecha</th>
        <th>Veterinario</th>
        <th>Diagnóstico</th>
        <th>Estado</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
  const tbody = tabla.querySelector('tbody');

  lista.forEach((reporte) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${reporte.numArete}</td>
      <td>${reporte.fecha}</td>
      <td>${reporte.veterinario}</td>
      <td>${reporte.diagnostico}</td>
      <td>${reporte.estado}</td>
      <td>
        <button class="btn-ver" title="Ver detalles">👁️</button>
        <button class="btn-editar" title="Editar">✏️</button>
        <button class="btn-eliminar" title="Eliminar">🗑️</button>
      </td>
    `;

    // Visualizar detalle completo
    fila.querySelector('.btn-ver').addEventListener('click', () => {
      contenidoReporte.innerHTML = `
        <p><strong>Animal (Num. Arete):</strong> ${reporte.numArete}</p>
        <p><strong>Fecha:</strong> ${reporte.fecha}</p>
        <p><strong>Veterinario:</strong> ${reporte.veterinario}</p>
        <p><strong>Diagnóstico:</strong> ${reporte.diagnostico}</p>
        <p><strong>Síntomas:</strong> ${reporte.sintomas || 'N/A'}</p>
        <p><strong>Tratamiento:</strong> ${reporte.tratamiento || 'N/A'}</p>
        <p><strong>Medicamentos:</strong> ${reporte.medicamentos || 'N/A'}</p>
        <p><strong>Estado:</strong> ${reporte.estado}</p>
        <p><strong>Observaciones:</strong> ${reporte.observaciones || 'N/A'}</p>
      `;
      modalVisualizar.style.display = 'flex';
    });

    // Editar
    fila.querySelector('.btn-editar').addEventListener('click', () => {
      inputNumArete.value = reporte.numArete;
      inputFecha.value = reporte.fecha;
      inputVeterinario.value = reporte.veterinario;
      inputDiagnostico.value = reporte.diagnostico;
      inputSintomas.value = reporte.sintomas;
      inputTratamiento.value = reporte.tratamiento;
      inputMedicamentos.value = reporte.medicamentos;
      selectEstado.value = reporte.estado;
      inputObservaciones.value = reporte.observaciones;
      editIndex = reportesMedicos.indexOf(reporte);
      modal.style.display = 'flex';
    });

    // Eliminar con modal
    fila.querySelector('.btn-eliminar').addEventListener('click', () => {
      abrirModalEliminar(reporte);
    });

    tbody.appendChild(fila);
  });

  tablaReportes.appendChild(tabla);
}

// Buscar reportes
buscador.addEventListener('input', () => {
  const texto = buscador.value.toLowerCase();
  const resultados = reportesMedicos.filter(r =>
    r.numArete.toLowerCase().includes(texto) ||
    r.veterinario.toLowerCase().includes(texto) ||
    r.diagnostico.toLowerCase().includes(texto)
  );
  renderizarReportes(resultados);
});

// Cerrar modal con ESC o click fuera
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modalElim = document.getElementById('modalEliminarReporte');
    if (modalElim && modalElim.classList.contains('active')) {
      cerrarModalEliminar();
    }
  }
});

window.addEventListener('click', (e) => {
  const modalElim = document.getElementById('modalEliminarReporte');
  if (e.target === modalElim) {
    cerrarModalEliminar();
  }
});

// Inicializar tabla
renderizarReportes();