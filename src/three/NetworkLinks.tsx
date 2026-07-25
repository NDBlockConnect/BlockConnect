import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export interface NetworkLink {
  from: [number, number, number]
  to: [number, number, number]
  color: string
  /** Number of pulse particles traveling along this link. */
  pulses?: number
}

interface NetworkLinksProps {
  links: NetworkLink[]
}

/**
 * Constellation of thin glowing lines connecting voxel nodes, with slow
 * pulse particles drifting along each edge. Distinct from a single-arc
 * data stream: this is a network mesh, not a bridge.
 */
export default function NetworkLinks({ links }: NetworkLinksProps) {
  return (
    <group>
      {links.map((link, i) => (
        <LinkEdge key={i} {...link} />
      ))}
    </group>
  )
}

function LinkEdge({ from, to, color, pulses = 3 }: NetworkLink) {
  // Build a slight arc via a quadratic bezier with mid pushed toward camera.
  const curve = useMemo(() => {
    const a = new THREE.Vector3(...from)
    const b = new THREE.Vector3(...to)
    const mid = a.clone().add(b).multiplyScalar(0.5)
    mid.y += 0.25
    mid.z += 0.4
    return new THREE.QuadraticBezierCurve3(a, mid, b)
  }, [from, to])

  // Static guide line geometry.
  const lineGeometry = useMemo(() => {
    const pts = curve.getPoints(32)
    const geo = new THREE.BufferGeometry()
    const arr = new Float32Array(pts.length * 3)
    pts.forEach((p, i) => {
      arr[i * 3] = p.x
      arr[i * 3 + 1] = p.y
      arr[i * 3 + 2] = p.z
    })
    geo.setAttribute('position', new THREE.BufferAttribute(arr, 3))
    return geo
  }, [curve])

  const lineMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color(color),
        transparent: true,
        opacity: 0.22,
      }),
    [color],
  )

  // Build the line as a primitive object to avoid the JSX <line> SVG/THREE
  // type collision. `<primitive>` is type-safe and unambiguous.
  const lineObj = useMemo(
    () => new THREE.Line(lineGeometry, lineMaterial),
    [lineGeometry, lineMaterial],
  )

  // Pulse particles: pre-allocated positions + speeds + progress array.
  const { pointsGeometry, pointsMaterial, progress, speeds } = useMemo(() => {
    const positions = new Float32Array(pulses * 3)
    const arr = new Float32Array(pulses)
    const sp = new Float32Array(pulses)
    for (let i = 0; i < pulses; i++) {
      const t = i / pulses
      const p = curve.getPoint(t)
      positions[i * 3] = p.x
      positions[i * 3 + 1] = p.y
      positions[i * 3 + 2] = p.z
      arr[i] = t
      sp[i] = 0.04 + Math.random() * 0.06
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const tex = makePulseTexture(color)
    const mat = new THREE.PointsMaterial({
      size: 0.12,
      map: tex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      color: new THREE.Color(color),
      opacity: 0.9,
    })
    return { pointsGeometry: geo, pointsMaterial: mat, progress: arr, speeds: sp }
  }, [curve, pulses, color])

  const pointsRef = useRef<THREE.Points>(null)

  useFrame((_, delta) => {
    if (!pointsRef.current) return
    const pos = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const arr = pos.array as Float32Array
    for (let i = 0; i < pulses; i++) {
      progress[i] += speeds[i] * delta
      if (progress[i] > 1) progress[i] -= 1
      const p = curve.getPoint(progress[i])
      arr[i * 3] = p.x
      arr[i * 3 + 1] = p.y
      arr[i * 3 + 2] = p.z
    }
    pos.needsUpdate = true
  })

  return (
    <group>
      <primitive object={lineObj} />
      <points ref={pointsRef} geometry={pointsGeometry} material={pointsMaterial} />
    </group>
  )
}

/** Procedural circular sprite — no external asset needed. */
function makePulseTexture(color: string): THREE.Texture {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  const c = new THREE.Color(color)
  const r = Math.floor(c.r * 255)
  const g = Math.floor(c.g * 255)
  const b = Math.floor(c.b * 255)
  grad.addColorStop(0, `rgba(${r},${g},${b},1)`)
  grad.addColorStop(0.3, `rgba(${r},${g},${b},0.6)`)
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}
