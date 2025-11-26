'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import { useAudio } from '@/hooks/useAudio'

function Mandala({ onMaterialReady }: { onMaterialReady: (material: THREE.ShaderMaterial | null) => void }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)
  
  // Create shader material
  useEffect(() => {
    if (meshRef.current) {
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          progress: { value: 0 },
          colorA: { value: new THREE.Color('#FFD700') },
          colorB: { value: new THREE.Color('#FF6B35') },
          colorC: { value: new THREE.Color('#C44569') },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform float progress;
          uniform vec3 colorA;
          uniform vec3 colorB;
          uniform vec3 colorC;
          varying vec2 vUv;

          #define PI 3.14159265359
          #define TAU 6.28318530718

          float kaleidoscope(vec2 uv, float segments) {
            float angle = atan(uv.y, uv.x);
            float radius = length(uv);
            float segmentAngle = TAU / segments;
            
            angle = mod(angle + time * 0.1, segmentAngle);
            if (angle > segmentAngle * 0.5) {
              angle = segmentAngle - angle;
            }
            
            return sin(angle * 8.0 + time) * cos(radius * 20.0 - time * 2.0);
          }

          float mandala(vec2 uv) {
            vec2 center = uv - 0.5;
            float radius = length(center);
            float angle = atan(center.y, center.x);
            
            float pattern = 0.0;
            pattern += sin(angle * 12.0 + time * 0.5) * 0.5 + 0.5;
            pattern += sin(radius * 30.0 - time * 2.0) * 0.5 + 0.5;
            pattern += kaleidoscope(center, 8.0) * 0.3;
            
            return pattern * (1.0 - radius * 2.0);
          }

          void main() {
            vec2 uv = vUv;
            
            float pattern = mandala(uv);
            pattern = smoothstep(0.3, 0.7, pattern);
            
            vec3 color = mix(colorA, colorB, pattern);
            color = mix(color, colorC, sin(time + uv.x * 10.0) * 0.5 + 0.5);
            
            float alpha = pattern * (0.3 + progress * 0.7);
            
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
      })
      
      materialRef.current = material
      onMaterialReady(material)
      meshRef.current.material = material
    }
  }, [onMaterialReady])

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value += delta
    }
  })

  return (
    <mesh ref={meshRef} rotation={[0, 0, Math.PI / 4]}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  )
}

function FloatingSpices() {
  const groupRef = useRef<THREE.Group>(null)
  const spices = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 2
      ] as [number, number, number],
      scale: 0.02 + Math.random() * 0.08,
      rotationSpeed: Math.random() * 0.02,
      floatSpeed: 0.5 + Math.random() * 1.5,
      color: ['#FF6B35', '#FFD700', '#C44569', '#2ECC71'][Math.floor(Math.random() * 4)]
    }))
  }, [])

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {spices.map((spice, i) => (
        <mesh
          key={i}
          position={spice.position}
          scale={spice.scale}
        >
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={spice.color}
            emissive={spice.color}
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
    </group>
  )
}

interface PreloaderProps {
  onComplete: () => void
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(true)
  const { playSound, isEnabled } = useAudio()
  const { userSettings } = useAppStore()
  const tablaIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const mandalaMaterialRef = useRef<THREE.ShaderMaterial | null>(null)

  // Ref to pass to Mandala component
  const mandalaProgressRef = useRef((material: THREE.ShaderMaterial | null) => {
    mandalaMaterialRef.current = material
  })

  useEffect(() => {
    // Simulate asset loading
    const loadingSequence = async () => {
      const steps = [
        { duration: 500, increment: 15 },
        { duration: 800, increment: 25 },
        { duration: 600, increment: 20 },
        { duration: 400, increment: 15 },
        { duration: 300, increment: 10 },
        { duration: 400, increment: 15 },
      ]

      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, step.duration))
        setProgress(prev => Math.min(prev + step.increment, 100))
      }

      setLoading(false)
      setTimeout(() => {
        onComplete()
      }, 500)
    }

    loadingSequence()
  }, [onComplete])

  useEffect(() => {
    // Tabla beat simulation
    if (isEnabled && loading) {
      const playTablaBeat = () => {
        // Simulate tabla sounds using Tone.js notes
        playSound('tabla')
      }

      tablaIntervalRef.current = setInterval(playTablaBeat, 400)
    }

    return () => {
      if (tablaIntervalRef.current) {
        clearInterval(tablaIntervalRef.current)
      }
    }
  }, [isEnabled, loading, playSound])

  // Update mandala progress
  useEffect(() => {
    if (mandalaMaterialRef.current) {
      mandalaMaterialRef.current.uniforms.progress.value = progress / 100
    }
  }, [progress])

  if (!loading) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="relative w-full h-full">
        {/* Three.js Canvas */}
        <Canvas
          camera={{ position: [0, 0, 1], fov: 75 }}
          gl={{ alpha: true, antialias: !userSettings.ecoMode }}
          dpr={userSettings.ecoMode ? 1 : window.devicePixelRatio}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[2, 2, 2]} intensity={0.8} />
          
          <Mandala onMaterialReady={mandalaProgressRef.current} />
          {!userSettings.ecoMode && <FloatingSpices />}
        </Canvas>

        {/* Progress Arc */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="rgba(255, 215, 0, 0.2)"
                strokeWidth="8"
                fill="none"
              />
              <motion.circle
                cx="64"
                cy="64"
                r="56"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: progress / 100 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                style={{
                  pathLength: progress / 100,
                  strokeDasharray: `${2 * Math.PI * 56}`,
                  strokeDashoffset: `${2 * Math.PI * 56 * (1 - progress / 100)}`
                }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFD700" />
                  <stop offset="50%" stopColor="#FF6B35" />
                  <stop offset="100%" stopColor="#C44569" />
                </linearGradient>
              </defs>
            </svg>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <motion.div
          className="absolute bottom-20 left-0 right-0 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-white text-lg font-light tracking-wide">
            {progress < 30 && "Initializing sensory experience..."}
            {progress >= 30 && progress < 60 && "Loading cultural patterns..."}
            {progress >= 60 && progress < 85 && "Calibrating atmospheric layers..."}
            {progress >= 85 && "Almost ready..."}
          </p>
        </motion.div>
      </div>
    </div>
  )
}