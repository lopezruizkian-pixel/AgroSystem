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

let editIndex = null;

// Abrir modal
btnAgregar.addEventListener('click', () => {
  limpiarModal();
  modal.style.display = 'flex';
});

// Cerrar modal
btnCerrarModal.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', e => { if(e.target === modal) modal.style.display = 'none'; });

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
        <button class="btn-editar">✏️</button>
        <button class="btn-eliminar">🗑️</button>
        <button class="btn-ver">👁️</button>
      </td>
    `;

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

    // Eliminar
    fila.querySelector('.btn-eliminar').addEventListener('click', () => {
      if(confirm('¿Desea eliminar este medicamento?')) {
        medicamentos.splice(medicamentos.indexOf(med), 1);
        renderizarMedicamentos();
      }
    });

    // Visualizar
    fila.querySelector('.btn-ver').addEventListener('click', () => {
      alert(
        `Nombre: ${med.nombre}\n` +
        `Presentación: ${med.presentacion}\n` +
        `Dosis: ${med.dosis}\n` +
        `Caducidad: ${med.caducidad}\n` +
        `Via: ${med.via}\n` +
        `Composición: ${med.composicion}\n` +
        `Indicaciones: ${med.indicaciones}`
      );
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
