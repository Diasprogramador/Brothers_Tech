import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Cena 3D real (React Three Fiber / Three.js).
 * Renderiza um icosaedro wireframe girando + 500 partículas flutuantes.
 * Vai no fundo de seções, com pointer-events:none pra não bloquear cliques.
 */

function WireIcosa() {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.x += delta * 0.18;
    mesh.current.rotation.y += delta * 0.26;
    // leve "respiração" pulsando a escala
    const s = 1 + Math.sin(state.clock.elapsedTime * 1.2) * 0.04;
    mesh.current.scale.setScalar(s);
  });

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.4, 1]} />
      <meshStandardMaterial
        color="#46d373"
        wireframe
        transparent
        opacity={0.35}
        emissive="#46d373"
        emissiveIntensity={0.4}
      />
    </mesh>
  );
}

function FloatingParticles({ count = 500 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // distribuição num volume esférico
      const r = 2 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      p[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      p[i * 3 + 2] = r * Math.cos(phi);
    }
    return p;
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.04;
    pointsRef.current.rotation.x += delta * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#94a39a"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

interface Scene3DProps {
  /** Opacidade do canvas inteiro. Default 1. */
  opacity?: number;
}

export function Scene3D({ opacity = 1 }: Scene3DProps) {
  return (
    <div
      className="scene3d"
      style={{ opacity, pointerEvents: "none" }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: "transparent" }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.2} color="#46d373" />
        <pointLight position={[-10, -10, -5]} intensity={0.6} color="#364c84" />
        <WireIcosa />
        <FloatingParticles />
      </Canvas>
    </div>
  );
}
