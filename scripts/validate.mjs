// 校验 src/data/vendors/*.json：字段、枚举、重复 id、tier 与 score 是否对齐
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const DIR = new URL('../src/data/vendors/', import.meta.url).pathname
const TIERS = { SSS: [97, 100], SS: [93, 96.99], S: [88, 92.99], A: [80, 87.99], B: [72, 79.99], C: [64, 71.99], D: [55, 63.99], E: [0, 54.99] }
const CATS = ['llm', 'image', 'video']
const STATUS = ['released', 'preview', 'rumored', 'deprecated']

let errors = 0
let warns = 0
const err = (f, m) => (errors++, console.log(`✖ ${f}: ${m}`))
const warn = (f, m) => (warns++, console.log(`⚠ ${f}: ${m}`))
const ids = new Map()
const counts = { llm: 0, image: 0, video: 0 }

for (const file of readdirSync(DIR).filter((f) => f.endsWith('.json'))) {
  let d
  try {
    d = JSON.parse(readFileSync(join(DIR, file), 'utf8'))
  } catch (e) {
    err(file, `JSON 解析失败 ${e.message}`)
    continue
  }
  const v = d.vendor
  for (const k of ['id', 'name', 'nameZh', 'color', 'monogram']) if (!v?.[k]) err(file, `vendor.${k} 缺失`)
  if (v?.color && !/^#[0-9a-f]{6}$/i.test(v.color)) err(file, `vendor.color 不是 #rrggbb`)
  for (const m of d.models ?? []) {
    const at = `${file} › ${m.id}`
    if (ids.has(m.id)) err(at, `id 与 ${ids.get(m.id)} 重复`)
    ids.set(m.id, file)
    if (!CATS.includes(m.category)) err(at, `category 非法: ${m.category}`)
    if (!TIERS[m.tier]) err(at, `tier 非法: ${m.tier}`)
    if (!STATUS.includes(m.status)) err(at, `status 非法: ${m.status}`)
    if (typeof m.score !== 'number') err(at, 'score 不是数字')
    else if (TIERS[m.tier]) {
      const [lo, hi] = TIERS[m.tier]
      if (m.score < lo || m.score > hi) warn(at, `score ${m.score} 不在 ${m.tier} 档区间 ${lo}–${Math.floor(hi)}`)
    }
    if (m.prevTier && !TIERS[m.prevTier]) err(at, `prevTier 非法: ${m.prevTier}`)
    for (const k of ['name', 'tagline']) if (!m[k]) err(at, `${k} 缺失`)
    for (const k of ['tags', 'highlights', 'benchmarks', 'sources']) if (!Array.isArray(m[k])) err(at, `${k} 应为数组`)
    if (m.released && !/^\d{4}(-\d{2}(-\d{2})?)?$/.test(m.released)) err(at, `released 格式应为 YYYY[-MM[-DD]]: ${m.released}`)
    counts[m.category] = (counts[m.category] ?? 0) + 1
  }
}

console.log(`\n${ids.size} 个模型（LLM ${counts.llm} / 图像 ${counts.image} / 视频 ${counts.video}），${errors} 个错误，${warns} 个提醒`)
process.exit(errors ? 1 : 0)
