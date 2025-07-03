import type { MDXComponents } from "mdx/types"

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: ({ ...props }) => (
      <h1
        className="scroll-m-20 text-3xl font-bold tracking-tight md:text-4xl"
        {...props}
      />
    ),
    h2: ({ ...props }) => (
      <h2
        className="scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight md:text-2xl"
        {...props}
      />
    ),
    h3: ({ ...props }) => (
      <h3
        className="scroll-m-20 text-lg font-semibold tracking-tight md:text-xl"
        {...props}
      />
    ),
    h4: ({ ...props }) => (
      <h4
        className="scroll-m-20 text-base font-semibold tracking-tight md:text-lg"
        {...props}
      />
    ),
    h5: ({ ...props }) => (
      <h5 className="scroll-m-20 font-semibold tracking-tight" {...props} />
    ),
    p: ({ ...props }) => (
      <p
        className="text-body-foreground text-sm [&:not(:first-child)]:mt-2"
        {...props}
      />
    ),
    blockquote: ({ ...props }) => (
      <blockquote className="mt-6 w-full border-l-2 pl-6 italic" {...props} />
    ),
    ul: ({ ...props }) => (
      <ul className="my-4 ml-4 list-disc [&>li]:mt-2" {...props} />
    ),
    li: ({ ...props }) => (
      <li className="text-body-foreground text-sm" {...props} />
    ),
    code: ({ ...props }) => (
      <code
        className="bg-muted relative mx-1 rounded px-0.5 py-px font-mono text-sm font-semibold"
        {...props}
      />
    ),
  }
}
