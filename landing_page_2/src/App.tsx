import { usePreloader } from './hooks/usePreloader';
import Preloader from './components/Preloader/Preloader';

function App() {
  const { isPreloading, onComplete } = usePreloader();

  return (
    <>
      {isPreloading && <Preloader onComplete={onComplete} />}
      <main
        style={{
          opacity: isPreloading ? 0 : 1,
          transition: 'opacity 0.5s ease',
          width: '100%',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0c0f0d',
          color: '#f2f5f2',
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 48, fontWeight: 600, letterSpacing: '-0.02em' }}>
            Brothers Tech
          </h1>
          <p style={{ marginTop: 12, color: '#94a39a', fontSize: 18 }}>
            Landing page em construção
          </p>
        </div>
      </main>
    </>
  );
}

export default App;
