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

// Modal de visualización
const modalVisualizar = document.getElementById('modalVisualizarEnfermedad');
const contenidoEnfermedad = document.getElementById('contenidoEnfermedad');
const btnCerrarVisualizar = document.getElementById('btnCerrarVisualizar');

let editIndex = null;

// Abrir modal
btnAgregar.addEventListener('click', () => {
  limpiarModal();
  modal.style.display = 'flex';
});

// Cerrar modal agregar/editar
btnCerrarModal.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', (e) => { if(e.target === modal) modal.style.display = 'none'; });

// Cerrar modal visualizar
btnCerrarVisualizar.addEventListener('click', () => modalVisualizar.style.display = 'none');
window.addEventListener('click', (e) => { if(e.target === modalVisualizar) modalVisualizar.style.display = 'none'; });

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

// Función para obtener clase de badge según el riesgo
function getBadgeClass(riesgo) {
  const clases = {
    'Leve': 'badge-leve',
    'Moderado': 'badge-moderado',
    'Grave': 'badge-grave',
    'Crítico': 'badge-critico'
  };
  return clases[riesgo] || 'badge-leve';
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
        <button class="btn-visualizar">👁️</button>
        <button class="btn-editar">✏️</button>
        <button class="btn-eliminar">🗑️</button>
      </td>
    `;

    // Visualizar - con modal mejorado
    fila.querySelector('.btn-visualizar').addEventListener('click', () => {
      contenidoEnfermedad.innerHTML = `
        <div class="detalle-item">
          <strong>Nombre</strong>
          <p>${enfermedad.nombre}</p>
        </div>
        <div class="detalle-item">
          <strong>Tipo</strong>
          <p>${enfermedad.tipo}</p>
        </div>
        <div class="detalle-item">
          <strong>Síntomas</strong>
          <p>${enfermedad.sintomas || 'No especificados'}</p>
        </div>
        <div class="detalle-item">
          <strong>Duración Estimada</strong>
          <p>${enfermedad.duracion || 'No especificada'}</p>
        </div>
        <div class="detalle-item">
          <strong>Tratamientos Recomendados</strong>
          <p>${enfermedad.tratamientos || 'No especificados'}</p>
        </div>
        <div class="detalle-item">
          <strong>Nivel de Riesgo</strong>
          <p><span class="badge-riesgo ${getBadgeClass(enfermedad.riesgo)}">${enfermedad.riesgo}</span></p>
        </div>
        <div class="detalle-item">
          <strong>Modo de Transmisión</strong>
          <p>${enfermedad.transmision || 'No especificado'}</p>
        </div>
        <div class="detalle-item">
          <strong>Análisis</strong>
          <p>${enfermedad.analisis || 'No especificado'}</p>
        </div>
      `;
      modalVisualizar.style.display = 'flex';
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

    // Eliminar - SIN MODIFICAR LA LÓGICA ORIGINAL
    fila.querySelector('.btn-eliminar').addEventListener('click', () => {
      if(confirm('¿Desea eliminar esta enfermedad?')){
        const globalIndex = enfermedades.indexOf(enfermedad);
        enfermedades.splice(globalIndex, 1);
        renderizarEnfermedades();
      }
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

// Inicializar
renderizarEnfermedades();