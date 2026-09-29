// 数据脚本共用：读写 src/data 下的各类文件
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

export const ROOT = new URL('..', import.meta.url).pathname
export const DATA = join(ROOT, 'src/data')
export const VENDOR_DIR = join(DATA, 'vendors')
export const EN_DIR = join(DATA, 'locales/en')
export const TIER_ORDER = ['SSS', 'SS', 'S', 'A', 'B', 'C', 'D', 'E']
export const TIER_RANGE = { SSS: [97, 100], SS: [93, 96.99], S: [88, 92.99], A: [80, 87.99], B: [72, 79.99], C: [64, 71.99], D: [55, 63.99], E: [0, 54.99] }
export const CATS = ['llm', 'image', 'video']

export const readJSON = (p) => JSON.parse(readFileSync(p, 'utf8'))
export const writeJSON = (p, d) => writeFileSync(p, JSON.stringify(d, null, 2) + '\n')

export function loadVendors() {
  return readdirSync(VENDOR_DIR)
    .filter((f) => f.endsWith('.json'))
    .sort()
    .map((f) => ({ file: join(VENDOR_DIR, f), id: f.slice(0, -5), data: readJSON(join(VENDOR_DIR, f)) }))
}

export function loadLocale(vendorId) {
  const p = join(EN_DIR, `${vendorId}.json`)
  return existsSync(p) ? readJSON(p) : null
}

export const loadMeta = () => readJSON(join(DATA, 'meta.json'))
export const saveMeta = (d) => writeJSON(join(DATA, 'meta.json'), d)
export const loadHistory = () => readJSON(join(DATA, 'history.json'))
export const saveHistory = (d) => writeJSON(join(DATA, 'history.json'), d)

export function allModels() {
  return loadVendors().flatMap((v) => v.data.models.map((m) => ({ ...m, vendorId: v.id })))
}

export function sortModels(list) {
  return [...list].sort((a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier) || b.score - a.score || a.name.localeCompare(b.name))
}

/** 北京时间今天 YYYY-MM-DD */
export function today() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai' }).format(new Date())
}
