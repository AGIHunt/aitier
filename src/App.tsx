import { lazy, Suspense, useEffect } from 'react'
import { audio } from './audio/engine'
import { MODEL_BY_ID, MODELS_BY_CATEGORY } from './data'
import { TIER_BY_ID, TIERS } from './data/tiers'
import { useT } from './i18n'
import { useStore } from './store'
import { DetailPanel } from './ui/DetailPanel'
import { Ticker, TierRail, TopBar, VendorBar } from './ui/Hud'
import { Intro } from './ui/Intro'
import { Palette } from './ui/Palette'
import { Slam } from './ui/Slam'
import { TableView } from './ui/TableView'
import { Versus } from './ui/Versus'

const Experience = lazy(() => import('./scene/Experience').then((m) => ({ default: m.Experience })))

function useKeys() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const s = useStore.getState()
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        s.set({ paletteOpen: !s.paletteOpen, paletteMode: 'search' })
        return
      }
      if (s.paletteOpen || !s.entered || s.intro) return
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return
      const list = MODELS_BY_CATEGORY[s.category]
      switch (e.key) {
        case 'Escape':
          if (s.vs) s.set({ vs: null })
          else if (s.selectedId) s.select(null)
          else if (s.overview) s.set({ overview: false })
          break
        case 'ArrowUp':
          if (s.view === '3d' && !s.selectedId) {
            e.preventDefault()
            audio.whoosh(0.5, true)
            s.set({ focus: Math.max(0, Math.round(s.focus) - 1), overview: false })
          }
          break
        case 'ArrowDown':
          if (s.view === '3d' && !s.selectedId) {
            e.preventDefault()
            audio.whoosh(0.5, false)
            s.set({ focus: Math.min(TIERS.length - 1, Math.round(s.focus) + 1), overview: false })
          }
          break
        case 'ArrowLeft':
        case 'ArrowRight': {
          const cur = s.selectedId ? MODEL_BY_ID.get(s.selectedId) : undefined
          const d = e.key === 'ArrowRight' ? 1 : -1
          const n = cur ? list[(cur.rank - 1 + d + list.length) % list.length] : list[0]
          if (!n) break
          audio.select(TIER_BY_ID[n.tier].semitone)
          s.select(n.id)
          s.set({ focus: TIER_BY_ID[n.tier].level })
          break
        }
        case 'o':
        case 'O':
          if (s.view === '3d') s.set({ overview: !s.overview, selectedId: null })
          break
        case 'v':
        case 'V':
          s.set({ view: s.view === '3d' ? 'table' : '3d' })
          break
        case 'm':
        case 'M':
          audio.setMuted(!s.muted)
          s.set({ muted: !s.muted })
          break
        case '1':
        case '2':
        case '3': {
          const c = (['llm', 'image', 'video'] as const)[Number(e.key) - 1]
          if (c !== s.category) {
            audio.whoosh(0.8)
            s.set({ category: c, selectedId: null, vendorFilter: null, focus: 0 })
          }
          break
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}

export default function App() {
  const entered = useStore((s) => s.entered)
  const intro = useStore((s) => s.intro)
  const view = useStore((s) => s.view)
  const T = useT()
  useKeys()

  return (
    <div className={`app ${entered ? 'app--in' : ''} ${intro ? 'app--intro' : ''} app--${view}`}>
      <div className="stage">
        {entered && view === '3d' && (
          <Suspense fallback={null}>
            <Experience />
          </Suspense>
        )}
        {entered && view === 'table' && <TableView />}
      </div>
      {entered && (
        <div className="hud">
          <TopBar />
          {view === '3d' && <TierRail />}
          <div className="bottom">
            <VendorBar />
            <Ticker />
          </div>
          {view === '3d' && <div className="hint-touch">{T('hintTouch')}</div>}
          {view === '3d' && (
            <div className="hint">
              {T('hint')} <kbd>←</kbd>
              <kbd>→</kbd> {T('hintNext')} <kbd>O</kbd> {T('hintOverview')}
            </div>
          )}
        </div>
      )}
      <DetailPanel />
      <Slam />
      <Palette />
      <Versus />
      <Intro />
    </div>
  )
}
