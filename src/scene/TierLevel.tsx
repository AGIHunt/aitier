import { Billboard, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { TIERS, tierY } from '../data/tiers'
import { audio } from '../audio/engine'
import { useStore } from '../store'
import { PER_RING, type TierLayout } from './layout'
import { ModelCard } from './ModelCard'
import { runtime } from './runtime'

const platformFrag = /* glsl */ `
uniform float uTime;
uniform float uLit;
uniform vec3 uColor;
varying vec2 vUv;
#define PI 3.14159265
void main() {
  vec2 p = vUv * 2.0 - 1.0;
  float r = length(p);
  if (r > 1.0) discard;
  float a = atan(p.y, p.x);
  // 同心环
  float rings = smoothstep(0.92, 1.0, sin(r * 42.0 - uTime * 1.4) * 0.5 + 0.5) * 0.35;
  // 外圈刻度（旋转）
  float ticks = step(0.9, fract((a + uTime * 0.08) / (2.0 * PI) * 120.0)) * smoothstep(0.86, 0.9, r) * (1.0 - smoothstep(0.96, 0.97, r));
  // 外圈虚线（反向旋转）
  float dash = step(0.5, fract((a - uTime * 0.15) / (2.0 * PI) * 36.0)) * smoothstep(0.975, 0.98, r) * (1.0 - smoothstep(0.99, 1.0, r));
  // 径向扫描
  float sweep = pow(max(0.0, cos(a - uTime * 0.6)), 24.0) * smoothstep(1.0, 0.2, r) * 0.6;
  // 中心辉光
  float core = smoothstep(0.45, 0.0, r) * 0.25;
  float edge = smoothstep(0.7, 1.0, r) * 0.18;
  float v = rings * (1.0 - r * 0.6) + ticks * 0.9 + dash * 0.8 + sweep + core + edge;
  gl_FragColor = vec4(uColor * v * (0.25 + uLit * 1.1), v * (0.3 + 0.7 * uLit));
}`

const platformVert = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`

interface Props {
  layout: TierLayout
}

export function TierLevel({ layout }: Props) {
  const tier = TIERS[layout.level]
  const y = tierY(layout.level)
  const R = layout.radius + 1.1
  const rows = Math.max(1, Math.ceil(layout.slots.length / PER_RING))
  const letterY = y + 1.35 + rows * 1.9 + 1.5
  const empty = layout.slots.length === 0
  const lit = useRef(0)
  const letter = useRef<THREE.Group>(null!)
  const ring = useRef<THREE.Mesh>(null!)
  const halo = useRef<THREE.Mesh>(null!)

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: platformVert,
        fragmentShader: platformFrag,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        uniforms: { uTime: { value: 0 }, uLit: { value: 0 }, uColor: { value: new THREE.Color(tier.color) } },
      }),
    [tier],
  )
  const ringColor = useMemo(() => new THREE.Color(tier.color).multiplyScalar(3), [tier])
  const letterColor = useMemo(() => new THREE.Color(tier.glow).multiplyScalar(1.15), [tier])
  const ringMat = useRef<THREE.MeshBasicMaterial>(null!)

  // 用 state 触发卡片入场：开场时相机经过才点亮
  const cardsActive = useActiveFlag(layout.level)

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    const s = useStore.getState()
    const isLit = runtime.introFocus < 0 || runtime.introFocus <= layout.level + 0.25
    const near = 1 - Math.min(1, Math.abs(s.focus - layout.level))
    const target = isLit ? (empty ? 0.25 : 0.55 + near * 0.45) : 0.04
    lit.current = THREE.MathUtils.damp(lit.current, target, 3, dt)
    mat.uniforms.uTime.value = t
    const pulse = audio.beatPulse() * (1 - Math.min(1, Math.abs(s.focus - layout.level)))
    mat.uniforms.uLit.value = lit.current + pulse * 0.5
    ringMat.current.opacity = lit.current
    ring.current.scale.setScalar(1 + pulse * 0.025)
    ring.current.rotation.z = t * 0.05 * (layout.level % 2 ? 1 : -1)
    letter.current.position.y = letterY + Math.sin(t * 0.8 + layout.level) * 0.15
    letter.current.scale.setScalar(0.6 + lit.current * 0.45)
    if (halo.current) {
      halo.current.rotation.z = -t * 0.2
      ;(halo.current.material as THREE.MeshBasicMaterial).opacity = lit.current * 0.8
    }
  })

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, y, 0]} material={mat}>
        <circleGeometry args={[R, 96]} />
      </mesh>
      <mesh ref={ring} rotation-x={-Math.PI / 2} position={[0, y + 0.02, 0]}>
        <torusGeometry args={[R, 0.045, 8, 160]} />
        <meshBasicMaterial ref={ringMat} color={ringColor} toneMapped={false} transparent />
      </mesh>
      {layout.level <= 1 && (
        <mesh ref={halo} rotation-x={-Math.PI / 2} position={[0, y - 0.6, 0]}>
          <torusGeometry args={[R + 0.9, 0.02, 6, 160]} />
          <meshBasicMaterial color={ringColor} toneMapped={false} transparent />
        </mesh>
      )}
      <group ref={letter} position={[0, letterY, 0]}>
        <Billboard>
          <Text
            font="/fonts/Orbitron-Black.woff"
            fontSize={tier.id.length > 2 ? 2.1 : 2.6}
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.04}
            outlineWidth={0.03}
            outlineColor={tier.color}
            outlineBlur={0.35}
            outlineOpacity={0.35}
          >
            {tier.id}
            <meshBasicMaterial color={letterColor} toneMapped={false} transparent opacity={empty ? 0.25 : 1} />
          </Text>
          <Text
            font="/fonts/SpaceGrotesk-Bold.woff"
            fontSize={0.34}
            position={[0, -1.75, 0]}
            letterSpacing={0.35}
            anchorX="center"
            color={tier.glow}
            fillOpacity={0.7}
          >
            {empty ? 'VACANT' : `${layout.slots.length} MODEL${layout.slots.length > 1 ? 'S' : ''}`}
          </Text>
        </Billboard>
      </group>
      {layout.slots.map((s) => (
        <ModelCard key={s.model.id} model={s.model} position={s.pos} index={s.index} active={cardsActive} />
      ))}
    </group>
  )
}

/** 开场动画期间：相机经过该档才返回 true */
function useActiveFlag(level: number) {
  const [on, setOn] = useState(runtime.introFocus < 0)
  const onRef = useRef(on)
  useFrame(() => {
    if (onRef.current) return
    if (runtime.introFocus < 0 || runtime.introFocus <= level + 0.25) {
      onRef.current = true
      setOn(true)
    }
  })
  useEffect(() => {
    onRef.current = on
  }, [on])
  return on
}
