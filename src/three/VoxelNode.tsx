import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface VoxelNodeProps {
  position: [number, number, number]
  color: string
  count?: number
  scale?: number
  seed?: number
  rotationSpeed?: number
  floatSpeed?: number
  label?: string
}

/** Deterministic pseudo-random for stable layouts across renders. */
function mulberry32(seed: number) {
  let s = seed >>> 0
  return function () {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * A compact voxel node — one cube cluster representing a tech direction
 * in the org constellation. Tighter and more crystalline than a "cloud":
 * cubes pack around a glowing core with deterministic placement.
 */
export default function VoxelNode({
  position,
  color,
  count = 14,
  scale = 1,
  seed = 1,
  rotationSpeed = 0.05,
  floatSpeed = 0.35,
}: VoxelNodeProps) {
  const group = useRef<THREE.Group>(null)

  const voxels = useMemo(() => {
    const rand = mulberry32(seed)
    const items: {
      pos: [number, number, number]
      size: number
      rot: [number, number, number]
      phase: number
    }[] = []
    for (let i = 0; i < count; i++) {
      // Tight spherical shell — smaller radius than MnMCP's clusters
      const theta = rand() * Math.PI * 2
      const phi = Math.acos(2 * rand() - 1)
      const r = (0.35 + rand() * 0.55) * scale
      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi)
      const size = (0.14 + rand() * 0.16) * scale
      items.push({
        pos: [x, y, z],
        size,
        rot: [rand() * Math.PI, rand() * Math.PI, rand() * Math.PI],
        phase: rand() * Math.PI * 2,
      })
    }
    return items
  }, [count, scale, seed])

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        roughness: 0.4,
        metalness: 0.3,
        emissive: new THREE.Color(color).multiplyScalar(0.45),
        emissiveIntensity: 0.7,
      }),
    [color],
  )

  const edgesMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color(color).multiplyScalar(1.6),
        transparent: true,
        opacity: 0.55,
      }),
    [color],
  )

  useFrame((state, delta) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    group.current.rotation.y += delta * rotationSpeed
    group.current.rotation.x = Math.sin(t * 0.18) * 0.1
    group.current.position.y = position[1] + Math.sin(t * floatSpeed) * 0.14
    group.current.position.x = position[0]
    group.current.position.z = position[2]
  })

  return (
    <group ref={group} position={position}>
      {voxels.map((v, i) => (
        <Voxel key={i} {...v} material={material} edgesMaterial={edgesMaterial} />
      ))}
      {/* Core glow */}
      <mesh>
        <sphereGeometry args={[0.14 * scale, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.45} />
      </mesh>
      {/* Outer halo */}
      <mesh>
        <sphereGeometry args={[0.22 * scale, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} />
      </mesh>
    </group>
  )
}

function Voxel({
  pos,
  size,
  rot,
  phase,
  material,
  edgesMaterial,
}: {
  pos: [number, number, number]
  size: number
  rot: [number, number, number]
  phase: number
  material: THREE.Material
  edgesMaterial: THREE.Material
}) {
  const mesh = useRef<THREE.Mesh>(null)
  const edges = useRef<THREE.LineSegments>(null)

  useFrame((state) => {
    if (!mesh.current || !edges.current) return
    const t = state.clock.elapsedTime
    mesh.current.rotation.x = rot[0] + t * 0.08
    mesh.current.rotation.y = rot[1] + t * 0.1
    mesh.current.position.y = pos[1] + Math.sin(t * 0.5 + phase) * 0.04
    edges.current.rotation.copy(mesh.current.rotation)
    edges.current.position.copy(mesh.current.position)
  })

  return (
    <group position={pos} rotation={rot}>
      <mesh ref={mesh} material={material}>
        <boxGeometry args={[size, size, size]} />
      </mesh>
      <lineSegments ref={edges} material={edgesMaterial}>
        <edgesGeometry args={[new THREE.BoxGeometry(size, size, size)]} />
      </lineSegments>
    </group>
  )
}
