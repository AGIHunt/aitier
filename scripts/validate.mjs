// 校验数据：字段、枚举、重复 id、tier/score 对齐、档位名额、英文覆盖层完整性
// 用法：node scripts/validate.mjs [--strict]   （--strict 时缺英文翻译也算错误，打包前用）
import { CATS, TIER_RANGE, allModels, loadLocale, loadVendors } from './lib.mjs'

const strict = process.argv.includes('--strict')
const CJK = /[\u4e00-\u9fff]/
const STATUS = ['released', 'preview', 'rumored', 'deprecated']
let errors = 0
let warns = 0
const err = (f, m) => (errors++, console.log(`✖ ${f}: ${m}`))
const warn = (f, m) => (warns++, console.log(`⚠ ${f}: ${m}`))
const ids = new Map()

for (const { id: vid, data: d } of loadVendors()) {
  const file = `${vid}.json`
  const v = d.vendor
  if (v?.id !== vid) err(file, `vendor.id (${v?.id}) 必须等于文件名 (${vid})`)
  for (const k of ['id', 'name', 'nameZh', 'color', 'monogram', 'blurb']) if (!v?.[k]) err(file, `vendor.${k} 缺失`)
  if (v?.color && !/^#[0-9a-f]{6}$/i.test(v.color)) err(file, `vendor.color 不是 #rrggbb`)
  const en = loadLocale(vid)
  const miss = (m) => (strict ? err : warn)(file, m)
  if (!en) miss('缺英文覆盖层 locales/en/' + file)
  else if (!en.vendor?.blurb) miss('英文覆盖层缺 vendor.blurb')

  for (const m of d.models ?? []) {
    const at = `${file} › ${m.id}`
    if (!/^[a-z0-9][a-z0-9.-]*$/.test(m.id ?? '')) err(at, 'id 只能用小写字母、数字、点和连字符')
    if (ids.has(m.id)) err(at, `id 与 ${ids.get(m.id)} 重复`)
    ids.set(m.id, file)
    if (!CATS.includes(m.category)) err(at, `category 非法: ${m.category}`)
    if (!TIER_RANGE[m.tier]) err(at, `tier 非法: ${m.tier}`)
    if (!STATUS.includes(m.status)) err(at, `status 非法: ${m.status}`)
    if (typeof m.score !== 'number') err(at, 'score 不是数字')
    else if (TIER_RANGE[m.tier]) {
      const [lo, hi] = TIER_RANGE[m.tier]
      if (m.score < lo || m.score > hi) err(at, `score ${m.score} 不在 ${m.tier} 档区间 ${lo}–${Math.floor(hi)}`)
    }
    for (const k of ['name', 'tagline']) if (!m[k]) err(at, `${k} 缺失`)
    for (const k of ['tags', 'highlights', 'benchmarks', 'sources']) if (!Array.isArray(m[k])) err(at, `${k} 应为数组`)
    if (m.released && !/^\d{4}(-\d{2}(-\d{2})?)?$/.test(m.released)) err(at, `released 格式应为 YYYY[-MM[-DD]]: ${m.released}`)
    if (m.status === 'rumored' && ['SSS', 'SS'].includes(m.tier)) warn(at, '传闻模型不应占 SSS/SS')
    if (en) {
      const e = en.models?.[m.id]
      if (!e) miss(`${m.id} 缺英文`)
      else {
        if (!e.tagline) miss(`${m.id} 缺英文 tagline`)
        if ((e.highlights ?? []).length !== m.highlights.length) miss(`${m.id} 英文 highlights 条数不一致`)
        if ((e.tags ?? []).length !== m.tags.length) miss(`${m.id} 英文 tags 条数不一致`)
        for (const b of m.benchmarks) {
          if (b.note && !e.bench?.[b.name]) miss(`${m.id} 英文缺 bench note: ${b.name}`)
          if (CJK.test(b.name) && !e.benchName?.[b.name]) miss(`${m.id} 英文缺 benchName: ${b.name}`)
          if (CJK.test(String(b.value)) && !e.benchValue?.[b.name]) miss(`${m.id} 英文缺 benchValue: ${b.name}`)
        }
        for (const k of ['pricing', 'context', 'params']) if (m[k] && CJK.test(m[k]) && !e[k]) miss(`${m.id} 英文缺 ${k}`)
      }
    }
  }
  if (en) for (const k of Object.keys(en.models ?? {})) if (!d.models.some((m) => m.id === k)) warn(`locales/en/${file}`, `多余条目 ${k}（模型已删除或改名）`)
}

// 档位名额
const models = allModels()
for (const c of CATS) {
  const list = models.filter((m) => m.category === c)
  const n = (t) => list.filter((m) => m.tier === t && m.status !== 'rumored').length
  if (n('SSS') > 2) warn(c, `SSS 有 ${n('SSS')} 个（建议 ≤2）`)
  if (n('SS') > 3) warn(c, `SS 有 ${n('SS')} 个（建议 ≤3）`)
  if (n('S') > 7) warn(c, `S 有 ${n('S')} 个（建议 ≤7）`)
}

const cnt = Object.fromEntries(CATS.map((c) => [c, models.filter((m) => m.category === c).length]))
console.log(`\n${ids.size} 个模型（LLM ${cnt.llm} / 图像 ${cnt.image} / 视频 ${cnt.video}），${errors} 个错误，${warns} 个提醒`)
process.exit(errors ? 1 : 0)
