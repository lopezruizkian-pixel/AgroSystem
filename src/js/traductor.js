// traductor.js - para el home.html con data-translate / data-translate-placeholder

const localesPath = '../locales/'; // <- ajusta si tu carpeta locales está en otro lugar
const defaultLang = localStorage.getItem('idioma') || 'es';
let currentLang = defaultLang;

// carga JSON de traducción
async function loadLocale(lang) {
  try {
    const res = await fetch(`${localesPath}${lang}.json`);
    if (!res.ok) throw new Error(`Locale not found: ${lang} (${res.status})`);
    const json = await res.json();
    return json;
  } catch (err) {
    console.error('Error loading locale', err);
    return {};
  }
}

// aplica las traducciones en la página
async function applyTranslations(lang) {
  const translations = await loadLocale(lang);

  // elementos con texto
  document.querySelectorAll('[data-translate]').forEach(el => {
    const key = el.getAttribute('data-translate');
    if (key in translations) {
      el.textContent = translations[key];
    }
  });

  // placeholders
  document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
    const key = el.getAttribute('data-translate-placeholder');
    if (key in translations) {
      el.placeholder = translations[key];
    }
  });

  // alt attributes (opcional)
  document.querySelectorAll('[data-translate-alt]').forEach(el => {
    const key = el.getAttribute('data-translate-alt');
    if (key in translations) {
      el.setAttribute('alt', translations[key]);
    }
  });

  // title tag si está marcado
  const titleTag = document.querySelector('title[data-translate]');
  if (titleTag) {
    const key = titleTag.getAttribute('data-translate');
    if (key in translations) document.title = translations[key];
  }

  // actualizar texto del botón idioma
  const textoIdioma = document.getElementById('textoIdioma');
  if (textoIdioma) textoIdioma.textContent = (lang === 'es') ? 'EN' : 'ES';
}

// alterna idioma cuando se presiona el botón
async function toggleLanguage() {
  currentLang = (currentLang === 'es') ? 'en' : 'es';
  localStorage.setItem('idioma', currentLang);
  await applyTranslations(currentLang);
}

// init al cargar DOM
document.addEventListener('DOMContentLoaded', async () => {
  // event listener botón
  const btn = document.getElementById('btnTraducir');
  if (btn) btn.addEventListener('click', toggleLanguage);

  // aplicar idioma guardado o por defecto
  await applyTranslations(currentLang);
});
