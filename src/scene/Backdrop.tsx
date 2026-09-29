import { Stars } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { TOWER_TOP } from '../data/tiers'
import { getGlowTexture } from './cardTexture'

const nebulaVert = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = normalize(position);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`

const nebulaFrag = /* glsl */ `
uniform float uTime;
varying vec3 vDir;
float hash(vec3 p) { return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453); }
float noise(vec3 p) {
  vec3 i = floor(p); vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x), mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x), mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
}
float fbm(vec3 p) { float v = 0.0; float a = 0.5; for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; } return v; }
void main() {
  vec3 d = normalize(vDir);
  float h = d.y;
  vec3 top = vec3(0.10, 0.03, 0.20);
  vec3 mid = vec3(0.012, 0.014, 0.04);
  vec3 bot = vec3(0.0, 0.03, 0.06);
  vec3 col = h > 0.0 ? mix(mid, top, smoothstep(0.0, 1.0, h)) : mix(mid, bot, smoothstep(0.0, -1.0, h));
  float n = fbm(d * 2.2 + vec3(0.0, uTime * 0.01, uTime * 0.006));
  float n2 = fbm(d * 4.0 - vec3(uTime * 0.008));
  col += vec3(0.45, 0.10, 0.55) * pow(n, 3.0) * 0.55 * smoothstep(-0.2, 0.6, h);
  col += vec3(0.05, 0.25, 0.55) * pow(n2, 3.5) * 0.5;
  // 顶部「天门」光晕
  col += vec3(1.0, 0.45, 0.9) * pow(max(h, 0.0), 14.0) * 0.5;
  gl_FragColor = vec4(col, 1.0);
}`

export function Backdrop() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: nebulaVert,
        fragmentShader: nebulaFrag,
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: { uTime: { value: 0 } },
      }),
    [],
  )
  useFrame((s) => (mat.uniforms.uTime.value = s.clock.elapsedTime))
  return (
    <>
      <mesh material={mat} renderOrder={-10}>
        <sphereGeometry args={[480, 48, 32]} />
      </mesh>
      <Stars radius={220} depth={120} count={5000} factor={5} saturation={0.6} fade speed={0.6} />
      <RisingMotes />
    </>
  )
}

/** 沿塔身缓缓上升的光尘 */
function RisingMotes({ count = 1400 }) {
  const ref = useRef<THREE.Points>(null!)
  const { geo, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    const palette = ['#ff4fd8', '#b26bff', '#4dabf7', '#ffffff', '#ffa94d'].map((c) => new THREE.Color(c))
    for (let i = 0; i < count; i++) {
      const r = 2 + Math.pow(Math.random(), 0.7) * 34
      const a = Math.random() * Math.PI * 2
      pos[i * 3] = Math.cos(a) * r
      pos[i * 3 + 1] = -12 + Math.random() * (TOWER_TOP + 34)
      pos[i * 3 + 2] = Math.sin(a) * r
      const c = palette[Math.floor(Math.random() * palette.length)]
      col.set([c.r, c.g, c.b], i * 3)
      speeds[i] = 0.3 + Math.random() * 1.2
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
    return { geo, speeds }
  }, [count])

  useFrame((_, dt) => {
    const p = geo.attributes.position as THREE.BufferAttribute
    const arr = p.array as Float32Array
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speeds[i] * dt
      if (arr[i * 3 + 1] > TOWER_TOP + 22) arr[i * 3 + 1] = -12
    }
    p.needsUpdate = true
  })

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        size={0.28}
        map={getGlowTexture()}
        vertexColors
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        toneMapped={false}
      />
    </points>
  )
}
