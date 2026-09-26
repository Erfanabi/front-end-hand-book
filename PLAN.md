# Frontend Interview Handbook — Plan

## Goal
A bilingual (Persian RTL / English LTR) static site that hosts a complete Frontend Engineer
interview handbook, from basics to senior level, with runnable code, diagrams and interview Q&A.

## Stack
| Concern | Choice | Why |
| --- | --- | --- |
| Framework | React 19 + TypeScript (strict) + Vite | Fast dev/build, React 19 `<title>`/`<meta>` hoisting |
| Routing | React Router 7 (data router, lazy routes) | Simple, code-split per route |
| UI i18n | **Paraglide JS 2** (inlang) | Compile-time messages, tree-shaken, fully typed, no runtime JSON parsing — faster than i18next |
| Content | MDX per locale (`src/content/{fa,en}`) | Prose + React components (runners, diagrams, Q&A) |
| Code highlight | Shiki at **build time** (rehype) | Zero runtime cost |
| Diagrams | Mermaid, lazy-loaded when visible | Heavy lib only loaded on demand |
| Editor | CodeMirror 6, lazy-loaded | Only for runnable playgrounds |
| Styling | Tailwind CSS v4, logical properties (`ms-`, `pe-`, `start-`) | RTL & LTR from one codebase |
| Fonts | Vazirmatn (fa), Inter (en), JetBrains Mono (code) — self-hosted | No layout shift, offline |

## Architecture (feature-based)
```
src/
  app/            router, root layout, providers
  features/
    i18n/         locale detection, direction, paraglide bridge
    theme/        light/dark
    navigation/   sidebar, header, search palette, TOC, prev/next
    content/      chapter registry, chapter page, MDX components (Callout, QA, Compare…)
    playground/   sandboxed JS runner, HTML/CSS live preview, output quizzes
    diagrams/     Mermaid renderer
    event-loop/   step-by-step Event Loop visualizer
    progress/     read/unread tracking (localStorage)
    home/         landing page
  shared/         ui primitives, hooks, utils
  content/fa|en/  MDX chapters (same slugs in both languages)
messages/         paraglide UI strings (fa.json, en.json)
```

## Interactive features
- **Code Runner**: edit + run JS in a sandboxed iframe, console output captured in order (timers & promises included).
- **Predict the Output**: tricky snippets — guess, reveal, then run.
- **Live Preview**: editable HTML/CSS with instant render (positioning, flexbox, grid, specificity…).
- **Event Loop Visualizer**: step through Call Stack / Microtask / Task queues.
- **Search palette** (Ctrl/⌘+K) over chapters and headings, build-time index.
- Reading progress, “mark as read”, dark mode, per-page TOC, copy-code buttons.

## Content map (10 parts, same structure in fa & en)
1. HTML — fundamentals, document & meta, semantic, forms, accessibility, performance
2. CSS — fundamentals/cascade, selectors, box model & display, positioning, flexbox, grid, responsive & units & variables, rendering performance
3. JavaScript — fundamentals, variables & TDZ, execution context & lexical env & hoisting, scope & closures, types/equality/coercion, objects & prototypes, this & functions, arrays & strings, event loop, memory & GC, async
4. Browser — DOM, events, rendering pipeline, storage, HTTP/fetch/CORS, WebSocket, security
5. React — fundamentals, hooks, rendering & fiber, state, effects, performance, advanced (concurrent/RSC/SSR), 50 interview questions
6. Algorithms — level 1, level 2, level 3 (debounce, throttle, LRU, Promise, EventEmitter…)
7. Design Patterns — creational, structural, behavioral, frontend/React patterns
8. Frontend Architecture — structure, data layer, auth/security/performance
9. Interview — 50+ JS trick questions, 100+ senior questions
10. Cheat Sheet — rapid revision + 100 must-know questions

## Build order
1. Scaffold, tooling, i18n, theme, layout, navigation  →  2. MDX pipeline + components
→ 3. Playground / visualizer  →  4. Content part by part (fa + en)  →  5. Build, verify in browser.

## Publishing
`pnpm build` → static `dist/`. SPA fallback files for Netlify (`_redirects`) and Vercel (`vercel.json`) included.
