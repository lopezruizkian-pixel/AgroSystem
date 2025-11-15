// i18n.js
let idiomaActual = "es"; // idioma inicial

const traducciones = {
  es: {
    perfil: "Mi Perfil",
    cerrar: "Cerrar Sesión",
    enfermedades: "Enfermedades más frecuentes",
    agregar: "Agregar",
    nombreEnfermedad: "Nombre enfermedad",
    casos: "Casos",
    animal: "Animal",
    medicamento: "Medicamento",
    tarjeta: "Tarjeta de salud",
    reporte: "Reporte médico",
    tratamiento: "Tratamiento",
    enfermedad: "Enfermedad"
  },
  en: {
    perfil: "My Profile",
    cerrar: "Log Out",
    enfermedades: "Most common diseases",
    agregar: "Add",
    nombreEnfermedad: "Disease name",
    casos: "Cases",
    animal: "Animal",
    medicamento: "Medication",
    tarjeta: "Health card",
    reporte: "Medical report",
    tratamiento: "Treatment",
    enfermedad: "Disease"
  }
};

function traducirPagina() {
  document.querySelector(".btn-perfil").innerHTML = `<i class="fas fa-user"></i> ${traducciones[idiomaActual].perfil}`;
  document.querySelector(".btn-logout").innerHTML = `<i class="fas fa-sign-out-alt"></i> ${traducciones[idiomaActual].cerrar}`;

  const sidebarBtns = document.querySelectorAll(".sidebar .menu-btn");
  if(sidebarBtns.length === 6) {
    sidebarBtns[0].innerHTML = `<i class="fas fa-cow"></i> ${traducciones[idiomaActual].animal}`;
    sidebarBtns[1].innerHTML = `<i class="fas fa-pills"></i> ${traducciones[idiomaActual].medicamento}`;
    sidebarBtns[2].innerHTML = `<i class="fas fa-file-alt"></i> ${traducciones[idiomaActual].tarjeta}`;
    sidebarBtns[3].innerHTML = `<i class="fas fa-notes-medical"></i> ${traducciones[idiomaActual].reporte}`;
    sidebarBtns[4].innerHTML = `<i class="fas fa-syringe"></i> ${traducciones[idiomaActual].tratamiento}`;
    sidebarBtns[5].innerHTML = `<i class="fas fa-shield-virus"></i> ${traducciones[idiomaActual].enfermedad}`;
  }

  const titulo = document.querySelector("main h2");
  if(titulo) titulo.textContent = traducciones[idiomaActual].enfermedades;

  const btnAgregar = document.getElementById("btnAgregarEnfermedad");
  if(btnAgregar) btnAgregar.textContent = traducciones[idiomaActual].agregar;

  const inputNombre = document.getElementById("nombreEnfermedad");
  if(inputNombre) inputNombre.placeholder = traducciones[idiomaActual].nombreEnfermedad;

  const inputCasos = document.getElementById("numCasos");
  if(inputCasos) inputCasos.placeholder = traducciones[idiomaActual].casos;

  const btnTraducir = document.getElementById("btnTraducir");
  if(btnTraducir) btnTraducir.innerHTML = `<i class="fas fa-globe"></i> ${idiomaActual === "es" ? "English" : "Español"}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const btnTraducir = document.getElementById("btnTraducir");
  if(btnTraducir) {
    btnTraducir.addEventListener("click", () => {
      idiomaActual = idiomaActual === "es" ? "en" : "es";
      traducirPagina();
    });
  }
});
