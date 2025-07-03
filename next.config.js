import createMDX from "@next/mdx"

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [["remark-rehype", { strict: true, throwOnError: true }]],
    rehypePlugins: [["rehype-katex", { strict: true, throwOnError: true }]],
  },
})

// Merge MDX config with Next.js config
export default withMDX(nextConfig)
