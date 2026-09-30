import { useFrame } from '@react-three/fiber'
import { Bloom, ChromaticAberration, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import type { BloomEffect, ChromaticAberrationEffect } from 'postprocessing'
import { BlendFunction } from 'postprocessing'
import { useRef } from 'react'
import * as THREE from 'three'
import { audio } from '../audio/engine'
import { useStore } from '../store'

export function Effects({ quality }: { quality: 'high' | 'low' }) {
  const bloom = useRef<BloomEffect>(null!)
  const chroma = useRef<ChromaticAberrationEffect>(null!)
  const shock = useRef({ seen: 0, v: 0 })

  useFrame((_, dt) => {
    const s = useStore.getState()
    const sh = shock.current
    if (s.shock !== sh.seen) {
      sh.seen = s.shock
      sh.v = 1
    }
    sh.v = THREE.MathUtils.damp(sh.v, 0, 2.2, dt)
    const pulse = audio.beatPulse()
    if (bloom.current) bloom.current.intensity = 1.15 + sh.v * 3.2 + pulse * 0.35
    if (chroma.current) {
      const off = 0.0005 + sh.v * 0.014 + pulse * 0.0008
      chroma.current.offset.set(off, off * 0.6)
    }
  })

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        ref={bloom}
        mipmapBlur
        intensity={1.15}
        luminanceThreshold={0.3}
        luminanceSmoothing={0.3}
        radius={0.78}
        levels={quality === 'high' ? 6 : 4}
        resolutionScale={0.5}
      />
      <ChromaticAberration
        ref={chroma}
        offset={new THREE.Vector2(0.0005, 0.0003)}
        radialModulation
        modulationOffset={0.25}
      />
      <Noise opacity={0.045} blendFunction={BlendFunction.OVERLAY} />
      <Vignette offset={0.22} darkness={0.82} />
    </EffectComposer>
  )
}
