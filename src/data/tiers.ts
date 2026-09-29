import type { Category, TierId } from '../types'

export interface TierDef {
  id: TierId
  /** 0 = 最高档 */
  level: number
  color: string
  glow: string
  label: string
  desc: string
  /** 进入该档时播放的音高（半音，相对 A3） */
  semitone: number
}

export const TIERS: TierDef[] = [
  { id: 'SSS', level: 0, color: '#ff4fd8', glow: '#ff9bf0', label: '神', desc: '当前公认第一', semitone: 24 },
  { id: 'SS', level: 1, color: '#b26bff', glow: '#d7b3ff', label: '王', desc: '紧贴第一的顶级旗舰', semitone: 21 },
  { id: 'S', level: 2, color: '#ff6b6b', glow: '#ffb0b0', label: '皇', desc: '前沿第一梯队', semitone: 19 },
  { id: 'A', level: 3, color: '#ffa94d', glow: '#ffd4a3', label: '强', desc: '强，接近前沿', semitone: 16 },
  { id: 'B', level: 4, color: '#ffe066', glow: '#fff0b3', label: '能打', desc: '能打的中端 / 上代旗舰', semitone: 14 },
  { id: 'C', level: 5, color: '#a9e34b', glow: '#d8f5a2', label: '够用', desc: '轻量或老一代但常用', semitone: 12 },
  { id: 'D', level: 6, color: '#38d9a9', glow: '#96f2d7', label: '落后', desc: '明显落后', semitone: 9 },
  { id: 'E', level: 7, color: '#4dabf7', glow: '#a5d8ff', label: '边缘', desc: '边缘选手', semitone: 7 },
]

export const TIER_BY_ID: Record<TierId, TierDef> = Object.fromEntries(TIERS.map((t) => [t.id, t])) as Record<
  TierId,
  TierDef
>

export const CATEGORIES: { id: Category; label: string; en: string; icon: string }[] = [
  { id: 'llm', label: '语言模型', en: 'LLM', icon: '◆' },
  { id: 'image', label: '图像生成', en: 'IMAGE', icon: '◉' },
  { id: 'video', label: '视频生成', en: 'VIDEO', icon: '▶' },
]

/** 塔的几何参数 */
export const TOWER = {
  spacing: 8,
  cardW: 2.6,
  cardH: 1.5,
}

export function tierY(level: number) {
  return (TIERS.length - 1 - level) * TOWER.spacing
}

export const TOWER_TOP = tierY(0)
