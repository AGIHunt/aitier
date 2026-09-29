import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useMemo, useState } from 'react'
import { MODELS_BY_CATEGORY } from '../data'
import { useStore } from '../store'
import { Backdrop } from './Backdrop'
import { Beam } from './Beam'
import { CameraRig } from './CameraRig'
import { Effects } from './Effects'
import { computeLayout } from './layout'
import { TierLevel } from './TierLevel'
import { setTextureFocus } from './cardTexture'
import { runtime, setLayout } from './runtime'

setTextureFocus(() => (runtime.introFocus >= 0 ? runtime.introFocus : useStore.getState().focus))

function Tower() {
  const category = useStore((s) => s.category)
  const layout = useMemo(() => {
    const l = computeLayout(MODELS_BY_CATEGORY[category])
    setLayout(l)
    return l
  }, [category])
  // key 带上类别：切换时整座塔重建，卡片重新从光柱里飞出
  return (
    <group key={category}>
      {layout.map((t) => (
        <TierLevel key={t.level} layout={t} />
      ))}
    </group>
  )
}

export function Experience() {
  const [quality, setQuality] = useState<'high' | 'low'>('high')
  return (
    <Canvas
      dpr={[1, typeof window !== 'undefined' && window.innerWidth < 760 ? 1.5 : 1.75]}
      gl={{ antialias: false, powerPreference: 'high-performance', stencil: false }}
      camera={{ fov: 50, near: 0.1, far: 1500, position: [0, -14, 40] }}
      onPointerMissed={() => {
        if (runtime.dragged) return
        const s = useStore.getState()
        if (s.selectedId) s.select(null)
      }}
    >
      <color attach="background" args={['#020208']} />
      <PerformanceMonitor onDecline={() => setQuality('low')} />
      <AdaptiveDpr pixelated={false} />
      <Backdrop />
      <Beam />
      <Tower />
      <CameraRig />
      <Effects quality={quality} />
    </Canvas>
  )
}
