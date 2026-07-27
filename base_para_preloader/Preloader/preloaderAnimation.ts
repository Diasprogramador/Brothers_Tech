import gsap from 'gsap';

export function createPreloaderAnimation(
  svgElement: SVGSVGElement,
  overlayElement: HTMLElement,
  onComplete: () => void,
): gsap.core.Timeline {
  const tl = gsap.timeline({ onComplete });

  const strokeLayer = svgElement.querySelector('g:first-child');
  const fillLayer = svgElement.querySelector('g:last-child');

  if (!strokeLayer || !fillLayer) {
    onComplete();
    return tl;
  }

  const strokePaths = strokeLayer.querySelectorAll('path');

  // Respect prefers-reduced-motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    gsap.set(strokeLayer, { opacity: 0 });
    gsap.set(fillLayer, { opacity: 1 });
    gsap.set(overlayElement, { opacity: 0 });
    onComplete();
    return tl;
  }

  // Phase 1: Show stroke layer (0.00s -> 0.10s)
  tl.to(strokeLayer, {
    opacity: 1,
    duration: 0.1,
    ease: 'none',
  });

  // Phase 2: Draw strokes with stagger (0.10s -> ~1.40s)
  // Each path animates strokeDashoffset from length to 0
  tl.to(
    strokePaths,
    {
      strokeDashoffset: 0,
      duration: 1.2,
      stagger: 0.08,
      ease: 'power2.out',
    },
    0.1,
  );

  // Phase 3: Reveal fill layer group (1.40s -> 1.65s)
  // The <g> starts at opacity=0, so we animate the group itself
  tl.to(
    fillLayer,
    {
      opacity: 1,
      duration: 0.25,
      ease: 'power1.in',
    },
    1.4,
  );

  // Phase 4: Hide stroke layer (1.45s -> 1.60s)
  tl.to(
    strokeLayer,
    {
      opacity: 0,
      duration: 0.2,
      ease: 'power1.in',
    },
    1.45,
  );

  // Phase 5: Hold — logo stays visible for ~2.0s
  // (no animation, just a time gap before fade-out)

  // Phase 6: Fade out overlay (3.60s -> 4.00s)
  tl.to(
    overlayElement,
    {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut',
    },
    3.6,
  );

  return tl;
}
