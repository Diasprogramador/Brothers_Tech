import { Button } from '../ui/Button';
import { Dot } from '../ui/Dot';
import { Wrap } from '../ui/Wrap';
import { TAGS } from '../../data/content';
import { useHeroParallax } from '../../hooks/useHeroParallax';
import styles from './Hero.module.css';

export function Hero() {
  useHeroParallax();

  return (
    <section className={styles.hero} id="home">
      <Wrap className={styles.wrap}>
        <div className={styles.content}>
          <div className={`${styles.eyebrow} mono`}>estúdio de desenvolvimento</div>
          <h1 className={styles.title}>
            BROTHERS
            <br />
            <span className={styles.accent}>TECH</span>
          </h1>
          <p className={styles.sub}>
            Construímos sistemas, apps, sites e softwares sob medida — do primeiro rascunho ao
            produto no ar.
          </p>
          <div className={styles.actions}>
            <Button href="#contato" variant="primary">
              Iniciar projeto →
            </Button>
            <Button href="#servicos" variant="ghost">
              Serviços
            </Button>
          </div>
        </div>

        <div className={styles.avatars} aria-hidden="true">
          <div className={styles.avatarItem}>
            <img
              className={styles.avatarImg}
              src="/assets/avatar-sanderson-clean.png"
              alt=""
              width={170}
              height={512}
              loading="eager"
              decoding="async"
            />
          </div>
          <div className={styles.avatarItem}>
            <img
              className={styles.avatarImg}
              src="/assets/avatar-caio-clean.png"
              alt=""
              width={170}
              height={512}
              loading="eager"
              decoding="async"
            />
          </div>
        </div>

        <div className={styles.legend} aria-label="Áreas de atuação">
          <div className={styles.legendName}>Sanderson & Caio</div>
          <div className={`${styles.legendRole} mono`}>
            co-fundadores · brothers-tech.dev
          </div>
        </div>

        <div className={styles.tags}>
          {TAGS.map((t) => (
            <span key={t.label} className={styles.tag}>
              <Dot color={t.color as 'green' | 'orange' | 'blue'} />
              {t.label}
            </span>
          ))}
        </div>
      </Wrap>
    </section>
  );
}
