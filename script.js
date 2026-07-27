/* =====================================================================
   BROTHERS TECH — script.js
   Vanilla JS, sem libs. Acessível e performático.
   ===================================================================== */
'use strict';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Preloader (3s com stagger de letras) ---------- */
const preloader = document.getElementById('preloader');
if (preloader) {
  const TOTAL_MS = 3000;          // duração total
  const LAST_LETTER_DELAY = 120 + 11 * 180 + 520; // ~2.6s — última letra termina

  // marca o documento pra fallback no-js
  document.documentElement.classList.add('js');

  let completed = false;

  function done() {
    if (completed) return;
    completed = true;
    preloader.classList.add('is-complete');
    // esconde após o fade do preloader
    setTimeout(() => {
      preloader.classList.add('is-done');
    }, 350);
    // remove do DOM depois pra não atrapalhar a11y nem tab
    setTimeout(() => {
      preloader.remove();
    }, 900);
  }

  // dispara "complete" depois que a última letra assentar
  setTimeout(() => {
    // se a página já carregou, mantém 3s totais; senão espera
    if (document.readyState === 'complete' || prefersReducedMotion) {
      done();
    }
  }, LAST_LETTER_DELAY);

  // garante 3s mínimos mesmo se tudo carregar muito rápido
  setTimeout(done, TOTAL_MS);

  // se demorar muito (mais de 5s por algum asset), libera mesmo assim
  setTimeout(() => { if (!completed) done(); }, 5000);
}

/* ---------- Header scroll state ---------- */
const header = document.getElementById('site-header');
let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    header.classList.toggle('scrolled', window.scrollY > 8);
    ticking = false;
  });
}, { passive: true });

/* ---------- Mobile menu acessível ---------- */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
const menuLinks = mobileMenu.querySelectorAll('a');

function openMenu(){
  mobileMenu.classList.add('open');
  burger.setAttribute('aria-expanded', 'true');
  burger.setAttribute('aria-label', 'Fechar menu');
  document.body.style.overflow = 'hidden';
  // foco no primeiro link
  menuLinks[0]?.focus();
}
function closeMenu(){
  mobileMenu.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-label', 'Abrir menu');
  document.body.style.overflow = '';
  burger.focus();
}
function toggleMenu(){
  const isOpen = mobileMenu.classList.contains('open');
  if (isOpen) closeMenu(); else openMenu();
}
burger.addEventListener('click', toggleMenu);
menuLinks.forEach(a => a.addEventListener('click', closeMenu));
// ESC fecha
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
    closeMenu();
  }
});
// Fecha se redimensionar pra desktop
const mql = window.matchMedia('(min-width: 860px)');
mql.addEventListener('change', (e) => { if (e.matches) closeMenu(); });

/* ---------- Reveal animations (IntersectionObserver) ---------- */
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // respeita delays explícitos do dataset, sem sobrescrever
      const delay = Number(entry.target.dataset.delay) || 0;
      setTimeout(() => entry.target.classList.add('in'), delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

/* ---------- Smooth scroll (vanilla, respeita prefers-reduced-motion) ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const id = this.getAttribute('href');
    if (id === '#' || id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    closeMenu();
    target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    history.pushState(null, '', id);
  });
});

/* ---------- Custom cursor (desktop com mouse fino) ---------- */
const finePointer = window.matchMedia('(pointer: fine)').matches && window.innerWidth >= 860;
if (finePointer && !prefersReducedMotion) {
  const dot = document.createElement('div');
  const ring = document.createElement('div');
  dot.className = 'cursor-dot';
  ring.className = 'cursor-ring';
  dot.setAttribute('aria-hidden', 'true');
  ring.setAttribute('aria-hidden', 'true');
  document.body.append(dot, ring);

  let mx = 0, my = 0, rx = 0, ry = 0;
  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx - 3}px, ${my - 3}px)`;
  });
  // ring segue com lerp pra dar "elasticidade"
  (function follow(){
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
    requestAnimationFrame(follow);
  })();
  // cresce em cima de elementos interativos
  document.querySelectorAll('a, button, .tag, .channel').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('grow'));
    el.addEventListener('mouseleave', () => ring.classList.remove('grow'));
  });
  // some ao sair da janela
  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
}

/* ---------- Parallax sutil nos avatares do hero (joystick no mouse) ---------- */
if (finePointer && !prefersReducedMotion) {
  const hero = document.querySelector('.hero');
  const avatars = document.querySelectorAll('.hero-avatars .avatar-img');
  hero?.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5..0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    avatars.forEach((img, i) => {
      const depth = (i + 1) * 6; // avatar 2 reage mais
      img.style.setProperty('--px', `${x * depth}px`);
      img.style.setProperty('--py', `${y * depth}px`);
    });
  });
}
// CSS já anima com .avatar-img float; aplicamos translate adicional via layer extra
// (mantido simples — animação original do CSS roda junto)

/* ---------- Log de carregamento pra debug ---------- */
console.log('Brothers Tech · pronto');
