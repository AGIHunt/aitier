import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { audio } from '../audio/engine'
import { MODELS_BY_CATEGORY } from '../data'
import { TIER_BY_ID } from '../data/tiers'
import { useStore } from '../store'
import { Badge } from './bits'

/** 抵达塔顶时的「王座演出」：S·S·S 逐字砸入，揭晓第一名 */
export function Slam() {
  const shock = useStore((s) => s.shock)
  const category = useStore((s) => s.category)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!shock || !useStore.getState().intro) return
    setShow(true)
    const hits = [0, 1, 2].map((i) => setTimeout(() => audio.hit(i * 4), 120 + i * 190))
    const off = setTimeout(() => setShow(false), 2300)
    return () => {
      hits.forEach(clearTimeout)
      clearTimeout(off)
    }
  }, [shock])

  const top = MODELS_BY_CATEGORY[category][0]
  const tier = top ? TIER_BY_ID[top.tier] : null

  return (
    <AnimatePresence>
      {show && top && tier && (
        <motion.div className="slam" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.08 }} transition={{ duration: 0.6 }}>
          <motion.div className="slam__flash" initial={{ opacity: 0.9 }} animate={{ opacity: 0 }} transition={{ duration: 0.7 }} />
          <div className="slam__letters" style={{ color: tier.color }}>
            {top.tier.split('').map((ch, i) => (
              <motion.span
                key={i}
                initial={{ scale: 4, opacity: 0, y: -40, rotate: -8 }}
                animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
                transition={{ delay: 0.12 + i * 0.19, type: 'spring', stiffness: 520, damping: 16 }}
              >
                {ch}
              </motion.span>
            ))}
          </div>
          <motion.div
            className="slam__who"
            initial={{ opacity: 0, y: 20, letterSpacing: '0.6em' }}
            animate={{ opacity: 1, y: 0, letterSpacing: '0.08em' }}
            transition={{ delay: 0.75, duration: 0.7, ease: 'easeOut' }}
          >
            <Badge vendor={top.vendor} size={40} />
            <span>{top.name}</span>
          </motion.div>
          <motion.div className="slam__caption" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.05 }}>
            #1 · {tier.desc}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
