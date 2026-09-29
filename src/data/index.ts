import type {
  Category,
  HistoryFile,
  LocaleFile,
  MetaFile,
  Model,
  ModelText,
  Movement,
  RankedModel,
  RuntimeVendor,
  TierId,
  VendorFile,
} from '../types'
import history from './history.json'
import meta from './meta.json'
import { TIER_BY_ID, TIERS } from './tiers'

// 每家厂商一个 JSON：新增厂商只需往 vendors/ 里丢一个文件（英文覆盖层放 locales/en/ 同名文件）
const files = import.meta.glob<VendorFile>('./vendors/*.json', { eager: true, import: 'default' })
const enFiles = import.meta.glob<LocaleFile>('./locales/en/*.json', { eager: true, import: 'default' })
const enByVendor: Record<string, LocaleFile> = {}
for (const [path, f] of Object.entries(enFiles)) enByVendor[path.split('/').pop()!.replace('.json', '')] = f

export const META = meta as MetaFile
const HISTORY = history as HistoryFile

/** 上一期快照：当前期之前最近的一期 */
const prevEdition = [...HISTORY.editions].filter((e) => e.id < META.edition).sort((a, b) => b.id.localeCompare(a.id))[0]

function movement(id: string, tier: TierId): Movement {
  if (!prevEdition) return null
  const prev = prevEdition.tiers[id]
  if (!prev) return { kind: 'new' }
  const d = TIER_BY_ID[prev[0]].level - TIER_BY_ID[tier].level
  if (d === 0) return null
  return { kind: d > 0 ? 'up' : 'down', by: Math.abs(d), from: prev[0] }
}

function zhText(m: Model): ModelText {
  return {
    tagline: m.tagline,
    highlights: m.highlights,
    tags: m.tags,
    notes: m.notes,
    pricing: m.pricing,
    context: m.context,
    params: m.params,
    bench: m.benchmarks.map((b) => ({ name: b.name, value: b.value, note: b.note })),
  }
}

function enText(m: Model, loc: LocaleFile | undefined): ModelText {
  const e = loc?.models[m.id]
  const zh = zhText(m)
  if (!e) return zh
  return {
    tagline: e.tagline ?? zh.tagline,
    highlights: e.highlights ?? zh.highlights,
    tags: e.tags ?? zh.tags,
    notes: e.notes ?? zh.notes,
    pricing: e.pricing ?? zh.pricing,
    context: e.context ?? zh.context,
    params: e.params ?? zh.params,
    bench: m.benchmarks.map((b) => ({
      name: e.benchName?.[b.name] ?? b.name,
      value: e.benchValue?.[b.name] ?? b.value,
      note: b.note ? (e.bench?.[b.name] ?? b.note) : undefined,
    })),
  }
}

export const VENDORS: RuntimeVendor[] = []
const all: Omit<RankedModel, 'rank'>[] = []

for (const file of Object.values(files)) {
  const loc = enByVendor[file.vendor.id]
  const v: RuntimeVendor = {
    ...file.vendor,
    label: { zh: file.vendor.nameZh, en: file.vendor.name },
    blurbL: { zh: file.vendor.blurb, en: loc?.vendor?.blurb ?? file.vendor.blurb },
  }
  VENDORS.push(v)
  for (const m of file.models) {
    if (!TIER_BY_ID[m.tier]) {
      console.warn(`[airank] ${m.id} 的 tier 非法: ${m.tier}`)
      continue
    }
    const { tags: _t, tagline: _tl, highlights: _h, notes: _n, ...rest } = m
    all.push({ ...rest, vendor: v, text: { zh: zhText(m), en: enText(m, loc) }, move: movement(m.id, m.tier) })
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
  .filter((m) => m.released && m.status !== 'rumored')
  .sort((a, b) => (b.released ?? '').localeCompare(a.released ?? ''))
  .slice(0, 24)
