import cloudflare from "@astrojs/cloudflare"
import mdx from "@astrojs/mdx"
import react from "@astrojs/react"
import { defineConfig, memoryCache } from "astro/config"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare(),
  experimental: {
    cache: {
      provider: memoryCache()
    }
  },
  integrations: [mdx(), react()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" }
    }
  },
  output: "server",
  prefetch: true,
  session: {
    driver: {
      entrypoint: "unstorage/drivers/null"
    }
  }
})
