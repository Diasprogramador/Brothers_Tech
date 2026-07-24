import './Services.css';
import { Suspense, lazy } from 'react';
import { useReveal } from '../../hooks/useReveal';
import { useTilt } from '../../hooks/useTilt';

// Lazy load da cena 3D (three.js é pesado, só carrega quando Services aparece)
const Scene3D = lazy(() =>
  import('../Scene3D/Scene3D').then((m) => ({ default: m.Scene3D }))
);

const SERVICES = [
  { icon: '⌨', title: 'Sistemas', desc: 'Desenvolvimento de sistemas web sob medida — front, back e integrações.' },
  { icon: '📱', title: 'Apps', desc: 'Apps mobile nativos e híbridos com experiência fluida em qualquer tela.' },
  { icon: '🌐', title: 'Sites', desc: 'Sites e landing pages performáticos, SEO-ready e que convertem.' },
  { icon: '⚙', title: 'Softwares', desc: 'Softwares desktop e automações que reduzem custo e aceleram entregas.' },
];

export const Services = () => {
  const titleRef = useReveal<HTMLDivElement>({ animation: 'slideUpBig' });
  const gridRef = useReveal<HTMLDivElement>({ stagger: 0.18, animation: 'fadeUp' });

  return (
    <section id="servicos" className="services">
      {/* Cena 3D REAL no fundo da seção */}
      <Suspense fallback={null}>
        <Scene3D opacity={0.85} />
      </Suspense>

      <div className="services-container services-front">
        <div ref={titleRef}>
          <span className="section-eyebrow">O que fazemos</span>
          <h2 className="services-title">Serviços</h2>
        </div>
        <div className="services-grid" ref={gridRef}>
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.title} index={i} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
};

function ServiceCard({ icon, title, desc, index }: { icon: string; title: string; desc: string; index: number }) {
  const tiltRef = useTilt<HTMLDivElement>({ max: 16, perspective: 900, scale: 1.04 });
  return (
    <div
      className="service-card"
      ref={tiltRef}
      data-reveal-child
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="service-icon" aria-hidden="true">{icon}</div>
      <h3 className="service-name">{title}</h3>
      <p className="service-desc">{desc}</p>
      <span className="service-card-glow" aria-hidden="true" />
    </div>
  );
}
