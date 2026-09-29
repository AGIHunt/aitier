import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { TIERS, TOWER_TOP } from '../data/tiers'

const vert = /* glsl */ `
varying vec2 vUv;
varying vec3 vN;
varying vec3 vView;
void main() {
  vUv = uv;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vN = normalize(normalMatrix * normal);
  vView = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`

const frag = /* glsl */ `
uniform float uTime;
uniform vec3 uColA;
uniform vec3 uColB;
uniform float uPower;
varying vec2 vUv;
varying vec3 vN;
varying vec3 vView;
void main() {
  float fres = pow(1.0 - abs(dot(vN, vView)), 1.6);
  float core = 1.0 - fres;
  float streak = smoothstep(0.55, 1.0, sin(vUv.y * 90.0 - uTime * 7.0 + sin(vUv.x * 40.0) * 2.0) * 0.5 + 0.5);
  float pulse = smoothstep(0.0, 0.03, fract(vUv.y * 3.0 - uTime * 0.35)) * (1.0 - smoothstep(0.03, 0.12, fract(vUv.y * 3.0 - uTime * 0.35)));
  vec3 col = mix(uColB, uColA, vUv.y);
  float fade = smoothstep(0.0, 0.08, vUv.y) * (1.0 - smoothstep(0.92, 1.0, vUv.y));
  float a = (core * 0.45 + streak * 0.22 + pulse * 0.45) * fade * uPower;
  gl_FragColor = vec4(col * a * 1.8, a);
}`

/** 贯穿全塔的中央光柱 + 顶端天门光环 */
export function Beam() {
  const height = TOWER_TOP + 40
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vert,
        fragmentShader: frag,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uColA: { value: new THREE.Color(TIERS[0].color) },
          uColB: { value: new THREE.Color(TIERS[TIERS.length - 1].color) },
          uPower: { value: 1 },
        },
      }),
    [],
  )
  const crown = useRef<THREE.Group>(null!)
  useFrame((s) => {
    const t = s.clock.elapsedTime
    mat.uniforms.uTime.value = t
    crown.current.rotation.y = t * 0.25
    crown.current.children.forEach((c, i) => {
      c.rotation.z = t * (0.3 + i * 0.12) * (i % 2 ? -1 : 1)
    })
  })
  const crownColor = useMemo(() => new THREE.Color(TIERS[0].glow).multiplyScalar(2.2), [])
  return (
    <group>
      <mesh position={[0, height / 2 - 14, 0]} material={mat}>
        <cylinderGeometry args={[0.55, 0.55, height, 32, 1, true]} />
      </mesh>
      <mesh position={[0, height / 2 - 14, 0]} material={mat} scale={[2.6, 1, 2.6]}>
        <cylinderGeometry args={[0.55, 0.55, height, 32, 1, true]} />
      </mesh>
      {/* 天门：SSS 上方交错旋转的光环 */}
      <group ref={crown} position={[0, TOWER_TOP + 9, 0]}>
        {[3.2, 4.4, 5.8].map((r, i) => (
          <mesh key={r} rotation={[Math.PI / 2 + (i - 1) * 0.35, i * 0.6, 0]}>
            <torusGeometry args={[r, 0.03 + i * 0.01, 8, 128]} />
            <meshBasicMaterial color={crownColor} toneMapped={false} transparent opacity={0.9 - i * 0.2} />
          </mesh>
        ))}
        <mesh>
          <sphereGeometry args={[0.42, 32, 32]} />
          <meshBasicMaterial color={crownColor} toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}
