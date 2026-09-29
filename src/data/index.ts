import type { Category, RankedModel, TierId, Vendor, VendorFile } from '../types'
import { TIER_BY_ID, TIERS } from './tiers'
import meta from './meta.json'

// 每家厂商一个 JSON：新增厂商只需往 vendors/ 里丢一个文件
const files = import.meta.glob<VendorFile>('./vendors/*.json', { eager: true, import: 'default' })

export const VENDORS: Vendor[] = []
const all: Omit<RankedModel, 'rank'>[] = []

for (const file of Object.values(files)) {
  VENDORS.push(file.vendor)
  for (const m of file.models) {
    if (!TIER_BY_ID[m.tier]) {
      console.warn(`[airank] ${m.id} 的 tier 非法: ${m.tier}`)
      continue
    }
    all.push({ ...m, vendor: file.vendor })
  }
}

VENDORS.sort((a, b) => a.name.localeCompare(b.name))

function byStrength(a: { tier: TierId; score: number; name: string }, b: { tier: TierId; score: number; name: string }) {
  return TIER_BY_ID[a.tier].level - TIER_BY_ID[b.tier].level || b.score - a.score || a.name.localeCompare(b.name)
}

export const MODELS_BY_CATEGORY: Record<Category, RankedModel[]> = { llm: [], image: [], video: [] }
for (const cat of Object.keys(MODELS_BY_CATEGORY) as Category[]) {
  MODELS_BY_CATEGORY[cat] = all
    .filter((m) => m.category === cat)
    .sort(byStrength)
    .map((m, i) => ({ ...m, rank: i + 1 }))
}

export const ALL_MODELS: RankedModel[] = Object.values(MODELS_BY_CATEGORY).flat()
export const MODEL_BY_ID = new Map(ALL_MODELS.map((m) => [m.id, m]))

export function groupByTier(models: RankedModel[]) {
  return TIERS.map((t) => ({ tier: t, models: models.filter((m) => m.tier === t.id) }))
}

/** 按发布时间倒序的最新动态 */
export const LATEST = [...ALL_MODELS]
  .filter((m) => m.released)
  .sort((a, b) => (b.released ?? '').localeCompare(a.released ?? ''))
  .slice(0, 24)

export const META = meta as { updatedAt: string; edition: string; changelog: { date: string; text: string }[] }
