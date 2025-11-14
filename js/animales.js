// Arreglo para almacenar animales
let animales = [];

// Selección de elementos
const modal = document.getElementById('modalAgregarAnimal');
const btnGuardar = document.getElementById('btnGuardarAnimal');
const btnCerrarModal = document.getElementById('btnCerrarModal');
const btnAgregar = document.querySelector('.btn-agregar');
const tablaAnimales = document.querySelector('.tabla-animales');
const inputNombre = document.getElementById('nombre');
const inputNumArete = document.getElementById('numArete');
const selectRebano = document.getElementById('rebano');
const selectProcedencia = document.getElementById('procedencia');

// Agregamos un select para Sexo en el HTML con id="sexo"
const selectSexo = document.getElementById('sexo');

const buscador = document.querySelector('.buscador input');

// Modal y contenido de visualización
let modalVisualizar = document.getElementById('modalVisualizarAnimal');
if (!modalVisualizar) {
  modalVisualizar = document.createElement('div');
  modalVisualizar.id = 'modalVisualizarAnimal';
  modalVisualizar.classList.add('modal');
  modalVisualizar.innerHTML = `
    <div class="modal-contenido" style="width: 400px;">
      <h2>Detalle del Animal</h2>
      <div id="contenidoAnimal"></div>
      <div class="botones">
        <button id="btnCerrarVisualizar">Cerrar</button>
      </div>
    </div>
  `;
  document.body.appendChild(modalVisualizar);
}

const contenidoAnimal = document.getElementById('contenidoAnimal');
const btnCerrarVisualizar = document.getElementById('btnCerrarVisualizar');

let editIndex = null;

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

// Limpiar modal de agregar/editar
function limpiarModal() {
  inputNombre.value = '';
  inputNumArete.value = '';
  selectRebano.value = 'Vaca';
  selectProcedencia.value = 'Interno';
  selectSexo.value = 'H';
  editIndex = null;
}

// Guardar animal (agregar o editar)
btnGuardar.addEventListener('click', () => {
  const nombre = inputNombre.value.trim();
  const numArete = inputNumArete.value.trim();
  const rebano = selectRebano.value;
  const procedencia = selectProcedencia.value;
  const sexo = selectSexo.value;

  if (!nombre || !numArete || !sexo) {
    alert('Por favor complete todos los campos.');
    return;
  }

  const animalData = { nombre, numArete, rebano, procedencia, sexo };

  if (editIndex !== null) {
    animales[editIndex] = animalData;
  } else {
    animales.push(animalData);
  }

  modal.style.display = 'none';
  renderizarAnimales();
});

// Renderizar animales en la tabla principal
function renderizarAnimales(lista = animales) {
  tablaAnimales.innerHTML = '';

  if (lista.length === 0) {
    tablaAnimales.innerHTML = '<p>No hay animales registrados.</p>';
    return;
  }

  const tabla = document.createElement('table');
  tabla.innerHTML = `
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Número de Arete</th>
        <th>Sexo</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
  const tbody = tabla.querySelector('tbody');

  lista.forEach((animal) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${animal.nombre}</td>
      <td>${animal.numArete}</td>
      <td>${animal.sexo}</td>
      <td>
        <button class="btn-ver">👁️</button>
        <button class="btn-editar">✏️</button>
        <button class="btn-eliminar">🗑️</button>
      </td>
    `;

    // Visualizar detalle completo
    fila.querySelector('.btn-ver').addEventListener('click', () => {
      contenidoAnimal.innerHTML = `
        <p><strong>Nombre:</strong> ${animal.nombre}</p>
        <p><strong>Número de Arete:</strong> ${animal.numArete}</p>
        <p><strong>Sexo:</strong> ${animal.sexo}</p>
        <p><strong>Rebaño:</strong> ${animal.rebano}</p>
        <p><strong>Procedencia:</strong> ${animal.procedencia}</p>
      `;
      modalVisualizar.style.display = 'flex';
    });

    // Editar
    fila.querySelector('.btn-editar').addEventListener('click', () => {
      inputNombre.value = animal.nombre;
      inputNumArete.value = animal.numArete;
      selectRebano.value = animal.rebano;
      selectProcedencia.value = animal.procedencia;
      selectSexo.value = animal.sexo;
      editIndex = animales.indexOf(animal);
      modal.style.display = 'flex';
    });

    // Eliminar
    fila.querySelector('.btn-eliminar').addEventListener('click', () => {
      if (confirm('¿Desea eliminar este animal?')) {
        const globalIndex = animales.indexOf(animal);
        animales.splice(globalIndex, 1);
        renderizarAnimales();
      }
    });

    tbody.appendChild(fila);
  });

  tablaAnimales.appendChild(tabla);
}

// Buscar animales
buscador.addEventListener('input', () => {
  const texto = buscador.value.toLowerCase();
  const resultados = animales.filter(a =>
    a.nombre.toLowerCase().includes(texto) ||
    a.numArete.toLowerCase().includes(texto)
  );
  renderizarAnimales(resultados);
});

// Inicializar tabla
renderizarAnimales();
