'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { useAppStore } from '@/store/useAppStore'

function Globe() {
  const meshRef = useRef<THREE.Mesh>(null)
  const userSettings = useAppStore((state) => state.userSettings)

  useFrame((state, delta) => {
    if (meshRef.current && !userSettings.ecoMode) {
      meshRef.current.rotation.y += delta * 0.1
    }
  })

  return (
    <Sphere ref={meshRef} args={[2, 64, 64]}>
      <meshStandardMaterial
        color="#0ea5e9"
        wireframe={userSettings.ecoMode}
        roughness={0.5}
        metalness={0.2}
      />
    </Sphere>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Globe />
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={10}
      />
    </>
  )
}

export default function GlobeViewer() {
  return (
    <div className="w-full h-[600px]">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <Scene />
      </Canvas>
    </div>
  )
}
