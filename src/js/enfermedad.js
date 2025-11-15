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

let editIndex = null;
let enfermedadAEliminar = null;

// Crear modal de confirmación de eliminación
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
      <p class="modal-submessage" id="mensajeEliminarEnfermedad">Esta acción no se puede deshacer.</p>
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

// Abrir modal
btnAgregar.addEventListener('click', () => {
  limpiarModal();
  modal.style.display = 'flex';
});

// Cerrar modal
btnCerrarModal.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', (e) => { if(e.target === modal) modal.style.display = 'none'; });

// Limpiar modal
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

// Guardar enfermedad (agregar o editar)
btnGuardar.addEventListener('click', () => {
  const nombre = inputNombre.value.trim();
  const tipo = inputTipo.value.trim();
  const sintomas = inputSintomas.value.trim();
  const duracion = inputDuracion.value.trim();
  const tratamientos = inputTratamientos.value.trim();
  const riesgo = selectRiesgo.value;
  const transmision = inputTransmision.value.trim();
  const analisis = inputAnalisis.value.trim();

  if(!nombre || !tipo) {
    alert('Por favor complete al menos nombre y tipo.');
    return;
  }

  const enfermedadData = { nombre, tipo, sintomas, duracion, tratamientos, riesgo, transmision, analisis };

  if(editIndex !== null) {
    enfermedades[editIndex] = enfermedadData;
  } else {
    enfermedades.push(enfermedadData);
  }

  modal.style.display = 'none';
  renderizarEnfermedades();
});

// Funciones del modal de eliminar
function abrirModalEliminar(enfermedad) {
  enfermedadAEliminar = enfermedad;
  document.getElementById('mensajeEliminarEnfermedad').textContent = 
    `Se eliminará la enfermedad "${enfermedad.nombre}" (${enfermedad.tipo}). Esta acción no se puede deshacer.`;
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
    const globalIndex = enfermedades.indexOf(enfermedadAEliminar);
    enfermedades.splice(globalIndex, 1);
    renderizarEnfermedades();
    cerrarModalEliminar();
  }
}

// Renderizar enfermedades
function renderizarEnfermedades(lista = enfermedades) {
  tablaEnfermedades.innerHTML = '';

  if(lista.length === 0){
    tablaEnfermedades.innerHTML = '<p>No hay enfermedades registradas.</p>';
    return;
  }

  const tabla = document.createElement('table');
  tabla.innerHTML = `
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Tipo</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
  const tbody = tabla.querySelector('tbody');

  lista.forEach((enfermedad, index) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${enfermedad.nombre}</td>
      <td>${enfermedad.tipo}</td>
      <td>
        <button class="btn-visualizar" title="Ver detalles">👁️</button>
        <button class="btn-editar" title="Editar">✏️</button>
        <button class="btn-eliminar" title="Eliminar">🗑️</button>
      </td>
    `;

    // Visualizar
    fila.querySelector('.btn-visualizar').addEventListener('click', () => {
      alert(
        `Nombre: ${enfermedad.nombre}\n` +
        `Tipo: ${enfermedad.tipo}\n` +
        `Síntomas: ${enfermedad.sintomas}\n` +
        `Duración Estimada: ${enfermedad.duracion}\n` +
        `Tratamientos Recomendados: ${enfermedad.tratamientos}\n` +
        `Nivel de Riesgo: ${enfermedad.riesgo}\n` +
        `Modo de Transmisión: ${enfermedad.transmision}\n` +
        `Análisis: ${enfermedad.analisis}`
      );
    });

    // Editar
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

    // Eliminar con modal
    fila.querySelector('.btn-eliminar').addEventListener('click', () => {
      abrirModalEliminar(enfermedad);
    });

    tbody.appendChild(fila);
  });

  tablaEnfermedades.appendChild(tabla);
}

// Buscar enfermedades
buscador.addEventListener('input', () => {
  const texto = buscador.value.toLowerCase();
  const resultados = enfermedades.filter(e =>
    e.nombre.toLowerCase().includes(texto) ||
    e.tipo.toLowerCase().includes(texto)
  );
  renderizarEnfermedades(resultados);
});

// Cerrar modal con ESC o click fuera
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modalElim = document.getElementById('modalEliminarEnfermedad');
    if (modalElim && modalElim.classList.contains('active')) {
      cerrarModalEliminar();
    }
  }
});

window.addEventListener('click', (e) => {
  const modalElim = document.getElementById('modalEliminarEnfermedad');
  if (e.target === modalElim) {
    cerrarModalEliminar();
  }
});

// Inicializar
renderizarEnfermedades();