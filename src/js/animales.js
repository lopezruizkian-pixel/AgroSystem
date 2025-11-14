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
const selectSexo = document.getElementById('sexo');
const buscador = document.querySelector('.buscador input');

// Modal y contenido de visualización
let modalVisualizar = document.getElementById('modalVisualizarAnimal');
if (!modalVisualizar) {
  modalVisualizar = document.createElement('div');
  modalVisualizar.id = 'modalVisualizarAnimal';
  modalVisualizar.classList.add('modal');
  modalVisualizar.innerHTML = `
    <div class="modal-contenido" style="width: 450px;">
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

// Modal adicional según Rebaño
let modalSecundario = document.createElement('div');
modalSecundario.classList.add('modal');
modalSecundario.id = 'modalSecundario';
modalSecundario.innerHTML = `
  <div class="modal-contenido">
    <h2>Datos adicionales</h2>
    <div id="camposSecundarios"></div>
    <div class="botones">
      <button id="btnGuardarSecundario">Guardar</button>
      <button id="btnCerrarSecundario">Cancelar</button>
    </div>
  </div>
`;
document.body.appendChild(modalSecundario);

const camposSecundarios = document.getElementById('camposSecundarios');
const btnGuardarSecundario = document.getElementById('btnGuardarSecundario');
const btnCerrarSecundario = document.getElementById('btnCerrarSecundario');

let animalTemp = {}; // Guardar temporalmente los datos del primer modal

// Abrir modal principal
btnAgregar.addEventListener('click', () => {
  limpiarModal();
  modal.style.display = 'flex';
});

// Cerrar modal principal
btnCerrarModal.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', (e) => {
  if (e.target === modal) modal.style.display = 'none';
});

// Cerrar modal de visualizar
btnCerrarVisualizar.addEventListener('click', () => modalVisualizar.style.display = 'none');
window.addEventListener('click', (e) => {
  if (e.target === modalVisualizar) modalVisualizar.style.display = 'none';
});

// Cerrar modal secundario
btnCerrarSecundario.addEventListener('click', () => modalSecundario.style.display = 'none');
window.addEventListener('click', (e) => {
  if (e.target === modalSecundario) modalSecundario.style.display = 'none';
});

// Limpiar modal principal
function limpiarModal() {
  inputNombre.value = '';
  inputNumArete.value = '';
  selectRebano.value = 'Vaca';
  selectProcedencia.value = 'Interno';
  selectSexo.value = 'H';
  editIndex = null;
}

// Guardar animal (primer modal)
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

  animalTemp = { nombre, numArete, rebano, procedencia, sexo };

  // Abrir modal secundario según el rebaño
  abrirModalSecundario(rebano);
  modal.style.display = 'none';
});

// Función para abrir modal secundario según Rebaño
function abrirModalSecundario(rebano) {
  camposSecundarios.innerHTML = '';

  camposSecundarios.innerHTML += `
    <label>Fecha de nacimiento:</label><input type="date" id="fechaNacimiento">
    <label>Edad:</label><input type="number" id="edad">
    <label>Peso:</label><input type="text" id="peso">
    <label>Características:</label><input type="text" id="caracteristicas">
    <h3>Padre</h3>
    <label>Nombre:</label><input type="text" id="padreNombre">
    <label>Número de Arete:</label><input type="text" id="padreArete">
    <h3>Madre</h3>
    <label>Nombre:</label><input type="text" id="madreNombre">
    <label>Número de Arete:</label><input type="text" id="madreArete">
  `;

  if(rebano === 'Becerro' || rebano === 'Becerra') {
    camposSecundarios.innerHTML += `
      <label>Inicio de lactancia:</label><input type="date" id="inicioLactancia">
      <label>Fin de lactancia:</label><input type="date" id="finLactancia">
    `;
  } else if(rebano === 'Vaca') {
    camposSecundarios.innerHTML += `
      <label>Fecha de parto:</label><input type="date" id="fechaParto">
      <label>Cantidad de crías:</label><input type="number" id="cantidadCrias">
    `;
  }

  modalSecundario.style.display = 'flex';
}

// Guardar modal secundario
btnGuardarSecundario.addEventListener('click', () => {
  // Obtener valores
  const fechaNacimiento = document.getElementById('fechaNacimiento').value;
  const edad = document.getElementById('edad').value;
  const peso = document.getElementById('peso').value;
  const caracteristicas = document.getElementById('caracteristicas').value;
  const padreNombre = document.getElementById('padreNombre').value;
  const padreArete = document.getElementById('padreArete').value;
  const madreNombre = document.getElementById('madreNombre').value;
  const madreArete = document.getElementById('madreArete').value;

  animalTemp.fechaNacimiento = fechaNacimiento;
  animalTemp.edad = edad;
  animalTemp.peso = peso;
  animalTemp.caracteristicas = caracteristicas;
  animalTemp.padreNombre = padreNombre;
  animalTemp.padreArete = padreArete;
  animalTemp.madreNombre = madreNombre;
  animalTemp.madreArete = madreArete;

  if(animalTemp.rebano === 'Becerro' || animalTemp.rebano === 'Becerra'){
    animalTemp.inicioLactancia = document.getElementById('inicioLactancia').value;
    animalTemp.finLactancia = document.getElementById('finLactancia').value;
  } else if(animalTemp.rebano === 'Vaca'){
    animalTemp.fechaParto = document.getElementById('fechaParto').value;
    animalTemp.cantidadCrias = document.getElementById('cantidadCrias').value;
  }

  if(editIndex !== null){
    animales[editIndex] = animalTemp;
  } else {
    animales.push(animalTemp);
  }

  modalSecundario.style.display = 'none';
  renderizarAnimales();
});

// Renderizar animales
function renderizarAnimales(lista = animales){
  tablaAnimales.innerHTML = '';

  if(lista.length === 0){
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

  lista.forEach(animal => {
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

    // Visualizar
    fila.querySelector('.btn-ver').addEventListener('click', () => {
      let html = `
        <p><strong>Nombre:</strong> ${animal.nombre}</p>
        <p><strong>Número de Arete:</strong> ${animal.numArete}</p>
        <p><strong>Sexo:</strong> ${animal.sexo}</p>
        <p><strong>Rebaño:</strong> ${animal.rebano}</p>
        <p><strong>Procedencia:</strong> ${animal.procedencia}</p>
        <p><strong>Fecha Nacimiento:</strong> ${animal.fechaNacimiento}</p>
        <p><strong>Edad:</strong> ${animal.edad}</p>
        <p><strong>Peso:</strong> ${animal.peso}</p>
        <p><strong>Características:</strong> ${animal.caracteristicas}</p>

        <div><strong>Padre:</strong>
          <p>Nombre: ${animal.padreNombre}</p>
          <p>Número de Arete: ${animal.padreArete}</p>
        </div>

        <div><strong>Madre:</strong>
          <p>Nombre: ${animal.madreNombre}</p>
          <p>Número de Arete: ${animal.madreArete}</p>
        </div>
      `;

      if(animal.rebano==='Becerro'||animal.rebano==='Becerra'){
        html += `
          <p><strong>Inicio Lactancia:</strong> ${animal.inicioLactancia}</p>
          <p><strong>Fin Lactancia:</strong> ${animal.finLactancia}</p>
        `;
      } else if(animal.rebano==='Vaca'){
        html += `
          <p><strong>Fecha de parto:</strong> ${animal.fechaParto}</p>
          <p><strong>Cantidad de crías:</strong> ${animal.cantidadCrias}</p>
        `;
      }

      contenidoAnimal.innerHTML = html;
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

      // Abrir modal secundario con datos existentes
      animalTemp = {...animal};
      abrirModalSecundario(animal.rebano);

      // Llenar campos del secundario
      setTimeout(() => {
        document.getElementById('fechaNacimiento').value = animal.fechaNacimiento || '';
        document.getElementById('edad').value = animal.edad || '';
        document.getElementById('peso').value = animal.peso || '';
        document.getElementById('caracteristicas').value = animal.caracteristicas || '';
        document.getElementById('padreNombre').value = animal.padreNombre || '';
        document.getElementById('padreArete').value = animal.padreArete || '';
        document.getElementById('madreNombre').value = animal.madreNombre || '';
        document.getElementById('madreArete').value = animal.madreArete || '';

        if(animal.rebano==='Becerro'||animal.rebano==='Becerra'){
          document.getElementById('inicioLactancia').value = animal.inicioLactancia || '';
          document.getElementById('finLactancia').value = animal.finLactancia || '';
        } else if(animal.rebano==='Vaca'){
          document.getElementById('fechaParto').value = animal.fechaParto || '';
          document.getElementById('cantidadCrias').value = animal.cantidadCrias || '';
        }
      }, 100);

      modalSecundario.style.display = 'flex';
    });

    // Eliminar
    fila.querySelector('.btn-eliminar').addEventListener('click', () => {
      if(confirm('¿Desea eliminar este animal?')){
        const idx = animales.indexOf(animal);
        animales.splice(idx, 1);
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
