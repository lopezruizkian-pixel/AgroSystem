// Arreglo para almacenar tratamientos
let tratamientos = [];

// Selección de elementos
const modal = document.getElementById('modalAgregarTratamiento');
const btnGuardar = document.getElementById('btnGuardarTratamiento');
const btnCerrarModal = document.getElementById('btnCerrarModal');
const btnAgregar = document.querySelector('.btn-agregar');
const tablaTratamientos = document.querySelector('.tabla-animales');
const inputNumArete = document.getElementById('numArete');
const inputNombreTratamiento = document.getElementById('nombreTratamiento');
const inputFechaInicio = document.getElementById('fechaInicio');
const inputFechaFin = document.getElementById('fechaFin');
const inputEnfermedad = document.getElementById('enfermedad');
const inputMedicamentos = document.getElementById('medicamentos');
const inputDosis = document.getElementById('dosis');
const selectVia = document.getElementById('via');
const inputFrecuencia = document.getElementById('frecuencia');
const inputDuracion = document.getElementById('duracion');
const inputVeterinario = document.getElementById('veterinario');
const selectEstado = document.getElementById('estado');
const inputObservaciones = document.getElementById('observaciones');
const buscador = document.querySelector('.buscador input');

// Modal de visualización
const modalVisualizar = document.getElementById('modalVisualizarTratamiento');
const contenidoTratamiento = document.getElementById('contenidoTratamiento');
const btnCerrarVisualizar = document.getElementById('btnCerrarVisualizar');

let editIndex = null;
let tratamientoAEliminar = null;

// Crear modal de confirmación de eliminación
const modalEliminar = document.createElement('div');
modalEliminar.id = 'modalEliminarTratamiento';
modalEliminar.classList.add('modal-overlay');
modalEliminar.innerHTML = `
  <div class="modal-container">
    <div class="modal-header-custom">
      <h2 class="modal-title-custom">
        <i class="fas fa-trash-alt"></i> Eliminar Tratamiento
      </h2>
      <button onclick="cerrarModalEliminar()" class="btn-close-custom">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <div class="modal-body-custom">
      <div class="modal-icon-warning" style="background-color: #f8d7da;">
        <i class="fas fa-exclamation-triangle" style="color: #721c24;"></i>
      </div>
      <p class="modal-message">¿Estás seguro de eliminar este tratamiento?</p>
      <p class="modal-submessage" id="mensajeEliminarTratamiento">Esta acción no se puede deshacer.</p>
    </div>
    <div class="modal-footer-custom">
      <button onclick="cerrarModalEliminar()" class="btn-modal-cancelar">
        <i class="fas fa-times"></i> Cancelar
      </button>
      <button onclick="confirmarEliminarTratamiento()" class="btn-modal-confirmar">
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
  inputNombreTratamiento.value = '';
  inputFechaInicio.value = '';
  inputFechaFin.value = '';
  inputEnfermedad.value = '';
  inputMedicamentos.value = '';
  inputDosis.value = '';
  selectVia.value = 'Oral';
  inputFrecuencia.value = '';
  inputDuracion.value = '';
  inputVeterinario.value = '';
  selectEstado.value = 'En curso';
  inputObservaciones.value = '';
  editIndex = null;
}

// Guardar tratamiento (agregar o editar)
btnGuardar.addEventListener('click', () => {
  const numArete = inputNumArete.value.trim();
  const nombreTratamiento = inputNombreTratamiento.value.trim();
  const fechaInicio = inputFechaInicio.value.trim();
  const fechaFin = inputFechaFin.value.trim();
  const enfermedad = inputEnfermedad.value.trim();
  const medicamentos = inputMedicamentos.value.trim();
  const dosis = inputDosis.value.trim();
  const via = selectVia.value;
  const frecuencia = inputFrecuencia.value.trim();
  const duracion = inputDuracion.value.trim();
  const veterinario = inputVeterinario.value.trim();
  const estado = selectEstado.value;
  const observaciones = inputObservaciones.value.trim();

  if (!numArete || !nombreTratamiento || !fechaInicio || !enfermedad) {
    alert('Por favor complete los campos obligatorios: Animal, Nombre del Tratamiento, Fecha de Inicio y Enfermedad.');
    return;
  }

  const tratamientoData = {
    numArete,
    nombreTratamiento,
    fechaInicio,
    fechaFin,
    enfermedad,
    medicamentos,
    dosis,
    via,
    frecuencia,
    duracion,
    veterinario,
    estado,
    observaciones
  };

  if (editIndex !== null) {
    tratamientos[editIndex] = tratamientoData;
  } else {
    tratamientos.push(tratamientoData);
  }

  modal.style.display = 'none';
  renderizarTratamientos();
});

// Funciones del modal de eliminar
function abrirModalEliminar(tratamiento) {
  tratamientoAEliminar = tratamiento;
  document.getElementById('mensajeEliminarTratamiento').textContent = 
    `Se eliminará el tratamiento "${tratamiento.nombreTratamiento}" del animal ${tratamiento.numArete}. Esta acción no se puede deshacer.`;
  document.getElementById('modalEliminarTratamiento').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function cerrarModalEliminar() {
  document.getElementById('modalEliminarTratamiento').classList.remove('active');
  document.body.style.overflow = 'auto';
  tratamientoAEliminar = null;
}

function confirmarEliminarTratamiento() {
  if (tratamientoAEliminar) {
    const globalIndex = tratamientos.indexOf(tratamientoAEliminar);
    tratamientos.splice(globalIndex, 1);
    renderizarTratamientos();
    cerrarModalEliminar();
  }
}

// Renderizar tratamientos en la tabla
function renderizarTratamientos(lista = tratamientos) {
  tablaTratamientos.innerHTML = '';

  if (lista.length === 0) {
    tablaTratamientos.innerHTML = '<p>No hay tratamientos registrados.</p>';
    return;
  }

  const tabla = document.createElement('table');
  tabla.innerHTML = `
    <thead>
      <tr>
        <th>Num. Arete</th>
        <th>Tratamiento</th>
        <th>Enfermedad</th>
        <th>Fecha Inicio</th>
        <th>Estado</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
  const tbody = tabla.querySelector('tbody');

  lista.forEach((tratamiento) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${tratamiento.numArete}</td>
      <td>${tratamiento.nombreTratamiento}</td>
      <td>${tratamiento.enfermedad}</td>
      <td>${tratamiento.fechaInicio}</td>
      <td>${tratamiento.estado}</td>
      <td>
        <button class="btn-ver" title="Ver detalles">👁️</button>
        <button class="btn-editar" title="Editar">✏️</button>
        <button class="btn-eliminar" title="Eliminar">🗑️</button>
      </td>
    `;

    // Visualizar detalle completo
    fila.querySelector('.btn-ver').addEventListener('click', () => {
      contenidoTratamiento.innerHTML = `
        <p><strong>Animal (Num. Arete):</strong> ${tratamiento.numArete}</p>
        <p><strong>Nombre del Tratamiento:</strong> ${tratamiento.nombreTratamiento}</p>
        <p><strong>Fecha de Inicio:</strong> ${tratamiento.fechaInicio}</p>
        <p><strong>Fecha de Fin:</strong> ${tratamiento.fechaFin || 'N/A'}</p>
        <p><strong>Enfermedad/Condición:</strong> ${tratamiento.enfermedad}</p>
        <p><strong>Medicamentos:</strong> ${tratamiento.medicamentos || 'N/A'}</p>
        <p><strong>Dosis:</strong> ${tratamiento.dosis || 'N/A'}</p>
        <p><strong>Vía de Administración:</strong> ${tratamiento.via}</p>
        <p><strong>Frecuencia:</strong> ${tratamiento.frecuencia || 'N/A'}</p>
        <p><strong>Duración:</strong> ${tratamiento.duracion || 'N/A'}</p>
        <p><strong>Veterinario:</strong> ${tratamiento.veterinario || 'N/A'}</p>
        <p><strong>Estado:</strong> ${tratamiento.estado}</p>
        <p><strong>Observaciones:</strong> ${tratamiento.observaciones || 'N/A'}</p>
      `;
      modalVisualizar.style.display = 'flex';
    });

    // Editar
    fila.querySelector('.btn-editar').addEventListener('click', () => {
      inputNumArete.value = tratamiento.numArete;
      inputNombreTratamiento.value = tratamiento.nombreTratamiento;
      inputFechaInicio.value = tratamiento.fechaInicio;
      inputFechaFin.value = tratamiento.fechaFin;
      inputEnfermedad.value = tratamiento.enfermedad;
      inputMedicamentos.value = tratamiento.medicamentos;
      inputDosis.value = tratamiento.dosis;
      selectVia.value = tratamiento.via;
      inputFrecuencia.value = tratamiento.frecuencia;
      inputDuracion.value = tratamiento.duracion;
      inputVeterinario.value = tratamiento.veterinario;
      selectEstado.value = tratamiento.estado;
      inputObservaciones.value = tratamiento.observaciones;
      editIndex = tratamientos.indexOf(tratamiento);
      modal.style.display = 'flex';
    });

    // Eliminar con modal
    fila.querySelector('.btn-eliminar').addEventListener('click', () => {
      abrirModalEliminar(tratamiento);
    });

    tbody.appendChild(fila);
  });

  tablaTratamientos.appendChild(tabla);
}

// Buscar tratamientos
buscador.addEventListener('input', () => {
  const texto = buscador.value.toLowerCase();
  const resultados = tratamientos.filter(t =>
    t.numArete.toLowerCase().includes(texto) ||
    t.nombreTratamiento.toLowerCase().includes(texto) ||
    t.enfermedad.toLowerCase().includes(texto)
  );
  renderizarTratamientos(resultados);
});

// Cerrar modal con ESC o click fuera
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modalElim = document.getElementById('modalEliminarTratamiento');
    if (modalElim && modalElim.classList.contains('active')) {
      cerrarModalEliminar();
    }
  }
});

window.addEventListener('click', (e) => {
  const modalElim = document.getElementById('modalEliminarTratamiento');
  if (e.target === modalElim) {
    cerrarModalEliminar();
  }
});

// Inicializar tabla
renderizarTratamientos();