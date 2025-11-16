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
    alert('Por favor complete al menos nombre y presentación.');
    return;
  }

  const medData = { nombre, presentacion, dosis, caducidad, via, composicion, indicaciones };

  if(editIndex !== null){
    medicamentos[editIndex] = medData;
  } else {
    medicamentos.push(medData);
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

    // Eliminar - SIN MODIFICAR LA LÓGICA ORIGINAL
    fila.querySelector('.btn-eliminar').addEventListener('click', () => {
      if(confirm('¿Desea eliminar este medicamento?')) {
        medicamentos.splice(medicamentos.indexOf(med), 1);
        renderizarMedicamentos();
      }
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

// Inicializar
renderizarMedicamentos();