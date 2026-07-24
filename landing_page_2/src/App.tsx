import { usePreloader } from './hooks/usePreloader';
import { Preloader } from './components/Preloader/Preloader';
import { Hero } from './components/Hero/Hero';
import { Services } from './components/Services/Services';
import { Projects } from './components/Projects/Projects';
import { About } from './components/About/About';
import { Contact } from './components/Contact/Contact';
import { Footer } from './components/Footer/Footer';
import { SmoothScroll } from './providers/SmoothScroll';

function App() {
  const { isPreloading, onComplete } = usePreloader();

  return (
    <>
      {isPreloading && <Preloader onComplete={onComplete} />}
      <div
        style={{
          opacity: isPreloading ? 0 : 1,
          transition: 'opacity 0.5s ease',
        }}
      >
        <SmoothScroll>
          <Hero />
          <Services />
          <Projects />
          <About />
          <Contact />
          <Footer />
        </SmoothScroll>
      </div>
    </>
  );
}

export default App;
