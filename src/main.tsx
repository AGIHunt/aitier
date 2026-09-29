import '@fontsource/orbitron/700.css'
import '@fontsource/orbitron/900.css'
import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/700.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/700.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { applyDocumentLang, detectLang } from './i18n'
import { useStore } from './store'

try {
  if (localStorage.getItem('airank:muted') === '1') useStore.getState().set({ muted: true })
} catch {
  /* 无存储也能用 */
}

const lang = detectLang()
useStore.getState().set({ lang })
applyDocumentLang(lang)

if (import.meta.env.DEV) (window as unknown as { __store: typeof useStore }).__store = useStore

// 卡片贴图用 canvas 绘制，需要字体先就绪
const fonts = ['900 40px Orbitron', '700 40px "Space Grotesk"', '500 40px "Space Grotesk"', '400 20px "JetBrains Mono"']
Promise.all(fonts.map((f) => document.fonts.load(f)))
  .catch(() => {})
  .finally(() => {
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  })
