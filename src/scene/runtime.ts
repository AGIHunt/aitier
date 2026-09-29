import * as THREE from 'three'
import type { TierLayout } from './layout'

/** 场景内部共享的可变状态（不走 React 渲染） */
export const runtime = {
  /** 开场动画时，相机当前经过的档位（连续值）；非开场为 -1 */
  introFocus: -1,
  /** 本次指针按下后是否拖动过，拖动过则不算点击 */
  dragged: false,
  layout: [] as TierLayout[],
  positions: new Map<string, THREE.Vector3>(),
  lastInteract: 0,
}

export function setLayout(layout: TierLayout[]) {
  runtime.layout = layout
  runtime.positions.clear()
  for (const t of layout) for (const s of t.slots) runtime.positions.set(s.model.id, s.pos)
}
