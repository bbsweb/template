import { minify } from "@swc/html"
import { defineConfig } from "vite"

const host = process.env.TAURI_DEV_HOST

// https://vite.dev/config/
export default defineConfig(() => ({
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent Vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host ? { protocol: "ws", host, port: 1421 } : undefined,
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"]
    }
  },
  plugins: [
    {
      name: "html-minify",
      apply: "build",
      async transformIndexHtml(html) {
        const result = await minify(html, {
          collapseWhitespaces: "all",
          removeComments: true,
          removeEmptyAttributes: true,
          removeRedundantAttributes: "all",
          minifyJson: true,
          minifyCss: true,
          minifyJs: false,
          quotes: true
        })
        return result.code
      }
    }
  ]
}))
