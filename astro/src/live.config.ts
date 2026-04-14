import { createMarkdownProcessor } from "@astrojs/markdown-remark"
import { z } from "astro/zod"
import { defineLiveCollection } from "astro:content"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"

export type OstContent = {
  list?: string[]
}

export type Ost = {
  id: number
  title: string
  content: string
}

export type Post = {
  id: number
  title: string
  excerpt: string
  content: string
  created: number
  updated: number
}

const post = defineLiveCollection({
  loader: {
    name: "post",
    loadEntry: async ({ filter }: { filter: { id: string } }) => {
      const data = await import("cloudflare:workers").then(({ env }) =>
        env.db
          .prepare("SELECT * FROM post WHERE id = ?1 LIMIT 1")
          .bind(filter.id)
          .first<Post>()
      )

      if (!data) throw new Error("post not exist")

      const processor = await createMarkdownProcessor({
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
        shikiConfig: {
          themes: { light: "github-light", dark: "github-dark" }
        }
      })
      const result = await processor.render(data.content)
      return {
        id: filter.id,
        data,
        rendered: { html: result.code }
      }
    },
    loadCollection: async () => {
      const { results } = await import("cloudflare:workers").then(({ env }) =>
        env.db.prepare("SELECT * FROM post").all<Post>()
      )
      return {
        entries: results.map((data) => ({ id: data.id.toString(), data }))
      }
    }
  },
  schema: z.object({
    id: z.number(),
    title: z.string(),
    excerpt: z.string(),
    content: z.string(),
    created: z.number(),
    updated: z.number()
  })
})

export const collections = { post }
