import { AnimatePresence, motion } from 'framer-motion'
import type { CSSProperties } from 'react'
import { audio } from '../audio/engine'
import { MODEL_BY_ID, MODELS_BY_CATEGORY } from '../data'
import { TIER_BY_ID } from '../data/tiers'
import { useT } from '../i18n'
import { useStore } from '../store'
import type { RankedModel } from '../types'
import { Badge, Move, TierChip } from './bits'

function ScoreRing({ m }: { m: RankedModel }) {
  const t = TIER_BY_ID[m.tier]
  const r = 46
  const c = 2 * Math.PI * r
  return (
    <svg className="ring" viewBox="0 0 120 120" width="112" height="112">
      <defs>
        <linearGradient id={`rg-${m.id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={t.glow} />
          <stop offset="1" stopColor={t.color} />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r={r} className="ring__bg" />
      <motion.circle
        cx="60"
        cy="60"
        r={r}
        stroke={`url(#rg-${m.id})`}
        className="ring__fg"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c * (1 - m.score / 100) }}
        transition={{ duration: 1.1, ease: 'easeOut', delay: 0.15 }}
      />
      <text x="60" y="66" className="ring__num" fill={t.glow}>
        {Math.round(m.score)}
      </text>
      <text x="60" y="84" className="ring__lbl">
        SCORE
      </text>
    </svg>
  )
}

export function DetailPanel() {
  const id = useStore((s) => s.selectedId)
  const view = useStore((s) => s.view)
  const lang = useStore((s) => s.lang)
  const T = useT()
  const m = id ? MODEL_BY_ID.get(id) : undefined
  const select = useStore((s) => s.select)
  const set = useStore((s) => s.set)

  const list = m ? MODELS_BY_CATEGORY[m.category] : []
  const peers = m ? list.filter((x) => x.tier === m.tier && x.id !== m.id).slice(0, 8) : []
  const go = (d: number) => {
    if (!m) return
    const n = list[(m.rank - 1 + d + list.length) % list.length]
    audio.select(TIER_BY_ID[n.tier].semitone)
    audio.whoosh(0.5)
    select(n.id)
    set({ focus: TIER_BY_ID[n.tier].level })
  }
  const tx = m?.text[lang]

  return (
    <AnimatePresence>
      {m && tx && (
        <motion.aside
          key="panel"
          className={`panel ${view === 'table' ? 'panel--table' : ''}`}
          style={{ '--tc': TIER_BY_ID[m.tier].color, '--tg': TIER_BY_ID[m.tier].glow, '--vc': m.vendor.color } as CSSProperties}
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 60, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 30 }}
        >
          <div className="panel__top">
            <button className="panel__nav" onClick={() => go(-1)} title={T('prev')}>
              ‹
            </button>
            <span className="panel__rank">
              #{m.rank} / {list.length}
            </span>
            <button className="panel__nav" onClick={() => go(1)} title={T('next')}>
              ›
            </button>
            <button className="panel__close" onClick={() => select(null)} title={T('close')}>
              ✕
            </button>
          </div>

          <div className="panel__scroll">
            <motion.div key={m.id + lang} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <div className="panel__head">
                <div>
                  <div className="panel__vendor">
                    <Badge vendor={m.vendor} size={26} />
                    <span>{m.vendor.label[lang]}</span>
                    <span className="dim">{m.vendor.country}</span>
                  </div>
                  <h2 className="panel__name">{m.name}</h2>
                  <div className="panel__tagline">{tx.tagline}</div>
                  <div className="panel__chips">
                    <TierChip tier={m.tier} size="lg" />
                    <Move m={m} />
                    <span className={`status status--${m.status}`}>{T(`status_${m.status}`)}</span>
                    {m.openWeights && <span className="status status--open">{T('openWeights')}</span>}
                  </div>
                </div>
                <ScoreRing m={m} />
              </div>

              <div className="tags">
                {tx.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>

              <dl className="facts">
                <div>
                  <dt>{T('released')}</dt>
                  <dd>{m.released ?? '—'}</dd>
                </div>
                <div>
                  <dt>{m.category === 'llm' ? T('context') : T('spec')}</dt>
                  <dd>{tx.context ?? '—'}</dd>
                </div>
                <div>
                  <dt>{T('params')}</dt>
                  <dd>{tx.params ?? '—'}</dd>
                </div>
                <div>
                  <dt>{T('price')}</dt>
                  <dd>{tx.pricing ?? '—'}</dd>
                </div>
              </dl>

              {tx.highlights.length > 0 && (
                <section>
                  <h3>{T('highlights')}</h3>
                  <ul className="hl">
                    {tx.highlights.map((h, i) => (
                      <motion.li key={i} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.07 }}>
                        {h}
                      </motion.li>
                    ))}
                  </ul>
                </section>
              )}

              {m.benchmarks.length > 0 && (
                <section>
                  <h3>{T('benchmarks')}</h3>
                  <div className="bench">
                    {m.benchmarks.map((b, i) => (
                      <a key={i} className="bench__row" href={b.source} target="_blank" rel="noreferrer">
                        <span className="bench__name">{tx.bench[i].name}</span>
                        <span className="bench__val">{tx.bench[i].value}</span>
                        <span className="bench__note">{tx.bench[i].note}</span>
                      </a>
                    ))}
                  </div>
                </section>
              )}

              {tx.notes && <p className="notes">{tx.notes}</p>}

              {peers.length > 0 && (
                <section>
                  <h3>{T('peers')}</h3>
                  <div className="peers">
                    {peers.map((p) => (
                      <button key={p.id} className="peer" onClick={() => (audio.select(TIER_BY_ID[p.tier].semitone), select(p.id))}>
                        <Badge vendor={p.vendor} size={18} />
                        <span>{p.name}</span>
                        <b>{Math.round(p.score)}</b>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {m.sources.length > 0 && (
                <div className="sources">
                  {T('sources')}
                  {m.sources.slice(0, 6).map((s, i) => (
                    <a key={i} href={s} target="_blank" rel="noreferrer">
                      [{i + 1}]
                    </a>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* 对决按钮固定在面板底部，不用滚动 */}
          <div className="panel__foot">
            <button
              className="vs-btn"
              onClick={() => {
                audio.hit(6)
                set({ paletteOpen: true, paletteMode: 'vs' })
              }}
            >
              {T('duel')}
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
