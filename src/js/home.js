const usuarioGuardado = localStorage.getItem('usuarioAgroSystem');
if (!usuarioGuardado) {
    window.location.href = '../../index.html';
}

const listaEnfermedades = document.getElementById('listaEnfermedades');
const btnAgregar = document.getElementById('btnAgregarEnfermedad');
const inputNombre = document.getElementById('nombreEnfermedad');
const inputCasos = document.getElementById('numCasos');

let enfermedades = JSON.parse(localStorage.getItem('enfermedades')) || [];

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

function renderizarLista() {
  listaEnfermedades.innerHTML = '';
  enfermedades.forEach((e, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span><i class="fas fa-virus"></i> ${e.nombre} - ${e.casos} casos</span>
      <button class="btn-ver-estadistica" data-index="${index}"><i class="fas fa-arrow-right"></i></button>
    `;
    listaEnfermedades.appendChild(li);
  });

  const botones = document.querySelectorAll('.btn-ver-estadistica');
  botones.forEach(btn => {
    btn.addEventListener('click', () => {
      const index = btn.dataset.index;
      localStorage.setItem('enfermedadSeleccionada', index);
      window.location.href = './estadisticas.html';
    });
  });
}

btnAgregar.addEventListener('click', () => {
  const nombre = inputNombre.value.trim();
  const casos = parseInt(inputCasos.value);

  if (!nombre || !casos || casos <= 0) {
    alert('Ingrese nombre y casos válidos');
    return;
  }

  enfermedades.push({ nombre, casos });
  localStorage.setItem('enfermedades', JSON.stringify(enfermedades));
  inputNombre.value = '';
  inputCasos.value = '';
  renderizarLista();
});

// Función para ir al perfil
function irPerfil() {
  window.location.href = './perfil.html';
}

// Función para cerrar sesión
function cerrarSesion() {
  if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
    localStorage.removeItem('usuarioAgroSystem');
    localStorage.removeItem('datosUsuarioAgroSystem');
    window.location.href = '../../index.html';
  }
}

renderizarLista();