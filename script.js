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
  entries.forEach((entry, index) => {
    if(entry.isIntersecting){
      // Add stagger delay based on element position
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('in');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

revealElements.forEach((el, index) => {
  // Add stagger delay for elements in the same section
  if(!el.dataset.delay) {
    el.dataset.delay = (index % 4) * 100;
  }
  revealObserver.observe(el);
});

// Parallax effect for hero avatar
const heroAvatar = document.querySelector('.hero-avatar');
if(heroAvatar) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if(scrolled < window.innerHeight) {
      heroAvatar.style.transform = `translateY(${scrolled * 0.15}px)`;
    }
  });
}

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

// Remove black background from avatar images (sticker effect)
function removeBlackBg(imgElement, src) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = function() {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for(let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const avg = (r + g + b) / 3;
      // Remove dark pixels - more aggressive on pure black, preserve colored darks
      if(avg < 25 && Math.abs(r - g) < 10 && Math.abs(g - b) < 10) {
        data[i + 3] = 0;
      }
    }
    ctx.putImageData(imageData, 0, 0);
    imgElement.style.backgroundImage = `url(${canvas.toDataURL('image/png')})`;
  };
  img.src = src;
}

// Apply to avatar images
document.querySelectorAll('.avatar-img').forEach(el => {
  const bgImage = el.style.backgroundImage;
  const src = bgImage.match(/url\(['"]?(.+?)['"]?\)/)?.[1];
  if(src) removeBlackBg(el, src);
});
