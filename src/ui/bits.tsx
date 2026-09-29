import type { CSSProperties } from 'react'
import { TIER_BY_ID } from '../data/tiers'
import { lighten, readable } from '../lib/color'
import type { RankedModel, TierId, Vendor } from '../types'

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

export function Move({ m }: { m: RankedModel }) {
  const mv = m.move
  if (!mv) return null
  if (mv.kind === 'new') return <span className="move move--new">NEW</span>
  return <span className={`move move--${mv.kind}`}>{mv.kind === 'up' ? `▲${mv.by}` : `▼${mv.by}`}</span>
}
