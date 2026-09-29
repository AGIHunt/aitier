import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1400,
    rolldownOptions: {
      output: {
        // 第三方库拆成独立 chunk：并行下载，且每期只改数据时浏览器 / CDN 缓存仍然有效
        codeSplitting: {
          groups: [
            { name: 'three', test: /node_modules[\\/](three|@react-three|postprocessing|three-stdlib|troika-|maath|meshline|camera-controls|@monogrid)/ },
            { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler|framer-motion|motion-dom|motion-utils|zustand)[\\/]/ },
          ],
        },
      },
    },
  },
})
