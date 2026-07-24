import './Services.css';
import { useReveal } from '../../hooks/useReveal';
import { useTilt } from '../../hooks/useTilt';

const SERVICES = [
  { icon: '⌨', title: 'Sistemas', desc: 'Desenvolvimento de sistemas web sob medida — front, back e integrações.' },
  { icon: '📱', title: 'Apps', desc: 'Apps mobile nativos e híbridos com experiência fluida em qualquer tela.' },
  { icon: '🌐', title: 'Sites', desc: 'Sites e landing pages performáticos, SEO-ready e que convertem.' },
  { icon: '⚙', title: 'Softwares', desc: 'Softwares desktop e automações que reduzem custo e aceleram entregas.' },
];

export const Services = () => {
  const sectionRef = useReveal<HTMLDivElement>({ animation: 'fadeUp' });
  const gridRef = useReveal<HTMLDivElement>({ stagger: 0.12, delay: 0.1 });

  return (
    <section id="servicos" className="services">
      <div className="services-container" ref={sectionRef}>
        <span className="section-eyebrow">O que fazemos</span>
        <h2 className="services-title">Serviços</h2>
        <div className="services-grid" ref={gridRef}>
          {SERVICES.map((s) => (
            <ServiceCard key={s.title} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
};

function ServiceCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  const tiltRef = useTilt<HTMLDivElement>({ max: 10 });
  return (
    <div className="service-card" ref={tiltRef} data-reveal-child>
      <div className="service-icon" aria-hidden="true">{icon}</div>
      <h3 className="service-name">{title}</h3>
      <p className="service-desc">{desc}</p>
    </div>
  );
}
