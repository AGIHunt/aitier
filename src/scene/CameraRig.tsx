import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { audio } from '../audio/engine'
import { MODEL_BY_ID } from '../data'
import { TIERS, TOWER_TOP, tierY } from '../data/tiers'
import { useStore } from '../store'
import { runtime } from './runtime'

const INTRO_RISE = 5.2
const INTRO_END = 7.4
const UP = new THREE.Vector3(0, 1, 0)

function radiusAt(focus: number) {
  const L = runtime.layout
  if (!L.length) return 8
  const a = Math.max(0, Math.min(L.length - 1, Math.floor(focus)))
  const b = Math.min(L.length - 1, a + 1)
  const f = Math.min(1, Math.max(0, focus - a))
  return THREE.MathUtils.lerp(L[a].radius, L[b].radius, f)
}

function easeInOutCubic(x: number) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}

export function CameraRig() {
  const { camera, gl } = useThree()
  const orbit = useRef({ theta: -0.9, phi: 0.2, lastWheel: 0 })
  const cur = useRef({ pos: new THREE.Vector3(0, -14, 40), look: new THREE.Vector3(0, -4, 0) })
  const intro = useRef({ t: -1, pinged: new Set<number>(), impacted: false })

  // 指针：拖动旋转 / 滚轮升降
  useEffect(() => {
    const el = gl.domElement
    let down = false
    let sx = 0
    let sy = 0
    let lx = 0
    let ly = 0
    const onDown = (e: PointerEvent) => {
      down = true
      sx = lx = e.clientX
      sy = ly = e.clientY
      runtime.dragged = false
    }
    const onMove = (e: PointerEvent) => {
      if (!down || useStore.getState().intro) return
      const dx = e.clientX - lx
      const dy = e.clientY - ly
      lx = e.clientX
      ly = e.clientY
      if (Math.hypot(e.clientX - sx, e.clientY - sy) > 5) runtime.dragged = true
      if (!runtime.dragged) return
      runtime.lastInteract = performance.now()
      const s = useStore.getState()
      if (s.selectedId && Math.hypot(e.clientX - sx, e.clientY - sy) > 40) s.select(null)
      orbit.current.theta -= dx * 0.0055
      orbit.current.phi = THREE.MathUtils.clamp(orbit.current.phi + dy * 0.003, -0.15, 0.75)
    }
    const onUp = () => {
      down = false
      // 让 click 事件先读到 dragged，再复位
      setTimeout(() => (runtime.dragged = false), 0)
    }
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const s = useStore.getState()
      if (s.intro) return
      runtime.lastInteract = performance.now()
      orbit.current.lastWheel = performance.now()
      const patch: Partial<typeof s> = { focus: THREE.MathUtils.clamp(s.focus + e.deltaY * 0.0022, 0, TIERS.length - 1) }
      if (s.selectedId) patch.selectedId = null
      if (s.overview) patch.overview = false
      s.set(patch)
    }
    el.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      el.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      el.removeEventListener('wheel', onWheel)
    }
  }, [gl])

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    const s = useStore.getState()
    const o = orbit.current
    const targetPos = new THREE.Vector3()
    const targetLook = new THREE.Vector3()
    let lambda = 2.6

    // ─── 开场：从塔底螺旋上升到 SSS ───
    if (s.intro) {
      const I = intro.current
      if (I.t < 0) {
        I.t = 0
        I.pinged.clear()
        I.impacted = false
        audio.riser(INTRO_RISE)
        audio.setEnergy(0.15)
      }
      I.t += dt
      const k = Math.min(1, I.t / INTRO_RISE)
      const f = 8.4 - 8.4 * (k * k * k * 0.55 + easeInOutCubic(k) * 0.45)
      runtime.introFocus = f
      for (const t of TIERS) {
        if (f <= t.level + 0.25 && !I.pinged.has(t.level)) {
          I.pinged.add(t.level)
          audio.tierPing(t.semitone)
        }
      }
      audio.setEnergy(0.15 + k * 0.5)
      if (k >= 1 && !I.impacted) {
        I.impacted = true
        audio.impact()
        audio.setEnergy(1)
        s.set({ shock: s.shock + 1 })
      }
      o.theta = -2.2 + k * 2.2 + Math.max(0, I.t - INTRO_RISE) * 0.08
      const R = THREE.MathUtils.lerp(34, radiusAt(0) * 1.25 + 10, k)
      o.phi = THREE.MathUtils.lerp(-0.08, 0.16, k)
      targetLook.set(0, tierY(Math.max(0, f)) + 1.8 + (1 - k) * 4, 0)
      targetPos.set(Math.sin(o.theta) * Math.cos(o.phi) * R, targetLook.y + Math.sin(o.phi) * R, Math.cos(o.theta) * Math.cos(o.phi) * R)
      lambda = 5
      if (I.t >= INTRO_END) {
        runtime.introFocus = -1
        I.t = -1
        runtime.lastInteract = performance.now()
        s.set({ intro: false, focus: 0 })
      }
    } else {
      const sel = s.selectedId ? runtime.positions.get(s.selectedId) : undefined
      if (sel) {
        // ─── 选中：飞到卡片前，卡片偏左给详情面板让位 ───
        const dir = new THREE.Vector3(sel.x, 0, sel.z)
        if (dir.lengthSq() < 0.01) dir.set(0, 0, 1)
        dir.normalize()
        const right = new THREE.Vector3().crossVectors(dir.clone().negate(), UP).normalize()
        const wide = window.innerWidth > 900
        targetLook.copy(sel).addScaledVector(right, wide ? 1.55 : 0).add(new THREE.Vector3(0, wide ? 0 : -0.8, 0))
        targetPos.copy(sel).addScaledVector(dir, wide ? 6.6 : 8.5).add(new THREE.Vector3(0, 0.7, 0))
        lambda = 3.2
        o.theta = Math.atan2(cur.current.pos.x, cur.current.pos.z)
        const m = MODEL_BY_ID.get(s.selectedId!)
        if (m) audio.setEnergy(0.2 + (1 - TIERS.findIndex((t) => t.id === m.tier) / 7) * 0.8)
      } else if (s.overview) {
        // ─── 全景 ───
        if (performance.now() - runtime.lastInteract > 2500) o.theta += dt * 0.08
        targetLook.set(0, TOWER_TOP / 2 + 4, 0)
        const R = 64
        targetPos.set(Math.sin(o.theta) * R, targetLook.y + 4 + o.phi * 30, Math.cos(o.theta) * R)
        audio.setEnergy(0.55)
      } else {
        // ─── 环绕当前档位 ───
        if (performance.now() - runtime.lastInteract > 5000) o.theta += dt * 0.05
        // 滚轮停下后吸附到最近的档
        if (performance.now() - o.lastWheel > 450) {
          const snapped = Math.round(s.focus)
          if (Math.abs(snapped - s.focus) > 0.001) s.set({ focus: THREE.MathUtils.damp(s.focus, snapped, 6, dt) })
        }
        const R = radiusAt(s.focus) * 1.25 + 10
        targetLook.set(0, tierY(s.focus) + 2.6, 0)
        targetPos.set(
          Math.sin(o.theta) * Math.cos(o.phi) * R,
          targetLook.y + Math.sin(o.phi) * R,
          Math.cos(o.theta) * Math.cos(o.phi) * R,
        )
        audio.setEnergy(0.18 + (1 - s.focus / 7) * 0.82)
      }
    }

    const c = cur.current
    c.pos.x = THREE.MathUtils.damp(c.pos.x, targetPos.x, lambda, dt)
    c.pos.y = THREE.MathUtils.damp(c.pos.y, targetPos.y, lambda, dt)
    c.pos.z = THREE.MathUtils.damp(c.pos.z, targetPos.z, lambda, dt)
    c.look.x = THREE.MathUtils.damp(c.look.x, targetLook.x, lambda * 1.2, dt)
    c.look.y = THREE.MathUtils.damp(c.look.y, targetLook.y, lambda * 1.2, dt)
    c.look.z = THREE.MathUtils.damp(c.look.z, targetLook.z, lambda * 1.2, dt)
    camera.position.copy(c.pos)
    camera.lookAt(c.look)
  })

  return null
}
