import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, Float, Text, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { Avatar } from './Avatar';

interface ClassroomSceneProps {
  taskType: 'cube' | 'molecule' | 'globe' | 'dna';
  students: Array<{ id: number; name: string; color: string; isSpeaking: boolean; isRaisingHand: boolean; reaction?: string | null }>;
  focusedStudentId: number | null;
  myReaction?: string | null;
}

function CentralObject({ type }: { type: 'cube' | 'molecule' | 'globe' | 'dna' }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x += 0.005;
    }
  });

  if (type === 'cube') {
    return (
      <mesh ref={meshRef} position={[0, 2.5, 0]}>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshPhongMaterial color="#00f2fe" emissive="#003366" transparent opacity={0.8} />
      </mesh>
    );
  }

  if (type === 'molecule') {
    return (
      <group position={[0, 2.5, 0]}>
        <mesh>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshPhongMaterial color="#ff004c" />
        </mesh>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[Math.cos(i * 2) * 0.8, Math.sin(i * 2) * 0.8, 0]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshPhongMaterial color="#00f2fe" />
          </mesh>
        ))}
      </group>
    );
  }

  if (type === 'globe') {
    return (
      <mesh ref={meshRef} position={[0, 2.5, 0]}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshPhongMaterial color="#2244ff" wireframe />
      </mesh>
    );
  }

  if (type === 'dna') {
    return (
      <group position={[0, 2.5, 0]} rotation={[0, 0, Math.PI / 4]}>
        {Array.from({ length: 10 }).map((_, i) => (
          <group key={i} position={[0, i * 0.4 - 2, 0]} rotation={[0, i * 0.5, 0]}>
            <mesh position={[0.6, 0, 0]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshPhongMaterial color="#ff004c" />
            </mesh>
            <mesh position={[-0.6, 0, 0]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshPhongMaterial color="#00f2fe" />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.02, 0.02, 1.2]} />
              <meshPhongMaterial color="#ffffff" transparent opacity={0.3} />
            </mesh>
          </group>
        ))}
      </group>
    );
  }

  return null;
}

function CameraRig({ focusedStudentId, students }: { focusedStudentId: number | null, students: ClassroomSceneProps['students'] }) {
  useFrame((state) => {
    const targetPosition = new THREE.Vector3(0, 4, 10);
    const targetLookAt = new THREE.Vector3(0, 2, 0);

    if (focusedStudentId !== null) {
      const index = students.findIndex(s => s.id === focusedStudentId);
      if (index !== -1) {
        const x = index % 2 === 0 ? -4.5 : 4.5;
        const z = index < 2 ? -2 : 2;
        targetPosition.set(x * 1.2, 2.5, z + 4);
        targetLookAt.set(x, 1.5, z);
      }
    }

    state.camera.position.lerp(targetPosition, 0.05);
    state.camera.lookAt(targetLookAt);
  });
  return null;
}

export function ClassroomScene({ taskType, students, focusedStudentId, myReaction }: ClassroomSceneProps) {
  return (
    <div className="w-full h-full bg-[#020205]">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 4, 10]} fov={60} />
        <CameraRig focusedStudentId={focusedStudentId} students={students} />
        <OrbitControls 
          enablePan={false} 
          maxPolarAngle={Math.PI / 2.1} 
          minDistance={5} 
          maxDistance={20}
          makeDefault
        />
        
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        {/* Floating Platform */}
        <group position={[0, -0.1, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <cylinderGeometry args={[12, 10, 0.5, 6]} />
            <meshPhongMaterial color="#0a0a15" transparent opacity={0.9} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]}>
            <cylinderGeometry args={[12.2, 10.2, 0.2, 6]} />
            <meshPhongMaterial color="#00f2fe" emissive="#00f2fe" emissiveIntensity={2} wireframe />
          </mesh>
          
          {/* Energy Core */}
          <mesh position={[0, -2, 0]}>
            <sphereGeometry args={[2, 32, 32]} />
            <meshPhongMaterial color="#00f2fe" emissive="#00f2fe" emissiveIntensity={5} transparent opacity={0.1} />
          </mesh>
        </group>
        <gridHelper args={[24, 24, 0x00f2fe, 0x111111]} position={[0, 0.2, 0]} />

        {/* Floating Rocks/Debris for Game Feel */}
        {Array.from({ length: 20 }).map((_, i) => (
          <Float key={i} speed={2} rotationIntensity={2} floatIntensity={2}>
            <mesh position={[
              (Math.random() - 0.5) * 40,
              (Math.random() - 0.5) * 20 + 5,
              (Math.random() - 0.5) * 40
            ]}>
              <dodecahedronGeometry args={[Math.random() * 0.5]} />
              <meshPhongMaterial color="#1a1a2e" />
            </mesh>
          </Float>
        ))}

        {/* Digital Board */}
        <group position={[0, 3, -8]}>
          <mesh receiveShadow>
            <planeGeometry args={[12, 6]} />
            <meshPhongMaterial color="#001a33" emissive="#003366" side={THREE.DoubleSide} />
          </mesh>
          <Text
            position={[0, 0, 0.1]}
            fontSize={0.5}
            color="#00f2fe"
            font="https://fonts.gstatic.com/s/spacegrotesk/v13/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-g.woff"
          >
            VIRTUAL CLASSROOM
          </Text>
          <pointLight position={[0, 0, 1]} intensity={0.5} color="#00f2fe" />
        </group>

        {/* Students */}
        {students.map((student, index) => {
          const x = index % 2 === 0 ? -4.5 : 4.5;
          const z = index < 2 ? -2 : 2;
          return (
            <Avatar
              key={student.id}
              position={[x, 0, z]}
              color={student.color}
              name={student.name}
              isSpeaking={student.isSpeaking}
              isRaisingHand={student.isRaisingHand}
              reaction={student.reaction}
            />
          );
        })}

        {/* Desks */}
        {[-4.5, 4.5].map(x => (
          [-2, 2].map(z => (
            <group key={`${x}-${z}`} position={[x, 0.5, z + 0.5]}>
              <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
                <boxGeometry args={[2, 0.1, 1]} />
                <meshPhongMaterial color="#333333" />
              </mesh>
              {[-0.8, 0.8].map(lx => (
                [-0.4, 0.4].map(lz => (
                  <mesh key={`${lx}-${lz}`} position={[lx, 0, lz]} castShadow>
                    <cylinderGeometry args={[0.05, 0.05, 1]} />
                    <meshPhongMaterial color="#555555" />
                  </mesh>
                ))
              ))}
            </group>
          ))
        ))}

        {/* Central Lesson Object */}
        <CentralObject type={taskType} />

        {/* You (Teacher/Host) */}
        <Avatar
          position={[0, 0, 6]}
          color="#00f2fe"
          name="You (Teacher)"
          isSpeaking={false}
          isRaisingHand={false}
          reaction={myReaction}
        />

      </Canvas>
    </div>
  );
}
