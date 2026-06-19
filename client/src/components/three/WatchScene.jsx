import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Ring, Torus, Cylinder, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function WatchModel({ scrollY = 0 }) {
  const groupRef = useRef();
  const innerRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.3 + scrollY * 0.001;
      groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
    }
    if (innerRef.current) {
      innerRef.current.rotation.z = -t * 0.5;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
      <group ref={groupRef} scale={1.4}>
        {/* Watch case */}
        <Cylinder args={[0.9, 0.9, 0.18, 64]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#2a2a2a" metalness={0.95} roughness={0.05} />
        </Cylinder>

        {/* Watch bezel */}
        <Ring args={[0.82, 0.98, 64]} position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="var(--accent)" metalness={1} roughness={0.1} />
        </Ring>

        {/* Watch dial */}
        <Cylinder args={[0.8, 0.8, 0.01, 64]} position={[0, 0.1, 0]}>
          <meshStandardMaterial color="#0a0a0a" metalness={0.3} roughness={0.8} />
        </Cylinder>

        {/* Hour markers */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const x = Math.sin(angle) * 0.65;
          const z = Math.cos(angle) * 0.65;
          return (
            <Cylinder key={i} args={[0.025, 0.025, 0.04, 8]} position={[x, 0.12, z]} rotation={[Math.PI / 2, 0, 0]}>
              <meshStandardMaterial color="var(--accent)" metalness={1} roughness={0.1} emissive="var(--accent)" emissiveIntensity={0.3} />
            </Cylinder>
          );
        })}

        {/* Crown */}
        <Cylinder args={[0.06, 0.06, 0.15, 16]} position={[0.97, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color="var(--accent)" metalness={1} roughness={0.1} />
        </Cylinder>

        {/* Watch strap - top */}
        <mesh position={[0, -0.05, -1.1]}>
          <boxGeometry args={[0.6, 0.12, 1.2]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.1} roughness={0.9} />
        </mesh>

        {/* Watch strap - bottom */}
        <mesh position={[0, -0.05, 1.1]}>
          <boxGeometry args={[0.6, 0.12, 1.2]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.1} roughness={0.9} />
        </mesh>

        {/* Rotating inner ring (seconds) */}
        <group ref={innerRef}>
          <Ring args={[0.58, 0.65, 64]} position={[0, 0.115, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#888" metalness={0.8} roughness={0.3} />
          </Ring>
        </group>

        {/* Ambient glow */}
        <pointLight position={[0, 2, 0]} intensity={0.5} color="var(--accent)" />
      </group>
    </Float>
  );
}

function Particles() {
  const particles = useRef();
  const count = 80;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
  }

  useFrame((state) => {
    if (particles.current) {
      particles.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={particles}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="var(--accent)" transparent opacity={0.6} />
    </points>
  );
}

export default function WatchScene({ height = '100%' }) {
  return (
    <div style={{ width: '100%', height }} className="relative">
      <Canvas
        camera={{ position: [0, 0.5, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
          <directionalLight position={[-5, -3, -5]} intensity={0.5} color="var(--accent)" />
          <pointLight position={[0, 3, 0]} intensity={1} color="var(--accent)" />
          <WatchModel />
          <Particles />
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  );
}
