// Arreglo para almacenar reportes médicos
let reportesMedicos = [];

// Selección de elementos
const modal = document.getElementById('modalAgregarReporte');
const btnGuardar = document.getElementById('btnGuardarReporte');
const btnCerrarModal = document.getElementById('btnCerrarModal');
const btnAgregar = document.querySelector('.btn-agregar');
const tablaReportes = document.querySelector('.tabla-animales');
const inputNumArete = document.getElementById('numArete');
const inputFecha = document.getElementById('fecha');
const inputVeterinario = document.getElementById('veterinario');
const inputDiagnostico = document.getElementById('diagnostico');
const inputSintomas = document.getElementById('sintomas');
const inputTratamiento = document.getElementById('tratamiento');
const inputMedicamentos = document.getElementById('medicamentos');
const selectEstado = document.getElementById('estado');
const inputObservaciones = document.getElementById('observaciones');
const buscador = document.querySelector('.buscador input');

// Modal de visualización
const modalVisualizar = document.getElementById('modalVisualizarReporte');
const contenidoReporte = document.getElementById('contenidoReporte');
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

// Limpiar modal
function limpiarModal() {
  inputNumArete.value = '';
  inputFecha.value = '';
  inputVeterinario.value = '';
  inputDiagnostico.value = '';
  inputSintomas.value = '';
  inputTratamiento.value = '';
  inputMedicamentos.value = '';
  selectEstado.value = 'Estable';
  inputObservaciones.value = '';
  editIndex = null;
}

// Guardar reporte (agregar o editar)
btnGuardar.addEventListener('click', () => {
  const numArete = inputNumArete.value.trim();
  const fecha = inputFecha.value.trim();
  const veterinario = inputVeterinario.value.trim();
  const diagnostico = inputDiagnostico.value.trim();
  const sintomas = inputSintomas.value.trim();
  const tratamiento = inputTratamiento.value.trim();
  const medicamentos = inputMedicamentos.value.trim();
  const estado = selectEstado.value;
  const observaciones = inputObservaciones.value.trim();

  if (!numArete || !fecha || !veterinario || !diagnostico) {
    alert('Por favor complete los campos obligatorios: Animal, Fecha, Veterinario y Diagnóstico.');
    return;
  }

  const reporteData = {
    numArete,
    fecha,
    veterinario,
    diagnostico,
    sintomas,
    tratamiento,
    medicamentos,
    estado,
    observaciones
  };

  if (editIndex !== null) {
    reportesMedicos[editIndex] = reporteData;
  } else {
    reportesMedicos.push(reporteData);
  }

  modal.style.display = 'none';
  renderizarReportes();
});

// Renderizar reportes en la tabla
function renderizarReportes(lista = reportesMedicos) {
  tablaReportes.innerHTML = '';

  if (lista.length === 0) {
    tablaReportes.innerHTML = '<p>No hay reportes médicos registrados.</p>';
    return;
  }

  const tabla = document.createElement('table');
  tabla.innerHTML = `
    <thead>
      <tr>
        <th>Num. Arete</th>
        <th>Fecha</th>
        <th>Veterinario</th>
        <th>Diagnóstico</th>
        <th>Estado</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
  const tbody = tabla.querySelector('tbody');

  lista.forEach((reporte) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${reporte.numArete}</td>
      <td>${reporte.fecha}</td>
      <td>${reporte.veterinario}</td>
      <td>${reporte.diagnostico}</td>
      <td>${reporte.estado}</td>
      <td>
        <button class="btn-ver">👁️</button>
        <button class="btn-editar">✏️</button>
        <button class="btn-eliminar">🗑️</button>
      </td>
    `;

    // Visualizar detalle completo
    fila.querySelector('.btn-ver').addEventListener('click', () => {
      contenidoReporte.innerHTML = `
        <p><strong>Animal (Num. Arete):</strong> ${reporte.numArete}</p>
        <p><strong>Fecha:</strong> ${reporte.fecha}</p>
        <p><strong>Veterinario:</strong> ${reporte.veterinario}</p>
        <p><strong>Diagnóstico:</strong> ${reporte.diagnostico}</p>
        <p><strong>Síntomas:</strong> ${reporte.sintomas || 'N/A'}</p>
        <p><strong>Tratamiento:</strong> ${reporte.tratamiento || 'N/A'}</p>
        <p><strong>Medicamentos:</strong> ${reporte.medicamentos || 'N/A'}</p>
        <p><strong>Estado:</strong> ${reporte.estado}</p>
        <p><strong>Observaciones:</strong> ${reporte.observaciones || 'N/A'}</p>
      `;
      modalVisualizar.style.display = 'flex';
    });

    // Editar
    fila.querySelector('.btn-editar').addEventListener('click', () => {
      inputNumArete.value = reporte.numArete;
      inputFecha.value = reporte.fecha;
      inputVeterinario.value = reporte.veterinario;
      inputDiagnostico.value = reporte.diagnostico;
      inputSintomas.value = reporte.sintomas;
      inputTratamiento.value = reporte.tratamiento;
      inputMedicamentos.value = reporte.medicamentos;
      selectEstado.value = reporte.estado;
      inputObservaciones.value = reporte.observaciones;
      editIndex = reportesMedicos.indexOf(reporte);
      modal.style.display = 'flex';
    });

    // Eliminar
    fila.querySelector('.btn-eliminar').addEventListener('click', () => {
      if (confirm('¿Desea eliminar este reporte médico?')) {
        const globalIndex = reportesMedicos.indexOf(reporte);
        reportesMedicos.splice(globalIndex, 1);
        renderizarReportes();
      }
    });

    tbody.appendChild(fila);
  });

  tablaReportes.appendChild(tabla);
}

// Buscar reportes
buscador.addEventListener('input', () => {
  const texto = buscador.value.toLowerCase();
  const resultados = reportesMedicos.filter(r =>
    r.numArete.toLowerCase().includes(texto) ||
    r.veterinario.toLowerCase().includes(texto) ||
    r.diagnostico.toLowerCase().includes(texto)
  );
  renderizarReportes(resultados);
});

// Inicializar tabla
renderizarReportes();