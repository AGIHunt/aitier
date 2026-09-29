import { AnimatePresence, motion } from 'framer-motion'
import type { CSSProperties } from 'react'
import { useMemo } from 'react'
import { audio } from '../audio/engine'
import { groupByTier, MODELS_BY_CATEGORY } from '../data'
import { useStore } from '../store'
import { Badge } from './bits'

/** 经典天梯表视图：可读性优先，也是手机端默认视图 */
export function TableView() {
  const category = useStore((s) => s.category)
  const vf = useStore((s) => s.vendorFilter)
  const selectedId = useStore((s) => s.selectedId)
  const select = useStore((s) => s.select)
  const groups = useMemo(() => groupByTier(MODELS_BY_CATEGORY[category]), [category])
  const total = MODELS_BY_CATEGORY[category].length

  return (
    <div className="table-view">
      <div className="tiers">
        {groups.map(({ tier, models }, gi) => (
          <motion.div
            key={`${category}-${tier.id}`}
            className="trow"
            style={{ '--tc': tier.color, '--tg': tier.glow } as CSSProperties}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: gi * 0.06 }}
          >
            <div className="trow__label">
              <span>{tier.id}</span>
              <small>{tier.label}</small>
            </div>
            <div className="trow__items">
              <AnimatePresence>
                {models.map((m, i) => {
                  const dim = vf && vf !== m.vendor.id
                  return (
                    <motion.button
                      layout
                      key={m.id}
                      className={`tcard ${selectedId === m.id ? 'tcard--on' : ''} ${m.status === 'rumored' ? 'tcard--rumor' : ''}`}
                      style={{ opacity: dim ? 0.18 : 1, '--vc': m.vendor.color } as CSSProperties}
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: dim ? 0.18 : 1, scale: 1 }}
                      transition={{ delay: gi * 0.06 + i * 0.025, type: 'spring', stiffness: 400, damping: 26 }}
                      onMouseEnter={() => audio.hover(m.score, m.openWeights)}
                      onClick={() => {
                        audio.select(tier.semitone)
                        select(m.id)
                      }}
                    >
                      <Badge vendor={m.vendor} size={34} />
                      <span className="tcard__name">{m.name}</span>
                      <span className="tcard__score">{Math.round(m.score)}</span>
                      {m.openWeights && <span className="tcard__open">OPEN</span>}
                    </motion.button>
                  )
                })}
              </AnimatePresence>
              {!models.length && <span className="trow__empty">— 虚位以待 —</span>}
            </div>
            <div className="trow__pct">{total ? Math.round((models.length / total) * 100) : 0}%</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
