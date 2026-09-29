import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'
import { useMemo } from 'react'
import { audio } from '../audio/engine'
import { groupByTier, LATEST, MODELS_BY_CATEGORY, VENDORS } from '../data'
import { CATEGORIES } from '../data/tiers'
import { applyDocumentLang, editionLabel, TIER_TEXT, useT, type Key } from '../i18n'
import { useStore } from '../store'
import type { Category } from '../types'
import { Badge, TierChip } from './bits'

export function TopBar() {
  const category = useStore((s) => s.category)
  const muted = useStore((s) => s.muted)
  const view = useStore((s) => s.view)
  const overview = useStore((s) => s.overview)
  const set = useStore((s) => s.set)
  const lang = useStore((s) => s.lang)
  const T = useT()

  const switchCat = (c: Category) => {
    if (c === category) return
    audio.whoosh(0.8)
    audio.tick()
    set({ category: c, selectedId: null, vendorFilter: null, focus: 0, overview: false, shock: useStore.getState().shock + 1 })
  }
  const toggleMute = () => {
    const m = !muted
    audio.init()
    audio.startAmbient()
    audio.setMuted(m)
    set({ muted: m })
    try {
      localStorage.setItem('airank:muted', m ? '1' : '0')
    } catch {
      /* ignore */
    }
  }

  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand__mark">▲</span>
        <div>
          <div className="brand__name">{T('title')}</div>
          <div className="brand__ed">{editionLabel(lang)}</div>
        </div>
      </div>

      <nav className="cats">
        {CATEGORIES.map((c) => (
          <button key={c.id} className={`cat ${c.id === category ? 'cat--on' : ''}`} onClick={() => switchCat(c.id)}>
            <span className="cat__icon">{c.icon}</span>
            <span className="cat__label">{T(`cat_${c.id}` as Key)}</span>
            <span className="cat__count">{MODELS_BY_CATEGORY[c.id].length}</span>
            {c.id === category && <motion.span layoutId="cat-glow" className="cat__glow" />}
          </button>
        ))}
      </nav>

      <div className="actions">
        <button className="icon-btn" title={T('search')} onClick={() => (audio.tick(), set({ paletteOpen: true, paletteMode: 'search' }))}>
          <span>⌕</span>
          <kbd>⌘K</kbd>
        </button>
        {view === '3d' && (
          <button className={`icon-btn ${overview ? 'icon-btn--on' : ''}`} title={T('overview')} onClick={() => (audio.whoosh(0.9, !overview), set({ overview: !overview, selectedId: null }))}>
            {T('overview')}
          </button>
        )}
        <button className="icon-btn" title="切换视图 (V)" onClick={() => (audio.tick(), set({ view: view === '3d' ? 'table' : '3d', selectedId: null }))}>
          {view === '3d' ? T('table') : '3D'}
        </button>
        <LangButton />
        <button className={`icon-btn sound ${muted ? '' : 'sound--on'}`} title={T('sound')} onClick={toggleMute}>
          <span className="eq">
            <i />
            <i />
            <i />
            <i />
          </span>
        </button>
      </div>
    </header>
  )
}

export function TierRail() {
  const category = useStore((s) => s.category)
  const focus = useStore((s) => s.focus)
  const overview = useStore((s) => s.overview)
  const set = useStore((s) => s.set)
  const lang = useStore((s) => s.lang)
  const groups = useMemo(() => groupByTier(MODELS_BY_CATEGORY[category]), [category])
  const total = MODELS_BY_CATEGORY[category].length

  return (
    <aside className="rail">
      {groups.map(({ tier, models }) => {
        const on = !overview && Math.round(focus) === tier.level
        return (
          <button
            key={tier.id}
            className={`rail__row ${on ? 'rail__row--on' : ''} ${models.length ? '' : 'rail__row--empty'}`}
            style={{ '--tc': tier.color, '--tg': tier.glow } as CSSProperties}
            onMouseEnter={() => audio.hover(100 - tier.level * 7, true)}
            onClick={() => {
              audio.whoosh(0.6, tier.level < focus)
              set({ focus: tier.level, selectedId: null, overview: false })
            }}
          >
            <TierChip tier={tier.id} size="sm" />
            <span className="rail__bar">
              <i style={{ width: `${total ? (models.length / total) * 100 : 0}%` }} />
            </span>
            <span className="rail__count">{models.length}</span>
            <span className="rail__desc">
              {TIER_TEXT[lang][tier.id].label} · {TIER_TEXT[lang][tier.id].desc}
            </span>
          </button>
        )
      })}
    </aside>
  )
}

export function VendorBar() {
  const category = useStore((s) => s.category)
  const vf = useStore((s) => s.vendorFilter)
  const set = useStore((s) => s.set)
  const lang = useStore((s) => s.lang)
  const T = useT()
  const vendors = useMemo(() => {
    const ids = new Set(MODELS_BY_CATEGORY[category].map((m) => m.vendor.id))
    return VENDORS.filter((v) => ids.has(v.id))
  }, [category])
  return (
    <div className="vendors">
      <button className={`vchip ${vf ? '' : 'vchip--on'}`} onClick={() => (audio.tick(), set({ vendorFilter: null }))}>
        {T('all')}
      </button>
      {vendors.map((v) => (
        <button
          key={v.id}
          className={`vchip ${vf === v.id ? 'vchip--on' : ''}`}
          style={{ '--vc': v.color } as CSSProperties}
          onClick={() => (audio.tick(), set({ vendorFilter: vf === v.id ? null : v.id }))}
          title={v.blurbL[lang]}
        >
          <Badge vendor={v} size={20} />
          <span>{v.name}</span>
        </button>
      ))}
    </div>
  )
}

export function Ticker() {
  const select = useStore((s) => s.select)
  const set = useStore((s) => s.set)
  const items = [...LATEST, ...LATEST]
  return (
    <div className="ticker">
      <span className="ticker__label">LATEST</span>
      <div className="ticker__track">
        <div className="ticker__inner">
          {items.map((m, i) => (
            <button
              key={i}
              className="ticker__item"
              onClick={() => {
                set({ category: m.category, view: useStore.getState().view })
                setTimeout(() => select(m.id), 60)
                audio.select(12)
              }}
            >
              <span className="ticker__date">{m.released?.slice(5) ?? ''}</span>
              <Badge vendor={m.vendor} size={16} />
              <span>{m.name}</span>
              <TierChip tier={m.tier} size="sm" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export function LangButton({ className = '' }: { className?: string }) {
  const lang = useStore((s) => s.lang)
  const set = useStore((s) => s.set)
  const T = useT()
  return (
    <button
      className={`icon-btn lang-btn ${className}`}
      title={T('langTitle')}
      onClick={() => {
        const next = lang === 'zh' ? 'en' : 'zh'
        audio.tick()
        set({ lang: next })
        applyDocumentLang(next)
        try {
          localStorage.setItem('airank:lang', next)
        } catch {
          /* ignore */
        }
      }}
    >
      {T('lang')}
    </button>
  )
}

/** 音频未解锁时的轻提示：点任意处即可开声 */
export function SoundPill() {
  const audioOn = useStore((s) => s.audioOn)
  const muted = useStore((s) => s.muted)
  const intro = useStore((s) => s.intro)
  const T = useT()
  if (audioOn || muted) return null
  return (
    <div className={`sound-pill ${intro ? 'sound-pill--intro' : ''}`}>
      <span className="eq eq--pill">
        <i />
        <i />
        <i />
        <i />
      </span>
      {T('soundPill')}
    </div>
  )
}
