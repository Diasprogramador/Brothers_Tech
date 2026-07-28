import type { ReactNode } from 'react';
import styles from './Button.module.css';

type Variant = 'primary' | 'ghost';

interface ButtonProps {
  href?: string;
  variant: Variant;
  children: ReactNode;
  onClick?: () => void;
  rel?: string;
  className?: string;
}

export function Button({ href, variant, children, onClick, rel, className }: ButtonProps) {
  const cls = className
    ? `${styles.btn} ${styles[variant]} ${className}`
    : `${styles.btn} ${styles[variant]}`;

  if (href) {
    return (
      <a href={href} className={cls} rel={rel}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={cls} onClick={onClick}>
      {children}
    </button>
  );
}
