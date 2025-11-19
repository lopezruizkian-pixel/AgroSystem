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

  if (!nombre) {
    alert('Ingrese un nombre válido');
    return;
  }

  vacas.push({ nombre, sexo });
  localStorage.setItem('vacas', JSON.stringify(vacas));
  inputNombre.value = '';
  renderizarLista();
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
