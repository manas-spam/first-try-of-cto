'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Sphere, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import { useAudio } from '@/hooks/useAudio'

interface GlobeToIndiaTransitionProps {
  onComplete: () => void
  isActive: boolean
}

function EarthGlobe({ progress }: { progress: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { userSettings } = useAppStore()
  
  // India coordinates (lat: 20.5937, lon: 78.9629)
  const indiaPosition = useMemo(() => {
    const lat = 20.5937 * (Math.PI / 180)
    const lon = 78.9629 * (Math.PI / 180)
    const radius = 2
    return new THREE.Vector3(
      radius * Math.cos(lat) * Math.cos(lon),
      radius * Math.sin(lat),
      radius * Math.cos(lat) * Math.sin(lon)
    )
  }, [])

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Rotate towards India as progress increases
      const targetRotation = progress * Math.PI
      meshRef.current.rotation.y += (targetRotation - meshRef.current.rotation.y) * 0.05
      
      // Gentle rotation when not transitioning
      if (progress === 0 && !userSettings.ecoMode) {
        meshRef.current.rotation.y += delta * 0.05
      }
    }
  })

  return (
    <Sphere ref={meshRef} args={[2, 64, 64]}>
      <meshStandardMaterial
        color="#4A90E2"
        wireframe={userSettings.ecoMode}
        roughness={0.7}
        metalness={0.3}
      />
    </Sphere>
  )
}

function IndiaHighlight({ progress }: { progress: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { userSettings } = useAppStore()
  
  // Simplified India shape (approximation)
  const indiaShape = useMemo(() => {
    const shape = new THREE.Shape()
    // Create a simplified outline of India
    shape.moveTo(-0.3, 0.8)
    shape.quadraticCurveTo(-0.5, 0.3, -0.4, 0)
    shape.quadraticCurveTo(-0.3, -0.3, 0, -0.4)
    shape.quadraticCurveTo(0.3, -0.3, 0.4, 0)
    shape.quadraticCurveTo(0.5, 0.3, 0.3, 0.8)
    shape.quadraticCurveTo(0, 0.9, -0.3, 0.8)
    return shape
  }, [])

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Pulsing effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1 * progress
      meshRef.current.scale.setScalar(scale)
      
      // Emission based on progress
      const material = meshRef.current.material as THREE.MeshStandardMaterial
      material.emissiveIntensity = progress * 0.3
    }
  })

  return (
    <group
      position={[
        Math.cos(78.9629 * (Math.PI / 180)) * Math.cos(20.5937 * (Math.PI / 180)) * 2.1,
        Math.sin(20.5937 * (Math.PI / 180)) * 2.1,
        Math.sin(78.9629 * (Math.PI / 180)) * Math.cos(20.5937 * (Math.PI / 180)) * 2.1
      ]}
    >
      <mesh ref={meshRef} rotation={[0, -78.9629 * (Math.PI / 180), 0]}>
        <extrudeGeometry
          args={[indiaShape, { depth: 0.1, bevelEnabled: false }]}
        />
        <meshStandardMaterial
          color="#FF6B35"
          emissive="#FF6B35"
          emissiveIntensity={0}
          transparent
          opacity={progress}
        />
      </mesh>
    </group>
  )
}

function ParallaxLayers({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const { userSettings } = useAppStore()
  
  const layers = useMemo(() => {
    return Array.from({ length: 3 }, (_, i) => ({
      count: 50 + i * 20,
      radius: 2.5 + i * 0.5,
      speed: 0.001 + i * 0.0005,
      color: ['#FFD700', '#FF6B35', '#C44569'][i]
    }))
  }, [])

  useFrame((state, delta) => {
    if (groupRef.current && !userSettings.ecoMode) {
      groupRef.current.rotation.y += delta * 0.02
    }
  })

  if (userSettings.ecoMode) return null

  return (
    <group ref={groupRef}>
      {layers.map((layer, layerIndex) => (
        <group key={layerIndex}>
          {Array.from({ length: layer.count }, (_, i) => {
            const angle = (i / layer.count) * Math.PI * 2
            const height = (Math.random() - 0.5) * 4
            
            return (
              <mesh
                key={i}
                position={[
                  Math.cos(angle) * layer.radius,
                  height,
                  Math.sin(angle) * layer.radius
                ]}
              >
                <sphereGeometry args={[0.01, 4, 4]} />
                <meshStandardMaterial
                  color={layer.color}
                  emissive={layer.color}
                  emissiveIntensity={0.5 * progress}
                  transparent
                  opacity={0.6 * progress}
                />
              </mesh>
            )
          })}
        </group>
      ))}
    </group>
  )
}

function CameraController({ progress }: { progress: number }) {
  const { camera } = useThree()
  
  useFrame(() => {
    // Smooth camera transition from global view to India-focused view
    const startZ = 5
    const endZ = 2.5
    
    const z = startZ + (endZ - startZ) * progress
    const y = 0 + (0.5) * progress * Math.sin(progress * Math.PI)
    
    camera.position.z = z
    camera.position.y = y
    camera.lookAt(0, 0, 0)
  })

  return null
}

export default function GlobeToIndiaTransition({ onComplete, isActive }: GlobeToIndiaTransitionProps) {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const { playSound } = useAudio()
  const { userSettings } = useAppStore()
  const scrollYRef = useRef(0)

  useEffect(() => {
    if (!isActive) {
      setProgress(0)
      setIsComplete(false)
      return
    }

    const handleScroll = () => {
      scrollYRef.current = window.scrollY
      const maxScroll = window.innerHeight
      const newProgress = Math.min(scrollYRef.current / maxScroll, 1)
      setProgress(newProgress)

      // Play sound at specific progress points
      if (newProgress > 0.25 && newProgress < 0.26) {
        playSound('navigation')
      }
      if (newProgress > 0.75 && newProgress < 0.76) {
        playSound('navigation')
      }

      if (newProgress >= 1 && !isComplete) {
        setIsComplete(true)
        setTimeout(() => {
          onComplete()
        }, 500)
      }
    }

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY * 0.001
      scrollYRef.current = Math.max(0, Math.min(scrollYRef.current + delta * 100, window.innerHeight))
      window.scrollTo(0, scrollYRef.current)
      handleScroll()
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('wheel', handleWheel)
    }
  }, [isActive, isComplete, onComplete, playSound])

  if (!isActive) return null

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-black via-blue-950 to-orange-950 z-40">
      <div className="w-full h-screen">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          gl={{ antialias: !userSettings.ecoMode }}
          dpr={userSettings.ecoMode ? 1 : window.devicePixelRatio}
        >
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
          
          <EarthGlobe progress={progress} />
          <IndiaHighlight progress={progress} />
          <ParallaxLayers progress={progress} />
          
          <CameraController progress={progress} />
          
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={progress === 0}
            autoRotate={progress === 0}
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: progress < 0.9 ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col items-center space-y-2">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-bounce" />
          </div>
          <p className="text-sm font-light">Scroll to explore India</p>
        </div>
      </motion.div>

      {/* Progress Indicator */}
      <div className="absolute top-8 left-8 right-8">
        <div className="max-w-md mx-auto">
          <div className="h-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
              initial={{ width: "0%" }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
          <p className="text-white/60 text-xs mt-2 text-center">
            {progress < 0.33 && "Discovering the subcontinent..."}
            {progress >= 0.33 && progress < 0.66 && "Approaching India..."}
            {progress >= 0.66 && "Entering the land of diversity..."}
          </p>
        </div>
      </div>
    </div>
  )
}