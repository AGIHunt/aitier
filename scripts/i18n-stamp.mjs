// 翻译完成后给英文覆盖层盖「中文指纹」戳，之后中文一改，validate 就会提示译文过期
// 用法：node scripts/i18n-stamp.mjs [modelId ...]   不带参数 = 给所有模型盖戳（确认译文都是最新时才这样做）
import { join } from 'node:path'
import { EN_DIR, loadLocale, loadVendors, writeJSON, zhHash } from './lib.mjs'

const only = new Set(process.argv.slice(2))
let n = 0
for (const { id, data } of loadVendors()) {
  const en = loadLocale(id)
  if (!en) continue
  for (const m of data.models) {
    if (only.size && !only.has(m.id)) continue
    if (!en.models[m.id]) continue
    en.models[m.id]._zh = zhHash(m)
    n++
  }
  writeJSON(join(EN_DIR, `${id}.json`), en)
}
console.log(`已盖戳 ${n} 个模型`)
