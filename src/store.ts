import { create } from 'zustand'
import type { Category } from './types'

export type ViewMode = '3d' | 'table'

interface State {
  entered: boolean
  intro: boolean
  category: Category
  selectedId: string | null
  hoveredId: string | null
  vendorFilter: string | null
  view: ViewMode
  muted: boolean
  /** 相机聚焦的档位（连续值，0 = SSS） */
  focus: number
  overview: boolean
  paletteOpen: boolean
  /** 自增：每次触发一次「冲击」后期效果 */
  shock: number
  paletteMode: 'search' | 'vs'
  vs: [string, string] | null
  set: (p: Partial<State>) => void
  select: (id: string | null) => void
}

export const useStore = create<State>((set) => ({
  entered: false,
  intro: false,
  category: 'llm',
  selectedId: null,
  hoveredId: null,
  vendorFilter: null,
  view: typeof window !== 'undefined' && window.innerWidth < 760 ? 'table' : '3d',
  muted: false,
  focus: 3,
  overview: false,
  paletteOpen: false,
  shock: 0,
  paletteMode: 'search',
  vs: null,
  set: (p) => set(p),
  select: (id) => set({ selectedId: id, overview: false }),
}))
