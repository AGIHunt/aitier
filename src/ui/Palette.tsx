import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { audio } from '../audio/engine'
import { ALL_MODELS } from '../data'
import { TIER_BY_ID } from '../data/tiers'
import { useT, type Key } from '../i18n'
import { useStore } from '../store'
import { Badge, TierChip } from './bits'

/** ⌘K 搜索；对决模式下用来挑第二个选手 */
export function Palette() {
  const open = useStore((s) => s.paletteOpen)
  const mode = useStore((s) => s.paletteMode)
  const selectedId = useStore((s) => s.selectedId)
  const set = useStore((s) => s.set)
  const lang = useStore((s) => s.lang)
  const T = useT()
  const [q, setQ] = useState('')
  const [idx, setIdx] = useState(0)
  const input = useRef<HTMLInputElement>(null)

  const self = selectedId ? ALL_MODELS.find((m) => m.id === selectedId) : undefined
  const results = useMemo(() => {
    const k = q.trim().toLowerCase()
    let pool = ALL_MODELS
    if (mode === 'vs' && self) pool = pool.filter((m) => m.category === self.category && m.id !== self.id)
    if (!k) return pool.slice(0, 40)
    return pool
      .filter((m) =>
        [m.name, m.vendor.name, m.vendor.nameZh, m.family ?? '', m.tier, ...m.text.zh.tags, ...m.text.en.tags].join(' ').toLowerCase().includes(k),
      )
      .slice(0, 40)
  }, [q, mode, self])

  useEffect(() => {
    if (open) {
      setQ('')
      setIdx(0)
      setTimeout(() => input.current?.focus(), 30)
    }
  }, [open])

  const pick = (id: string) => {
    const m = ALL_MODELS.find((x) => x.id === id)!
    if (mode === 'vs' && self) {
      audio.hit(8)
      set({ paletteOpen: false, vs: [self.id, id] })
      return
    }
    audio.select(TIER_BY_ID[m.tier].semitone)
    audio.whoosh(0.7)
    set({ paletteOpen: false, category: m.category, focus: TIER_BY_ID[m.tier].level, overview: false })
    setTimeout(() => useStore.getState().select(id), 60)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="palette-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => set({ paletteOpen: false })}>
          <motion.div
            className="palette"
            initial={{ y: -20, scale: 0.97 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: -10, scale: 0.98 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="palette__head">
              {mode === 'vs' && self ? <span className="palette__mode">⚔ {self.name} VS …</span> : <span className="palette__mode">⌕</span>}
              <input
                ref={input}
                value={q}
                placeholder={mode === 'vs' ? T('vsPh') : T('searchPh')}
                onChange={(e) => {
                  setQ(e.target.value)
                  setIdx(0)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    setIdx((i) => Math.min(results.length - 1, i + 1))
                    audio.tick()
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault()
                    setIdx((i) => Math.max(0, i - 1))
                    audio.tick()
                  } else if (e.key === 'Enter' && results[idx]) pick(results[idx].id)
                  else if (e.key === 'Escape') set({ paletteOpen: false })
                }}
              />
            </div>
            <div className="palette__list">
              {results.map((m, i) => (
                <button key={m.id} className={`prow ${i === idx ? 'prow--on' : ''}`} onMouseEnter={() => setIdx(i)} onClick={() => pick(m.id)}>
                  <Badge vendor={m.vendor} size={24} />
                  <span className="prow__name">{m.name}</span>
                  <span className="prow__meta">
                    {m.vendor.label[lang]} · {T(`cat_${m.category}` as Key)}
                  </span>
                  <TierChip tier={m.tier} size="sm" />
                  <b className="prow__score">{Math.round(m.score)}</b>
                </button>
              ))}
              {!results.length && <div className="palette__empty">{T('noMatch')}</div>}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
