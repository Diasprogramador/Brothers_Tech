import type { ReactNode } from 'react';
import styles from './SectionHeader.module.css';

interface SectionHeaderProps {
  num: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  reveal?: 'left' | 'right';
  align?: 'start' | 'center';
}

export function SectionHeader({
  num,
  eyebrow,
  title,
  description,
  reveal,
  align = 'start',
}: SectionHeaderProps) {
  const revealClass = reveal ? styles[`reveal${reveal === 'left' ? 'Left' : 'Right'}`] : '';
  const alignClass = align === 'center' ? styles.center : '';
  return (
    <div className={`${styles.head} ${revealClass} ${alignClass}`}>
      <div className={styles.eyebrow}>
        <span className={styles.n}>{num}</span> — {eyebrow}
      </div>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}
