// Verificar usuario
const usuarioGuardado = localStorage.getItem('usuarioAgroSystem');
if (!usuarioGuardado) {
    window.location.href = '../../index.html';
}

// Elementos del DOM
const listaVacas = document.getElementById('listaVacas');
const btnAgregar = document.getElementById('btnAgregarVaca');
const btnIrEstadisticas = document.getElementById('btnIrEstadisticas');
const inputNombre = document.getElementById('nombreVaca');
const selectSexo = document.getElementById('sexoVaca');

// Arreglo de vacas (nombre + sexo)
let vacas = JSON.parse(localStorage.getItem('vacas')) || [];

// ===================================
// SISTEMA DE ALERTAS PERSONALIZADAS
// ===================================

// Crear modal de alerta al cargar
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
// FIN SISTEMA DE ALERTAS
// ===================================

// Mostrar nombre del usuario en el header
document.addEventListener('DOMContentLoaded', function() {
  const datosUsuario = JSON.parse(localStorage.getItem('datosUsuarioAgroSystem'));
  if (datosUsuario) {
    const bienvenidaElement = document.getElementById('bienvenidaUsuario');
    if (bienvenidaElement) {
      bienvenidaElement.textContent = `Bienvenido, ${datosUsuario.nombreCompleto}`;
    }
  }
});

// Función para renderizar lista de vacas
function renderizarLista() {
  listaVacas.innerHTML = '';
  vacas.forEach((vaca, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span><i class="fas fa-cow"></i> ${vaca.nombre} - ${vaca.sexo}</span>
    `;
    listaVacas.appendChild(li);
  });
}

// Agregar nueva vaca
btnAgregar.addEventListener('click', () => {
  const nombre = inputNombre.value.trim();
  const sexo = selectSexo.value;
  
  // VALIDACIÓN CON ALERTA PERSONALIZADA
  if (!nombre) {
    mostrarAlerta('Por favor ingrese un nombre válido para el animal.', 'error');
    return;
  }

  vacas.push({ nombre, sexo });
  localStorage.setItem('vacas', JSON.stringify(vacas));
  inputNombre.value = '';
  renderizarLista();
  
  // Mostrar alerta de éxito
  mostrarAlerta(`El animal "${nombre}" ha sido agregado exitosamente.`, 'success');
});

// Botón para ir a estadísticas
btnIrEstadisticas.addEventListener('click', () => {
  localStorage.setItem('vacas', JSON.stringify(vacas));
  window.location.href = './estadisticas.html';
});

// Función para ir al perfil
function irPerfil() {
  window.location.href = './perfil.html';
}

// Funciones del modal de cerrar sesión
function abrirModalCerrarSesion() {
  const modal = document.getElementById('modalCerrarSesion');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function cerrarModalCerrarSesion() {
  const modal = document.getElementById('modalCerrarSesion');
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

function confirmarCerrarSesion() {
  localStorage.removeItem('usuarioAgroSystem');
  localStorage.removeItem('datosUsuarioAgroSystem');
  window.location.href = '../../index.html';
}

// Cerrar modal al hacer clic fuera o con ESC
window.addEventListener('click', (event) => {
  const modal = document.getElementById('modalCerrarSesion');
  if (event.target === modal) cerrarModalCerrarSesion();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    const modal = document.getElementById('modalCerrarSesion');
    if (modal.classList.contains('active')) cerrarModalCerrarSesion();
  }
});

renderizarLista();