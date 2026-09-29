// 期号管理
//   node scripts/edition.mjs publish            把当前数据快照写入 history.json（当前期，可重复执行覆盖）
//   node scripts/edition.mjs new [YYYY-MM-DD]   开新一期：先确保当前期已发布快照，再把 meta 切到新日期、期号 +1
//   node scripts/edition.mjs log "<中文>" "<English>"   给当前期追加一条更新日志
import { allModels, loadHistory, loadMeta, saveHistory, saveMeta, today } from './lib.mjs'

const [cmd, ...args] = process.argv.slice(2)
const meta = loadMeta()
const history = loadHistory()

function snapshot() {
  const tiers = Object.fromEntries(allModels().map((m) => [m.id, [m.tier, m.score]]))
  const i = history.editions.findIndex((e) => e.id === meta.edition)
  const entry = { id: meta.edition, issue: meta.issue, tiers }
  if (i >= 0) history.editions[i] = entry
  else history.editions.push(entry)
  history.editions.sort((a, b) => a.id.localeCompare(b.id))
  saveHistory(history)
  console.log(`已快照第 ${meta.issue} 期（${meta.edition}），${Object.keys(tiers).length} 个模型`)
}

if (cmd === 'publish') snapshot()
else if (cmd === 'new') {
  const date = args[0] ?? today()
  if (date <= meta.edition) {
    console.error(`新一期日期 ${date} 必须晚于当前期 ${meta.edition}`)
    process.exit(1)
  }
  if (!history.editions.some((e) => e.id === meta.edition)) snapshot()
  meta.edition = date
  meta.issue += 1
  saveMeta(meta)
  console.log(`已开启第 ${meta.issue} 期（${date}）。改完数据后运行 edition.mjs log 与 edition.mjs publish`)
} else if (cmd === 'log') {
  const [zh, en] = args
  if (!zh || !en) {
    console.error('用法：edition.mjs log "<中文>" "<English>"')
    process.exit(1)
  }
  meta.changelog.unshift({ date: meta.edition, zh, en })
  saveMeta(meta)
  console.log('已追加更新日志')
} else {
  console.error('用法：edition.mjs publish | new [YYYY-MM-DD] | log "<中文>" "<English>"')
  process.exit(1)
}
