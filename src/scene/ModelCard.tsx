import { Billboard } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { audio } from '../audio/engine'
import { TIER_BY_ID, TOWER } from '../data/tiers'
import { useStore } from '../store'
import type { RankedModel } from '../types'
import { EMPTY_TEXTURE, getGlowTexture, requestCardTexture } from './cardTexture'
import { runtime } from './runtime'

const vert = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`

const frag = /* glsl */ `
uniform sampler2D map;
uniform float uTime;
uniform float uHover;
uniform float uShine;
uniform float uOpacity;
uniform float uSeed;
uniform float uGlitch;
uniform vec3 uColor;
varying vec2 vUv;
void main() {
  vec2 uv = vUv;
  // 传闻模型：故障风横向撕裂
  if (uGlitch > 0.0) {
    float g = step(0.93, fract(sin(floor(uv.y * 24.0) * 91.7 + floor(uTime * 9.0) * 13.1) * 437.5));
    uv.x += g * 0.035 * sin(uTime * 40.0) * uGlitch;
  }
  vec4 tex = texture2D(map, uv);
  if (uGlitch > 0.0) {
    tex.r = texture2D(map, uv + vec2(0.006 * uGlitch, 0.0)).r;
    tex.b = texture2D(map, uv - vec2(0.006 * uGlitch, 0.0)).b;
    tex.a *= 0.78 + 0.22 * step(0.5, fract(vUv.y * 90.0 - uTime * 2.0));
  }
  // 斜向扫光（高档位更频繁、更亮）
  float s = fract(uTime * (0.12 + uShine * 0.18) + uSeed);
  float d = (vUv.x + vUv.y * 0.45) / 1.45 - (s * 1.8 - 0.4);
  float band = 1.0 - smoothstep(0.0, 0.05 + uHover * 0.04, abs(d));
  vec3 col = tex.rgb;
  col += uColor * band * (0.2 + uShine * 0.6 + uHover * 0.25) * tex.a;
  col += uColor * uHover * 0.04 * tex.a;
  col *= 1.0 - uHover * 0.12;
  // 全息竖纹
  col += uColor * 0.05 * uShine * sin(vUv.y * 180.0 + uTime * 6.0) * tex.a;
  gl_FragColor = vec4(col, tex.a * uOpacity);
  #include <colorspace_fragment>
}`

interface Props {
  model: RankedModel
  position: THREE.Vector3
  index: number
  active: boolean
}

export function ModelCard({ model, position, index, active }: Props) {
  const tier = TIER_BY_ID[model.tier]
  const group = useRef<THREE.Group>(null!)
  const glow = useRef<THREE.Sprite>(null!)
  const hovered = useRef(false)
  const appear = useRef(0)
  const startAt = useRef<number | null>(null)
  const hoverAmt = useRef(0)

  const lang = useStore((s) => s.lang)
  const [texture, setTexture] = useState<THREE.Texture>(EMPTY_TEXTURE)
  const ready = texture !== EMPTY_TEXTURE
  useEffect(() => {
    // 排队生成贴图，每帧只画几张，避免首屏卡死
    let tex: THREE.Texture | null = null
    const req = requestCardTexture(model, lang, tier.level)
    req.promise.then((t) => {
      tex = t
      setTexture(t)
    })
    return () => {
      req.cancel()
      tex?.dispose()
    }
  }, [model, lang, tier.level])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vert,
        fragmentShader: frag,
        transparent: true,
        depthWrite: false,
        uniforms: {
          map: { value: texture },
          uTime: { value: 0 },
          uHover: { value: 0 },
          uShine: { value: Math.max(0, (3 - tier.level) / 3) },
          uOpacity: { value: 0 },
          uSeed: { value: Math.random() },
          uGlitch: { value: model.status === 'rumored' ? 1 : 0 },
          uColor: { value: new THREE.Color(tier.glow) },
        },
      }),
    [texture, tier],
  )
  useEffect(() => () => material.dispose(), [material])

  const glowColor = useMemo(() => new THREE.Color(tier.color).multiplyScalar(1.6), [tier])
  const bob = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    if (active && startAt.current === null) startAt.current = t + index * 0.045
    const s = useStore.getState()
    const started = ready && startAt.current !== null && t >= startAt.current
    appear.current = THREE.MathUtils.damp(appear.current, started ? 1 : 0, 4.5, dt)
    const isSel = s.selectedId === model.id
    const hov = hovered.current || s.hoveredId === model.id || isSel
    hoverAmt.current = THREE.MathUtils.damp(hoverAmt.current, hov ? 1 : 0, 10, dt)

    const filtered = s.vendorFilter && s.vendorFilter !== model.vendor.id
    const dimmed = filtered || (s.selectedId && !isSel)
    const targetOpacity = filtered ? 0.1 : dimmed ? 0.35 : 1

    const a = appear.current
    // 入场：从中心光柱沿径向飞出并放大
    const k = 1 - Math.pow(1 - a, 3)
    group.current.position.set(
      position.x * k,
      position.y + Math.sin(t * 0.9 + bob) * 0.12 + (1 - k) * -2 + hoverAmt.current * 0.25,
      position.z * k,
    )
    const sc = (0.2 + 0.8 * k) * (1 + hoverAmt.current * 0.14)
    group.current.scale.setScalar(sc)

    const u = material.uniforms
    u.uTime.value = t
    u.uHover.value = hoverAmt.current
    u.uOpacity.value = THREE.MathUtils.damp(u.uOpacity.value, a * targetOpacity, 8, dt)
    const baseGlow = tier.level <= 1 ? 0.55 : tier.level === 2 ? 0.3 : 0.0
    const go = (baseGlow + hoverAmt.current * 0.28) * u.uOpacity.value
    ;(glow.current.material as THREE.SpriteMaterial).opacity = go
    // 不可见的光晕不画，省掉大量叠加混合的过度绘制
    glow.current.visible = go > 0.01
  })

  return (
    <group ref={group}>
      <sprite ref={glow} scale={[TOWER.cardW * 2.1, TOWER.cardH * 2.6, 1]} position={[0, 0, -0.05]}>
        <spriteMaterial
          map={getGlowTexture()}
          color={glowColor}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
          opacity={0}
        />
      </sprite>
      <Billboard>
        <mesh
          material={material}
          onPointerOver={(e) => {
            e.stopPropagation()
            if (appear.current < 0.5) return
            hovered.current = true
            useStore.getState().set({ hoveredId: model.id })
            document.body.style.cursor = 'pointer'
            audio.hover(model.score, model.openWeights)
          }}
          onPointerOut={() => {
            hovered.current = false
            if (useStore.getState().hoveredId === model.id) useStore.getState().set({ hoveredId: null })
            document.body.style.cursor = ''
          }}
          onClick={(e) => {
            e.stopPropagation()
            if (runtime.dragged) return
            useStore.getState().select(model.id)
            audio.select(tier.semitone)
            audio.whoosh(0.6)
          }}
        >
          <planeGeometry args={[TOWER.cardW, TOWER.cardH]} />
        </mesh>
      </Billboard>
    </group>
  )
}
