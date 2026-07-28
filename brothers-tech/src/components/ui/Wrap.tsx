import type { ReactNode } from 'react';
import styles from './Wrap.module.css';

interface WrapProps {
  children: ReactNode;
  className?: string;
}

export function Wrap({ children, className }: WrapProps) {
  const cls = className ? `${styles.wrap} ${className}` : styles.wrap;
  return <div className={cls}>{children}</div>;
}
