// Cargar todas las enfermedades
const enfermedades = JSON.parse(localStorage.getItem('enfermedades')) || [];
const indexSeleccionado = localStorage.getItem('enfermedadSeleccionada');
const titulo = document.getElementById('tituloEstadistica');
const contenido = document.getElementById('contenidoEstadisticas');

if (enfermedades.length === 0) {
  titulo.textContent = 'No hay enfermedades registradas';
  contenido.innerHTML = '';
} else {
  let enfermedad;
  if (indexSeleccionado !== null) {
    enfermedad = enfermedades[indexSeleccionado];
    titulo.textContent = `Estadísticas de ${enfermedad}`;
    contenido.innerHTML = `<p><i class="fas fa-virus"></i> Casos: ${enfermedad.casos}</p>`;
  } else {
    titulo.textContent = 'Estadísticas generales';
    contenido.innerHTML = '';
  }

  const ctx = document.getElementById('graficoEnfermedad').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: enfermedades.map(e => e.nombre),
      datasets: [{
        label: 'Casos',
        data: enfermedades.map(e => e.casos),
        backgroundColor: ['#4CAF50','#FF9800','#F44336','#2196F3','#9C27B0','#FFC107'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        title: { display: true, text: 'Distribución de enfermedades' }
      }
    }
  });
}
