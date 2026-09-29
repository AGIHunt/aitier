import type { CSSProperties } from 'react'
import { META } from '../data'
import { TIER_BY_ID } from '../data/tiers'
import { lighten, readable } from '../lib/color'
import type { TierId, Vendor } from '../types'

export function Badge({ vendor, size = 28 }: { vendor: Vendor; size?: number }) {
  const style: CSSProperties = {
    width: size,
    height: size,
    fontSize: size * (vendor.monogram.length > 1 ? 0.36 : 0.46),
    background: `radial-gradient(circle at 30% 28%, ${lighten(vendor.color, 0.35)}, ${vendor.color} 70%)`,
    color: readable(vendor.color, vendor.accent),
    boxShadow: `0 0 ${size * 0.5}px ${vendor.color}55`,
  }
  return (
    <span className="badge" style={style} title={vendor.nameZh}>
      {vendor.monogram}
    </span>
  )
}

export function TierChip({ tier, size = 'md' }: { tier: TierId; size?: 'sm' | 'md' | 'lg' }) {
  const t = TIER_BY_ID[tier]
  return (
    <span
      className={`tier-chip tier-chip--${size}`}
      style={{ '--tc': t.color, '--tg': t.glow } as CSSProperties}
    >
      {tier}
    </span>
  )
}

/** 两周内发布的新模型 */
export function isFresh(released: string | null) {
  if (!released || released.length < 10) return false
  return (Date.parse(META.updatedAt) - Date.parse(released)) / 864e5 <= 14
}

export function Move({ tier, prev, released }: { tier: TierId; prev?: TierId | null; released: string | null }) {
  if (!prev) return isFresh(released) ? <span className="move move--new">NEW</span> : null
  const d = TIER_BY_ID[prev].level - TIER_BY_ID[tier].level
  if (d === 0) return null
  return <span className={`move ${d > 0 ? 'move--up' : 'move--down'}`}>{d > 0 ? `▲${d}` : `▼${-d}`}</span>
}

export const STATUS_ZH: Record<string, string> = {
  released: '已发布',
  preview: '预览',
  rumored: '传闻',
  deprecated: '已退役',
}
