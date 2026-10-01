import type { ComponentProps, ReactNode } from 'react'
import type { MDXComponents } from 'mdx/types'
import { Link } from 'react-router'
import { useLocale } from '@/features/i18n'
import { Mermaid } from '@/features/diagrams/Mermaid'
import { EventLoopViz } from '@/features/event-loop/EventLoopViz'
import {
  CodeRunner,
  FlexboxPlayground,
  GridPlayground,
  LivePreview,
  PositionPlayground,
  Predict,
} from '@/features/playground'
import { Api } from './Api'
import { Callout } from './Callout'
import { BareCodeContext, CodeBlock } from './CodeBlock'
import { Answer, Deep, FollowUp, LevelBadge, Mistake, QA } from './QA'
import { Recap, Step, Steps } from './Steps'

/** Internal links are written locale-free (`/javascript/closures`) and get the current locale. */
function Anchor({ href = '', ...props }: ComponentProps<'a'>) {
  const locale = useLocale()
  if (href.startsWith('/')) return <Link to={`/${locale}${href}`} {...props} />
  if (href.startsWith('#')) return <a href={href} {...props} />
  return <a href={href} target="_blank" rel="noreferrer" {...props} />
}

/** Section headings get a hover "#" link so any subsection can be shared. */
const heading =
  (Tag: 'h2' | 'h3') =>
  ({ id, children, ...props }: ComponentProps<'h2'>) => (
    <Tag id={id} className="group/h" {...props}>
      {children}
      {id && (
        <a
          href={`#${id}`}
          aria-label="#"
          className="heading-anchor ms-2 inline-block font-mono text-[0.8em] font-normal text-muted no-underline opacity-0 transition-opacity group-hover/h:opacity-100 focus-visible:opacity-100"
        >
          #
        </a>
      )}
    </Tag>
  )

function Table(props: ComponentProps<'table'>) {
  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-line scrollbar-thin [&_tr:last-child_td]:border-b-0">
      <table {...props} />
    </div>
  )
}

const bare =
  <P extends object>(Component: (props: P) => ReactNode) =>
  (props: P) => (
    <BareCodeContext value={true}>
      <Component {...props} />
    </BareCodeContext>
  )

export const mdxComponents: MDXComponents = {
  pre: CodeBlock,
  h2: heading('h2'),
  h3: heading('h3'),
  a: Anchor,
  table: Table,
  Api,
  Callout,
  QA,
  Answer,
  Deep,
  Mistake,
  FollowUp,
  LevelBadge,
  Steps,
  Step,
  Recap,
  Mermaid,
  EventLoopViz,
  CodeRunner: bare(CodeRunner),
  Predict: bare(Predict),
  LivePreview,
  FlexboxPlayground,
  GridPlayground,
  PositionPlayground,
}
