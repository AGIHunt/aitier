import { META } from './data'
import { useStore } from './store'
import type { Lang, TierId } from './types'

/** 中文用户（zh-*）用中文，其他一律英文；手动切换后记住 */
export function detectLang(): Lang {
  try {
    const saved = localStorage.getItem('airank:lang')
    if (saved === 'zh' || saved === 'en') return saved
  } catch {
    /* ignore */
  }
  const langs = typeof navigator !== 'undefined' ? navigator.languages ?? [navigator.language] : []
  return langs.some((l) => l?.toLowerCase().startsWith('zh')) && langs[0]?.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}

const dict = {
  zh: {
    title: 'AI 天梯',
    subtitle: '全球大模型天梯榜 · LLM / 图像 / 视频',
    enter: '[ PRESS TO ENTER · 开声音体验 ]',
    enterMuted: '静音进入',
    cat_llm: '语言模型',
    cat_image: '图像生成',
    cat_video: '视频生成',
    search: '搜索 (⌘K)',
    overview: '全景',
    table: '表格',
    sound: '声音 (M)',
    all: '全部',
    hint: '拖动旋转 · 滚轮升降 · 点击卡片 ·',
    hintNext: '逐名 ·',
    hintOverview: '全景',
    hintTouch: '左右滑动旋转 · 上下滑动升降 · 点卡片看详情',
    soundPill: '点击任意处开启音效',
    released: '发布',
    context: '上下文',
    spec: '规格',
    params: '参数',
    price: '价格',
    highlights: '亮点',
    benchmarks: '榜单 / 基准',
    peers: '同档对手',
    duel: '⚔ 发起对决',
    sources: '来源：',
    prev: '上一名 (←)',
    next: '下一名 (→)',
    close: '关闭 (Esc)',
    status_released: '已发布',
    status_preview: '预览',
    status_rumored: '传闻',
    status_deprecated: '已退役',
    openWeights: '开源权重',
    open: '开源',
    vacant: '— 虚位以待 —',
    searchPh: '搜索模型 / 厂商 / 能力标签…',
    vsPh: '选择对手…',
    noMatch: '没有匹配的模型',
    exitDuel: '✕ 退出对决',
    noSharedBench: '两者没有同口径的公开基准，按综合分裁决',
    ascending: '> ASCENDING…',
    lang: 'EN',
    langTitle: 'Switch to English',
  },
  en: {
    title: 'AI LADDER',
    subtitle: 'The Global AI Model Tier List · LLM / Image / Video',
    enter: '[ PRESS TO ENTER · SOUND ON ]',
    enterMuted: 'Enter muted',
    cat_llm: 'Language',
    cat_image: 'Image',
    cat_video: 'Video',
    search: 'Search (⌘K)',
    overview: 'Overview',
    table: 'Table',
    sound: 'Sound (M)',
    all: 'All',
    hint: 'Drag to orbit · Scroll to climb · Click a card ·',
    hintNext: 'step ·',
    hintOverview: 'overview',
    hintTouch: 'Swipe ↔ to orbit · ↕ to climb · tap a card',
    soundPill: 'Tap anywhere for sound',
    released: 'Released',
    context: 'Context',
    spec: 'Output',
    params: 'Params',
    price: 'Pricing',
    highlights: 'Highlights',
    benchmarks: 'Leaderboards',
    peers: 'Same-tier rivals',
    duel: '⚔ Start a duel',
    sources: 'Sources:',
    prev: 'Previous (←)',
    next: 'Next (→)',
    close: 'Close (Esc)',
    status_released: 'Released',
    status_preview: 'Preview',
    status_rumored: 'Rumored',
    status_deprecated: 'Retired',
    openWeights: 'Open weights',
    open: 'OPEN',
    vacant: '— vacant —',
    searchPh: 'Search models, labs, skills…',
    vsPh: 'Pick an opponent…',
    noMatch: 'No matching models',
    exitDuel: '✕ Exit duel',
    noSharedBench: 'No shared public benchmark — decided on overall score',
    ascending: '> ASCENDING…',
    lang: '中',
    langTitle: '切换到中文',
  },
} as const

export type Key = keyof (typeof dict)['zh']

export const TIER_TEXT: Record<Lang, Record<TierId, { label: string; desc: string }>> = {
  zh: {
    SSS: { label: '神', desc: '当前公认第一' },
    SS: { label: '王', desc: '紧贴第一的顶级旗舰' },
    S: { label: '皇', desc: '前沿第一梯队' },
    A: { label: '强', desc: '强，接近前沿' },
    B: { label: '能打', desc: '能打的中端 / 上代旗舰' },
    C: { label: '够用', desc: '轻量或老一代但常用' },
    D: { label: '落后', desc: '明显落后' },
    E: { label: '边缘', desc: '边缘选手' },
  },
  en: {
    SSS: { label: 'GOD', desc: 'The undisputed #1' },
    SS: { label: 'KING', desc: 'Right on the leader’s heels' },
    S: { label: 'ELITE', desc: 'Frontier first tier' },
    A: { label: 'STRONG', desc: 'Strong, near the frontier' },
    B: { label: 'SOLID', desc: 'Solid mid-tier / last-gen flagship' },
    C: { label: 'DECENT', desc: 'Lightweight or older, still in use' },
    D: { label: 'BEHIND', desc: 'Clearly behind' },
    E: { label: 'FRINGE', desc: 'On the fringe' },
  },
}

export function t(lang: Lang, k: Key) {
  return dict[lang][k]
}

export function useT() {
  const lang = useStore((s) => s.lang)
  return (k: Key) => dict[lang][k]
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export function editionLabel(lang: Lang) {
  const [y, m] = META.edition.split('-')
  return lang === 'zh' ? `${y}.${m} · 第 ${META.issue} 期` : `Issue ${META.issue} · ${MONTHS[Number(m) - 1]} ${y}`
}

export function applyDocumentLang(lang: Lang) {
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
  document.title = lang === 'zh' ? 'AI 天梯 · 全球大模型天梯榜' : 'AI Ladder · The Global AI Model Tier List'
}
