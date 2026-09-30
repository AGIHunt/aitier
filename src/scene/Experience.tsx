import { Canvas, useThree } from '@react-three/fiber'
import { useCallback, useEffect, useMemo, useState } from 'react'
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

/**
 * 自己驱动渲染循环，按场景需要限帧：
 * - 开场 / 正在交互 / 有选中：60fps（高刷屏上默认会跑到 120，白白翻倍）
 * - 闲置（只有自动旋转）：30fps
 * - 窗口失焦：15fps；标签页隐藏：完全停
 */
function FrameLimiter({ onSlow }: { onSlow: () => void }) {
  const advance = useThree((s) => s.advance)
  const get = useThree((s) => s.get)
  if (import.meta.env.DEV) (window as unknown as { __r3f: typeof get }).__r3f = get
  useEffect(() => {
    let raf = 0
    let last = 0
    // 只在「应当跑 60fps」的活跃时段测实际帧间隔；连续 3 秒平均低于 ~40fps 才降画质
    let slowSince = 0
    let avg = 16.7
    let degraded = false
    const touch = () => (runtime.lastInteract = performance.now())
    window.addEventListener('pointermove', touch, { passive: true })
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop)
      if (document.hidden) return
      const s = useStore.getState()
      const active = s.intro || !!s.selectedId || !!s.vs || performance.now() - runtime.lastInteract < 2500
      const fps = !document.hasFocus() ? 15 : active ? 60 : 30
      if (t - last < 1000 / fps - 2) return
      const dt = t - last
      last = t
      if (fps === 60 && dt < 200 && !degraded) {
        avg = avg * 0.9 + dt * 0.1
        if (avg > 25) {
          if (!slowSince) slowSince = t
          else if (t - slowSince > 3000) {
            degraded = true
            onSlow()
          }
        } else slowSince = 0
      }
      // frameloop="never" 时 R3F 的 advance 以「秒」计时（毫秒会让所有动画快 1000 倍而狂抖）
      advance(t / 1000)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', touch)
    }
  }, [advance, onSlow])
  return null
}

const MAX_DPR = 1.5

export function Experience() {
  const [quality, setQuality] = useState<'high' | 'low'>('high')
  const onSlow = useCallback(() => setQuality('low'), [])
  // 性能不够时整体降一档：分辨率降到 1、Bloom 层数减少
  const dpr = quality === 'high' ? Math.min(MAX_DPR, window.devicePixelRatio || 1) : 1
  return (
    <Canvas
      frameloop="never"
      dpr={dpr}
      gl={{ antialias: false, powerPreference: 'high-performance', stencil: false }}
      camera={{ fov: 50, near: 0.1, far: 1500, position: [0, -14, 40] }}
      onPointerMissed={() => {
        if (runtime.dragged) return
        const s = useStore.getState()
        if (s.selectedId) s.select(null)
      }}
    >
      <FrameLimiter onSlow={onSlow} />
      <Backdrop />
      <Beam />
      <Tower />
      <CameraRig />
      <Effects quality={quality} />
    </Canvas>
  )
}
