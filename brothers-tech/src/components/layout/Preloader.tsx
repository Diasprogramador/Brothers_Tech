import { PRELOADER_LETTERS } from '../../data/content';
import { usePreloader } from '../../hooks/usePreloader';
import styles from './Preloader.module.css';

export function Preloader() {
  const { visible, complete } = usePreloader();
  if (!visible) return null;

  return (
    <div
      className={`${styles.preloader} ${complete ? styles.isComplete : ''} ${styles.isDone}`}
      role="status"
      aria-live="polite"
      aria-label="Carregando Brothers Tech"
    >
      <div className={styles.words} aria-hidden="true">
        <div className={`${styles.row} ${styles.rowUp}`}>
          {PRELOADER_LETTERS.up.map((letter, i) => (
            <span
              key={`up-${i}`}
              className={styles.letter}
              style={{ '--i': i } as React.CSSProperties}
            >
              <img src={letter.src} alt="" />
            </span>
          ))}
        </div>
        <div className={`${styles.row} ${styles.rowDown}`}>
          {PRELOADER_LETTERS.down.map((letter, i) => (
            <span
              key={`down-${i}`}
              className={`${styles.letter} ${styles.letterBlue}`}
              style={{ '--i': i + 8 } as React.CSSProperties}
            >
              <img src={letter.src} alt="" />
            </span>
          ))}
        </div>
      </div>
      <div className={styles.bar} aria-hidden="true">
        <span className={styles.barFill} />
      </div>
    </div>
  );
}
