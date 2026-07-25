import { Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr, AdaptiveEvents, Preload } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import VoxelNode from './VoxelNode'
import NetworkLinks, { type NetworkLink } from './NetworkLinks'
import { CATEGORIES } from '@/data/projects'

// 6 voxel nodes positioned to form a 3D constellation matrix.
// Each node carries one category color, so the scene reads as the org's
// multi-direction portfolio rather than a single bridge.
interface NodeSpec {
  pos: [number, number, number]
  color: string
  seed: number
}

const NODES: Record<string, NodeSpec> = {
  rendering:   { pos: [-2.4,  1.1, -0.4], color: CATEGORIES[0].color, seed: 7 },
  crossplay:   { pos: [ 2.4,  1.1, -0.4], color: CATEGORIES[1].color, seed: 21 },
  performance: { pos: [-2.6, -0.9,  0.9], color: CATEGORIES[2].color, seed: 41 },
  ai:          { pos: [ 2.6, -0.9,  0.9], color: CATEGORIES[3].color, seed: 67 },
  launcher:    { pos: [ 0.0,  1.9,  1.3], color: CATEGORIES[4].color, seed: 89 },
  meta:        { pos: [ 0.0, -1.6, -1.1], color: CATEGORIES[5].color, seed: 113 },
}

// Constellation edges — forms a connected mesh, not a star topology.
const LINKS: NetworkLink[] = [
  { from: NODES.rendering.pos,   to: NODES.crossplay.pos,   color: '#bef264', pulses: 3 },
  { from: NODES.rendering.pos,   to: NODES.performance.pos, color: '#bef264', pulses: 2 },
  { from: NODES.rendering.pos,   to: NODES.meta.pos,        color: '#bef264', pulses: 2 },
  { from: NODES.crossplay.pos,   to: NODES.ai.pos,          color: '#fb923c', pulses: 3 },
  { from: NODES.crossplay.pos,   to: NODES.launcher.pos,    color: '#fb923c', pulses: 2 },
  { from: NODES.crossplay.pos,   to: NODES.meta.pos,        color: '#fb923c', pulses: 2 },
  { from: NODES.performance.pos, to: NODES.ai.pos,          color: '#a78bfa', pulses: 2 },
  { from: NODES.performance.pos, to: NODES.meta.pos,        color: '#a78bfa', pulses: 2 },
  { from: NODES.ai.pos,          to: NODES.launcher.pos,    color: '#fb7185', pulses: 2 },
  { from: NODES.launcher.pos,    to: NODES.meta.pos,        color: '#38bdf8', pulses: 2 },
]

function Rig() {
  // Slow orbit + mouse parallax using R3F normalized pointer.
  useFrame((state) => {
    const px = state.pointer.x
    const py = state.pointer.y
    state.camera.position.x += (px * 1.4 - state.camera.position.x) * 0.035
    state.camera.position.y += (0.4 + py * 0.5 - state.camera.position.y) * 0.035
    state.camera.lookAt(0, 0, 0)
    const t = state.clock.elapsedTime
    state.camera.position.z = 7.5 + Math.sin(t * 0.07) * 0.5
  })
  return null
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.32} color="#a8b8e8" />
      <hemisphereLight args={['#b8d4ff', '#1a1320', 0.45]} />
      <directionalLight position={[5, 8, 6]} intensity={0.9} color="#ffffff" />
      {/* Per-node accent lights to make each cluster glow */}
      <pointLight position={[-2.4, 1.1, 1.5]} intensity={2.2} color="#bef264" distance={9} />
      <pointLight position={[2.4, 1.1, 1.5]}  intensity={2.2} color="#fb923c" distance={9} />
      <pointLight position={[-2.6, -0.9, 2]}  intensity={1.8} color="#a78bfa" distance={9} />
      <pointLight position={[2.6, -0.9, 2]}   intensity={1.8} color="#fb7185" distance={9} />
      <pointLight position={[0, 2.5, 2]}      intensity={1.6} color="#38bdf8" distance={9} />
      <pointLight position={[0, -2, 1]}       intensity={1.6} color="#e879f9" distance={9} />
    </>
  )
}

interface ConstellationSceneProps {
  className?: string
  enablePostprocessing?: boolean
}

export default function ConstellationScene({
  className,
  enablePostprocessing = true,
}: ConstellationSceneProps) {
  const isMobile =
    typeof window !== 'undefined' &&
    (window.matchMedia('(max-width: 768px)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  return (
    <div className={className} aria-hidden="true">
      <Canvas
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        camera={{ position: [0, 0.4, 7.5], fov: 44, near: 0.1, far: 100 }}
        style={{ width: '100%', height: '100%' }}
      >
        <fog attach="fog" args={['#0c0e13', 9, 19]} />
        <Suspense fallback={null}>
          <Lights />
          <VoxelNode position={NODES.rendering.pos}   color={NODES.rendering.color}   count={isMobile ? 9 : 14} seed={NODES.rendering.seed}   scale={1} rotationSpeed={0.06}  floatSpeed={0.42} />
          <VoxelNode position={NODES.crossplay.pos}   color={NODES.crossplay.color}   count={isMobile ? 9 : 14} seed={NODES.crossplay.seed}   scale={1} rotationSpeed={-0.06} floatSpeed={0.38} />
          <VoxelNode position={NODES.performance.pos} color={NODES.performance.color} count={isMobile ? 9 : 14} seed={NODES.performance.seed} scale={1} rotationSpeed={0.05}  floatSpeed={0.45} />
          <VoxelNode position={NODES.ai.pos}          color={NODES.ai.color}          count={isMobile ? 9 : 14} seed={NODES.ai.seed}          scale={1} rotationSpeed={-0.05} floatSpeed={0.4} />
          <VoxelNode position={NODES.launcher.pos}    color={NODES.launcher.color}    count={isMobile ? 9 : 14} seed={NODES.launcher.seed}    scale={1} rotationSpeed={0.04}  floatSpeed={0.5} />
          <VoxelNode position={NODES.meta.pos}        color={NODES.meta.color}        count={isMobile ? 9 : 14} seed={NODES.meta.seed}        scale={1} rotationSpeed={-0.04} floatSpeed={0.36} />
          <NetworkLinks links={LINKS} />
          <Rig />
          {enablePostprocessing && !isMobile && (
            <EffectComposer multisampling={2} enableNormalPass={false}>
              <Bloom
                intensity={0.9}
                luminanceThreshold={0.2}
                luminanceSmoothing={0.5}
                mipmapBlur
                radius={0.7}
              />
              <Vignette eskil={false} offset={0.2} darkness={0.82} />
            </EffectComposer>
          )}
          <Preload all />
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
        </Suspense>
      </Canvas>
    </div>
  )
}
