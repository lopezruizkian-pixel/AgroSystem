const listaEnfermedades = document.getElementById('listaEnfermedades');
const btnAgregar = document.getElementById('btnAgregarEnfermedad');
const inputNombre = document.getElementById('nombreEnfermedad');
const inputCasos = document.getElementById('numCasos');

// Cargar enfermedades desde localStorage
let enfermedades = JSON.parse(localStorage.getItem('enfermedades')) || [];

// Función para renderizar lista
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

// Agregar enfermedad
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

// Inicializar lista
renderizarLista();
