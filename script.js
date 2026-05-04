

'use strict';

/* ── Logo: fallback si la imagen no carga ───────────────── */
/*
 * Equivalente al onerror inline que se eliminó del HTML por
 * buenas prácticas (CSP / separación de responsabilidades).
 */
document.addEventListener('DOMContentLoaded', () => {
  const logoImg = document.querySelector('img.logo');
  if (logoImg) {
    logoImg.addEventListener('error', () => {
      logoImg.closest('.logo-wrapper').classList.add('img-error');
    });
  }
});

/* ── Selección de elementos ─────────────────────────────── */
const stickyNav = document.getElementById('stickyNav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.menu-section');

function setNavOpen(isOpen) {
  if (!stickyNav || !navToggle) return;

  stickyNav.classList.toggle('is-open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
}

function closeNav() {
  setNavOpen(false);
}

if (stickyNav && navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = stickyNav.classList.contains('is-open');
    setNavOpen(!isOpen);
  });

  document.addEventListener('click', event => {
    if (stickyNav.classList.contains('is-open') && !stickyNav.contains(event.target)) {
      closeNav();
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeNav();
    }
  });
}

navLinks.forEach(link => {
  link.addEventListener('click', function (event) {
    event.preventDefault();

    const targetId = this.getAttribute('href').slice(1); // quita el "#"
    const targetSection = document.getElementById(targetId);

    if (!targetSection) return;

    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    closeNav();

    // Permite navegar con teclado desde la sección activa
    targetSection.setAttribute('tabindex', '-1');
    targetSection.focus({ preventScroll: true });
  });
});

/* ── 2. ACTIVE LINK CON IntersectionObserver ────────────── */


/** Marca como activo el enlace cuyo data-section coincide con el id dado */
function setActiveLink(sectionId) {
  navLinks.forEach(link => {
    const isActive = link.dataset.section === sectionId;
    link.classList.toggle('active', isActive);

    // Accesibilidad: aria-current para lectores de pantalla
    if (isActive) {
      link.setAttribute('aria-current', 'true');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

function updateActiveLinkFromScroll() {
  if (sections.length === 0) return;

  const navOffset = stickyNav ? stickyNav.offsetHeight : 52;
  const activationLine = navOffset + 12;
  let activeSection = sections[0];

  sections.forEach(section => {
    if (section.getBoundingClientRect().top <= activationLine) {
      activeSection = section;
    }
  });

  setActiveLink(activeSection.id);
}

function observeActiveSection() {
  if (sections.length === 0) return;

  if ('IntersectionObserver' in window) {
    // Opciones del observer: dispara cuando la sección cruza la navbar sticky.
    const observerOptions = {
      root: null,
      rootMargin: '-52px 0px -40% 0px',
      threshold: 0,
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));
    return;
  }

  window.addEventListener('scroll', updateActiveLinkFromScroll, { passive: true });
  window.addEventListener('resize', updateActiveLinkFromScroll);
  updateActiveLinkFromScroll();
}

observeActiveSection();

/* ── 3. INICIALIZACIÓN ──────────────────────────────────── */
/**
 * Al cargar la página, activa el enlace de la primera sección
 * para que la navbar no aparezca sin ningún elemento resaltado.
 */
document.addEventListener('DOMContentLoaded', () => {
  closeNav();

  if (sections.length > 0) {
    setActiveLink(sections[0].id);
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth >= 600) {
    closeNav();
  }
});

/* ── LANGUAGE / TRADUCCIÓN ──────────────────────────────── */

let currentLang = localStorage.getItem('lang') || 'es';

const UI_TRANSLATIONS = {
  en: {
    langBtn: 'ES',
    siteSubtitle: 'Eco Lodge · Champey Jungle',
    footerNote: 'All prices in Guatemalan Quetzales (GTQ). Tax included.',
    cardNote: 'Includes soft drink',
    nav: {
      desayunos: 'Breakfast / Dinner',
      platos: 'House Specials',
      veggie: 'Vegetarian',
      mariscos: 'Seafood',
      burger: 'Burgers',
      snacks: 'Snacks',
      'bebidas-frias': 'Cold Drinks',
      'bebidas-calientes': 'Hot Drinks',
      alcohol: 'Alcohol',
      'happy-hour': 'Happy Hour'
    },
    sections: {
      desayunos: 'Breakfast / Dinner',
      platos: 'House Specials',
      veggie: 'Vegetarian Dishes',
      mariscos: 'Seafood',
      burger: 'Burgers',
      snacks: 'Snacks',
      'bebidas-frias': 'Cold Drinks',
      'bebidas-calientes': 'Hot Drinks',
      alcohol: 'Alcohol',
      'happy-hour': 'Happy Hour'
    },
    notes: {
      burger: 'All burgers include a soft drink.',
      'happy-hour': 'Available from 7:00 PM.'
    }
  },
  es: {
    langBtn: 'EN',
    siteSubtitle: 'Hostal Ecológico · Semuc Champey',
    footerNote: 'Todos los precios en quetzales (QTZ). IVA incluido.',
    cardNote: 'Incluye gaseosa',
    nav: {
      desayunos: 'Desayuno/Cena',
      platos: 'Especiales de la casa',
      veggie: 'Platos Vegetarianos',
      mariscos: 'Mariscos',
      burger: 'Hamburguesas',
      snacks: 'Snacks',
      'bebidas-frias': 'Bebidas Frías',
      'bebidas-calientes': 'Bebidas Calientes',
      alcohol: 'Alcohol',
      'happy-hour': 'Happy Hour'
    },
    sections: {
      desayunos: 'Desayuno / Cena',
      platos: 'Especiales de la Casa',
      veggie: 'Platos Vegetarianos',
      mariscos: 'Mariscos',
      burger: 'Hamburguesas',
      snacks: 'Snacks',
      'bebidas-frias': 'Bebidas Frías',
      'bebidas-calientes': 'Bebidas Calientes',
      alcohol: 'Alcohol',
      'happy-hour': 'Happy Hour'
    },
    notes: {
      burger: 'Todas las hamburguesas incluyen gaseosa.',
      'happy-hour': 'Disponible a partir de las 7:00 PM.'
    }
  }
};

const CARD_TRANSLATIONS_EN = {
  // DESAYUNO / CENA
  '10.-Huevos al gusto': {
    title: '10.- Eggs Your Way',
    desc: 'Scrambled with tomato and onion, fried, or medium — served with beans and bread.'
  },
  '11.- Omelette': {
    title: '11.- Omelette',
    desc: 'Omelette with fresh local ingredients, beans and toast.'
  },
  '12.- Panqueques con frutas': {
    title: '12.- Pancakes with Fruit',
    desc: 'Fluffy pancakes served with fresh local fruit and honey.'
  },
  '13.- Cereal': {
    title: '13.- Cereal',
    desc: 'Cereal with milk and fresh local fruit, perfect for a light breakfast.'
  },
  '14.- Yogur con Granola': {
    title: '14.- Yogurt with Granola',
    desc: 'Natural yogurt with granola and fresh local fruit — ideal for a healthy breakfast.'
  },
  '15.- Pan Tostado con Jalea y Mantequilla': {
    title: '15.- Toast with Jam and Butter',
    desc: 'Toast served with jam and butter, ideal for a light breakfast.'
  },
  // ESPECIALES DE LA CASA
  '1.- Pollo (Pechuga) a la plancha': {
    title: '1.- Grilled Chicken Breast',
    desc: 'Grilled chicken served with your choice of: mashed potatoes, pasta or salad.'
  },
  '2.- Torta Española': {
    title: '2.- Spanish Omelette',
    desc: 'Traditional Spanish omelette with potatoes, grilled meat and salad.'
  },
  '3.- Milanesa de Pollo': {
    title: '3.- Chicken Schnitzel',
    desc: 'Breaded chicken fillet served with mashed potatoes, pasta or salad.'
  },
  '4.- Pasta Bolognesa': {
    title: '4.- Bolognese Pasta',
    desc: 'Pasta with meat bolognese sauce, tomato and fresh herbs.'
  },
  '5.- Carne a la plancha': {
    title: '5.- Grilled Meat',
    desc: 'Grilled meat served with mashed potatoes, pasta or salad.'
  },
  // PLATOS VEGETARIANOS
  '7.-Fritata': {
    title: '7.- Frittata',
    desc: 'Pasta and egg frittata with cheese, omelette-style, served with fresh salad.'
  },
  '8.- Pasta Con Salsa de Tomate': {
    title: '8.- Pasta with Tomato Sauce',
    desc: 'Pasta with homemade tomato sauce and fresh salad.'
  },
  '9.- Ensalada El Portal': {
    title: '9.- El Portal Salad',
    desc: 'Cucumber, lettuce, carrot, tomato, onion, cheese and eggs — a fresh, healthy salad.'
  },
  '25.- Arroz, Frijoles y Ensalada': {
    title: '25.- Rice, Beans and Salad',
    desc: 'Rice, beans and fresh salad with homemade salsa.'
  },
  // MARISCOS
  'Ceviche de Camarón / Mixto': {
    title: 'Shrimp Ceviche / Mixed',
    desc: 'Choose shrimp or mixed ceviche, available in medium and large sizes.'
  },
  'Filete de Pescado': {
    title: 'Fish Fillet',
    desc: 'Fresh fish fillet, breaded or garlic-style, with white rice and fresh salad.'
  },
  'Camarones': {
    title: 'Shrimp',
    desc: 'Breaded or garlic-style.'
  },
  // HAMBURGUESAS
  'Texas Burger': {
    title: 'Texas Burger',
    desc: 'Beef patty, tomato, onion, cheese, ham and fries.'
  },
  'Deli Burger': {
    title: 'Deli Burger',
    desc: 'Beef patty, tomato, onion, cheese, egg and fries.'
  },
  'Deluxe Burger': {
    title: 'Deluxe Burger',
    desc: 'Beef patty, tomato, onion, cheese and fries.'
  },
  'Big Burger': {
    title: 'Big Burger',
    desc: 'Double beef patty, tomato, onion, cheese and fries.'
  },
  'Cheese Burger': {
    title: 'Cheese Burger',
    desc: 'Beef patty, double cheese, onion, tomato and fries.'
  },
  // SNACKS
  'Pizza del Portal': {
    title: 'Pizza del Portal',
    desc: 'Artisan pizza with fresh local ingredients. By the slice (Q15) or whole.'
  },
  'Nachos Veggie': {
    title: 'Veggie Nachos',
    desc: 'Nachos with cheese, beans, guacamole, pico de gallo and jalapeños.'
  },
  'Nachos de Carne': {
    title: 'Meat Nachos',
    desc: 'Nachos with meat, cheese, beans, guacamole, pico de gallo and jalapeños.'
  },
  'Nachos con Atún': {
    title: 'Tuna Nachos',
    desc: 'Nachos with tuna, cheese, beans, guacamole, pico de gallo and jalapeños.'
  },
  'Sandwich de Pollo': {
    title: 'Chicken Sandwich',
    desc: 'Chicken sandwich with lettuce, tomato and homemade mayo.'
  },
  'Sandwich Veggie': {
    title: 'Veggie Sandwich',
    desc: 'Veggie sandwich with cheese, lettuce, tomato and homemade mayo.'
  },
  'Sandwich de Atún': {
    title: 'Tuna Sandwich',
    desc: 'Tuna sandwich with lettuce, tomato and homemade mayo.'
  },
  // BEBIDAS FRÍAS
  'Limonada con Agua': {
    title: 'Lemonade',
    desc: 'Fresh natural lemonade, refreshing and light.'
  },
  'Agua 300ml': { title: 'Water 300ml' },
  'Agua 2L': { title: 'Water 2L' },
  'Té Frío': { title: 'Iced Tea' },
  // BEBIDAS CALIENTES
  'Café': {
    title: 'Coffee',
    desc: 'Locally roasted highland coffee. Available americano or with milk.'
  },
  'Té de Hierbas de la Selva': {
    title: 'Jungle Herbal Tea',
    desc: 'Natural herbal tea, relaxing and aromatic. Available with milk +Q3.'
  },
  'Chocolate Caliente': {
    title: 'Hot Chocolate',
    desc: '100% organic local cocoa prepared with coconut milk, cinnamon and piloncillo.'
  },
  // ALCOHOL
  'Mojito': { title: 'Mojito' },
  'Cuba Libre': { title: 'Cuba Libre' },
  'Tequila Sunrise': { title: 'Tequila Sunrise' },
  'A dormir Juntitos': { title: 'Goodnight Together' },
  'Cafe Irlande': { title: 'Irish Coffee' },
  'Margarita': { title: 'Margarita' },
  'Pina Colada': { title: 'Piña Colada' },
  'Daiquiri': { title: 'Daiquiri' },
  'Copa de Vino': { title: 'Glass of Wine' },
  'Gallo': { title: 'Gallo' },
  'Michelada': { title: 'Michelada' },
  'Oasis': { title: 'Oasis' },
  'Caipirinha': { title: 'Caipirinha' },
  'Champey Drink': { title: 'Champey Drink' },
  'Screwdriver': { title: 'Screwdriver' },
  'Skydriver': { title: 'Skydriver' },
  'Molotov': { title: 'Molotov' },
  // BEBIDAS FRÍAS (marcas internacionales)
  'Gatorade': { title: 'Gatorade' },
  'Coca-Cola': { title: 'Coca-Cola' },
  'Coca-Cola Zero': { title: 'Coca-Cola Zero' }
};

function initCardTranslations() {
  document.querySelectorAll('.menu-card').forEach(card => {
    const titleEl = card.querySelector('.card-title');
    const descEl  = card.querySelector('.card-desc');
    const noteEl  = card.querySelector('.card-note');

    if (titleEl) {
      const esKey = titleEl.textContent.trim();
      titleEl.dataset.es = esKey;
      const enData = CARD_TRANSLATIONS_EN[esKey];
      if (enData) {
        titleEl.dataset.en = enData.title;
        if (descEl && enData.desc) {
          descEl.dataset.es = descEl.textContent.trim();
          descEl.dataset.en = enData.desc;
        }
      }
    }

    if (noteEl) {
      noteEl.dataset.es = noteEl.textContent.trim();
      noteEl.dataset.en = UI_TRANSLATIONS.en.cardNote;
    }
  });
}

function updateStaticUI() {
  const t = UI_TRANSLATIONS[currentLang];

  // Botón de idioma
  const langBtnLabel = document.querySelector('#lang-btn .lang-label');
  if (langBtnLabel) langBtnLabel.textContent = t.langBtn;

  // Subtítulo del header
  const subtitle = document.querySelector('.site-subtitle');
  if (subtitle) subtitle.textContent = t.siteSubtitle;

  // Nota del footer
  const footerNote = document.querySelector('.footer-note');
  if (footerNote) footerNote.textContent = t.footerNote;

  // Nav links
  document.querySelectorAll('.nav-link[data-section]').forEach(link => {
    const key = link.dataset.section;
    if (t.nav[key]) link.textContent = t.nav[key];
  });

  // Títulos y notas de sección
  document.querySelectorAll('.menu-section').forEach(section => {
    const key = section.id;
    const titleEl = section.querySelector('.section-title');
    if (titleEl && t.sections[key]) titleEl.textContent = t.sections[key];

    const noteEl = section.querySelector('.section-note');
    if (noteEl && t.notes[key]) noteEl.textContent = t.notes[key];
  });

  // Contenido de las tarjetas
  document.querySelectorAll('.menu-card').forEach(card => {
    const titleEl = card.querySelector('.card-title');
    const descEl  = card.querySelector('.card-desc');
    const noteEl  = card.querySelector('.card-note');

    if (titleEl && titleEl.dataset[currentLang]) {
      titleEl.textContent = titleEl.dataset[currentLang];
    }
    if (descEl && descEl.dataset[currentLang]) {
      descEl.textContent = descEl.dataset[currentLang];
    }
    if (noteEl && noteEl.dataset[currentLang]) {
      noteEl.textContent = noteEl.dataset[currentLang];
    }
  });

  // Atributo lang del documento
  document.documentElement.lang = currentLang;
}

function toggleLang() {
  currentLang = currentLang === 'es' ? 'en' : 'es';
  localStorage.setItem('lang', currentLang);
  updateStaticUI();
}

document.addEventListener('DOMContentLoaded', () => {
  initCardTranslations();

  const langBtn = document.getElementById('lang-btn');
  if (langBtn) langBtn.addEventListener('click', toggleLang);

  // Aplica preferencia guardada si no es español (default)
  if (currentLang !== 'es') {
    updateStaticUI();
  }
});
