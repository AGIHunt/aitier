export type Lang = 'zh' | 'en'
export type Category = 'llm' | 'image' | 'video'
export type TierId = 'SSS' | 'SS' | 'S' | 'A' | 'B' | 'C' | 'D' | 'E'
export type ModelStatus = 'released' | 'preview' | 'rumored' | 'deprecated'

// ───────────── 存储格式（src/data/vendors/*.json，中文为主语言） ─────────────

export interface Vendor {
  id: string
  /** 英文名 / 官方名 */
  name: string
  nameZh: string
  country: string
  color: string
  accent: string
  monogram: string
  blurb: string
}

export interface Benchmark {
  name: string
  value: string
  note?: string
  source?: string
}

export interface Model {
  id: string
  name: string
  category: Category
  family?: string
  released: string | null
  status: ModelStatus
  openWeights: boolean
  params?: string | null
  context?: string | null
  pricing?: string | null
  tier: TierId
  score: number
  tags: string[]
  tagline: string
  highlights: string[]
  benchmarks: Benchmark[]
  notes?: string
  sources: string[]
}

export interface VendorFile {
  vendor: Vendor
  models: Model[]
  tierRationale?: string
}

/** 英文覆盖层（src/data/locales/en/<vendorId>.json），按模型 id 索引 */
export interface LocaleFile {
  vendor?: { blurb?: string }
  models: Record<
    string,
    {
      tagline?: string
      highlights?: string[]
      tags?: string[]
      notes?: string
      /** benchmark 名 → 该条 note 的译文 */
      bench?: Record<string, string>
      /** 以下仅在中文原文含中文字符时提供 */
      pricing?: string
      context?: string
      params?: string
      /** benchmark 原名 → 英文名 */
      benchName?: Record<string, string>
      /** benchmark 原名 → 英文 value */
      benchValue?: Record<string, string>
    }
  >
}

/** 历史快照（src/data/history.json）：每期发布时记录每个模型的档位和分数 */
export interface HistoryFile {
  editions: { id: string; issue: number; tiers: Record<string, [TierId, number]> }[]
}

export interface MetaFile {
  /** 当前期的 id（日期） */
  edition: string
  issue: number
  changelog: { date: string; zh: string; en: string }[]
}

// ───────────── 运行时 ─────────────

export interface ModelText {
  tagline: string
  highlights: string[]
  tags: string[]
  notes?: string
  pricing?: string | null
  context?: string | null
  params?: string | null
  /** 与 benchmarks 等长 */
  bench: { name: string; value: string; note?: string }[]
}

export interface RuntimeVendor extends Vendor {
  label: Record<Lang, string>
  blurbL: Record<Lang, string>
}

export type Movement = { kind: 'new' } | { kind: 'up' | 'down'; by: number; from: TierId } | null

export interface RankedModel extends Omit<Model, 'tags' | 'tagline' | 'highlights' | 'notes'> {
  vendor: RuntimeVendor
  /** 类别内名次（1 起） */
  rank: number
  text: Record<Lang, ModelText>
  /** 相对上一期的档位变化；首期为 null */
  move: Movement
}
