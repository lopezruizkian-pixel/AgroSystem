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
let animalAEliminar = null;

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
// MODAL ADICIONAL SEGÚN REBAÑO
// ===================================
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

// ===================================
// MODAL DE ELIMINAR
// ===================================
const modalEliminar = document.createElement('div');
modalEliminar.id = 'modalEliminarAnimal';
modalEliminar.classList.add('modal-overlay');
modalEliminar.innerHTML = `
  <div class="modal-container">
    <div class="modal-header-custom">
      <h2 class="modal-title-custom">
        <i class="fas fa-trash-alt"></i> Eliminar Animal
      </h2>
      <button onclick="cerrarModalEliminar()" class="btn-close-custom">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <div class="modal-body-custom">
      <div class="modal-icon-warning" style="background-color: #f8d7da;">
        <i class="fas fa-exclamation-triangle" style="color: #721c24;"></i>
      </div>
      <p class="modal-message">¿Estás seguro de eliminar este animal?</p>
      <p class="modal-submessage" id="mensajeEliminarAnimal">Esta acción no se puede deshacer.</p>
    </div>
    <div class="modal-footer-custom">
      <button onclick="cerrarModalEliminar()" class="btn-modal-cancelar">
        <i class="fas fa-times"></i> Cancelar
      </button>
      <button onclick="confirmarEliminarAnimal()" class="btn-modal-confirmar">
        <i class="fas fa-trash-alt"></i> Eliminar
      </button>
    </div>
  </div>
`;
document.body.appendChild(modalEliminar);

// ===================================
// FUNCIONES DE MODALES
// ===================================

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

// ===================================
// GUARDAR ANIMAL (PRIMER MODAL)
// ===================================
btnGuardar.addEventListener('click', () => {
  const nombre = inputNombre.value.trim();
  const numArete = inputNumArete.value.trim();
  const rebano = selectRebano.value;
  const procedencia = selectProcedencia.value;
  const sexo = selectSexo.value;

  if (!nombre || !numArete || !sexo) {
    mostrarAlerta('Por favor complete todos los campos obligatorios: Nombre, Número de Arete y Sexo.', 'error');
    return;
  }

  animalTemp = { nombre, numArete, rebano, procedencia, sexo };

  // Abrir modal secundario según el rebaño
  abrirModalSecundario(rebano);
  modal.style.display = 'none';
});

// ===================================
// MODAL SECUNDARIO SEGÚN REBAÑO
// ===================================
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

// ===================================
// GUARDAR MODAL SECUNDARIO
// ===================================
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
    mostrarAlerta(`El animal "${animalTemp.nombre}" ha sido actualizado exitosamente.`, 'success');
  } else {
    animales.push(animalTemp);
    mostrarAlerta(`El animal "${animalTemp.nombre}" ha sido registrado exitosamente.`, 'success');
  }

  modalSecundario.style.display = 'none';
  renderizarAnimales();
});

// ===================================
// FUNCIONES DEL MODAL DE ELIMINAR
// ===================================
function abrirModalEliminar(animal) {
  animalAEliminar = animal;
  document.getElementById('mensajeEliminarAnimal').textContent = 
    `Se eliminará el animal "${animal.nombre}" (Arete: ${animal.numArete}).`;
  document.getElementById('modalEliminarAnimal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function cerrarModalEliminar() {
  document.getElementById('modalEliminarAnimal').classList.remove('active');
  document.body.style.overflow = 'auto';
  animalAEliminar = null;
}

function confirmarEliminarAnimal() {
  if (animalAEliminar) {
    const nombreAnimal = animalAEliminar.nombre;
    const numArete = animalAEliminar.numArete;
    const idx = animales.indexOf(animalAEliminar);
    animales.splice(idx, 1);
    renderizarAnimales();
    cerrarModalEliminar();
    
    // Mostrar alerta de éxito
    mostrarAlerta(`El animal "${nombreAnimal}" (Arete: ${numArete}) ha sido eliminado exitosamente.`, 'success');
  }
}

// ===================================
// RENDERIZAR ANIMALES
// ===================================
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
        <button class="btn-ver" title="Ver detalles">👁️</button>
        <button class="btn-editar" title="Editar">✏️</button>
        <button class="btn-eliminar" title="Eliminar">🗑️</button>
      </td>
    `;

    // VISUALIZAR
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

    // EDITAR
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

    // ELIMINAR
    fila.querySelector('.btn-eliminar').addEventListener('click', () => {
      abrirModalEliminar(animal);
    });

    tbody.appendChild(fila);
  });

  tablaAnimales.appendChild(tabla);
}

// ===================================
// BUSCAR ANIMALES
// ===================================
buscador.addEventListener('input', () => {
  const texto = buscador.value.toLowerCase();
  const resultados = animales.filter(a =>
    a.nombre.toLowerCase().includes(texto) ||
    a.numArete.toLowerCase().includes(texto)
  );
  renderizarAnimales(resultados);
});

// Cerrar modal de eliminar con ESC o click fuera
window.addEventListener('click', (e) => {
  const modalElim = document.getElementById('modalEliminarAnimal');
  if (e.target === modalElim) {
    cerrarModalEliminar();
  }
});

// Inicializar tabla
renderizarAnimales();