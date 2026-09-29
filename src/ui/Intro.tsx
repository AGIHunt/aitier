import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { audio } from '../audio/engine'
import { ALL_MODELS, VENDORS } from '../data'
import { editionLabel, useT } from '../i18n'
import { useStore } from '../store'
import { LangButton } from './Hud'

const SOURCES = ['LMArena · Text / WebDev / Vision', 'LMArena · Text-to-Image / Image Edit', 'LMArena · Text-to-Video / Image-to-Video', 'Artificial Analysis · Intelligence Index', 'Agent Arena · 2M sessions', 'Bug Hunt Bench · Terminal-Bench · SWE-bench', 'AGI HUNT · agihunt.info']

export function Intro() {
  const entered = useStore((s) => s.entered)
  const lang = useStore((s) => s.lang)
  const T = useT()
  const [boot, setBoot] = useState<string[] | null>(null)
  useEffect(() => {
    // 在开场页停留时就预取 3D 场景代码，避免进入后黑屏
    import('../scene/Experience')
  }, [])

  const start = (withSound: boolean) => {
    audio.init()
    audio.setMuted(!withSound)
    useStore.getState().set({ muted: !withSound })
    try {
      localStorage.setItem('airank:muted', withSound ? '0' : '1')
    } catch {
      /* 无存储也能用 */
    }
    audio.startAmbient()
    const lines = [
      `> AIRANK ${editionLabel('en').toUpperCase()}`,
      ...SOURCES.map((s) => `  LOADING ${s} ……… OK`),
      `> ${ALL_MODELS.length} MODELS / ${VENDORS.length} VENDORS INDEXED`,
      '> ASCENDING…',
    ]
    setBoot([])
    lines.forEach((l, i) =>
      setTimeout(() => {
        setBoot((b) => [...(b ?? []), l])
        audio.tick()
      }, 90 + i * 150),
    )
    setTimeout(() => useStore.getState().set({ entered: true, intro: true }), 200 + lines.length * 150)
  }

  return (
    <AnimatePresence>
      {!entered && (
        <motion.div className="intro" exit={{ opacity: 0 }} transition={{ duration: 1.1 }}>
          <div className="intro__grid" />
          {!boot && <LangButton className="intro__lang" />}
          {!boot ? (
            <motion.div className="intro__center" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
              <div className="intro__edition">{editionLabel(lang)}</div>
              <h1 className="intro__title" data-text={T('title')}>
                {T('title')}
              </h1>
              <div className="intro__sub">{T('subtitle')}</div>
              <button className="intro__enter" onClick={() => start(true)}>
                <span>{T('enter')}</span>
                <i className="caret" />
              </button>
              <button className="intro__mute" onClick={() => start(false)}>
                {T('enterMuted')}
              </button>
            </motion.div>
          ) : (
            <div className="boot">
              {boot.map((l, i) => (
                <div key={i} className={l.startsWith('>') ? 'boot__head' : ''}>
                  {l}
                </div>
              ))}
              <i className="caret" />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
