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

// 不再等字体：界面立即渲染，卡片贴图在 cardTexture 里等字体就绪后再画
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
