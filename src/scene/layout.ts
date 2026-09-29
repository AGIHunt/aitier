import * as THREE from 'three'
import { groupByTier } from '../data'
import { TOWER, tierY } from '../data/tiers'
import type { RankedModel } from '../types'

export const PER_RING = 20
const ROW_GAP = 1.9

export interface Slot {
  model: RankedModel
  pos: THREE.Vector3
  /** 在该档中的序号，决定入场延迟 */
  index: number
  level: number
}

export interface TierLayout {
  level: number
  radius: number
  slots: Slot[]
}

export function ringRadius(n: number) {
  const perRow = Math.min(Math.max(n, 1), PER_RING)
  return Math.max(4.6, (perRow * (TOWER.cardW + 0.55)) / (Math.PI * 2))
}

/** 把一个档位的模型排成环：最强的放正前方，然后左右交替向后排 */
export function computeLayout(models: RankedModel[]): TierLayout[] {
  return groupByTier(models).map(({ tier, models: list }) => {
    const n = list.length
    const rows = Math.max(1, Math.ceil(n / PER_RING))
    const radius = ringRadius(n)
    const slots: Slot[] = []
    for (let r = 0; r < rows; r++) {
      const rowItems = list.slice(r * PER_RING, (r + 1) * PER_RING)
      const count = rowItems.length
      const step = (Math.PI * 2) / Math.max(count, 1)
      const offset = r % 2 ? step / 2 : 0
      rowItems.forEach((m, i) => {
        // 0, +1, -1, +2, -2 ... 让高分集中在正前方
        const k = i === 0 ? 0 : i % 2 ? (i + 1) / 2 : -i / 2
        const a = k * step + offset
        const y = tierY(tier.level) + 1.35 + r * ROW_GAP
        slots.push({
          model: m,
          pos: new THREE.Vector3(Math.sin(a) * radius, y, Math.cos(a) * radius),
          index: r * PER_RING + i,
          level: tier.level,
        })
      })
    }
    return { level: tier.level, radius, slots }
  })
}
