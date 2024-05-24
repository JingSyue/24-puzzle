import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

export default function ElfModel({ modelName }) {
  const { scene } = useGLTF(`/models/${modelName}.glb`);
  return (
    <Canvas style={{ height: '300px', width: '300px' }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <primitive object={scene} scale={1} />
      <OrbitControls />
    </Canvas>
  );
}
