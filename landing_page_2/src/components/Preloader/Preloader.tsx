import { useRef, useEffect, useState } from 'react';
import LogoSvg from './LogoSvg';
import { createPreloaderAnimation } from './preloaderAnimation';
import './Preloader.css';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!svgRef.current || !overlayRef.current) return;

    const tl = createPreloaderAnimation(
      svgRef.current,
      overlayRef.current,
      () => {
        setVisible(false);
        onComplete();
      },
    );

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div ref={overlayRef} className="preloader-overlay">
      <div className="preloader-logo">
        <LogoSvg svgRef={svgRef} />
      </div>
    </div>
  );
}
