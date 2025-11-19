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

let tarjetas = [];

const btnAgregar = document.querySelector('.btn-agregar');
const tablaContenedor = document.querySelector('.tabla-tarjetas');

const modal = document.getElementById('modalAgregar');
const btnGuardar = document.getElementById('btnGuardar');
const btnCerrarModal = document.getElementById('btnCerrarModal');

const inputNombre = document.getElementById('nombre');
const inputNumArete = document.getElementById('numArete');
const selectSexo = document.getElementById('sexo');
const inputPeso = document.getElementById('peso');
const inputFechaNac = document.getElementById('fechaNac');
const inputRebano = document.getElementById('rebano');
const inputCaract = document.getElementById('caract');

const inputHFecha = document.getElementById('hFecha');
const inputHEvento = document.getElementById('hEvento');
const inputHDiag = document.getElementById('hDiag');
const inputHDesc = document.getElementById('hDesc');
const inputHTrat = document.getElementById('hTrat');
const inputHVet = document.getElementById('hVet');
const inputHEstado = document.getElementById('hEstado');

const modalVisualizar = document.getElementById('modalVisualizar');
const contenidoVisualizar = document.getElementById('contenidoVisualizar');
const btnCerrarVisualizar = document.getElementById('btnCerrarVisualizar');

const buscador = document.querySelector('.buscador input');

let editIndex = null;
let tarjetaAEliminar = null;

// Crear modal de confirmación de eliminación
const modalEliminar = document.createElement('div');
modalEliminar.id = 'modalEliminarTarjeta';
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
      <p class="modal-submessage" id="mensajeEliminarTarjeta">Esta acción no se puede deshacer.</p>
    </div>
    <div class="modal-footer-custom">
      <button onclick="cerrarModalEliminar()" class="btn-modal-cancelar">
        <i class="fas fa-times"></i> Cancelar
      </button>
      <button onclick="confirmarEliminarTarjeta()" class="btn-modal-confirmar">
        <i class="fas fa-trash-alt"></i> Eliminar
      </button>
    </div>
  </div>
`;
document.body.appendChild(modalEliminar);

// Abrir modal Agregar
btnAgregar.addEventListener('click', () => {
  limpiarModal();
  document.getElementById('tituloModal').textContent='Agregar Animal';
  editIndex=null;
  modal.style.display='flex';
});

// Cerrar modal Agregar/Editar
btnCerrarModal.addEventListener('click',()=>modal.style.display='none');
window.addEventListener('click', e=>{if(e.target===modal) modal.style.display='none';});

// Cerrar modal Visualizar
btnCerrarVisualizar.addEventListener('click',()=>modalVisualizar.style.display='none');
window.addEventListener('click', e=>{if(e.target===modalVisualizar) modalVisualizar.style.display='none';});

// Limpiar modal
function limpiarModal(){
  inputNombre.value='';
  inputNumArete.value='';
  selectSexo.value='H';
  inputPeso.value='';
  inputFechaNac.value='';
  inputRebano.value='';
  inputCaract.value='';
  inputHFecha.value='';
  inputHEvento.value='';
  inputHDiag.value='';
  inputHDesc.value='';
  inputHTrat.value='';
  inputHVet.value='';
  inputHEstado.value='';
}

// Guardar / Editar - MODIFICADO PARA USAR ALERTA PERSONALIZADA
btnGuardar.addEventListener('click', ()=>{
  const animal = {
    nombre: inputNombre.value.trim(),
    numArete: inputNumArete.value.trim(),
    sexo: selectSexo.value,
    peso: inputPeso.value.trim(),
    fechaNac: inputFechaNac.value.trim(),
    rebano: inputRebano.value.trim(),
    caract: inputCaract.value.trim(),
    historial:{
      fecha: inputHFecha.value.trim(),
      evento: inputHEvento.value.trim(),
      diag: inputHDiag.value.trim(),
      desc: inputHDesc.value.trim(),
      trat: inputHTrat.value.trim(),
      vet: inputHVet.value.trim(),
      estado: inputHEstado.value.trim()
    }
  };
  
  // REEMPLAZAR alert() CON mostrarAlerta()
  if(!animal.nombre || !animal.numArete){ 
    mostrarAlerta('El nombre y el número de arete son obligatorios', 'warning');
    return; 
  }

  if(editIndex!==null){
    tarjetas[editIndex]=animal;
    mostrarAlerta('Animal actualizado correctamente', 'success');
  }else{
    tarjetas.push(animal);
    mostrarAlerta('Animal agregado correctamente', 'success');
  }

  modal.style.display='none';
  renderizarTabla();
});

// Funciones del modal de eliminar
function abrirModalEliminar(tarjeta) {
  tarjetaAEliminar = tarjeta;
  document.getElementById('mensajeEliminarTarjeta').textContent = 
    `Se eliminará el animal "${tarjeta.nombre}" (Arete: ${tarjeta.numArete}). Esta acción no se puede deshacer.`;
  document.getElementById('modalEliminarTarjeta').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function cerrarModalEliminar() {
  document.getElementById('modalEliminarTarjeta').classList.remove('active');
  document.body.style.overflow = 'auto';
  tarjetaAEliminar = null;
}

function confirmarEliminarTarjeta() {
  if (tarjetaAEliminar) {
    const idx = tarjetas.indexOf(tarjetaAEliminar);
    tarjetas.splice(idx, 1);
    renderizarTabla();
    cerrarModalEliminar();
    mostrarAlerta('Animal eliminado correctamente', 'success');
  }
}

// Renderizar tabla
function renderizarTabla(lista=tarjetas){
  tablaContenedor.innerHTML='';
  if(lista.length===0){
    tablaContenedor.innerHTML='<p>No hay animales registrados.</p>';
    return;
  }

  const tabla = document.createElement('table');
  tabla.innerHTML=`
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Número de Arete</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
  const tbody = tabla.querySelector('tbody');

  lista.forEach((t,i)=>{
    const fila=document.createElement('tr');
    fila.innerHTML=`
      <td>${t.nombre}</td>
      <td>${t.numArete}</td>
      <td>
        <button class="btn-ver" title="Ver detalles">👁️</button>
        <button class="btn-editar" title="Editar">✏️</button>
        <button class="btn-eliminar" title="Eliminar">🗑️</button>
      </td>
    `;

    // Ver
    fila.querySelector('.btn-ver').addEventListener('click',()=>{
      contenidoVisualizar.innerHTML=`
        <p><strong>Nombre:</strong> ${t.nombre}</p>
        <p><strong>Arete:</strong> ${t.numArete}</p>
        <p><strong>Sexo:</strong> ${t.sexo}</p>
        <p><strong>Peso:</strong> ${t.peso}</p>
        <p><strong>Fecha nacimiento:</strong> ${t.fechaNac}</p>
        <p><strong>Rebaño:</strong> ${t.rebano}</p>
        <p><strong>Características:</strong> ${t.caract}</p>
        <h4>Historial Médico</h4>
        <p><strong>Fecha:</strong> ${t.historial.fecha}</p>
        <p><strong>Evento:</strong> ${t.historial.evento}</p>
        <p><strong>Diagnóstico:</strong> ${t.historial.diag}</p>
        <p><strong>Descripción:</strong> ${t.historial.desc}</p>
        <p><strong>Tratamiento:</strong> ${t.historial.trat}</p>
        <p><strong>Veterinario:</strong> ${t.historial.vet}</p>
        <p><strong>Estado:</strong> ${t.historial.estado}</p>
      `;
      modalVisualizar.style.display='flex';
    });

    // Editar
    fila.querySelector('.btn-editar').addEventListener('click',()=>{
      inputNombre.value=t.nombre;
      inputNumArete.value=t.numArete;
      selectSexo.value=t.sexo;
      inputPeso.value=t.peso;
      inputFechaNac.value=t.fechaNac;
      inputRebano.value=t.rebano;
      inputCaract.value=t.caract;
      inputHFecha.value=t.historial.fecha;
      inputHEvento.value=t.historial.evento;
      inputHDiag.value=t.historial.diag;
      inputHDesc.value=t.historial.desc;
      inputHTrat.value=t.historial.trat;
      inputHVet.value=t.historial.vet;
      inputHEstado.value=t.historial.estado;
      editIndex=i;
      document.getElementById('tituloModal').textContent='Editar Animal';
      modal.style.display='flex';
    });

    // Eliminar con modal
    fila.querySelector('.btn-eliminar').addEventListener('click',()=>{
      abrirModalEliminar(t);
    });

    tbody.appendChild(fila);
  });

  tablaContenedor.appendChild(tabla);
}

// Buscador
buscador.addEventListener('input',()=>{
  const texto=buscador.value.toLowerCase();
  const filtrados=tarjetas.filter(t=>
    t.nombre.toLowerCase().includes(texto)||
    t.numArete.toLowerCase().includes(texto)
  );
  renderizarTabla(filtrados);
});

// Cerrar modal con ESC o click fuera
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modalElim = document.getElementById('modalEliminarTarjeta');
    if (modalElim && modalElim.classList.contains('active')) {
      cerrarModalEliminar();
    }
  }
});

window.addEventListener('click', (e) => {
  const modalElim = document.getElementById('modalEliminarTarjeta');
  if (e.target === modalElim) {
    cerrarModalEliminar();
  }
});

// Inicializar tabla
renderizarTabla();