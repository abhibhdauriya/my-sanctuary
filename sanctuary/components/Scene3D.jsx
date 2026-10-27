'use client';
import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Text, MeshDistortMaterial, Sphere, Box, Cylinder } from '@react-three/drei';

function CyberGrid() {
  return (
    <gridHelper args={[60, 60, '#a855f7', '#1e1b4b']} position={[0, -2, 0]} />
  );
}

function HolographicCore({ onSelect }) {
  const meshRef = useRef();
  useFrame((state) => {
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2;
  });

  return (
    <group position={[0, 0, 0]} onClick={() => onSelect('about')}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[1.2, 0]} />
        <MeshDistortMaterial color="#06b6d4" speed={2} distort={0.3} roughness={0.1} metalness={0.9} wireframe />
      </mesh>
      <Sphere args={[0.6, 32, 32]}>
        <meshStandardMaterial color="#8b5cf6" emissive="#7c3aed" emissiveIntensity={2} />
      </Sphere>
      <Cylinder args={[1.5, 1.8, 0.4, 32]} position={[0, -1.8, 0]}>
        <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
      </Cylinder>
      <Text position={[0, -1.2, 0]} fontSize={0.25} color="#38bdf8" anchorX="center" anchorY="middle">
        ABHISHEK CORE
      </Text>
    </group>
  );
}

function InteractiveZone({ position, title, subtitle, color, type, onSelect }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onSelect(type)}
        className="cursor-pointer"
      >
        <Box args={[1.8, 1.2, 0.15]}>
          <meshStandardMaterial
            color={hovered ? '#ffffff' : '#0f172a'}
            emissive={color}
            emissiveIntensity={hovered ? 1.5 : 0.6}
            metalness={0.9}
            roughness={0.1}
          />
        </Box>
        <Text position={[0, 0.15, 0.1]} fontSize={0.2} color="#ffffff" anchorX="center" anchorY="middle">
          {title}
        </Text>
        <Text position={[0, -0.2, 0.1]} fontSize={0.12} color="#94a3b8" anchorX="center" anchorY="middle">
          {subtitle}
        </Text>
      </group>
    </Float>
  );
}

function SocialOrb({ position, label, color, url }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Float speed={3} rotationIntensity={1} floatIntensity={1.5}>
      <group
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => url && window.open(url, '_blank')}
      >
        <Sphere args={[0.4, 32, 32]}>
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 2.5 : 0.8}
            roughness={0.2}
          />
        </Sphere>
        <Text position={[0, -0.65, 0]} fontSize={0.18} color="#ffffff" anchorX="center" anchorY="middle">
          {label}
        </Text>
      </group>
    </Float>
  );
}

export default function Scene3D({ onSelectZone, content }) {
  const socials = content?.socials || {};

  return (
    <div className="w-full h-screen bg-[#05050a] relative select-none">
      <Canvas camera={{ position: [0, 2, 8.5], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#38bdf8" />
        <pointLight position={[-10, 5, -10]} intensity={1.2} color="#ec4899" />
        <CyberGrid />

        {/* Center Hologram Avatar / Core */}
        <HolographicCore onSelect={onSelectZone} />

        {/* 3 Main Interactive Portals */}
        <InteractiveZone
          position={[-3.5, 0.4, 0]}
          title="DIARY & REFLECTIONS"
          subtitle="Thoughts, Life Lessons & Vision"
          color="#a855f7"
          type="diary"
          onSelect={onSelectZone}
        />

        <InteractiveZone
          position={[3.5, 0.4, 0]}
          title="DATA & AUTOMATION"
          subtitle="Google Sheets & Streamlit Hub"
          color="#06b6d4"
          type="sheets"
          onSelect={onSelectZone}
        />

        <InteractiveZone
          position={[0, 2.5, -2]}
          title="MEDIA & CREATIVE HUB"
          subtitle="Videos, Photos & Highlights"
          color="#f43f5e"
          type="media"
          onSelect={onSelectZone}
        />

        {/* Floating Social Media Orbs */}
        <SocialOrb position={[-3.5, 2.6, -1]} label="Instagram" color="#e1306c" url={socials.instagram} />
        <SocialOrb position={[-1.2, 3.6, -1.5]} label="YouTube" color="#ff0000" url={socials.youtube} />
        <SocialOrb position={[1.2, 3.6, -1.5]} label="Facebook" color="#1877f2" url={socials.facebook} />
        <SocialOrb position={[3.5, 2.6, -1]} label="GitHub / Web" color="#10b981" url={socials.github} />

        <OrbitControls maxPolarAngle={Math.PI / 2 - 0.05} minDistance={4} maxDistance={14} enablePan={false} />
      </Canvas>
    </div>
  );
}
