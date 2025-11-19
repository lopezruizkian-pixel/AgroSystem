// Obtener vacas del localStorage
const vacas = JSON.parse(localStorage.getItem('vacas')) || [];

// Elementos del DOM
const titulo = document.getElementById('tituloEstadistica');
const contenido = document.getElementById('contenidoEstadisticas');
const canvas = document.getElementById('graficoVacas');

if (vacas.length === 0) {
  titulo.textContent = 'No hay vacas registradas';
  contenido.innerHTML = '';
} else {
  // Contar machos y hembras
  const totalVacas = vacas.length;
  const machos = vacas.filter(v => v.sexo === 'Macho').length;
  const hembras = vacas.filter(v => v.sexo === 'Hembra').length;

  // Mostrar datos en texto
  titulo.textContent = 'Estadísticas generales de vacas';
  contenido.innerHTML = `
    <p>Total de vacas: ${totalVacas}</p>
    <p><i class="fas fa-mars"></i> Macho: ${machos}</p>
    <p><i class="fas fa-venus"></i> Hembra: ${hembras}</p>
  `;

  // Crear gráfico circular
  const ctx = canvas.getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Macho', 'Hembra'],
      datasets: [{
        label: 'Cantidad',
        data: [machos, hembras],
        backgroundColor: ['#36A2EB', '#FF6384'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        title: { display: true, text: 'Distribución por sexo de vacas' }
      }
    }
  });
}
