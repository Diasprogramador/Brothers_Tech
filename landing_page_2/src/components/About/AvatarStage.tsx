import { useMemo, useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import avatarCaio from '../../assets/founders/avatar-caio.png';
import avatarSanderson from '../../assets/founders/avatar-sanderson.png';

/**
 * AvatarStage — palco 3D real (React Three Fiber) para a seção About.
 *
 * Conceito "showcase de personagens":
 *  - Dois avatar-billboards (textura PNG com alpha) sobre uma plataforma 3D
 *  - Iluminação cinematográfica (ambient + 2 spots coloridos que orbitam)
 *  - Partículas volumétricas em espiral em torno dos personagens
 *  - Leve "respiração" idle + inclinação suave que segue o mouse (lerp)
 *  - Grade holográfica sob a plataforma para aterrar a composição
 *
 * Totalmente responsivo: camera/FOV/posições ajustam por viewport via useThree size.
 * Respeita prefers-reduced-motion (desliga idle + partículas).
 * Sem dependências extras — só @react-three/fiber + three (já no projeto).
 */

type Follow = React.MutableRefObject<{ x: number; y: number }>;

/* ---------- ShaderMaterial: chroma-key remove fundo preto do PNG ---------- */
// Os PNGs originais não têm canal alpha (Format24bppRgb), então usamos um
// shader que descarta pixels cuja luminância está abaixo de um threshold.
// Feather suave nas bordas evita "dent" duro ao redor da silhueta.
const chromaKeyVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const chromaKeyFragment = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uThreshold;   // pixels com luminância abaixo disso viram transparentes
  uniform float uFeather;     // suavidade da borda do chroma-key (0..1)
  uniform vec3 uTint;         // coloração leve para integrar com o palco
  uniform float uTintAmount;
  varying vec2 vUv;
  void main() {
    vec4 tex = texture2D(uMap, vUv);
    float lum = dot(tex.rgb, vec3(0.299, 0.587, 0.114));
    // Smoothstep do threshold ao threshold+feather: 0 abaixo, 1 acima.
    float alpha = smoothstep(uThreshold, uThreshold + uFeather, lum);
    if (alpha <= 0.001) discard;
    vec3 color = mix(tex.rgb, tex.rgb * uTint, uTintAmount);
    gl_FragColor = vec4(color, alpha);
  }
`;
function makeChromaKeyMaterial(
  map: THREE.Texture,
  opts: { threshold?: number; feather?: number; tint?: THREE.ColorRepresentation; tintAmount?: number } = {}
) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: map },
      uThreshold: { value: opts.threshold ?? 0.06 },
      uFeather: { value: opts.feather ?? 0.12 },
      uTint: { value: new THREE.Color(opts.tint ?? '#7ef0a8') },
      uTintAmount: { value: opts.tintAmount ?? 0.12 },
    },
    vertexShader: chromaKeyVertex,
    fragmentShader: chromaKeyFragment,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
}

/* ---------- Avatar como billboard 3D (com chroma-key) ---------- */
function AvatarBillboard({
  texture,
  position,
  scale = 1,
  idlePhase = 0,
  followRef,
  reduced,
}: {
  texture: THREE.Texture;
  position: [number, number, number];
  scale?: number;
  idlePhase?: number;
  followRef: Follow;
  reduced: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const grp = groupRef.current;
    if (!grp) return;

    if (!reduced) {
      const t = state.clock.elapsedTime + idlePhase;
      // Respiração idle (sobe/desce + leve rotação Z)
      grp.position.y = position[1] + Math.sin(t * 1.1) * 0.04;
      grp.rotation.z = Math.sin(t * 0.7) * 0.04;
    }

    // Inclinação suave que segue o mouse (lerp p/ suavizar)
    const target = followRef.current;
    const targetYaw = target.x * 0.28;
    const targetPitch = -target.y * 0.18;
    grp.rotation.y = THREE.MathUtils.lerp(grp.rotation.y, targetYaw, 1 - Math.exp(-delta * 4));
    grp.rotation.x = THREE.MathUtils.lerp(grp.rotation.x, targetPitch, 1 - Math.exp(-delta * 4));
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh scale={[scale, scale, scale]}>
        {/* Avatar real tem aspect 341x1024 (~0.333:1), portrait estreito. */}
        <planeGeometry args={[0.6, 1.8, 1]} />
        <primitive
          object={makeChromaKeyMaterial(texture, {
            threshold: 0.06,
            feather: 0.12,
            tint: '#7ef0a8',
            tintAmount: 0.12,
          })}
          attach="material"
        />
      </mesh>
    </group>
  );
}

/* ---------- Plataforma (disco com brilho) ---------- */
function Platform({ radius = 2.1, reduced }: { radius?: number; reduced: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current && !reduced) ref.current.rotation.y += delta * 0.05;
  });
  return (
    <group position={[0, -0.7, 0]}>
      {/* Disco principal */}
      <mesh ref={ref} receiveShadow>
        <cylinderGeometry args={[radius, radius * 1.05, 0.08, 64]} />
        <meshStandardMaterial
          color="#0e1614"
          roughness={0.25}
          metalness={0.7}
          emissive="#46d373"
          emissiveIntensity={0.06}
        />
      </mesh>
      {/* Anel brilhante sob o disco */}
      <mesh position={[0, -0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 1.08, radius * 1.18, 64]} />
        <meshBasicMaterial color="#ffb040" transparent opacity={0.55} side={THREE.DoubleSide} />
      </mesh>
      {/* Halo radial no chão */}
      <mesh position={[0, -0.07, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.1, radius * 1.6, 64]} />
        <meshBasicMaterial color="#46d373" transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/* ---------- Grade holográfica no chão ---------- */
function HoloGrid() {
  return (
    <gridHelper
      args={[18, 36, '#1f3b2c', '#0c1a14']}
      position={[0, -0.74, 0]}
    >
      <meshBasicMaterial attach="material" transparent opacity={0.4} />
    </gridHelper>
  );
}

/* ---------- Partículas em espiral ---------- */
function SpiralParticles({ count = 220 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.5 + Math.random() * 2.8;
      const height = (Math.random() - 0.3) * 2.4;
      p[i * 3] = Math.cos(angle) * radius;
      p[i * 3 + 1] = height;
      p[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return p;
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.08;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += delta * 0.25;
      if (arr[i * 3 + 1] > 2.2) arr[i * 3 + 1] = -0.5;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
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
        size={0.04}
        color="#ffb040"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ---------- Spots que orbitam (luz cinema) ---------- */
function MovingLights({ reduced }: { reduced: boolean }) {
  const a = useRef<THREE.PointLight>(null);
  const b = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    if (reduced) return;
    const t = state.clock.elapsedTime;
    if (a.current) {
      a.current.position.x = Math.cos(t * 0.6) * 3.4;
      a.current.position.z = Math.sin(t * 0.6) * 3.4;
    }
    if (b.current) {
      b.current.position.x = Math.cos(t * 0.6 + Math.PI) * 3.4;
      b.current.position.z = Math.sin(t * 0.6 + Math.PI) * 3.4;
    }
  });
  return (
    <>
      <pointLight ref={a} position={[3, 2, 0]} intensity={2.6} color="#ffb040" distance={9} decay={2} />
      <pointLight ref={b} position={[-3, 2, 0]} intensity={2.2} color="#46d373" distance={9} decay={2} />
    </>
  );
}

/* ---------- Cena cheia ---------- */
function Stage({
  followRef,
  caioTex,
  sandersonTex,
  reduced,
}: {
  followRef: Follow;
  caioTex: THREE.Texture;
  sandersonTex: THREE.Texture;
  reduced: boolean;
}) {
  const { size, camera } = useThree();
  const isNarrow = size.width < 640;
  // Avatares são 3:1 portrait (plano 0.6x1.8). Base encosta na plataforma (-0.7).
  const spread = isNarrow ? 0.45 : 0.85;       // distância horizontal do centro
  const avatarScale = isNarrow ? 0.8 : 1.05;    // avatar desktop ~2.0 alto, mobile ~1.45
  const avatarY = 0.28;                          // base ≈ plataforma
  const caioPos: [number, number, number] = [-spread, avatarY, 0.2];
  const sandPos: [number, number, number] = [spread, avatarY, 0.4];

  // Aponta a câmera para o centro do palco (uma vez por mount/resize efetivo)
  useEffect(() => {
    camera.lookAt(0, 0.3, 0);
  }, [camera, size.width, size.height]);

  return (
    <>
      <ambientLight intensity={0.55} />
      <MovingLights reduced={reduced} />
      <Platform radius={isNarrow ? 1.6 : 2.2} reduced={reduced} />
      <HoloGrid />
      <AvatarBillboard
        texture={caioTex}
        position={caioPos}
        scale={avatarScale}
        idlePhase={0}
        followRef={followRef}
        reduced={reduced}
      />
      <AvatarBillboard
        texture={sandersonTex}
        position={sandPos}
        scale={avatarScale}
        idlePhase={1.3}
        followRef={followRef}
        reduced={reduced}
      />
      {!reduced && <SpiralParticles count={isNarrow ? 120 : 220} />}
    </>
  );
}

/* ---------- Carrega texturas via R3F nativo (Suspense) ---------- */
function StageInner({ followRef, reduced }: { followRef: Follow; reduced: boolean }) {
  const [caioTex, sandersonTex] = useLoader(THREE.TextureLoader, [avatarCaio, avatarSanderson]);
  // Configura as texturas (alpha + mip lineares p/ PNG com transparência suave)
  useMemo(() => {
    [caioTex, sandersonTex].forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      t.needsUpdate = true;
    });
  }, [caioTex, sandersonTex]);
  return (
    <Stage
      followRef={followRef}
      caioTex={caioTex}
      sandersonTex={sandersonTex}
      reduced={reduced}
    />
  );
}

export function AvatarStage() {
  const [reduced, setReduced] = useState(false);
  const followRef = useRef({ x: 0, y: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);

  // Detecta reduced-motion uma vez
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
  }, []);

  // Pointer (mouse/touch) → followRef normalizado [-1, 1]
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      followRef.current.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      followRef.current.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const onLeave = () => {
      followRef.current.x = 0;
      followRef.current.y = 0;
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div className="avatar-stage" ref={wrapRef}>
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 1.1, 5.6], fov: 38 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          style={{ background: 'transparent' }}
          frameloop={reduced ? 'demand' : 'always'}
        >
          <StageInner followRef={followRef} reduced={reduced} />
        </Canvas>
      </Suspense>
    </div>
  );
}
