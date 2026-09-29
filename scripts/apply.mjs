// 把一个修改方案（patch JSON）应用到 vendors/ 数据
// 用法：node scripts/apply.mjs <patch.json> [--dry]
// patch 格式：
// {
//   "changes": [{ "id": "...", "tier": "S", "score": 90, "status"?: "...", "reason": "..." , ...其它要覆盖的字段 }],
//   "remove":  [{ "id": "...", "reason": "..." }],
//   "add":     [{ "vendorId": "bytedance", "model": { 完整模型对象 } }],
//   "benchmarkUpdates": [{ "id": "...", "benchmarks": [ 完整数组 ] }],
//   "vendors": [{ "vendor": { 完整 vendor 对象 }, "models": [] }]    // 新厂商
// }
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { VENDOR_DIR, loadVendors, readJSON, writeJSON } from './lib.mjs'

const [patchPath] = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const dry = process.argv.includes('--dry')
if (!patchPath) {
  console.error('用法：node scripts/apply.mjs <patch.json> [--dry]')
  process.exit(1)
}
const patch = readJSON(patchPath)
const vendors = loadVendors()
const find = (id) => {
  for (const v of vendors) {
    const i = v.data.models.findIndex((m) => m.id === id)
    if (i >= 0) return { v, i }
  }
  return null
}
const META_KEYS = new Set(['id', 'reason', 'evidence'])
const log = []

for (const nv of patch.vendors ?? []) {
  const file = join(VENDOR_DIR, `${nv.vendor.id}.json`)
  if (existsSync(file)) {
    log.push(`跳过新厂商 ${nv.vendor.id}：已存在`)
    continue
  }
  const entry = { file, id: nv.vendor.id, data: { vendor: nv.vendor, models: nv.models ?? [] } }
  vendors.push(entry)
  log.push(`+ 新厂商 ${nv.vendor.id}`)
}
for (const c of patch.changes ?? []) {
  const hit = find(c.id)
  if (!hit) {
    log.push(`✖ 找不到 ${c.id}`)
    continue
  }
  const m = hit.v.data.models[hit.i]
  const diff = []
  for (const [k, val] of Object.entries(c)) {
    if (META_KEYS.has(k)) continue
    if (JSON.stringify(m[k]) !== JSON.stringify(val)) diff.push(`${k}: ${JSON.stringify(m[k])} → ${JSON.stringify(val)}`)
    m[k] = val
  }
  log.push(`~ ${c.id}  ${diff.join('  ')}${c.reason ? `  // ${c.reason}` : ''}`)
}
for (const b of patch.benchmarkUpdates ?? []) {
  const hit = find(b.id)
  if (!hit) {
    log.push(`✖ 找不到 ${b.id}`)
    continue
  }
  hit.v.data.models[hit.i].benchmarks = b.benchmarks
  log.push(`~ ${b.id}  benchmarks 更新（${b.benchmarks.length} 条）`)
}
for (const r of patch.remove ?? []) {
  const hit = find(r.id)
  if (!hit) {
    log.push(`✖ 找不到 ${r.id}`)
    continue
  }
  hit.v.data.models.splice(hit.i, 1)
  log.push(`- ${r.id}${r.reason ? `  // ${r.reason}` : ''}`)
}
for (const a of patch.add ?? []) {
  const v = vendors.find((x) => x.id === a.vendorId)
  if (!v) {
    log.push(`✖ 厂商不存在 ${a.vendorId}（先在 patch.vendors 里建）`)
    continue
  }
  if (find(a.model.id)) {
    log.push(`✖ 已存在 ${a.model.id}，改用 changes`)
    continue
  }
  v.data.models.push(a.model)
  log.push(`+ ${a.vendorId}/${a.model.id}  ${a.model.tier} ${a.model.score}`)
}

console.log(log.join('\n'))
if (dry) console.log('\n(--dry：未写入)')
else {
  for (const v of vendors) writeJSON(v.file, v.data)
  console.log('\n已写入。接着运行 npm run validate')
}
