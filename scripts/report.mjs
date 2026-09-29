// 打印当前天梯（给人或 agent 看），并标出相对上一期的变化
// 用法：node scripts/report.mjs [llm|image|video] [--bench]
import { CATS, allModels, loadHistory, loadMeta, sortModels } from './lib.mjs'

const cats = CATS.filter((c) => process.argv.includes(c))
const withBench = process.argv.includes('--bench')
const meta = loadMeta()
const prev = loadHistory()
  .editions.filter((e) => e.id < meta.edition)
  .sort((a, b) => b.id.localeCompare(a.id))[0]

console.log(`# 当前第 ${meta.issue} 期（${meta.edition}）${prev ? `，对比上一期 ${prev.id}` : '，无上一期'}\n`)
for (const c of cats.length ? cats : CATS) {
  const list = sortModels(allModels().filter((m) => m.category === c))
  console.log(`## ${c}（${list.length}）`)
  list.forEach((m, i) => {
    const p = prev?.tiers[m.id]
    const mv = !prev ? '' : !p ? ' NEW' : p[0] !== m.tier ? ` (${p[0]}→${m.tier})` : p[1] !== m.score ? ` (${p[1]}→${m.score})` : ''
    const b = withBench ? ' | ' + m.benchmarks.map((x) => `${x.name}=${x.value}${x.note ? `(${x.note})` : ''}`).join('; ') : ''
    console.log(`${String(i + 1).padStart(3)}. ${m.tier.padEnd(3)} ${String(m.score).padStart(5)}  ${m.name}  [${m.vendorId}/${m.id}] ${m.status}${m.released ? ' ' + m.released : ''}${mv}${b}`)
  })
  if (prev) {
    const gone = Object.keys(prev.tiers).filter((id) => !allModels().some((m) => m.id === id))
    if (gone.length) console.log(`  已移除：${gone.join(', ')}`)
  }
  console.log()
}
