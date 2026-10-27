'use client';
import { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Html, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

const VIEWS = {
  home: { pos: [0, 2.6, 7.5], look: [0, 1, 0] },
  diary: { pos: [-2.2, 2, 3.2], look: [-3, 1, 0] },
  data: { pos: [2.6, 2.2, 3.2], look: [3, 1.2, 0] },
  media: { pos: [0, 3, 1.5], look: [0, 3, -3.5] },
};

function CameraRig({ active, controls }) {
  const { camera } = useThree();
  const look = useRef(new THREE.Vector3(0, 1, 0));
  useFrame((_, dt) => {
    const v = VIEWS[active || 'home'];
    camera.position.lerp(new THREE.Vector3(...v.pos), Math.min(1, dt * 2.5));
    look.current.lerp(new THREE.Vector3(...v.look), Math.min(1, dt * 2.5));
    if (controls.current) { controls.current.target.copy(look.current); controls.current.update(); }
  });
  return null;
}

function Hot({ label, position, onClick, children }) {
  const [hover, setHover] = useState(false);
  return (
    <group position={position} scale={hover ? 1.07 : 1}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHover(false); document.body.style.cursor = 'auto'; }}
      onClick={(e) => { e.stopPropagation(); onClick(); }}>
      {children}
      <Html position={[0, 1.7, 0]} center distanceFactor={9}>
        <div className="ui px-3 py-1 rounded-full text-xs whitespace-nowrap glass animate-pulse" style={{ pointerEvents: 'none' }}>{label}</div>
      </Html>
    </group>
  );
}

function Avatar() {
  const ref = useRef();
  useFrame(({ clock }) => { if (ref.current) ref.current.position.y = Math.sin(clock.elapsedTime * 1.6) * 0.05; });
  // Swap this group for: const { scene } = useGLTF('/avatar.glb')  ->  <primitive object={scene} />
  return (
    <group ref={ref} position={[0, 0.2, 0.5]}>
      <mesh position={[0, 0.9, 0]}><capsuleGeometry args={[0.35, 0.8, 8, 16]} /><meshStandardMaterial color="#7c6cff" flatShading /></mesh>
      <mesh position={[0, 1.85, 0]}><icosahedronGeometry args={[0.32, 1]} /><meshStandardMaterial color="#f1c9a5" flatShading /></mesh>
      <mesh position={[0.12, 1.88, 0.28]}><sphereGeometry args={[0.04]} /><meshBasicMaterial color="#090d16" /></mesh>
      <mesh position={[-0.12, 1.88, 0.28]}><sphereGeometry args={[0.04]} /><meshBasicMaterial color="#090d16" /></mesh>
    </group>
  );
}

const SOCIAL = [
  ['instagram', '#e1306c', -3.2], ['youtube', '#ff2d2d', -1.1], ['facebook', '#4a7bff', 1.1], ['github', '#e6ebf5', 3.2],
];

export default function Scene3D({ active, onOpen, night, socials }) {
  const controls = useRef();
  return (
    <Canvas camera={{ position: [0, 2.6, 7.5], fov: 50 }} dpr={[1, 1.75]}>
      <color attach="background" args={[night ? '#05070d' : '#2a2140']} />
      <ambientLight intensity={night ? 0.25 : 0.7} color={night ? '#8fa8ff' : '#ffe2a8'} />
      <directionalLight position={[5, 8, 4]} intensity={night ? 0.35 : 1.4} color={night ? '#9db8ff' : '#ffd27a'} />
      {night ? <Stars radius={60} depth={40} count={2500} factor={4} fade speed={1} />
        : <mesh position={[8, 8, -14]}><sphereGeometry args={[1.6, 24, 24]} /><meshBasicMaterial color="#ffc94d" /></mesh>}
      <Environment preset={night ? 'night' : 'sunset'} />

      <mesh rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[7, 48]} /><meshStandardMaterial color="#10162a" /></mesh>
      <mesh position={[0, 3, -5]}><planeGeometry args={[14, 7]} /><meshStandardMaterial color="#141b33" /></mesh>

      <Avatar />

      <Hot label="Diary" position={[-3, 0, 0]} onClick={() => onOpen('diary')}>
        <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.4, 0.5, 1, 8]} /><meshStandardMaterial color="#3b2f63" flatShading /></mesh>
        <mesh position={[0, 1.1, 0]} rotation={[-0.4, 0, 0]}><boxGeometry args={[0.9, 0.12, 0.65]} /><meshStandardMaterial color="#a78bfa" emissive="#6d4aff" emissiveIntensity={0.5} /></mesh>
      </Hot>

      <Hot label="Data terminal" position={[3, 0, 0]} onClick={() => onOpen('data')}>
        <mesh position={[0, 0.55, 0]}><boxGeometry args={[1.8, 0.1, 0.9]} /><meshStandardMaterial color="#1e293b" /></mesh>
        <mesh position={[0, 1.3, -0.2]}><boxGeometry args={[1.2, 0.75, 0.06]} /><meshStandardMaterial color="#0b1220" emissive="#22d3ee" emissiveIntensity={0.6} /></mesh>
        {[-0.8, 0.8].map((x) => <mesh key={x} position={[x, 0.27, 0]}><boxGeometry args={[0.08, 0.55, 0.8]} /><meshStandardMaterial color="#334155" /></mesh>)}
      </Hot>

      <Hot label="Media" position={[0, 2.2, -4.2]} onClick={() => onOpen('media')}>
        <mesh><boxGeometry args={[3.4, 1.9, 0.1]} /><meshStandardMaterial color="#0b1220" emissive="#a855f7" emissiveIntensity={0.45} /></mesh>
        <mesh position={[0, 0, 0.06]}><planeGeometry args={[3.1, 1.6]} /><meshBasicMaterial color="#1a2342" /></mesh>
      </Hot>

      {SOCIAL.map(([k, c, x]) => (
        <Float key={k} speed={2} floatIntensity={0.6}>
          <Hot label={k} position={[x, 3.6, 0.5]} onClick={() => socials?.[k] && window.open(socials[k], '_blank', 'noopener')}>
            <mesh><octahedronGeometry args={[0.32]} /><meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.5} flatShading /></mesh>
          </Hot>
        </Float>
      ))}

      <OrbitControls ref={controls} enablePan={false} minDistance={3} maxDistance={11}
        minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2.1}
        minAzimuthAngle={-Math.PI / 3} maxAzimuthAngle={Math.PI / 3} />
      <CameraRig active={active} controls={controls} />
    </Canvas>
  );
}
