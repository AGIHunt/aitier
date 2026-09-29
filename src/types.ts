export type Category = 'llm' | 'image' | 'video'
export type TierId = 'SSS' | 'SS' | 'S' | 'A' | 'B' | 'C' | 'D' | 'E'
export type ModelStatus = 'released' | 'preview' | 'rumored' | 'deprecated'

export interface Vendor {
  id: string
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
  /** 上一期的档位，用于显示升降箭头；新上榜留空 */
  prevTier?: TierId | null
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

/** 运行时使用的扁平模型：带上厂商引用 */
export interface RankedModel extends Model {
  vendor: Vendor
  /** 类别内名次（1 起） */
  rank: number
}
