// Header scroll state
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
});

// Mobile menu
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

// Smooth scroll reveal animations with stagger
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if(entry.isIntersecting){
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('in');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

revealElements.forEach((el, index) => {
  if(!el.dataset.delay) {
    el.dataset.delay = (index % 4) * 100;
  }
  revealObserver.observe(el);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if(target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

