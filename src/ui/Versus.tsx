import { AnimatePresence, motion } from 'framer-motion'
import type { CSSProperties } from 'react'
import { useEffect } from 'react'
import { audio } from '../audio/engine'
import { MODEL_BY_ID } from '../data'
import { TIER_BY_ID } from '../data/tiers'
import { useStore } from '../store'
import type { RankedModel } from '../types'
import { Badge, TierChip } from './bits'

/** 从两边 benchmark 里找同名项逐项对比 */
function sharedBenchmarks(a: RankedModel, b: RankedModel) {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9一-鿿]/g, '')
  const out: { name: string; a: string; b: string; winner: 0 | 1 | 2 }[] = []
  for (const x of a.benchmarks) {
    const y = b.benchmarks.find((z) => norm(z.name) === norm(x.name))
    if (!y) continue
    const na = parseFloat(x.value.replace(/[^0-9.]/g, ''))
    const nb = parseFloat(y.value.replace(/[^0-9.]/g, ''))
    // 名次类指标（第 N）越小越好，其余越大越好
    const lowerBetter = /rank|名次/i.test(x.name)
    const winner = isNaN(na) || isNaN(nb) || na === nb ? 0 : (na > nb) !== lowerBetter ? 1 : 2
    out.push({ name: x.name, a: x.value, b: y.value, winner })
  }
  return out.slice(0, 6)
}

function Fighter({ m, side, win }: { m: RankedModel; side: 'l' | 'r'; win: boolean }) {
  const t = TIER_BY_ID[m.tier]
  return (
    <motion.div
      className={`fighter fighter--${side} ${win ? 'fighter--win' : ''}`}
      style={{ '--vc': m.vendor.color, '--tc': t.color } as CSSProperties}
      initial={{ x: side === 'l' ? -300 : 300, opacity: 0, skewX: side === 'l' ? -12 : 12 }}
      animate={{ x: 0, opacity: 1, skewX: 0 }}
      transition={{ type: 'spring', stiffness: 180, damping: 18, delay: side === 'l' ? 0.05 : 0.2 }}
    >
      <div className="fighter__mono">{m.vendor.monogram}</div>
      <Badge vendor={m.vendor} size={56} />
      <div className="fighter__name">{m.name}</div>
      <div className="fighter__vendor">{m.vendor.nameZh}</div>
      <div className="fighter__row">
        <TierChip tier={m.tier} size="lg" />
        <span className="fighter__score">{Math.round(m.score)}</span>
      </div>
      <div className="hp">
        <motion.i initial={{ width: 0 }} animate={{ width: `${m.score}%` }} transition={{ delay: 0.7, duration: 0.9, ease: 'easeOut' }} />
      </div>
      <div className="fighter__tagline">{m.tagline}</div>
    </motion.div>
  )
}

export function Versus() {
  const vs = useStore((s) => s.vs)
  const set = useStore((s) => s.set)
  const a = vs ? MODEL_BY_ID.get(vs[0]) : undefined
  const b = vs ? MODEL_BY_ID.get(vs[1]) : undefined

  useEffect(() => {
    if (!a || !b) return
    const timers = [
      setTimeout(() => audio.hit(0), 60),
      setTimeout(() => audio.hit(5), 260),
      setTimeout(() => audio.impact(), 520),
    ]
    const n = sharedBenchmarks(a, b).length
    for (let i = 0; i < n; i++) timers.push(setTimeout(() => audio.hit(3 + i), 1300 + i * 220))
    return () => timers.forEach(clearTimeout)
  }, [a, b])

  const rows = a && b ? sharedBenchmarks(a, b) : []
  const aWins = a && b ? a.score > b.score : false

  return (
    <AnimatePresence>
      {a && b && (
        <motion.div className="versus" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => set({ vs: null })}>
          <div className="versus__stripes" />
          <div className="versus__stage" onClick={(e) => e.stopPropagation()}>
            <Fighter m={a} side="l" win={aWins} />
            <motion.div
              className="versus__vs"
              initial={{ scale: 6, opacity: 0, rotate: -25 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ delay: 0.45, type: 'spring', stiffness: 400, damping: 14 }}
            >
              VS
            </motion.div>
            <Fighter m={b} side="r" win={!aWins} />
          </div>
          <div className="versus__rounds" onClick={(e) => e.stopPropagation()}>
            {rows.length ? (
              rows.map((r, i) => (
                <motion.div
                  key={r.name}
                  className="round"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 + i * 0.22 }}
                >
                  <span className={r.winner === 1 ? 'round__win' : ''}>{r.a}</span>
                  <em>{r.name}</em>
                  <span className={r.winner === 2 ? 'round__win' : ''}>{r.b}</span>
                </motion.div>
              ))
            ) : (
              <motion.div className="round round--none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
                两者没有同口径的公开基准，按综合分裁决
              </motion.div>
            )}
            <motion.div className="verdict" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.5 + rows.length * 0.22, type: 'spring' }}>
              WINNER · {(aWins ? a : b).name}
            </motion.div>
          </div>
          <button className="versus__close" onClick={() => set({ vs: null })}>
            ✕ 退出对决
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
