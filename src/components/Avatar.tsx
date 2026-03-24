import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Mic } from 'lucide-react';

interface AvatarProps {
  position: [number, number, number];
  color: string;
  name: string;
  isSpeaking?: boolean;
  isRaisingHand?: boolean;
  reaction?: string | null;
}

export function Avatar({ position, color, name, isSpeaking, isRaisingHand, reaction }: AvatarProps) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const armRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Breathing animation
    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.02;

    // Speaking animation (head bob)
    if (isSpeaking && headRef.current) {
      headRef.current.position.y = 1.75 + Math.sin(state.clock.elapsedTime * 10) * 0.05;
    }

    // Hand raising animation
    if (armRef.current) {
      const targetRotation = isRaisingHand ? -Math.PI * 0.8 : 0;
      armRef.current.rotation.z = THREE.MathUtils.lerp(armRef.current.rotation.z, targetRotation, 0.1);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Body */}
      <Cylinder args={[0.2, 0.15, 0.8]} position={[0, 1.2, 0]}>
        <meshPhongMaterial color={color} />
      </Cylinder>
      
      {/* Head */}
      <Sphere ref={headRef} args={[0.2, 16, 16]} position={[0, 1.75, 0]}>
        <meshPhongMaterial color="#ffdbac" />
      </Sphere>

      {/* Arms */}
      <group position={[-0.3, 1.4, 0]}>
        <Cylinder args={[0.06, 0.06, 0.7]} rotation={[0, 0, 0.2]}>
          <meshPhongMaterial color={color} />
        </Cylinder>
      </group>
      
      <group ref={armRef} position={[0.3, 1.4, 0]}>
        <Cylinder args={[0.06, 0.06, 0.7]} position={[0, 0.3, 0]} rotation={[0, 0, -0.2]}>
          <meshPhongMaterial color={color} />
        </Cylinder>
      </group>

      {/* Legs */}
      <Cylinder args={[0.08, 0.08, 0.8]} position={[-0.15, 0.4, 0]}>
        <meshPhongMaterial color="#111111" />
      </Cylinder>
      <Cylinder args={[0.08, 0.08, 0.8]} position={[0.15, 0.4, 0]}>
        <meshPhongMaterial color="#111111" />
      </Cylinder>

      {/* Name Tag & Indicators */}
      <Html position={[0, 2.2, 0]} center distanceFactor={10}>
        <div className="flex flex-col items-center gap-1 pointer-events-none select-none">
          {reaction && (
            <div className="text-2xl animate-bounce mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
              {reaction}
            </div>
          )}
          {isSpeaking && (
            <div className="bg-[#00f2fe] p-1 rounded-full shadow-[0_0_10px_#00f2fe] animate-bounce">
              <Mic className="w-2 h-2 text-black" />
            </div>
          )}
          <div className={`px-2 py-0.5 rounded-md backdrop-blur-md border border-white/20 flex items-center gap-2 ${isSpeaking ? 'bg-[#00f2fe]/20 border-[#00f2fe]/40' : 'bg-black/40'}`}>
            <span className="text-[8px] font-bold text-white uppercase tracking-widest whitespace-nowrap">
              {name}
            </span>
            {isRaisingHand && (
              <span className="text-[8px] animate-pulse">✋</span>
            )}
          </div>
        </div>
      </Html>
    </group>
  );
}
