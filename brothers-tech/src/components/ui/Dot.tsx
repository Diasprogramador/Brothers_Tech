import type { CSSProperties, ReactNode } from 'react';
import styles from './Dot.module.css';

type DotColor = 'green' | 'orange' | 'blue';

interface DotProps {
  color: DotColor;
  size?: number;
  glow?: boolean;
  ariaLabel?: string;
}

export function Dot({ color, size = 6, glow = false, ariaLabel }: DotProps) {
  const style: CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
  };
  if (glow) style.boxShadow = '0 0 8px var(--green)';
  return (
    <span
      className={`${styles.dot} ${styles[color]}`}
      style={style}
      aria-hidden={!ariaLabel}
      aria-label={ariaLabel}
    />
  );
}

export function DotBlock({ children }: { children: ReactNode }) {
  return <span className={styles.block}>{children}</span>;
}
