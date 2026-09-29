/** 纯函数颜色工具（不依赖 three，供 UI 与场景共用） */
function parse(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const n = parseInt(h.length === 3 ? h.replace(/./g, '$&$&') : h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

const toHex = (r: number, g: number, b: number) =>
  '#' + [r, g, b].map((x) => Math.round(Math.max(0, Math.min(255, x))).toString(16).padStart(2, '0')).join('')

export function lighten(hex: string, amt: number) {
  const [r, g, b] = parse(hex)
  return toHex(r + (255 - r) * amt, g + (255 - g) * amt, b + (255 - b) * amt)
}

export function hexA(hex: string, a: number) {
  const [r, g, b] = parse(hex)
  return `rgba(${r},${g},${b},${a})`
}

function luminance(hex: string) {
  const [r, g, b] = parse(hex).map((c) => {
    const s = c / 255
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** 在品牌色上选可读的字色 */
export function readable(bg: string, accent: string) {
  const lb = luminance(bg)
  if (accent && Math.abs(luminance(accent) - lb) > 0.35) return accent
  return lb > 0.55 ? '#0b0d14' : '#ffffff'
}
