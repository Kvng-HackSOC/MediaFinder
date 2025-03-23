// src/components/ThreeJsDemo.js
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture, Text } from '@react-three/drei';
import * as THREE from 'three';

// Interactive 3D Text component
const InteractiveText = ({ text, position, rotation, onClick }) => {
  const textRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame(() => {
    if (textRef.current) {
      textRef.current.rotation.y += 0.005;
      
      if (hovered) {
        textRef.current.material.color.lerp(new THREE.Color('#ffb470'), 0.1);
      } else {
        textRef.current.material.color.lerp(new THREE.Color('#5e8bff'), 0.1);
      }
    }
  });
  
  return (
    <Text
      ref={textRef}
      position={position}
      rotation={rotation}
      fontSize={0.5}
      color="#5e8bff"
      maxWidth={2}
      lineHeight={1}
      letterSpacing={0.02}
      textAlign="center"
      font="/fonts/Inter-Bold.woff"
      anchorX="center"
      anchorY="middle"
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
    >
      {text}
    </Text>
  );
};

// Animated floating sphere
const FloatingSphere = ({ position, color, size = 1, speed = 1 }) => {
  const meshRef = useRef();
  const [hover, setHover] = useState(false);
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    meshRef.current.position.y += Math.sin(t * speed) * 0.002;
    meshRef.current.rotation.x = t * 0.2;
    meshRef.current.rotation.z = t * 0.1;
    
    if (hover) {
      meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, 1.2, 0.1);
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, 1.2, 0.1);
      meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, 1.2, 0.1);
    } else {
      meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, 1, 0.1);
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, 1, 0.1);
      meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, 1, 0.1);
    }
  });
  
  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial
        color={color}
        metalness={0.3}
        roughness={0.4}
        envMapIntensity={1}
      />
    </mesh>
  );
};

// Main interactive 3D scene
const Scene = ({ onItemClick }) => {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} color="#5ad4a6" intensity={0.5} />
      
      <FloatingSphere position={[-3, 0, 0]} color="#5e8bff" size={0.8} speed={0.7} />
      <FloatingSphere position={[3, 0, -2]} color="#5ad4a6" size={1.2} speed={0.5} />
      <FloatingSphere position={[0, 0, -5]} color="#ffb470" size={1.5} speed={0.3} />
      
      <InteractiveText
        text="Click to Explore Images"
        position={[0, 2, 0]}
        rotation={[0, 0, 0]}
        onClick={() => onItemClick('images')}
      />
      
      <InteractiveText
        text="3D Models Gallery"
        position={[-2.5, 0.5, 0]}
        rotation={[0, 0.3, 0]}
        onClick={() => onItemClick('models')}
      />
      
      <InteractiveText
        text="Illustrations & Graphics"
        position={[2.5, 0.5, 0]}
        rotation={[0, -0.3, 0]}
        onClick={() => onItemClick('illustrations')}
      />
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        autoRotate 
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
      />
    </>
  );
};

// Main component export
const ThreeJsDemo = ({ onItemSelect }) => {
  const handleItemClick = (itemType) => {
    console.log(`Selected: ${itemType}`);
    if (onItemSelect) onItemSelect(itemType);
  };
  
  return (
    <div style={{ width: '100%', height: '500px', position: 'relative' }}>
      <Canvas camera={{ position: [0, 1, 6], fov: 60 }}>
        <Scene onItemClick={handleItemClick} />
      </Canvas>
      
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        padding: '10px 15px',
        background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: '8px',
        fontSize: '14px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        Drag to rotate • Click text to explore
      </div>
    </div>
  );
};

export default ThreeJsDemo;