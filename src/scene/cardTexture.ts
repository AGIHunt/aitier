import * as THREE from 'three'
import { TIER_BY_ID } from '../data/tiers'
import { hexA, lighten, readable } from '../lib/color'
import { t } from '../i18n'
import type { Lang, RankedModel } from '../types'

export const CARD_PX = { w: 572, h: 330 }
const CJK = '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", sans-serif'

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function fitText(ctx: CanvasRenderingContext2D, text: string, maxW: number, size: number, weight: string, family: string) {
  let s = size
  do {
    ctx.font = `${weight} ${s}px ${family}`
    if (ctx.measureText(text).width <= maxW) break
    s -= 2
  } while (s > 18)
  return s
}

function ellipsis(ctx: CanvasRenderingContext2D, text: string, maxW: number) {
  if (ctx.measureText(text).width <= maxW) return text
  let t = text
  while (t.length > 1 && ctx.measureText(t + '…').width > maxW) t = t.slice(0, -1)
  return t + '…'
}

/** 厂商徽章：品牌色圆 + 字母，UI 与 3D 共用 */
export function drawBadge(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, color: string, accent: string, mono: string) {
  const g = ctx.createRadialGradient(cx - r * 0.4, cy - r * 0.4, r * 0.1, cx, cy, r)
  g.addColorStop(0, lighten(color, 0.35))
  g.addColorStop(1, color)
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fill()
  ctx.lineWidth = r * 0.08
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'
  ctx.stroke()
  ctx.fillStyle = readable(color, accent)
  const isCjk = /[㐀-鿿]/.test(mono)
  const size = r * (mono.length > 1 ? (isCjk ? 0.78 : 0.85) : 1.1)
  ctx.font = `900 ${size}px ${isCjk ? CJK : 'Orbitron, sans-serif'}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(mono, cx, cy + r * 0.05)
}

export function makeCardTexture(m: RankedModel, lang: Lang): THREE.CanvasTexture {
  const tx = m.text[lang]
  const { w, h } = CARD_PX
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  const tier = TIER_BY_ID[m.tier]
  const pad = 10

  // 底
  roundRect(ctx, pad, pad, w - pad * 2, h - pad * 2, 30)
  const bg = ctx.createLinearGradient(0, 0, w, h)
  bg.addColorStop(0, 'rgba(22,24,44,0.94)')
  bg.addColorStop(1, 'rgba(8,9,20,0.94)')
  ctx.fillStyle = bg
  ctx.fill()

  // 厂商色的斜向光
  ctx.save()
  ctx.clip()
  const wash = ctx.createRadialGradient(w * 0.05, h * 0.05, 10, w * 0.1, h * 0.1, w * 0.75)
  wash.addColorStop(0, hexA(m.vendor.color, 0.42))
  wash.addColorStop(1, hexA(m.vendor.color, 0))
  ctx.fillStyle = wash
  ctx.fillRect(0, 0, w, h)
  // 细网格
  ctx.strokeStyle = 'rgba(255,255,255,0.035)'
  ctx.lineWidth = 1
  for (let x = 0; x < w; x += 22) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, h)
    ctx.stroke()
  }
  for (let y = 0; y < h; y += 22) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(w, y)
    ctx.stroke()
  }
  ctx.restore()

  // 渐变描边：档位色 → 厂商色
  roundRect(ctx, pad, pad, w - pad * 2, h - pad * 2, 30)
  const border = ctx.createLinearGradient(0, 0, w, h)
  border.addColorStop(0, tier.glow)
  border.addColorStop(0.5, tier.color)
  border.addColorStop(1, m.vendor.color)
  ctx.strokeStyle = border
  ctx.lineWidth = 5
  ctx.stroke()

  // 徽章 + 厂商
  drawBadge(ctx, 64, 66, 32, m.vendor.color, m.vendor.accent, m.vendor.monogram)
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = 'rgba(255,255,255,0.62)'
  ctx.font = `600 22px "Space Grotesk", ${CJK}`
  ctx.fillText(ellipsis(ctx, m.vendor.name.toUpperCase(), 250), 108, 60)
  ctx.fillStyle = 'rgba(255,255,255,0.4)'
  ctx.font = `500 18px ${CJK}`
  const chips = [
    m.openWeights ? t(lang, 'open') : null,
    m.status === 'preview' ? t(lang, 'status_preview') : null,
    m.status === 'rumored' ? t(lang, 'status_rumored') : null,
    m.released?.slice(0, 7),
  ].filter(Boolean)
  ctx.fillText(chips.join(' · '), 108, 88)

  // 名次
  ctx.textAlign = 'right'
  ctx.font = '900 30px Orbitron, sans-serif'
  ctx.fillStyle = tier.glow
  ctx.fillText(`#${m.rank}`, w - 38, 66)

  // 名称
  ctx.textAlign = 'left'
  const size = fitText(ctx, m.name, w - 76, 58, '700', `"Space Grotesk", ${CJK}`)
  ctx.fillStyle = '#ffffff'
  ctx.shadowColor = hexA(tier.color, 0.8)
  ctx.shadowBlur = 18
  ctx.fillText(m.name, 38, 176 + (58 - size) * 0.3)
  ctx.shadowBlur = 0

  // 标签行
  ctx.font = `500 21px ${CJK}`
  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  ctx.fillText(ellipsis(ctx, tx.tagline, w - 190), 38, 226)

  // 能力标签
  let x = 38
  ctx.font = `600 18px ${CJK}`
  for (const tag of tx.tags.slice(0, 3)) {
    const tw = ctx.measureText(tag).width + 22
    if (x + tw > w - 170) break
    roundRect(ctx, x, 252, tw, 34, 17)
    ctx.fillStyle = hexA(tier.color, 0.16)
    ctx.fill()
    ctx.strokeStyle = hexA(tier.color, 0.55)
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.fillStyle = tier.glow
    ctx.fillText(tag, x + 11, 276)
    x += tw + 8
  }

  // 分数
  ctx.textAlign = 'right'
  ctx.font = '900 76px Orbitron, sans-serif'
  const sg = ctx.createLinearGradient(0, 220, 0, 300)
  sg.addColorStop(0, '#ffffff')
  sg.addColorStop(1, tier.color)
  ctx.fillStyle = sg
  ctx.shadowColor = tier.color
  ctx.shadowBlur = 24
  ctx.fillText(String(Math.round(m.score)), w - 36, 294)
  ctx.shadowBlur = 0

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

/** 柔光贴图（hover 光晕、粒子） */
let glowTex: THREE.Texture | null = null
export function getGlowTexture() {
  if (glowTex) return glowTex
  const s = 128
  const c = document.createElement('canvas')
  c.width = c.height = s
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.25, 'rgba(255,255,255,0.45)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, s, s)
  glowTex = new THREE.CanvasTexture(c)
  return glowTex
}
